# E2E Testing Guide

End-to-end tests for SearchBot that test both backend and frontend together.

## Quick Start

### Option 1: Use the automated script (Recommended)

```bash
./run-e2e-tests.sh
```

This script will:

- Install dependencies if needed
- Install Playwright browsers
- Set up backend/frontend if needed
- Run all tests
- Show test report

### Option 2: Manual setup

```bash
# 1. Install dependencies
cd e2e
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Run tests
npm test
```

## What Gets Tested

### Simple Search Test (`simple-search.spec.ts`)

- ✅ Backend health endpoint
- ✅ Frontend loads correctly
- ✅ Can submit a search request
- ✅ App handles response (success or error gracefully)

### Full Search Flow Test (`search-flow.spec.ts`)

- ✅ Complete user journey through the app
- ✅ Search input interaction
- ✅ Category selection
- ✅ Search submission
- ✅ Results display
- ✅ Error handling

### API Integration Test (`api-integration.spec.ts`)

- ✅ Health endpoint
- ✅ Search endpoint accepts valid requests
- ✅ Invalid requests are rejected
- ✅ CORS configuration

## How It Works

The Playwright configuration automatically:

1. **Starts Backend** on port 8000

   - Uses your backend venv
   - Sets CORS for localhost
   - Uses test API key (or your OPENAI_API_KEY if set)

2. **Starts Frontend** on port 19006

   - Builds Expo web app
   - Connects to localhost backend
   - Enables live search

3. **Runs Tests**

   - Waits for both servers to be ready
   - Executes test scenarios
   - Captures screenshots on failure

4. **Cleans Up**
   - Stops servers after tests complete

## Test Commands

```bash
cd e2e

# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Debug tests step-by-step
npm run test:debug

# Run specific test file
npx playwright test tests/simple-search.spec.ts
s
# Run tests matching a pattern
npx playwright test -g "simple"
```

## Viewing Test Results

After tests complete:

```bash
cd e2e
npx playwright show-report
```

This opens an HTML report with:

- Test results
- Screenshots of failures
- Video recordings (if enabled)
- Network logs

## Troubleshooting

### Tests fail to start servers

**Error:** `Port 8000 already in use`

**Solution:**

```bash
# Kill processes on ports
kill -9 $(lsof -ti:8000) $(lsof -ti:19006)
```

### Tests timeout waiting for servers

**Solution:**

- Check backend venv is set up: `cd backend && source venv/bin/activate`
- Check frontend dependencies: `cd SearchBotApp && npm install`
- Increase timeout in `playwright.config.ts`

### Tests fail with API errors

**Note:** This is expected if:

- OpenAI API key is invalid
- OpenAI account has no balance
- Backend has other errors

The tests verify that errors are handled gracefully (app doesn't crash).

### Frontend doesn't load

**Check:**

- Expo is installed: `npx expo --version`
- Frontend dependencies: `cd SearchBotApp && npm install`
- Port 19006 is available

## CI/CD Integration

These tests can run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: |
    cd e2e && npm install
    npx playwright install chromium

- name: Run E2E tests
  run: |
    cd e2e && npm test
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    CI: true
```

## Environment Variables

- `OPENAI_API_KEY` - Optional, for testing with real API (defaults to 'test-key')
- `CI` - Automatically detected, enables headless mode and retries

## Test Structure

```
e2e/
├── tests/
│   ├── simple-search.spec.ts    # Basic smoke tests
│   ├── search-flow.spec.ts      # Full user flow
│   └── api-integration.spec.ts  # API tests
├── helpers/                      # Test utilities
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies
└── README.md                     # Detailed docs
```

## Writing New Tests

Example test:

```typescript
import { test, expect } from "@playwright/test";

test("my new test", async ({ page }) => {
  await page.goto("http://localhost:19006");
  // Your test code here
});
```

See Playwright docs: https://playwright.dev/docs/intro
