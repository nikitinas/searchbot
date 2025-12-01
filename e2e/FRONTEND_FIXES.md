# Frontend Server Fixes for Playwright E2E Tests

## What Was Fixed

1. **Created a reliable frontend startup script** (`scripts/start-frontend.js`)
   - Builds the web app using `expo export`
   - Serves static files using Python's http.server or npx serve
   - Caches builds (reuses if less than 5 minutes old)
   - Properly handles environment variables

2. **Updated Playwright configuration**
   - Added frontend server to webServer config
   - Configured URL check for server readiness
   - Set appropriate timeouts for build process

## How It Works

The frontend startup process:
1. Checks if `dist` folder exists and is recent (< 5 minutes)
2. If not, builds the web app: `npm run build:web`
3. Serves the `dist` folder on port 19006
4. Uses Python's http.server (fallback to npx serve)

## Testing the Script Manually

The script works when tested manually:
```bash
cd e2e
node scripts/start-frontend.js
# Server starts on http://localhost:19006 ✅
```

## Current Status

✅ **Frontend startup script**: Working
✅ **Backend API tests**: Passing (3/3)
⚠️ **Full E2E with auto-startup**: Needs testing

## Running Tests

### Option 1: Backend-only (Recommended - Fast & Reliable)
```bash
cd e2e
SKIP_SERVERS=true npx playwright test tests/backend-only.spec.ts
```

### Option 2: Full E2E with Manual Servers
```bash
# Terminal 1: Start backend
cd backend && source venv/bin/activate && uvicorn main:app --port 8000

# Terminal 2: Start frontend
cd e2e && node scripts/start-frontend.js

# Terminal 3: Run tests
cd e2e && SKIP_SERVERS=true npx playwright test
```

### Option 3: Full E2E with Auto-startup (Experimental)
```bash
cd e2e
npx playwright test
```
Note: This may timeout if build takes too long. The script works, but Playwright's detection might need tuning.

## Next Steps

If auto-startup continues to timeout:
1. Pre-build the web app before running tests
2. Increase timeout in playwright.config.ts
3. Use a faster build method (e.g., serve pre-built dist)

## Files Created/Modified

- `e2e/scripts/start-frontend.js` - Frontend startup script
- `e2e/scripts/start-frontend.sh` - Bash alternative (backup)
- `e2e/playwright.config.ts` - Updated with frontend server config
- `e2e/tests/backend-only.spec.ts` - Backend-only tests (working)

