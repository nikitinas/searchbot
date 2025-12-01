#!/bin/bash

# Start frontend with automatic port handling
# This script handles port conflicts automatically without prompts

set -e

cd SearchBotApp

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    
    while lsof -ti:$port > /dev/null 2>&1; do
        echo "⚠️  Port $port is busy, trying next port..."
        port=$((port + 1))
        if [ $port -gt $((start_port + 10)) ]; then
            echo "❌ Could not find available port near $start_port"
            exit 1
        fi
    done
    
    echo $port
}

# Kill any existing Expo processes on common ports
echo "🧹 Cleaning up any existing Expo processes..."
pkill -f "expo start" 2>/dev/null || true
sleep 1

# Find available port starting from 19006
PORT=$(find_available_port 19006)
echo "🚀 Starting frontend on port $PORT"
echo ""

# Export environment variables
export EXPO_PUBLIC_API_URL=http://localhost:8000/v1
export EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true

# Start Expo with explicit port and non-interactive mode
# Use --no-dev-client to avoid prompts
# Redirect stdin to /dev/null to prevent interactive prompts
echo "Starting Expo web server..."
npx expo start --web --port $PORT < /dev/null 2>&1 | while IFS= read -r line; do
    echo "$line"
    # Look for the web URL in output
    if echo "$line" | grep -q "Web is waiting on\|web is running"; then
        WEB_URL=$(echo "$line" | grep -oE "http://[^ ]*" | head -1)
        if [ -n "$WEB_URL" ]; then
            echo ""
            echo "✅ Frontend ready at: $WEB_URL"
            echo ""
        fi
    fi
done
