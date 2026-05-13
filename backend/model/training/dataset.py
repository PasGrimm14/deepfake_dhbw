"""
Dataset-Klassen für Deepfake-Training
"""

from pathlib import Path

import albumentations as A
import cv2
import numpy as np
import torch
from albumentations.pytorch import ToTensorV2
from torch.utils.data import Dataset


def build_transforms(split: str, image_size: int = 224) -> A.Compose:
    """Albumentations Transform-Pipeline."""
    normalize = A.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],
    )

    if split == "train":
        return A.Compose([
            A.Resize(image_size, image_size),
            A.HorizontalFlip(p=0.5),
            A.RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, p=0.3),
            A.GaussianBlur(blur_limit=(3, 7), p=0.2),
            A.ImageCompression(quality_range=(60, 100), p=0.3),
            # Simuliert verschiedene Kompressionsartefakte (wichtig für FF++)
            A.OneOf([
                A.GaussNoise(p=1.0),
                A.ISONoise(p=1.0),
            ], p=0.2),
            A.CoarseDropout(
                num_holes_range=(1, 4),
                hole_height_range=(16, 32),
                hole_width_range=(16, 32),
                p=0.2,
            ),
            normalize,
            ToTensorV2(),
        ])
    else:
        # Val / Test: nur Resize + Normalize
        return A.Compose([
            A.Resize(image_size, image_size),
            normalize,
            ToTensorV2(),
        ])


class DeepfakeImageDataset(Dataset):
    """
    ImageFolder-kompatibles Dataset.
    Erwartet Struktur:
        root/real/*.jpg
        root/fake/*.jpg
    """

    def __init__(self, root: str, split: str = "train", config: dict = None):
        self.root = Path(root)
        self.split = split
        image_size = config["data"]["image_size"] if config else 224

        self.transform = build_transforms(split, image_size)

        # Alle Bilder laden
        self.samples = []  # (path, label)  label: 0=real, 1=fake

        for label_name, label_idx in [("real", 0), ("fake", 1)]:
            label_dir = self.root / label_name
            if not label_dir.exists():
                print(f"WARNUNG: {label_dir} nicht gefunden!")
                continue
            for img_path in sorted(label_dir.glob("*.jpg")):
                self.samples.append((img_path, label_idx))
            for img_path in sorted(label_dir.glob("*.png")):
                self.samples.append((img_path, label_idx))

        if len(self.samples) == 0:
            raise ValueError(f"Keine Bilder in {self.root} gefunden!")

        # Klassenverteilung
        n_real = sum(1 for _, l in self.samples if l == 0)
        n_fake = sum(1 for _, l in self.samples if l == 1)
        print(f"  [{split}] Real: {n_real}, Fake: {n_fake}, Total: {len(self.samples)}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx: int) -> dict:
        img_path, label = self.samples[idx]

        # Bild laden (RGB)
        img = cv2.imread(str(img_path))
        if img is None:
            # Fallback: schwarzes Bild
            img = np.zeros((224, 224, 3), dtype=np.uint8)
        else:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        transformed = self.transform(image=img)
        image_tensor = transformed["image"]

        return {
            "image": image_tensor,
            "label": label,
            "path": str(img_path),
        }


class AudioSpectrogramDataset(Dataset):
    """
    Dataset für Audio-Deepfake-Erkennung (ASVspoof 2019).
    Konvertiert .flac/.wav → Mel-Spektrogramm.
    """

    def __init__(self, file_list: list[tuple], split: str = "train",
                 sample_rate: int = 16000, n_mels: int = 80, max_len: int = 400):
        """
        file_list: Liste von (audio_path, label) Tupeln
                   label: 0=bonafide (real), 1=spoof (fake)
        """
        self.samples = file_list
        self.split = split
        self.sample_rate = sample_rate
        self.n_mels = n_mels
        self.max_len = max_len   # Frames im Spektrogramm

    def _load_mel(self, path: str) -> np.ndarray:
        import librosa
        y, sr = librosa.load(path, sr=self.sample_rate, mono=True)
        # Mel-Spektrogramm
        mel = librosa.feature.melspectrogram(
            y=y, sr=sr, n_mels=self.n_mels,
            n_fft=512, hop_length=160, win_length=400,
        )
        mel_db = librosa.power_to_db(mel, ref=np.max)
        # Auf max_len padden/cutten → [n_mels, max_len]
        if mel_db.shape[1] < self.max_len:
            pad = self.max_len - mel_db.shape[1]
            mel_db = np.pad(mel_db, ((0, 0), (0, pad)), mode="constant", constant_values=-80)
        else:
            mel_db = mel_db[:, :self.max_len]
        # Normalisierung auf [0, 1]
        mel_db = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-8)
        return mel_db.astype(np.float32)

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx: int) -> dict:
        audio_path, label = self.samples[idx]
        mel = self._load_mel(audio_path)
        # [1, n_mels, max_len] – 1 Kanal für CNN
        mel_tensor = torch.tensor(mel).unsqueeze(0)
        return {
            "spectrogram": mel_tensor,
            "label": label,
            "path": audio_path,
        }
