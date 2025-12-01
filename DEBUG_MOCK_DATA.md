# Debugging: Why Am I Getting Mock Data Instead of Backend?

## Quick Check

1. **Open browser console** (F12 → Console tab)
2. **Look for these log messages** when you start the app:
   - `🔍 SearchService Configuration:`
   - `🌐 API Client Configuration:`
3. **When you make a search**, look for:
   - `🚀 Attempting live search with backend API...` (means it's trying backend)
   - `📝 Using mock data` (means it's using mocks)

## Common Issues & Solutions

### Issue 1: `LIVE_SEARCH_ENABLED` is false

**Symptom:** Console shows `📝 Using mock data`

**Check:**
```javascript
// In browser console, run:
console.log('EXPO_PUBLIC_ENABLE_LIVE_SEARCH:', process.env.EXPO_PUBLIC_ENABLE_LIVE_SEARCH);
```

**Solution:**
- Make sure you're using `npm run web:local` (not just `npm run web`)
- Or set environment variable manually:
  ```bash
  EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true EXPO_PUBLIC_API_URL=http://localhost:8000/v1 npm run web
  ```

### Issue 2: API URL is wrong

**Symptom:** Console shows wrong API URL or placeholder URL

**Check:**
```javascript
// In browser console:
console.log('EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
```

**Solution:**
- Make sure URL includes `/v1` suffix: `http://localhost:8000/v1`
- Verify backend is running: `curl http://localhost:8000/health`

### Issue 3: Backend not running

**Symptom:** Console shows `❌ Live search failed` with network error

**Check:**
```bash
curl http://localhost:8000/health
```

**Solution:**
- Start backend: `cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000`

### Issue 4: CORS Error

**Symptom:** Console shows CORS error in network tab

**Check:**
- Browser Network tab → Look for failed request → Check error message

**Solution:**
- Update `backend/.env`: `CORS_ORIGINS=http://localhost:8081,http://localhost:19006`
- Restart backend server

### Issue 5: Environment variables not loaded

**Symptom:** Console shows `undefined` for environment variables

**Solution:**
- **Restart Expo dev server** after setting environment variables
- Environment variables are read at startup, not runtime
- Use `npm run web:local` which sets them inline

## Step-by-Step Debugging

### Step 1: Check Environment Variables

Open browser console and run:
```javascript
console.log({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  LIVE_SEARCH: process.env.EXPO_PUBLIC_ENABLE_LIVE_SEARCH,
});
```

**Expected output:**
```javascript
{
  API_URL: "http://localhost:8000/v1",
  LIVE_SEARCH: "true"
}
```

### Step 2: Check Backend is Running

```bash
curl http://localhost:8000/health
```

**Expected:** `{"status":"ok","service":"searchbot-api"}`

### Step 3: Test Backend Directly

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

### Step 4: Check Browser Network Tab

1. Open DevTools → Network tab
2. Make a search in the app
3. Look for request to `/v1/search`
4. Check:
   - **Status:** Should be 200 (not 404, 500, or CORS error)
   - **Request URL:** Should be `http://localhost:8000/v1/search`
   - **Response:** Should be JSON with search results

## Using .env File (Alternative Method)

Instead of inline environment variables, you can create `.env.local` in `SearchBotApp`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/v1
EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true
```

**Note:** You may need to install `dotenv` or use Expo's built-in env support. For now, inline variables are more reliable.

## Verify It's Working

When everything is configured correctly, you should see:

1. **On app start:**
   ```
   🔍 SearchService Configuration:
     EXPO_PUBLIC_ENABLE_LIVE_SEARCH: true
     LIVE_SEARCH_ENABLED: true
     EXPO_PUBLIC_API_URL: http://localhost:8000/v1
   🌐 API Client Configuration:
     EXPO_PUBLIC_API_URL: http://localhost:8000/v1
     API_BASE_URL: http://localhost:8000/v1
   ```

2. **When making a search:**
   ```
   🚀 Attempting live search with backend API...
     API URL: http://localhost:8000/v1
     Request: { id: '...', description: '...' }
   ✅ Live search successful!
   ```

3. **In Network tab:**
   - Request to `http://localhost:8000/v1/search`
   - Status: 200 OK
   - Response: Real search results (not mock data)

## Still Not Working?

1. **Clear browser cache** and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Restart Expo dev server** completely
3. **Check backend logs** for incoming requests
4. **Try the automated script:** `./start-local.sh` (ensures correct setup)

