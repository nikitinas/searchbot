# Local Testing Guide: Web App + Backend

This guide shows you how to run both the React Native web app and backend locally for testing.

## Quick Start

### Option 1: Manual (Two Terminals)

**Terminal 1 - Backend:**

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```bash
cd SearchBotApp
EXPO_PUBLIC_API_URL=http://localhost:8000/v1 EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true npm run web
```

Then open: `http://localhost:19006` (or the URL shown in terminal)

### Option 2: Using Environment File

Create `.env.local` in `SearchBotApp` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000/v1
EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true
```

Then run:

```bash
cd SearchBotApp
npm run web
```

## Step-by-Step Setup

### 1. Start Backend

```bash
# Navigate to backend
cd backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Make sure you have a .env file with API key
# If not, create one:
cat > .env << EOF
OPENAI_API_KEY=your_key_here
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
PORT=8000
EOF

# Start backend server
uvicorn main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Verify backend is running:**

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{ "status": "ok", "service": "searchbot-api" }
```

### 2. Start Frontend Web App

**In a new terminal:**

```bash
# Navigate to frontend
cd SearchBotApp

# Install dependencies (if not already done)
npm install

# Run web app with environment variables
EXPO_PUBLIC_API_URL=http://localhost:8000/v1 EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true npm run web
```

You should see:

```
Metro waiting on exp://192.168.x.x:8081
› Press w │ open web

Web is waiting on http://localhost:19006
```

**Press `w`** to open in browser, or manually open `http://localhost:19006`

### 3. Test the Connection

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Try a search** in the web app
4. **Look for API calls** to `http://localhost:8000/v1/search`
5. **Check response** - should be 200 OK with real data

## Environment Variables

### Frontend Environment Variables

Set these when running `npm run web`:

- `EXPO_PUBLIC_API_URL` - Backend URL (required)
  - Format: `http://localhost:8000/v1` (include `/v1` suffix)
- `EXPO_PUBLIC_ENABLE_LIVE_SEARCH` - Enable real API calls (optional)
  - Set to `true` to use backend API
  - If not set, uses mock data

### Backend Environment Variables

Create `backend/.env`:

```env
# Required: AI API Key
OPENAI_API_KEY=sk-your-key-here

# Optional: CORS origins (defaults include localhost:8081 and localhost:19006)
CORS_ORIGINS=http://localhost:8081,http://localhost:19006

# Optional: Port (defaults to 8000)
PORT=8000
```

## Troubleshooting

### Backend Not Starting

**Error: `ModuleNotFoundError`**

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Error: `Address already in use`**

- Port 8000 is already in use
- Change port: `uvicorn main:app --reload --port 8001`
- Update frontend: `EXPO_PUBLIC_API_URL=http://localhost:8001/v1`

### Frontend Can't Connect to Backend

**CORS Error:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. Check backend `.env` includes: `CORS_ORIGINS=http://localhost:8081,http://localhost:19006`
2. Restart backend server
3. Check browser console for exact origin URL

**404 Not Found:**

- Make sure `EXPO_PUBLIC_API_URL` includes `/v1` suffix
- Check backend is running: `curl http://localhost:8000/health`

**Network Error / Connection Refused:**

- Verify backend is running on port 8000
- Check firewall isn't blocking localhost connections
- Try: `curl http://localhost:8000/health`

### Frontend Uses Mock Data Instead of Backend

**Symptom:** App works but shows mock data

**Solution:**

- Set `EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true`
- Check browser console for API errors
- Verify `EXPO_PUBLIC_API_URL` is set correctly

### Wrong Port

**Expo web runs on different port:**

- Default: `http://localhost:19006`
- Sometimes: `http://localhost:8081`
- Check terminal output for actual URL

**Update backend CORS:**

```env
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,http://localhost:3000
```

## Testing Checklist

- [ ] Backend starts without errors
- [ ] `curl http://localhost:8000/health` returns `{"status":"ok"}`
- [ ] Frontend starts and opens in browser
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows API calls to `/v1/search`
- [ ] Search returns real data (not mock)
- [ ] Backend logs show incoming requests

## Quick Test Commands

**Test backend health:**

```bash
curl http://localhost:8000/health
```

**Test backend search endpoint:**

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

**Check frontend environment:**
Open browser console and run:

```javascript
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
```

## Using Mock Data (No Backend)

If you want to test frontend without backend:

```bash
cd SearchBotApp
# Don't set EXPO_PUBLIC_ENABLE_LIVE_SEARCH, or set it to false
npm run web
```

The app will use mock data defined in `src/services/searchService.ts`.
