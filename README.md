# Deepfake Awareness Portal

Ein modernes Multi-Page React-Projekt über Deepfakes & Voice Cloning Awareness, erstellt als DHBW-Projektarbeit.

## Projektteam
- Pascal Grimm
- Leonard Schmid

## Tech Stack

### Frontend
- **React 18** mit **React Router v6**
- **Tailwind CSS** für Styling
- **Framer Motion** für Animationen
- **Lucide React** für Icons
- **React Simple Maps** für die interaktive Weltkarte
- **Vite** als Build-Tool

### Backend
- **Python 3.11** mit **FastAPI**
- **ONNX Runtime** für CPU-Inferenz (kein GPU nötig)
- **OpenCV** für Bildverarbeitung & Heatmap-Generierung
- **Librosa / SoundFile** für Audio-Analyse
- **Uvicorn** als ASGI-Server

## Seiten

| Route | Seite |
|---|---|
| `/` | Home / Landing |
| `/was-sind-deepfakes` | Was sind Deepfakes & Voice Cloning? |
| `/angriffsvektoren` | Reale Angriffsvektoren & Fallbeispiele |
| `/awareness-portal` | Awareness Portal (Quiz + Demos) |
| `/deepfake-scanner` | Deepfake Scanner (Backend-API) |
| `/schutzmassnahmen` | Schutzmaßnahmen & Fazit |
| `/praesentation` | Präsentation (Canva Embed) |
| `/quellen` | Quellenverzeichnis (Notion-Integration) |
| `/template` | Template Page (leeres Scaffold) |

## Setup

### Frontend

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build
npm run build

# Build-Vorschau
npm run preview
```

### Backend

```bash
# In das Backend-Verzeichnis wechseln
cd backend

# Virtuelle Umgebung erstellen (empfohlen)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Abhängigkeiten installieren
pip install -r requirements.txt

# Entwicklungsserver starten
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

Die API ist dann unter `http://localhost:8000` erreichbar. Swagger-Doku: `http://localhost:8000/docs`

## Deepfake Scanner — Backend-API

Der Scanner nutzt ein trainiertes ONNX-Modell (EfficientNet-B4) und läuft vollständig auf der CPU — kein GPU nötig.

