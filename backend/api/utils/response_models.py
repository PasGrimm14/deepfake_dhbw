"""Pydantic Response-Schemas"""

from typing import Any, Optional
from pydantic import BaseModel


class ScanResponse(BaseModel):
    verdict: str                          # "FAKE" | "REAL" | "UNKNOWN"
    fake_probability: float               # 0.0 – 1.0
    confidence: float                     # 0.0 – 1.0
    label: str                            # Lesbarer Text
    modality: str                         # "image" | "video" | "audio"
    processing_time_ms: int
    details: Optional[dict[str, Any]] = None


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
