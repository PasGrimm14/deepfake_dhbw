"""
Training Script – Bild-Deepfake-Erkennung
==========================================
Modell:   EfficientNet-B4 (timm, pretrained ImageNet)
Training: Mixed Precision, CosineAnneal, Early Stopping
Logging:  TensorBoard

Nutzung:
    python model/training/train_image.py --config configs/efficientnet_b4.yaml
"""

import argparse
import os
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import yaml
from sklearn.metrics import roc_auc_score, accuracy_score
from torch.cuda.amp import GradScaler, autocast
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
from tqdm import tqdm

import timm

from dataset import DeepfakeImageDataset


# ── Modell ────────────────────────────────────────────────────────────────────

class DeepfakeClassifier(nn.Module):
    def __init__(self, backbone: str = "efficientnet_b4", pretrained: bool = True, dropout: float = 0.3):
        super().__init__()
        self.backbone = timm.create_model(
            backbone,
            pretrained=pretrained,
            num_classes=0,           # Feature-Extraktor, kein Head
            global_pool="avg",
        )
        feat_dim = self.backbone.num_features
        self.head = nn.Sequential(
            nn.Dropout(p=dropout),
            nn.Linear(feat_dim, 1),  # Binary: fake-Wahrscheinlichkeit
        )

    def forward(self, x):
        features = self.backbone(x)
        return self.head(features).squeeze(1)   # [B]

    def get_features(self, x):
        """Für GradCAM: Features vor dem Head."""
        return self.backbone(x)


# ── Trainer ───────────────────────────────────────────────────────────────────

