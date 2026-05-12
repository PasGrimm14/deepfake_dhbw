# Deepfake Awareness Portal

Ein modernes Multi-Page React-Projekt über Deepfakes & Voice Cloning Awareness, erstellt als DHBW-Projektarbeit.

## Tech Stack

- **React 18** mit **React Router v6**
- **Tailwind CSS** für Styling
- **Framer Motion** für Animationen
- **Lucide React** für Icons
- **React Simple Maps** für die interaktive Weltkarte
- **Vite** als Build-Tool

## Seiten

| Route | Seite |
|---|---|
| `/` | Home / Landing |
| `/was-sind-deepfakes` | Was sind Deepfakes & Voice Cloning? |
| `/angriffsvektoren` | Reale Angriffsvektoren & Fallbeispiele |
| `/awareness-portal` | Awareness Portal (Quiz + Demos) |
| `/deepfake-scanner` | Deepfake Scanner (Anthropic API) |
| `/schutzmassnahmen` | Schutzmaßnahmen & Fazit |
| `/praesentation` | Präsentation (Canva Embed) |
| `/quellen` | Quellenverzeichnis (Notion-Integration) |
| `/template` | Template Page (leeres Scaffold) |

## Setup

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

## Deepfake Scanner — API Key

Die Scanner-Seite nutzt die Anthropic API (Modell: `claude-sonnet-4-20250514`). Der API-Key kann auf zwei Wegen angegeben werden:

1. **Im UI** — direkt auf der `/deepfake-scanner` Seite eingeben. Er wird in `localStorage` gespeichert und nur an `api.anthropic.com` gesendet.

2. **Per `.env`-Datei** — `.env.example` nach `.env` kopieren und Key eintragen:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api...
   ```

> Der Key wird ausschließlich für direkte Browser-zu-Anthropic-API-Aufrufe verwendet. Kein Backend erforderlich.

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

## Projektstruktur

```
src/
├── components/
│   ├── NavBar.jsx            # Sticky Navigation mit Mobile-Menü
│   ├── Footer.jsx            # Seitenfooter mit Links
│   ├── PageHero.jsx          # Wiederverwendbarer Seiten-Hero
│   ├── RiskBadge.jsx         # LOW / MEDIUM / HIGH / CRITICAL Badge
│   ├── InfoCard.jsx          # Icon + Titel + Beschreibung Karte
│   ├── AnimatedCounter.jsx   # Count-up-Animation beim Scrollen
│   └── SectionDivider.jsx    # Visueller Abschnittstrenner
├── data/
│   ├── quellen.js            # Statische Fallback-Quellen (APA 7)
│   └├── quellenUtils.js      # APA-7-Formatter & Hilfsfunktionen
├── hooks/
│   └── useNotion.js          # Notion-Daten-Hook mit Pagination
├── pages/
│   ├── Home.jsx
│   ├── WasSindDeepfakes.jsx
│   ├── Angriffsvektoren.jsx
│   ├── AwarenessPortal.jsx
│   ├── DeepfakeScanner.jsx
│   ├── Schutzmassnahmen.jsx
│   ├── Praesentation.jsx
│   ├── Quellen.jsx
│   └── Template.jsx          # Leeres Scaffold für neue Seiten
├── assets/
├── App.jsx                   # Router-Setup + Layout
├── main.jsx
└── index.css                 # Tailwind Base + eigene Utilities
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
