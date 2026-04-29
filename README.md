# Deepfake Awareness Portal

A modern multi-page React application about Deepfakes & Voice Cloning Awareness, built as a DHBW project.

## Tech Stack

- **React 18** with **React Router v6**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vite** as build tool

## Pages

| Route | Page |
|---|---|
| `/` | Home / Landing |
| `/was-sind-deepfakes` | Was sind Deepfakes & Voice Cloning? |
| `/angriffsvektoren` | Reale Angriffsvektoren & Fallbeispiele |
| `/awareness-portal` | Awareness Portal (Quiz + Demos) |
| `/deepfake-scanner` | Deepfake Scanner (Anthropic API) |
| `/schutzmassnahmen` | Schutzmaßnahmen & Fazit |
| `/template` | Template Page (blank scaffold) |

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deepfake Scanner — API Key

The scanner page uses the Anthropic API. You can provide your API key in two ways:

1. **In the UI** — Enter it directly on the `/deepfake-scanner` page. It's stored in `localStorage` and never sent anywhere except `api.anthropic.com`.

2. **Via `.env` file** — Copy `.env.example` to `.env` and add your key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api...
   ```

> The key is only used for direct browser-to-Anthropic API calls. No backend required.

## Project Structure

```
src/
├── components/
│   ├── NavBar.jsx          # Sticky top navigation with mobile menu
│   ├── Footer.jsx          # Site footer with links
│   ├── PageHero.jsx        # Reusable page hero banner
│   ├── RiskBadge.jsx       # LOW / MEDIUM / HIGH / CRITICAL badge
│   ├── InfoCard.jsx        # Icon + title + description card
│   ├── AnimatedCounter.jsx # Count-up animation on scroll
│   └── SectionDivider.jsx  # Visual section separator
├── pages/
│   ├── Home.jsx
│   ├── WasSindDeepfakes.jsx
│   ├── Angriffsvektoren.jsx
│   ├── AwarenessPortal.jsx
│   ├── DeepfakeScanner.jsx
│   ├── Schutzmassnahmen.jsx
│   └── Template.jsx        # Blank page scaffold for new pages
├── assets/
├── App.jsx                 # Router setup + layout
├── main.jsx
└── index.css               # Tailwind base + custom utilities
```

## Adding New Pages

1. Copy `src/pages/Template.jsx` to a new file
2. Rename the exported component
3. Add a route in `src/App.jsx`
4. Add a link in `src/components/NavBar.jsx` → `navLinks` array

## Design System

| Token | Value |
|---|---|
| Primary accent | `red-600` / `red-700` |
| Background | `white` / `gray-50` |
| Card surface | `white` + `border-gray-200` |
| Heading text | `gray-900` |
| Body text | `gray-600` |
| Danger | `red-800` |
