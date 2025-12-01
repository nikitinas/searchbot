#!/bin/bash

# Start Local Development: Backend + Frontend
# This script starts both backend and frontend for local testing

set -e

echo "🚀 Starting SearchBot Local Development..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: backend/.env not found${NC}"
    echo "Creating backend/.env template..."
    cat > backend/.env << EOF
OPENAI_API_KEY=your_key_here
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
PORT=8000
EOF
    echo -e "${YELLOW}Please edit backend/.env and add your OPENAI_API_KEY${NC}"
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}📦 Starting Backend...${NC}"
cd backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies if needed
if [ ! -d "venv/lib/python3"*"/site-packages/fastapi" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    pip install -r requirements.txt > /dev/null 2>&1
fi

# Start backend in background
uvicorn main:app --reload --port 8000 > /tmp/searchbot-backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${GREEN}✓ Backend started on http://localhost:8000${NC}"
echo "  Logs: tail -f /tmp/searchbot-backend.log"
echo ""

# Wait a moment for backend to start
sleep 2

# Check if backend is running
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${YELLOW}⚠️  Backend may not be ready yet. Waiting...${NC}"
    sleep 3
fi

# Start Frontend
cd ../SearchBotApp
echo -e "${BLUE}🌐 Starting Frontend...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install > /dev/null 2>&1
fi

# Start frontend with environment variables
# Use script that handles port conflicts automatically
cd ../SearchBotApp
EXPO_PUBLIC_API_URL=http://localhost:8000/v1 EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true bash -c 'npx expo start --web --port 19006 < /dev/null' > /tmp/searchbot-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✓ Frontend starting...${NC}"
echo "  Logs: tail -f /tmp/searchbot-frontend.log"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo ""
echo -e "Backend:  ${BLUE}http://localhost:8000${NC}"
echo -e "Frontend: ${BLUE}http://localhost:19006${NC} (check terminal for actual URL)"
echo ""
echo -e "API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Wait for user interrupt
wait

