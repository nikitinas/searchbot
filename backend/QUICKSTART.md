# Quick Start Guide

## 1. Setup Python Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

## 3. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## 4. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Test search endpoint
curl -X POST http://localhost:8000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "description": "Find best smartphone under $500",
    "category": "Electronics",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
```

## 5. Update Frontend

In `SearchBotApp`, update `.env` or `app.json`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/v1
EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true
```

## Deployment Options

### Railway (Easiest)
1. Push to GitHub
2. Connect repo to Railway
3. Add environment variables
4. Deploy!

### Docker
```bash
docker build -t searchbot-backend .
docker run -p 8000:8000 --env-file .env searchbot-backend
```

### Vercel (Serverless)
See `vercel.json` for serverless function configuration.