class Trainer:
    def __init__(self, config: dict):
        self.cfg = config
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Device: {self.device}")
        if self.device.type == "cuda":
            print(f"GPU: {torch.cuda.get_device_name(0)}")

        self._build_model()
        self._build_data()
        self._build_optimizer()

        self.writer = SummaryWriter(log_dir=config["paths"]["log_dir"])
        Path(config["paths"]["checkpoint_dir"]).mkdir(parents=True, exist_ok=True)

        self.best_auc = 0.0
        self.scaler = GradScaler(enabled=config["training"]["mixed_precision"])

    def _build_model(self):
        m = self.cfg["model"]
        self.model = DeepfakeClassifier(
            backbone=m["backbone"],
            pretrained=m["pretrained"],
            dropout=m["dropout"],
        ).to(self.device)
        print(f"Modell: {m['backbone']} | Params: {sum(p.numel() for p in self.model.parameters()):,}")

    def _build_data(self):
        d = self.cfg["data"]
        self.train_ds = DeepfakeImageDataset(d["train_dir"], split="train", config=self.cfg)
        self.val_ds   = DeepfakeImageDataset(d["val_dir"],   split="val",   config=self.cfg)
        self.train_dl = DataLoader(
            self.train_ds,
            batch_size=self.cfg["training"]["batch_size"],
            shuffle=True,
            num_workers=d["num_workers"],
            pin_memory=True,
        )
        self.val_dl = DataLoader(
            self.val_ds,
            batch_size=self.cfg["training"]["batch_size"] * 2,
            shuffle=False,
            num_workers=d["num_workers"],
            pin_memory=True,
        )
        print(f"Train: {len(self.train_ds)} | Val: {len(self.val_ds)}")

    def _build_optimizer(self):
        t = self.cfg["training"]
        self.optimizer = AdamW(
            self.model.parameters(),
            lr=t["learning_rate"],
            weight_decay=t["weight_decay"],
        )
        self.scheduler = CosineAnnealingLR(
            self.optimizer,
            T_max=t["epochs"] - t["warmup_epochs"],
            eta_min=1e-6,
        )
        self.criterion = nn.BCEWithLogitsLoss()

    def _warmup_lr(self, epoch: int):
        """Lineares LR-Warmup."""
        warmup = self.cfg["training"]["warmup_epochs"]
        if epoch < warmup:
            lr = self.cfg["training"]["learning_rate"] * (epoch + 1) / warmup
            for pg in self.optimizer.param_groups:
                pg["lr"] = lr

    def train_epoch(self, epoch: int) -> dict:
        self.model.train()
        losses, preds, labels = [], [], []

        for batch in tqdm(self.train_dl, desc=f"Epoch {epoch+1} [train]", leave=False):
            imgs, lbls = batch["image"].to(self.device), batch["label"].float().to(self.device)

            self.optimizer.zero_grad()
            with autocast(enabled=self.cfg["training"]["mixed_precision"]):
                logits = self.model(imgs)
                loss = self.criterion(logits, lbls)

            self.scaler.scale(loss).backward()
            # Gradient Clipping
            self.scaler.unscale_(self.optimizer)
            nn.utils.clip_grad_norm_(self.model.parameters(), self.cfg["training"]["gradient_clip"])
            self.scaler.step(self.optimizer)
            self.scaler.update()

            losses.append(loss.item())
            preds.extend(torch.sigmoid(logits).detach().cpu().numpy())
            labels.extend(lbls.cpu().numpy())

        auc = roc_auc_score(labels, preds)
        acc = accuracy_score(labels, np.array(preds) > 0.5)
        return {"loss": np.mean(losses), "auc": auc, "acc": acc}

    @torch.no_grad()
    def val_epoch(self, epoch: int) -> dict:
        self.model.eval()
        losses, preds, labels = [], [], []

        for batch in tqdm(self.val_dl, desc=f"Epoch {epoch+1} [val]  ", leave=False):
            imgs, lbls = batch["image"].to(self.device), batch["label"].float().to(self.device)
            with autocast(enabled=self.cfg["training"]["mixed_precision"]):
                logits = self.model(imgs)
                loss = self.criterion(logits, lbls)
            losses.append(loss.item())
            preds.extend(torch.sigmoid(logits).cpu().numpy())
            labels.extend(lbls.cpu().numpy())

        auc = roc_auc_score(labels, preds)
        acc = accuracy_score(labels, np.array(preds) > 0.5)
        return {"loss": np.mean(losses), "auc": auc, "acc": acc}

    def save_checkpoint(self, epoch: int, metrics: dict, is_best: bool = False):
        ckpt = {
            "epoch": epoch,
            "model_state_dict": self.model.state_dict(),
            "optimizer_state_dict": self.optimizer.state_dict(),
            "metrics": metrics,
            "config": self.cfg,
        }
        path = Path(self.cfg["paths"]["checkpoint_dir"]) / f"epoch_{epoch+1:03d}.pth"
        torch.save(ckpt, path)
        if is_best:
            best_path = Path(self.cfg["paths"]["best_model"])
            torch.save(ckpt, best_path)
            print(f"  ✓ Neues bestes Modell gespeichert (AUC: {metrics['val_auc']:.4f})")

    def run(self):
        epochs = self.cfg["training"]["epochs"]
        print(f"\nStarte Training für {epochs} Epochen...\n")

        for epoch in range(epochs):
            self._warmup_lr(epoch)
            t0 = time.time()

            train_m = self.train_epoch(epoch)
            val_m   = self.val_epoch(epoch)

            if epoch >= self.cfg["training"]["warmup_epochs"]:
                self.scheduler.step()

            # Logging
            elapsed = time.time() - t0
            print(
                f"Epoch {epoch+1:3d}/{epochs} | "
                f"Train Loss: {train_m['loss']:.4f} AUC: {train_m['auc']:.4f} | "
                f"Val Loss: {val_m['loss']:.4f} AUC: {val_m['auc']:.4f} Acc: {val_m['acc']:.4f} | "
                f"{elapsed:.1f}s"
            )

            for k, v in train_m.items():
                self.writer.add_scalar(f"train/{k}", v, epoch)
            for k, v in val_m.items():
                self.writer.add_scalar(f"val/{k}", v, epoch)
            self.writer.add_scalar("lr", self.optimizer.param_groups[0]["lr"], epoch)

            # Checkpoint
            is_best = val_m["auc"] > self.best_auc
            if is_best:
                self.best_auc = val_m["auc"]
            self.save_checkpoint(epoch, {**train_m, **{f"val_{k}": v for k, v in val_m.items()}}, is_best)

        print(f"\nTraining abgeschlossen. Bestes Val-AUC: {self.best_auc:.4f}")
        self.writer.close()


# ── Entry Point ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=str, default="configs/efficientnet_b4.yaml")
    args = parser.parse_args()

    with open(args.config) as f:
        config = yaml.safe_load(f)

    trainer = Trainer(config)
    trainer.run()
