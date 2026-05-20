"""
Scan-Endpoints
==============
POST /api/scan/image  → Bild analysieren
POST /api/scan/video  → Video analysieren (Frame-Sampling)
POST /api/scan/audio  → Audio analysieren (Mel-Spektrogramm)
"""

import sys
import time
from pathlib import Path

import numpy as np
from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from PIL import Image
import io
import cv2

from api.utils.response_models import ScanResponse, ErrorResponse

router = APIRouter()

# ── Erlaubte MIME-Types ────────────────────────────────────────────────────────
IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
VIDEO_TYPES = {"video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"}
AUDIO_TYPES = {"audio/wav", "audio/x-wav", "audio/flac", "audio/mpeg", "audio/mp4"}
MAX_FILE_SIZE_MB = 50


def _check_file(file: UploadFile, allowed_types: set[str]):
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail=f"Nicht unterstützter Dateityp: {file.content_type}. Erlaubt: {allowed_types}",
        )


async def _read_file(file: UploadFile) -> bytes:
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(413, f"Datei zu groß ({size_mb:.1f}MB). Max: {MAX_FILE_SIZE_MB}MB")
    return contents


# ── /image ────────────────────────────────────────────────────────────────────

@router.post("/image", response_model=ScanResponse)
async def scan_image(request: Request, file: UploadFile = File(...)):
    """
    Analysiert ein Bild auf Deepfake-Merkmale.
    Gibt Fake-Wahrscheinlichkeit + GradCAM-Heatmap zurück.
    """
    _check_file(file, IMAGE_TYPES)
    contents = await _read_file(file)

    # Bytes → RGB NumPy
    pil_img = Image.open(io.BytesIO(contents)).convert("RGB")
    
    w, h = pil_img.size
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    pil_img = pil_img.crop((left, top, left + s, top + s))
    img_rgb = np.array(pil_img.resize((224, 224), Image.LANCZOS))

    t0 = time.time()
    models = request.app.state.models

    if models.get("image") is None:
        raise HTTPException(503, "Bild-Modell nicht geladen. ONNX-Datei vorhanden?")

    try:
        result = models["image"].predict_with_heatmap(img_rgb)
    except Exception as e:
        raise HTTPException(500, f"Analyse-Fehler: {str(e)}")

    elapsed_ms = int((time.time() - t0) * 1000)

    return ScanResponse(
        verdict=result["verdict"],
        fake_probability=result["fake_probability"],
        confidence=result["confidence"],
        label=result["label"],
        modality="image",
        processing_time_ms=elapsed_ms,
        details={
            "suspicious_regions": result.get("suspicious_regions", []),
            "heatmap_base64": result.get("heatmap_base64"),
        },
    )


# ── /video ────────────────────────────────────────────────────────────────────

@router.post("/video", response_model=ScanResponse)
async def scan_video(request: Request, file: UploadFile = File(...)):
    """
    Analysiert ein Video durch Frame-Sampling.
    Extrahiert 10 Frames, analysiert jedes einzeln, aggregiert das Ergebnis.
    """
    _check_file(file, VIDEO_TYPES)
    contents = await _read_file(file)

    # Temp-Datei (cv2 braucht einen Dateipfad)
    import tempfile, os
    suffix = Path(file.filename or "video.mp4").suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    t0 = time.time()
    models = request.app.state.models

    if models.get("video") is None:
        os.unlink(tmp_path)
        raise HTTPException(503, "Video-Detektor nicht verfügbar.")

    try:
        result = models["video"].predict(tmp_path)
    except Exception as e:
        raise HTTPException(500, f"Analyse-Fehler: {str(e)}")
    finally:
        os.unlink(tmp_path)

    elapsed_ms = int((time.time() - t0) * 1000)

    return ScanResponse(
        verdict=result["verdict"],
        fake_probability=result["fake_probability"],
        confidence=result["confidence"],
        label=result["label"],
        modality="video",
        processing_time_ms=elapsed_ms,
        details={
            "analyzed_frames": result.get("analyzed_frames"),
            "suspicious_frames": result.get("suspicious_frames"),
            "max_frame_fake_probability": result.get("max_frame_fake_probability"),
            "frame_results": result.get("frame_results", []),
        },
    )


# ── /audio ────────────────────────────────────────────────────────────────────

@router.post("/audio", response_model=ScanResponse)
async def scan_audio(request: Request, file: UploadFile = File(...)):
    """
    Analysiert eine Audiodatei auf synthetische Sprache (TTS/Voice-Conversion).
    """
    _check_file(file, AUDIO_TYPES)
    contents = await _read_file(file)

    t0 = time.time()
    models = request.app.state.models

    if models.get("audio") is None:
        raise HTTPException(503, "Audio-Modell nicht geladen.")

    try:
        result = models["audio"].predict_from_bytes(contents)
    except Exception as e:
        raise HTTPException(500, f"Analyse-Fehler: {str(e)}")

    elapsed_ms = int((time.time() - t0) * 1000)

    return ScanResponse(
        verdict=result["verdict"],
        fake_probability=result["fake_probability"],
        confidence=result["confidence"],
        label=result["label"],
        modality="audio",
        processing_time_ms=elapsed_ms,
        details={"note": result.get("note", "")},
    )
