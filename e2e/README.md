# SearchBot E2E Tests

End-to-end tests for SearchBot application using Playwright.

## Setup

1. **Install dependencies:**
   ```bash
   cd e2e
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Set up backend environment:**
   ```bash
   cd ../backend
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Set up frontend:**
   ```bash
   cd ../SearchBotApp
   npm install
   ```

## Running Tests

### Run all tests:
```bash
cd e2e
npm test
```

### Run tests in headed mode (see browser):
```bash
npm run test:headed
```

### Run tests with UI mode (interactive):
```bash
npm run test:ui
```

### Debug tests:
```bash
npm run test:debug
```

## What Gets Tested

### UI Tests (`search-flow.spec.ts`):
- App loads correctly
- Search input is accessible
- Search submission works
- Results are displayed
- Error handling works gracefully

### API Tests (`api-integration.spec.ts`):
- Health endpoint responds
- Search endpoint accepts valid requests
- Invalid requests are rejected
- CORS is configured correctly

## How It Works

The Playwright configuration (`playwright.config.ts`) automatically:
1. Starts the backend server on port 8000
2. Starts the frontend Expo web server on port 19006
3. Waits for both servers to be ready
4. Runs the tests
5. Cleans up servers after tests complete

## Environment Variables

The tests use these environment variables:
- `OPENAI_API_KEY` - Optional, for testing with real API (defaults to 'test-key')
- `CI` - Set automatically in CI environments

## Troubleshooting

### Tests fail to start servers:
- Make sure ports 8000 and 19006 are not in use
- Check that backend venv is set up correctly
- Verify frontend dependencies are installed

### Tests timeout:
- Increase timeout in `playwright.config.ts`
- Check that servers are starting correctly
- Verify network connectivity

### Tests fail with API errors:
- This is expected if OpenAI API key is invalid or has no balance
- Tests verify that errors are handled gracefully
- To test with real API, set `OPENAI_API_KEY` environment variable

## CI/CD Integration

These tests can be run in CI/CD pipelines. The `CI` environment variable is automatically detected, and tests will:
- Run in headless mode
- Retry failed tests
- Generate HTML reports

