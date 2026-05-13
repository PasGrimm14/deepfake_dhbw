"""
Audio-Training Script – ASVspoof 2019 LA
=========================================
Architektur: MobileNetV2 (angepasst für 1-Kanal Mel-Spektrogramm)

Nutzung:
    python model/training/train_audio.py --data-dir data/raw/asvspooof2019/LA
"""

import argparse
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from sklearn.metrics import roc_auc_score
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR
from torch.utils.data import DataLoader
from tqdm import tqdm

import timm

sys.path.insert(0, str(Path(__file__).parent))
from dataset import AudioSpectrogramDataset


def load_asvspooof_protocol(protocol_path: Path, audio_dir: Path) -> list[tuple]:
    """
    Liest ASVspoof 2019 LA Protokoll-Datei.
    Format: SPEAKER_ID AUDIO_FILE - SYSTEM_ID LABEL
    Label: 'bonafide' → 0, 'spoof' → 1
    """
    samples = []
    with open(protocol_path) as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) < 5:
                continue
            audio_id = parts[1]
            label_str = parts[4]
            label = 0 if label_str == "bonafide" else 1
            audio_path = audio_dir / f"{audio_id}.flac"
            if audio_path.exists():
                samples.append((str(audio_path), label))
    print(f"  Geladen: {len(samples)} Samples ({sum(1 for _,l in samples if l==0)} real, {sum(1 for _,l in samples if l==1)} fake)")
    return samples


class AudioClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        # MobileNetV2 – erster Conv angepasst für 1 Kanal
        self.backbone = timm.create_model("mobilenetv2_100", pretrained=True, num_classes=0)
        # Ersten Conv für 1-Kanal-Input anpassen (Mel-Spektrogramm hat 1 Kanal)
        old_conv = self.backbone.conv_stem
        self.backbone.conv_stem = nn.Conv2d(
            1, old_conv.out_channels,
            kernel_size=old_conv.kernel_size,
            stride=old_conv.stride,
            padding=old_conv.padding,
            bias=False,
        )
        # Gewichte initialisieren: Mittelwert über RGB-Kanäle
        with torch.no_grad():
            self.backbone.conv_stem.weight = nn.Parameter(
                old_conv.weight.mean(dim=1, keepdim=True)
            )
        self.head = nn.Linear(self.backbone.num_features, 1)

    def forward(self, x):
        # x: [B, 1, n_mels, max_len]
        features = self.backbone(x)
        return self.head(features).squeeze(1)


def train(args):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    data_dir = Path(args.data_dir)

    # Protokolle laden
    train_samples = load_asvspooof_protocol(
        data_dir / "ASVspoof2019_LA_cm_protocols" / "ASVspoof2019.LA.cm.train.trn.txt",
        data_dir / "ASVspoof2019_LA_train" / "flac",
    )
    val_samples = load_asvspooof_protocol(
        data_dir / "ASVspoof2019_LA_cm_protocols" / "ASVspoof2019.LA.cm.dev.trl.txt",
        data_dir / "ASVspoof2019_LA_dev" / "flac",
    )

    train_ds = AudioSpectrogramDataset(train_samples, split="train")
    val_ds   = AudioSpectrogramDataset(val_samples,   split="val")

    train_dl = DataLoader(train_ds, batch_size=64, shuffle=True,  num_workers=8, pin_memory=True)
    val_dl   = DataLoader(val_ds,   batch_size=64, shuffle=False, num_workers=8, pin_memory=True)

    model = AudioClassifier().to(device)
    optimizer = AdamW(model.parameters(), lr=1e-4, weight_decay=1e-5)
    scheduler = CosineAnnealingLR(optimizer, T_max=args.epochs, eta_min=1e-6)
    criterion = nn.BCEWithLogitsLoss()
    scaler = torch.cuda.amp.GradScaler()

    best_auc = 0.0
    Path("checkpoints").mkdir(exist_ok=True)

    for epoch in range(args.epochs):
        # Train
        model.train()
        train_losses = []
        for batch in tqdm(train_dl, desc=f"Epoch {epoch+1} [train]", leave=False):
            x = batch["spectrogram"].to(device)
            y = batch["label"].float().to(device)
            optimizer.zero_grad()
            with torch.cuda.amp.autocast():
                logits = model(x)
                loss = criterion(logits, y)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            train_losses.append(loss.item())
        scheduler.step()

        # Val
        model.eval()
        preds, labels = [], []
        with torch.no_grad():
            for batch in tqdm(val_dl, desc=f"Epoch {epoch+1} [val]  ", leave=False):
                x = batch["spectrogram"].to(device)
                y = batch["label"]
                with torch.cuda.amp.autocast():
                    logits = model(x)
                preds.extend(torch.sigmoid(logits).cpu().numpy())
                labels.extend(y.numpy())

        auc = roc_auc_score(labels, preds)
        print(f"Epoch {epoch+1:2d}/{args.epochs} | Train Loss: {np.mean(train_losses):.4f} | Val AUC: {auc:.4f}")

        if auc > best_auc:
            best_auc = auc
            torch.save({
                "epoch": epoch,
                "model_state_dict": model.state_dict(),
                "auc": auc,
            }, "checkpoints/best_audio_model.pth")
            print(f"  ✓ Neues bestes Audio-Modell (AUC: {auc:.4f})")

    print(f"\nFertig! Bestes AUC: {best_auc:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", required=True, help="Pfad zu ASVspoof 2019 LA")
    parser.add_argument("--epochs", type=int, default=15)
    args = parser.parse_args()
    train(args)
