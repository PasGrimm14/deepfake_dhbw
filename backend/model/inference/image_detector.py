"""
Bild-Inferenz mit GradCAM-Heatmap
===================================
Läuft mit ONNX Runtime (kein PyTorch nötig auf VPS).
GradCAM wird separat via pytorch-grad-cam generiert falls torch verfügbar.
"""

from __future__ import annotations

import base64
import io
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

# ONNX Runtime für Inference auf VPS
import onnxruntime as ort


# ── Normalisierungskonstanten (ImageNet) ──────────────────────────────────────
_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
_STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess_image(img: np.ndarray, size: int = 224) -> np.ndarray:
    """
    NumPy-only Preprocessing (kein Albumentations auf VPS nötig).
    Input:  RGB uint8 [H, W, 3]
    Output: float32 [1, 3, H, W]
    """
    img = cv2.resize(img, (size, size)).astype(np.float32) / 255.0
    img = (img - _MEAN) / _STD
    img = img.transpose(2, 0, 1)          # HWC → CHW
    return img[np.newaxis, ...]            # [1, 3, H, W]


class ImageDeepfakeDetector:
    """
    ONNX-basierter Deepfake-Detektor für Bilder.
    Läuft vollständig auf CPU, kein GPU nötig.
    """

    def __init__(self, model_path: str):
        if not Path(model_path).exists():
            raise FileNotFoundError(f"ONNX-Modell nicht gefunden: {model_path}")

        # ONNX Session – CPU-Provider für VPS
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 4       # VPS hat meist 4 vCPUs
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        self.session = ort.InferenceSession(
            model_path,
            sess_options=opts,
            providers=["CPUExecutionProvider"],
        )
        self.input_name = self.session.get_inputs()[0].name

    def predict(self, img_rgb: np.ndarray) -> dict:
        """
        Analysiert ein RGB-Bild.

        Returns:
            {
              "fake_probability": float (0.0–1.0),
              "verdict": "FAKE" | "REAL",
              "confidence": float (0.0–1.0),
              "label": str,
            }
        """
        tensor = preprocess_image(img_rgb)
        logits = self.session.run(None, {self.input_name: tensor})[0]   # [1, 1] oder [1]
        prob = float(1 / (1 + np.exp(-logits.flatten()[0])))            # Sigmoid

        verdict = "FAKE" if prob > 0.5 else "REAL"
        confidence = prob if verdict == "FAKE" else 1.0 - prob

        return {
            "fake_probability": round(prob, 4),
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "label": f"{verdict} ({confidence*100:.1f}% Konfidenz)",
        }

    def predict_with_heatmap(self, img_rgb: np.ndarray) -> dict:
        """
        Wie predict(), aber zusätzlich Gradual-Saliency-Heatmap via OpenCV.
        
        Da wir ONNX verwenden, generieren wir eine approximierte Heatmap
        durch Occlusion-Sensitivity (kein Backprop nötig).
        Schnell genug für VPS (~300ms extra).
        """
        result = self.predict(img_rgb)

        # Occlusion-Sensitivity Heatmap
        heatmap = self._occlusion_sensitivity(img_rgb, stride=12, patch_size=24)
        heatmap_b64 = self._heatmap_to_base64(img_rgb, heatmap)

        # Verdächtige Regionen beschreiben
        regions = self._describe_regions(heatmap)

        return {
            **result,
            "heatmap_base64": heatmap_b64,
            "suspicious_regions": regions,
        }

    def _occlusion_sensitivity(
        self,
        img_rgb: np.ndarray,
        stride: int = 16,
        patch_size: int = 32,
    ) -> np.ndarray:
        """
        Occlusion-Sensitivity: Patch blockieren → Score-Abfall = wichtige Region.
        Gibt normalisierte Heatmap [0, 1] in Originalgröße zurück.
        """
        h, w = img_rgb.shape[:2]
        base_prob = self.predict(img_rgb)["fake_probability"]
        sensitivity = np.zeros((h, w), dtype=np.float32)

        for y in range(0, h - patch_size + 1, stride):
            for x in range(0, w - patch_size + 1, stride):
                occluded = img_rgb.copy()
                occluded[y:y+patch_size, x:x+patch_size] = 128  # Grauer Block
                occ_prob = self.predict(occluded)["fake_probability"]
                diff = base_prob - occ_prob
                sensitivity[y:y+patch_size, x:x+patch_size] += diff

        # Normalisieren
        s_min, s_max = sensitivity.min(), sensitivity.max()
        if s_max > s_min:
            sensitivity = (sensitivity - s_min) / (s_max - s_min)
        return sensitivity

    def _heatmap_to_base64(self, img_rgb: np.ndarray, heatmap: np.ndarray) -> str:
        """Überlagert Heatmap auf Originalbild und gibt Base64-PNG zurück."""
        h, w = img_rgb.shape[:2]
        heatmap_resized = cv2.resize(heatmap, (w, h))

        # Colormap anwenden (COLORMAP_JET: blau=sicher, rot=verdächtig)
        heatmap_uint8 = (heatmap_resized * 255).astype(np.uint8)
        heatmap_uint8 = 255 - heatmap_uint8  # invertieren: rot=verdächtig
        colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
        colored_rgb = cv2.cvtColor(colored, cv2.COLOR_BGR2RGB)

        # Überlagern
        overlay = (0.5 * img_rgb + 0.5 * colored_rgb).astype(np.uint8)

        pil_img = Image.fromarray(overlay)
        buf = io.BytesIO()
        pil_img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")

    def _describe_regions(self, heatmap: np.ndarray, threshold: float = 0.35) -> list[str]:
        """
        Nach Invertierung: niedrige Werte = verdächtig (rot), hohe Werte = unauffällig (blau)
        Daher: zone.mean() < threshold → verdächtig
        """
        h, w = heatmap.shape
        zones = {
            "Stirn":        heatmap[0:h//3,    w//3:2*w//3],
            "Linkes Auge":  heatmap[h//6:h//3, 0:w//3],
            "Rechtes Auge": heatmap[h//6:h//3, 2*w//3:w],
            "Nase":         heatmap[h//3:2*h//3, w//3:2*w//3],
            "Mund":         heatmap[2*h//3:5*h//6, w//4:3*w//4],
            "Kinn":         heatmap[5*h//6:h,  w//3:2*w//3],
            "Linke Wange":  heatmap[h//4:3*h//4, 0:w//4],
            "Rechte Wange": heatmap[h//4:3*h//4, 3*w//4:w],
            "Haaransatz":   heatmap[0:h//8,    :],
        }
        suspicious = []
        for zone_name, zone_data in zones.items():
            if zone_data.mean() < threshold:  # < statt > wegen Invertierung
                suspicious.append(zone_name)
        return suspicious
