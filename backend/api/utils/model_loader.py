import os
from pathlib import Path

def load_models() -> dict:
    models = {}

    image_model_path = os.getenv("IMAGE_MODEL_PATH", "models/deepfake_image.onnx")
    try:
        from model.inference.image_detector import ImageDeepfakeDetector
        models["image"] = ImageDeepfakeDetector(image_model_path)
        print(f"  ✓ Bild-Modell geladen: {image_model_path}")
    except FileNotFoundError:
        print(f"  ✗ Bild-Modell nicht gefunden: {image_model_path}")
        models["image"] = None
    except Exception as e:
        print(f"  ✗ Bild-Modell Fehler: {e}")
        models["image"] = None

    models["audio"] = None
    models["video"] = None

    return models