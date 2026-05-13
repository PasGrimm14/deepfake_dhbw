"""
Video-Detektor (Frame-Sampling + Aggregation)
"""

from __future__ import annotations

import numpy as np
import cv2
from pathlib import Path

from image_detector import ImageDeepfakeDetector


class VideoDeepfakeDetector:
    """
    Analysiert Videos durch Frame-Sampling.
    Kein eigenes Video-Modell nötig – nutzt ImageDeepfakeDetector.
    """

    def __init__(self, image_detector: ImageDeepfakeDetector, n_frames: int = 10):
        self.detector = image_detector
        self.n_frames = n_frames

    def predict(self, video_path: str) -> dict:
        """
        Returns:
            {
              "fake_probability": float,
              "verdict": str,
              "confidence": float,
              "frame_results": [...],
              "analyzed_frames": int,
              "suspicious_frames": int,
            }
        """
        frames = self._extract_frames(video_path)
        if not frames:
            return {"error": "Keine Frames extrahierbar", "verdict": "UNKNOWN"}

        frame_results = []
        for i, frame in enumerate(frames):
            result = self.detector.predict(frame)
            frame_results.append({
                "frame_index": i,
                "fake_probability": result["fake_probability"],
                "verdict": result["verdict"],
            })

        probs = [r["fake_probability"] for r in frame_results]
        avg_prob = float(np.mean(probs))
        max_prob = float(np.max(probs))
        suspicious = sum(1 for r in frame_results if r["verdict"] == "FAKE")

        # Konservativ: wenn >30% der Frames fake → Video fake
        verdict = "FAKE" if suspicious / len(frame_results) > 0.3 else "REAL"
        confidence = avg_prob if verdict == "FAKE" else 1.0 - avg_prob

        return {
            "fake_probability": round(avg_prob, 4),
            "max_frame_fake_probability": round(max_prob, 4),
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "label": f"{verdict} ({confidence*100:.1f}% Konfidenz)",
            "analyzed_frames": len(frames),
            "suspicious_frames": suspicious,
            "frame_results": frame_results,
        }

    def _extract_frames(self, video_path: str) -> list[np.ndarray]:
        cap = cv2.VideoCapture(video_path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total <= 0:
            cap.release()
            return []

        indices = np.linspace(0, total - 1, min(self.n_frames, total), dtype=int)
        frames = []
        for idx in indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
            ret, frame = cap.read()
            if ret:
                frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        cap.release()
        return frames
