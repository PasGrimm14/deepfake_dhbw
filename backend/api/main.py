"""
Deepfake Detector API
=====================
FastAPI App – startet mit: uvicorn api.main:app --host 0.0.0.0 --port 8000
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import scan, health
from api.utils.model_loader import load_models


# ── Lifespan: Modelle beim Start laden ────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modelle einmalig beim Start in app.state laden."""
    print("Lade Deepfake-Modelle...")
    app.state.models = load_models()
    print("Modelle geladen ✓")
    yield
    # Shutdown (optional cleanup)


# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Deepfake Detector API",
    description="Erkennt Deepfakes in Bildern, Videos und Audio",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Im Prod auf deine Domain einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(scan.router, prefix="/api/scan")


@app.get("/")
async def root():
    return {"message": "Deepfake Detector API", "docs": "/docs"}
