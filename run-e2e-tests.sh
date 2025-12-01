#!/bin/bash

# Run E2E tests for SearchBot
# This script sets up and runs Playwright tests

set -e

echo "🧪 Setting up E2E tests..."
echo ""

# Check if e2e directory exists
if [ ! -d "e2e" ]; then
    echo "❌ Error: e2e directory not found"
    exit 1
fi

cd e2e

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Install Playwright browsers if not installed
if [ ! -d "node_modules/@playwright" ]; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install chromium
    echo ""
fi

# Check if backend venv exists
if [ ! -d "../backend/venv" ]; then
    echo "⚠️  Warning: Backend venv not found"
    echo "   Creating backend venv..."
    cd ../backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ../e2e
    echo ""
fi

# Check if frontend node_modules exists
if [ ! -d "../SearchBotApp/node_modules" ]; then
    echo "⚠️  Warning: Frontend node_modules not found"
    echo "   Installing frontend dependencies..."
    cd ../SearchBotApp
    npm install
    cd ../e2e
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 Running E2E tests..."
echo ""

# Run tests
npm test

echo ""
echo "✅ Tests complete!"
echo ""
echo "📊 View test report:"
echo "   npx playwright show-report"

