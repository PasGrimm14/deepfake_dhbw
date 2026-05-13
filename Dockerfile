# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Abhängigkeiten zuerst (besseres Layer-Caching)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Quellcode kopieren
COPY . .

# Build-Zeit-Umgebungsvariablen (werden in den Build eingebettet)
# Werden zur Laufzeit durch docker-compose env_file überschrieben,
# sofern VITE_* Variablen gesetzt sind.
ARG VITE_ANTHROPIC_API_KEY=""
ARG VITE_NOTION_TOKEN=""
ARG VITE_NOTION_DATABASE_ID=""
ARG VITE_SCANNER_API_URL=""

ENV VITE_ANTHROPIC_API_KEY=$VITE_ANTHROPIC_API_KEY
ENV VITE_NOTION_TOKEN=$VITE_NOTION_TOKEN
ENV VITE_NOTION_DATABASE_ID=$VITE_NOTION_DATABASE_ID
ENV VITE_SCANNER_API_URL=$VITE_SCANNER_API_URL

RUN npm run build

# ─── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# NEU: Startup-Script das ENV-Variablen injiziert
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/favicon.svg || exit 1

EXPOSE 80

CMD ["/docker-entrypoint.sh"]