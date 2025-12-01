# Quick Start: Local Testing

## 🚀 Fastest Way (Using Scripts)

### macOS/Linux:
```bash
./start-local.sh
```

### Windows:
```bash
start-local.bat
```

This will start both backend and frontend automatically!

## 📝 Manual Method

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend:
```bash
cd SearchBotApp
npm run web:local
```

Then open: **http://localhost:19006**

## ✅ Verify It Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"ok","service":"searchbot-api"}`

2. **Open Frontend:**
   - Browser opens automatically, or go to `http://localhost:19006`
   - Try a search
   - Check browser DevTools → Network tab for API calls

3. **Check Backend Logs:**
   - Backend terminal should show incoming requests
   - Look for: `POST /v1/search`

## 🔧 Troubleshooting

**Getting mock data instead of backend?**

1. **Check browser console** - Look for `📝 Using mock data` message
2. **Verify environment variables:**
   ```javascript
   // In browser console:
   console.log('LIVE_SEARCH:', process.env.EXPO_PUBLIC_ENABLE_LIVE_SEARCH);
   console.log('API_URL:', process.env.EXPO_PUBLIC_API_URL);
   ```
3. **Make sure you're using `npm run web:local`** (not just `npm run web`)
4. **Restart Expo dev server** after setting environment variables

See `DEBUG_MOCK_DATA.md` for detailed troubleshooting guide.

**Backend won't start?**
- Make sure you have `backend/.env` with `OPENAI_API_KEY`
- Activate venv: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)

**Frontend can't connect?**
- Check backend is running: `curl http://localhost:8000/health`
- Make sure you used `npm run web:local` (not just `npm run web`)

**CORS errors?**
- Backend CORS already includes `localhost:8081` and `localhost:19006`
- If using different port, update `backend/.env`: `CORS_ORIGINS=http://localhost:YOUR_PORT`

## 📚 More Details

See `LOCAL_TESTING.md` for complete guide with troubleshooting.

