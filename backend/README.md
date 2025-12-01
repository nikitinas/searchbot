# SearchBot Backend

Backend API for SearchBot mobile app.

## Architecture

- **Framework**: FastAPI (Python)
- **AI/LLM**: OpenAI GPT-4 or Anthropic Claude (for research generation)
- **Web Scraping**: BeautifulSoup4 + requests (for source gathering)
- **Image Processing**: PIL/Pillow (for image analysis if needed)
- **Database**: PostgreSQL (for user data, history sync - optional)
- **Caching**: Redis (for rate limiting and response caching)

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Environment Variables

Create `.env` file:

```env
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here

DATABASE_URL=postgresql://user:pass@localhost/searchbot  # Optional
REDIS_URL=redis://localhost:6379  # Optional

CORS_ORIGINS=http://localhost:8081,exp://localhost:8081
```

## API Endpoints

### POST /v1/search
Main search endpoint that processes research requests.

**Request Body:**
```json
{
  "id": "string",
  "description": "Find best smartphone under $500",
  "category": "Electronics",
  "priority": "normal",
  "imageUri": "https://...",  // Optional
  "voiceTranscript": "string",  // Optional
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "summary": "Compared 17 phones...",
  "steps": [...],
  "decisionFactors": [...],
  "sources": [...],
  "estimatedTimeMinutes": 10,
  "difficulty": "easy",
  "recommendedActions": [...]
}
```

## Deployment

### Option 1: Railway/Render
- Connect GitHub repo
- Set environment variables
- Auto-deploys on push

### Option 2: AWS/GCP
- Use Docker container
- Deploy to ECS/Cloud Run
- Set up load balancer

### Option 3: Vercel (Serverless)
- Use serverless functions
- Good for MVP/testing

