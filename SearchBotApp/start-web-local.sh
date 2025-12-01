#!/bin/bash

# Start Expo web with local backend configuration
# This ensures environment variables are properly set

export EXPO_PUBLIC_API_URL=http://localhost:8000/v1
export EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true

echo "🚀 Starting Expo web with:"
echo "  EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL"
echo "  EXPO_PUBLIC_ENABLE_LIVE_SEARCH=$EXPO_PUBLIC_ENABLE_LIVE_SEARCH"
echo ""

# Clear cache and start
npx expo start --web --clear

