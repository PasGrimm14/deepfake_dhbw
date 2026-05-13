"""
Audio-Deepfake-Detektor
========================
Mel-Spektrogramm → ONNX MobileNetV2 → Fake-Wahrscheinlichkeit
CPU-Inference: ~50-150ms
"""

from __future__ import annotations

import io
import numpy as np

import onnxruntime as ort


class AudioDeepfakeDetector:
    """
    ONNX-basierter Audio-Detektor.
    Trainiert auf ASVspoof 2019 LA (Logical Access).
    """

    SAMPLE_RATE = 16000
    N_MELS = 80
    MAX_LEN = 400           # ~4 Sekunden bei hop_length=160

    def __init__(self, model_path: str):
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 4
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        self.session = ort.InferenceSession(
            model_path,
            sess_options=opts,
            providers=["CPUExecutionProvider"],
        )
        self.input_name = self.session.get_inputs()[0].name

    def predict_from_path(self, audio_path: str) -> dict:
        mel = self._load_mel(audio_path)
        return self._run_inference(mel)

    def predict_from_bytes(self, audio_bytes: bytes) -> dict:
        """Für FastAPI File-Upload."""
        import soundfile as sf
        data, sr = sf.read(io.BytesIO(audio_bytes))
        mel = self._audio_to_mel(data, sr)
        return self._run_inference(mel)

    def _run_inference(self, mel: np.ndarray) -> dict:
        # [1, 1, n_mels, max_len]
        tensor = mel[np.newaxis, np.newaxis, ...].astype(np.float32)
        logits = self.session.run(None, {self.input_name: tensor})[0]
        prob = float(1 / (1 + np.exp(-logits.flatten()[0])))

        verdict = "FAKE" if prob > 0.5 else "REAL"
        confidence = prob if verdict == "FAKE" else 1.0 - prob

        return {
            "fake_probability": round(prob, 4),
            "verdict": verdict,
            "confidence": round(confidence, 4),
            "label": f"{verdict} ({confidence*100:.1f}% Konfidenz)",
            "note": "Audio-Analyse basiert auf ASVspoof 2019 (TTS/Voice-Conversion-Fakes)",
        }

    def _load_mel(self, path: str) -> np.ndarray:
        import librosa
        y, sr = librosa.load(path, sr=self.SAMPLE_RATE, mono=True)
        return self._audio_to_mel(y, sr)

    def _audio_to_mel(self, y: np.ndarray, sr: int) -> np.ndarray:
        import librosa
        if sr != self.SAMPLE_RATE:
            y = librosa.resample(y, orig_sr=sr, target_sr=self.SAMPLE_RATE)

        mel = librosa.feature.melspectrogram(
            y=y, sr=self.SAMPLE_RATE,
            n_mels=self.N_MELS,
            n_fft=512, hop_length=160, win_length=400,
        )
        mel_db = librosa.power_to_db(mel, ref=np.max)

        # Padden / Cutten
        if mel_db.shape[1] < self.MAX_LEN:
            pad = self.MAX_LEN - mel_db.shape[1]
            mel_db = np.pad(mel_db, ((0, 0), (0, pad)), mode="constant", constant_values=-80)
        else:
            mel_db = mel_db[:, :self.MAX_LEN]

        # Normalisieren [0, 1]
        mel_db = (mel_db - mel_db.min()) / (mel_db.max() - mel_db.min() + 1e-8)
        return mel_db.astype(np.float32)
