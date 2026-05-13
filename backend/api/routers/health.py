"""Health Check"""
from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/health")
async def health(request: Request):
    models = request.app.state.models
    return {
        "status": "ok",
        "models": {
            "image": models.get("image") is not None,
            "audio": models.get("audio") is not None,
            "video": models.get("video") is not None,
        }
    }