### Endpunkte

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/health` | Modellstatus prüfen |
| `POST` | `/api/scan/image` | Bild analysieren (JPG, PNG, WebP) |
| `POST` | `/api/scan/video` | Video analysieren (MP4, MOV, WebM) |
| `POST` | `/api/scan/audio` | Audio analysieren (WAV, FLAC, MP3) |

### Modell einrichten

Das ONNX-Modell muss manuell heruntergeladen und abgelegt werden:

```
backend/models/deepfake_image.onnx
```

Der Pfad ist über die Umgebungsvariable `IMAGE_MODEL_PATH` konfigurierbar (Standard: `models/deepfake_image.onnx`).

Ohne Modell startet die API trotzdem, gibt für Bild-Scans aber `HTTP 503` zurück. Audio- und Video-Erkennung sind noch als `null` markiert und können separat aktiviert werden.

### Umgebungsvariablen (Backend)

```
IMAGE_MODEL_PATH=models/deepfake_image.onnx   # Pfad zum ONNX-Modell
VIDEO_FRAMES=10                                # Anzahl Frames beim Video-Sampling
```

### Frontend-Verbindung

Die Scanner-Seite liest die API-URL aus:

```
VITE_SCANNER_API_URL=http://localhost:8000
```

Im Docker-Produktivbetrieb wird diese Variable zur Laufzeit über `docker-entrypoint.sh` injiziert.

## Modell trainieren

Die Trainings-Skripte liegen unter `backend/model/training/`.

### Bild-Modell (EfficientNet-B4 auf FaceForensics++)

```bash
python model/training/train_image.py --config configs/efficientnet_b4.yaml
```

Erwartet folgende Verzeichnisstruktur:
```
data/
  train/
    real/*.jpg
    fake/*.jpg
  val/
    real/*.jpg
    fake/*.jpg
```

### Audio-Modell (MobileNetV2 auf ASVspoof 2019 LA)

```bash
python model/training/train_audio.py --data-dir data/raw/asvspoof2019/LA
```

### ONNX-Export

Nach dem Training das beste Checkpoint-Modell nach ONNX exportieren und unter `backend/models/` ablegen. PyTorch-Export-Skript liegt bei.

## Quellenverzeichnis — Notion-Integration

Die Seite `/quellen` lädt Einträge live aus einer Notion-Datenbank und formatiert sie automatisch nach APA 7.

### Umgebungsvariablen

```
VITE_NOTION_TOKEN=secret_...        # Notion Integration Token
VITE_NOTION_DATABASE_ID=abc123...   # ID der Notion-Datenbank
```

### Entwicklung vs. Produktion

| Umgebung | Zugriff |
|---|---|
| `npm run dev` | Vite-Proxy (`/notion-api` → `api.notion.com`) — kein CORS-Problem |
| Docker / Produktion | `notion-proxy` Container auf Port 3002 |
| Netlify Deploy | Serverless Function (`netlify/functions/notion-proxy.js`) |

### Notion-Datenbank — Felder

| Feld | Typ | Beschreibung |
|---|---|---|
| `title` | Title | Titel des Werks |
| `type` | Select | `journal` / `book` / `website` / `news` / `report` |
| `category` | Select | Thematische Gruppe (z.B. `Technologie`) |
| `authors` | Rich Text | Semikolon-getrennt: `Nachname, V.; Nachname2, V.` |
| `year` | Rich Text | Erscheinungsjahr |
| `journal` | Rich Text | Zeitschriftenname |
| `volume` | Rich Text | Band |
| `issue` | Rich Text | Heftnummer |
| `pages` | Rich Text | Seitenzahlen |
| `doi` | Rich Text | DOI ohne `https://doi.org/` |
| `publisher` | Rich Text | Verlag (nur bei Büchern) |
| `organization` | Rich Text | Herausgebende Organisation |
| `outlet` | Rich Text | Nachrichtenquelle |
| `url` | URL | Vollständige URL |
| `accessDate` | Rich Text | Zugriffsdatum (nur bei veränderlichen Inhalten) |
| `note` | Rich Text | Optionaler Hinweis |

## Docker

Das Projekt besteht aus drei Services:

| Service | Image | Port | Beschreibung |
|---|---|---|---|
| `deepfake-awareness` | Frontend (Nginx) | 3001 | React-App |
| `notion-proxy` | Node.js | 3002 | Notion-API-Proxy |
| `deepfake-backend` | Python / FastAPI | 3003 | Deepfake-Analyse-API |

```bash
# Alle Services starten
docker compose up -d

# Nur Backend neu bauen
docker compose build deepfake-backend
docker compose up -d deepfake-backend
```

### Umgebungsvariablen für Docker

```
GITHUB_REPOSITORY_OWNER=dein-username
GITHUB_REPO_NAME=deepfake-awareness
NOTION_TOKEN=secret_...
SCANNER_API_URL=https://deepfake-back.example.com
```

## Deployment (GitHub Actions → Portainer)

Der Workflow in `.github/workflows/deploy.yml` läuft bei jedem Push auf `main`:

1. **Build & Push Frontend** → `ghcr.io/<repo>:latest`
2. **Build & Push Backend** → `ghcr.io/<repo>-backend:latest`
3. **Deploy** → Portainer-Webhook triggert Stack-Update

Benötigte Secrets in GitHub:

| Secret | Beschreibung |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API Key (optional, für zukünftige Features) |
| `VITE_NOTION_TOKEN` | Notion Token |
| `VITE_NOTION_DATABASE_ID` | Notion Datenbank-ID |
| `VITE_SCANNER_API_URL` | Öffentliche URL des Backends |
| `PORTAINER_WEBHOOK_URL` | Portainer Stack-Webhook-URL |

## Deployment (Netlify)

```toml
# netlify.toml (bereits konfiguriert)
[build]
  command   = "npm run build"
  publish   = "dist"
  functions = "netlify/functions"
```

Erforderliche Umgebungsvariablen in Netlify:
- `NOTION_TOKEN` — Notion Integration Token (serverseitig, ohne `VITE_`-Prefix)

> **Hinweis:** Das Python-Backend wird von Netlify nicht unterstützt. Für den vollständigen Scanner-Betrieb ist ein separater Server oder Container notwendig.

## Projektstruktur

```
├── backend/
│   ├── api/
│   │   ├── main.py               # FastAPI App + CORS + Lifespan
│   │   ├── routers/
│   │   │   ├── health.py         # GET /api/health
│   │   │   └── scan.py           # POST /api/scan/{image,video,audio}
│   │   └── utils/
│   │       ├── model_loader.py   # ONNX-Modelle beim Start laden
│   │       └── response_models.py# Pydantic Schemas
│   ├── model/
│   │   ├── inference/
│   │   │   ├── image_detector.py # ONNX Inferenz + Occlusion Heatmap
│   │   │   ├── video_detector.py # Frame-Sampling + Aggregation
│   │   │   └── audio_detector.py # Mel-Spektrogramm + ONNX
│   │   └── training/
│   │       ├── dataset.py        # DeepfakeImageDataset, AudioSpectrogramDataset
│   │       ├── train_image.py    # EfficientNet-B4 Training
│   │       └── train_audio.py    # MobileNetV2 auf ASVspoof 2019
│   ├── models/                   # ONNX-Modelle (nicht im Repo, manuell ablegen)
│   │   └── deepfake_image.onnx
│   └── requirements.txt
├── notion-proxy/
│   ├── server.js                 # Express-Proxy für Notion API
│   ├── package.json
│   └── Dockerfile
├── netlify/
│   └── functions/
│       └── notion-proxy.js       # Netlify Serverless Function
├── src/
│   ├── components/
│   │   ├── NavBar.jsx
│   │   ├── Footer.jsx
│   │   ├── PageHero.jsx
│   │   ├── RiskBadge.jsx
│   │   ├── InfoCard.jsx
│   │   ├── AnimatedCounter.jsx
│   │   └── SectionDivider.jsx
│   ├── data/
│   │   ├── quellen.js            # Statische Fallback-Quellen (APA 7)
│   │   └── quellenUtils.js       # APA-7-Formatter & Hilfsfunktionen
│   ├── hooks/
│   │   └── useNotion.js          # Notion-Daten-Hook mit Pagination
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── WasSindDeepfakes.jsx
│   │   ├── Angriffsvektoren.jsx
│   │   ├── AwarenessPortal.jsx
│   │   ├── DeepfakeScanner.jsx
│   │   ├── Schutzmassnahmen.jsx
│   │   ├── Praesentation.jsx
│   │   ├── Quellen.jsx
│   │   └── Template.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Dockerfile                    # Frontend Multi-Stage Build
├── backend.Dockerfile            # Backend Python Image
├── docker-compose.yml
├── docker-entrypoint.sh          # ENV-Injektion zur Laufzeit
├── nginx.conf
└── netlify.toml
```

## Neue Seite hinzufügen

1. `src/pages/Template.jsx` kopieren und umbenennen
2. Exportierten Komponentennamen anpassen
3. Route in `src/App.jsx` eintragen
4. Link in `src/components/NavBar.jsx` → `navLinks`-Array ergänzen

## Design System

| Token | Wert |
|---|---|
| Primary Accent | `red-600` / `red-700` |
| Background | `white` / `gray-50` |
| Card Surface | `white` + `border-gray-200` |
| Heading | `gray-900` |
| Body Text | `gray-600` |
| Danger | `red-800` |
| Font | Inter (Google Fonts) |

## Disclaimer

Dieses Portal dient ausschließlich zu Aufklärungszwecken. Der Deepfake Scanner nutzt KI-Analyse und ersetzt keine forensische Untersuchung. Alle Inhalte sind für Bildungszwecke im Rahmen der DHBW-Projektarbeit erstellt.
