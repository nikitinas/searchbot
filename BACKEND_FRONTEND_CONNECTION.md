# Backend-Frontend Connection Guide

## Current Status

✅ **Frontend is configured** to connect to backend via `apiClient.ts`
✅ **Backend API** is ready and has CORS middleware
⚠️ **Connection requires configuration** for Vercel deployment

## How It Works

### Frontend (React Native Web App)

The frontend uses:

- **API Client**: `SearchBotApp/src/services/apiClient.ts`
  - Reads `EXPO_PUBLIC_API_URL` environment variable
  - Defaults to: `https://api.searchbot-placeholder.com/v1` (placeholder)
- **Search Service**: `SearchBotApp/src/services/searchService.ts`
  - Uses `EXPO_PUBLIC_ENABLE_LIVE_SEARCH` flag
  - When `true`: Calls real backend API
  - When `false` or unset: Uses mock data (for development)

### Backend (FastAPI)

The backend:

- **CORS Configuration**: Allows requests from specific origins
- **Default**: Only allows `http://localhost:8081` (Expo dev server)
- **Environment Variable**: `CORS_ORIGINS` (comma-separated list)

## Required Configuration for Vercel Deployment

### 1. Backend CORS Configuration

Update your backend's `CORS_ORIGINS` environment variable to include your Vercel domain:

**If using Railway/Render/other hosting:**

```bash
# In your backend hosting platform's environment variables:
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

**Important**: Replace `your-app` with your actual Vercel project name.

**For production**, you might want to use:

```bash
CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

### 2. Frontend Environment Variables (Vercel)

In your Vercel project settings, add:

**Required:**

- `EXPO_PUBLIC_API_URL` = `https://your-backend-url.com/v1`
  - Example: `https://your-backend.up.railway.app/v1`
  - **Note**: Include `/v1` at the end since your API uses `/v1` prefix

**Optional (to enable live backend):**

- `EXPO_PUBLIC_ENABLE_LIVE_SEARCH` = `true`
  - Without this, the app uses mock data instead of calling backend

### 3. Verify Connection

After deployment:

1. **Check Backend Health**:

   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Check Frontend API Calls**:
   - Open browser DevTools → Network tab
   - Try a search in your web app
   - Look for requests to `/v1/search`
   - Check if they succeed (200) or fail (CORS error = 403/404)

## Testing Locally

### Test Backend Connection

```bash
# Start backend
cd backend
uvicorn main:app --reload --port 8000

# In another terminal, test from frontend
cd SearchBotApp
EXPO_PUBLIC_API_URL=http://localhost:8000/v1 EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true npm run web
```

### Test with Mock Data (No Backend)

```bash
cd SearchBotApp
# Don't set EXPO_PUBLIC_ENABLE_LIVE_SEARCH, or set it to false
npm run web
```

## Troubleshooting

### CORS Errors

**Symptom**: Browser console shows:

```
Access to XMLHttpRequest at 'https://backend-url' from origin 'https://vercel-url' has been blocked by CORS policy
```

**Solution**:

1. Add your Vercel URL to backend's `CORS_ORIGINS`
2. Restart backend server
3. Clear browser cache and retry

### API Calls Return 404

**Symptom**: Network requests return 404 Not Found

**Solution**:

- Check `EXPO_PUBLIC_API_URL` includes `/v1` suffix
- Verify backend endpoint is `/v1/search` (not `/search`)

### Mock Data Instead of Real API

**Symptom**: App works but uses mock data

**Solution**:

- Set `EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true` in Vercel environment variables
- Verify `EXPO_PUBLIC_API_URL` is set correctly

### Backend Not Responding

**Symptom**: Network requests timeout or fail

**Solution**:

1. Check backend is running: `curl https://your-backend-url.com/health`
2. Verify backend URL is correct in Vercel env vars
3. Check backend logs for errors

## Quick Checklist

Before deploying to Vercel:

- [ ] Backend is deployed and accessible
- [ ] Backend `CORS_ORIGINS` includes your Vercel domain(s)
- [ ] Vercel environment variable `EXPO_PUBLIC_API_URL` is set
- [ ] Vercel environment variable `EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true` (if you want real API)
- [ ] Test health endpoint: `curl https://your-backend-url.com/health`
- [ ] Test search endpoint manually (see backend TESTING.md)

## Example Configuration

### Backend (Railway/Render) Environment Variables:

```env
CORS_ORIGINS=http://localhost:8081,https://searchbot-app.vercel.app,https://searchbot-app-git-main.vercel.app
OPENAI_API_KEY=sk-...
```

### Frontend (Vercel) Environment Variables:

```env
EXPO_PUBLIC_API_URL=https://searchbot-backend.up.railway.app/v1
EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true
```

## Architecture Flow

```
User Browser (Vercel)
    ↓
React Native Web App
    ↓
apiClient.ts (uses EXPO_PUBLIC_API_URL)
    ↓
searchService.ts (checks EXPO_PUBLIC_ENABLE_LIVE_SEARCH)
    ↓
Backend API (FastAPI) at /v1/search
    ↓
CORS Middleware (checks CORS_ORIGINS)
    ↓
Search Engine + AI Service
    ↓
Returns JSON response
```
