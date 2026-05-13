#!/bin/sh

# Placeholder im gebauten JS durch echte ENV-Variable ersetzen
find /usr/share/nginx/html -name "*.js" -exec \
  sed -i "s|VITE_SCANNER_API_URL_PLACEHOLDER|${SCANNER_API_URL:-http://localhost:8000}|g" {} \;

# Nginx starten
exec nginx -g "daemon off;"