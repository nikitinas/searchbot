#!/bin/bash

# Start frontend for E2E tests
# This script builds the web app and serves it

set -e

FRONTEND_DIR="../SearchBotApp"
PORT=${1:-19006}

cd "$FRONTEND_DIR"

# Check if dist exists and is recent (less than 5 minutes old)
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    DIST_AGE=$(find dist/index.html -mmin -5 2>/dev/null || echo "")
    if [ -n "$DIST_AGE" ]; then
        echo "✅ Using existing dist build"
    else
        echo "📦 Building web app..."
        EXPO_PUBLIC_API_URL=http://localhost:8000/v1 EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true npm run build:web
    fi
else
    echo "📦 Building web app..."
    EXPO_PUBLIC_API_URL=http://localhost:8000/v1 EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true npm run build:web
fi

# Serve the built files
echo "🌐 Serving on http://localhost:$PORT"
cd dist

# Use Python's http.server if available, otherwise use npx serve
if command -v python3 &> /dev/null; then
    python3 -m http.server "$PORT"
elif command -v python &> /dev/null; then
    python -m http.server "$PORT"
else
    npx serve -p "$PORT" .
fi

