# API Testing Guide

## 1. Get Your Railway Deployment URL

After successful deployment, Railway provides a public URL like:

- `https://your-app-name.up.railway.app`

You can find it in Railway dashboard → Your Service → **Settings** → **Domains**.

## 2. Test Health Endpoint

First, verify the API is running:

```bash
curl https://your-app-name.up.railway.app/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "service": "searchbot-api"
}
```

## 3. Test Search Endpoint

### Using curl:

```bash
curl -X POST https://your-app-name.up.railway.app/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "description": "How to learn Python programming",
    "category": "education",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
```

### Using Python:

```python
import requests

url = "https://your-app-name.up.railway.app/v1/search"
payload = {
    "id": "test-123",
    "description": "How to learn Python programming",
    "category": "education",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
}

response = requests.post(url, json=payload)
print(response.json())
```

### Expected Response:

```json
{
  "summary": "...",
  "steps": [
    {
      "id": "step-0",
      "title": "...",
      "description": "..."
    }
  ],
  "decisionFactors": [
    {
      "id": "factor-0",
      "label": "...",
      "detail": "..."
    }
  ],
  "sources": [
    {
      "id": "src-0",
      "title": "...",
      "url": "...",
      "credibility": 75,
      "snippet": "..."
    }
  ],
  "estimatedTimeMinutes": 10,
  "difficulty": "medium",
  "recommendedActions": ["..."]
}
```

## 4. Use FastAPI Auto-Generated Docs

FastAPI automatically generates interactive API documentation:

**Swagger UI:**

```
https://your-app-name.up.railway.app/docs
```

**ReDoc:**

```
https://your-app-name.up.railway.app/redoc
```

You can test endpoints directly in the browser using these docs!

## 5. Test Image Upload Endpoint

```bash
curl -X POST https://your-app-name.up.railway.app/v1/search/upload-image \
  -F "file=@/path/to/your/image.jpg"
```

## 6. Common Test Scenarios

### Test with different categories:

- `"category": "shopping"`
- `"category": "travel"`
- `"category": "health"`
- `"category": "finance"`

### Test with different priorities:

- `"priority": "urgent"`
- `"priority": "normal"`
- `"priority": "low"`

### Test with voice transcript:

```json
{
  "id": "test-456",
  "description": "Best restaurants in New York",
  "category": "food",
  "priority": "normal",
  "voiceTranscript": "I'm looking for the best restaurants in New York City",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 7. Troubleshooting

### If you get CORS errors:

Add your frontend URL to Railway environment variables:

```
CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:8081
```

### If you get 500 errors:

Check Railway logs:

- Railway Dashboard → Your Service → **Deployments** → Click on deployment → **View Logs**

Common issues:

- Missing `OPENAI_API_KEY` environment variable
- Invalid API key
- Network issues with OpenAI API

### Check API logs:

```bash
# In Railway dashboard, go to your service → Logs tab
```

## 8. Quick Test Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

API_URL="https://your-app-name.up.railway.app"

echo "Testing health endpoint..."
curl "$API_URL/health"
echo -e "\n\n"

echo "Testing search endpoint..."
curl -X POST "$API_URL/v1/search" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "description": "How to start a business",
    "category": "business",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
echo -e "\n"
```

Make it executable and run:

```bash
chmod +x test_api.sh
./test_api.sh
```
