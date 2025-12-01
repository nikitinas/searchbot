# Local Testing Guide

## Quick Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Create `.env` File

Create a `.env` file in the `backend` directory:

```bash
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional: Override base URL (for proxy or custom endpoint)
# OPENAI_BASE_URL=https://api.openai.com/v1

# Optional: Change model (default: gpt-4-turbo-preview)
# OPENAI_MODEL=gpt-3.5-turbo

# CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:8081,http://localhost:19006

# Port (defaults to 8000)
PORT=8000
```

**Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to your `.env` file

### 4. Run the Server

```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Testing Endpoints

### 1. Health Check (No API Key Required)

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "searchbot-api"
}
```

### 2. Interactive API Docs

Open in browser:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test endpoints directly in the browser!

### 3. Test Search Endpoint

```bash
curl -X POST http://localhost:8000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "description": "How to learn Python programming",
    "category": "education",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
```

### 4. Test with Python Script

Create `test_local.py`:

```python
import requests
import json

url = "http://localhost:8000/v1/search"
payload = {
    "id": "test-123",
    "description": "Best way to learn Python",
    "category": "education",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
}

print("Sending request...")
response = requests.post(url, json=payload)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
```

Run:
```bash
python test_local.py
```

## Troubleshooting

### Issue: "OPENAI_API_KEY environment variable not set"

**Solution:** Make sure you created `.env` file in the `backend` directory with your API key.

### Issue: API hangs or times out

**Possible causes:**
1. **Google Search rate limiting** - The free `googlesearch-python` library may be rate-limited. The code will fallback to mock sources after 10 seconds.
2. **OpenAI API slow response** - GPT-4 can take 10-30 seconds. This is normal.
3. **Network issues** - Check your internet connection.

**Solutions:**
- The code now has a 10-second timeout for web search
- If search times out, it uses fallback sources
- Consider using SerpAPI (paid) for more reliable search results

### Issue: CORS errors from frontend

**Solution:** Add your frontend URL to `CORS_ORIGINS` in `.env`:
```
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,http://localhost:3000
```

### Issue: Port 8000 already in use

**Solution:** Change the port:
```bash
PORT=8001 uvicorn main:app --reload --port 8001
```

Or kill the process using port 8000:
```bash
# Find process
lsof -ti:8000

# Kill it
kill -9 $(lsof -ti:8000)
```

### Check Logs

The server will print detailed error messages. Look for:
- `Search error:` - Web search issues
- `Error fetching` - Individual source fetch failures
- `Search processing error:` - Full error traceback

## Testing Different Scenarios

### Test with different categories:
```bash
curl -X POST http://localhost:8000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "description": "Best restaurants in New York",
    "category": "food",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
```

### Test with voice transcript:
```bash
curl -X POST http://localhost:8000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-2",
    "description": "How to start a business",
    "category": "business",
    "priority": "urgent",
    "voiceTranscript": "I want to start my own business",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
```

## Performance Notes

- **First request** may be slower (cold start)
- **Search gathering** takes 5-15 seconds (web scraping)
- **AI generation** takes 10-30 seconds (GPT-4)
- **Total time**: ~15-45 seconds per request

For faster testing, consider:
- Using `gpt-3.5-turbo` instead of `gpt-4-turbo-preview` (set `OPENAI_MODEL=gpt-3.5-turbo` in `.env`)
- Using SerpAPI for more reliable search (requires paid API key)

