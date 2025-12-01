# Quick Diagnostic: Mock Data Issue

Since you see `EXPO_PUBLIC_ENABLE_LIVE_SEARCH: true` in console, the environment variable is set correctly.

## Step 1: Check What Happens When You Search

Make a search and look for these messages in console:

**✅ Good signs:**
```
🚀 Attempting live search with backend API...
  API URL: http://localhost:8000/v1
  Request: { id: '...', description: '...' }
✅ Live search successful!
```

**❌ Problem signs:**
```
🚀 Attempting live search with backend API...
❌ Live search failed: [error message]
⚠️  Falling back to mock data
```

## Step 2: Check Backend is Running

```bash
curl http://localhost:8000/health
```

**Expected:** `{"status":"ok","service":"searchbot-api"}`

**If it fails:** Start backend:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

## Step 3: Check Browser Network Tab

1. Open DevTools (F12) → Network tab
2. Make a search
3. Look for request to `localhost:8000/v1/search`

**Check:**
- **Status:** Should be `200` (green)
- **Request URL:** Should be `http://localhost:8000/v1/search`
- **Response:** Should be JSON with search results

**Common errors:**
- **404 Not Found:** API URL might be wrong (check includes `/v1`)
- **CORS Error:** Backend CORS not configured for your port
- **Failed (net::ERR_CONNECTION_REFUSED):** Backend not running
- **500 Internal Server Error:** Backend error (check backend logs)

## Step 4: Verify API URL

In browser console, run:
```javascript
console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
```

**Should be:** `http://localhost:8000/v1` (with `/v1` suffix)

## Step 5: Test Backend Directly

```bash
curl -X POST http://localhost:8000/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-123",
    "description": "Test question",
    "category": "education",
    "priority": "normal",
    "createdAt": "2024-01-01T00:00:00Z"
  }'
```

**Expected:** JSON response with search results

**If this fails:** Backend has an issue (check backend logs)

## Common Issues & Solutions

### Issue: See "Attempting live search" but then "Failed"

**Check error details in console:**
- **Network Error:** Backend not running → Start backend
- **404:** Wrong API URL → Check includes `/v1`
- **CORS:** Backend CORS not configured → Update `backend/.env`

### Issue: Don't see "Attempting live search" at all

**Check:**
- Environment variable might not be loaded → Restart Expo server
- Make sure using `npm run web:local` (not `npm run web`)

### Issue: Backend works with curl but not from browser

**Likely CORS issue:**
1. Check what port Expo is using (usually `19006` or `8081`)
2. Update `backend/.env`:
   ```env
   CORS_ORIGINS=http://localhost:8081,http://localhost:19006
   ```
3. Restart backend

## Still Not Working?

Share these details:
1. Console messages when you make a search
2. Network tab screenshot or status code
3. Output of `curl http://localhost:8000/health`
4. Output of `curl -X POST http://localhost:8000/v1/search ...` (test command above)

