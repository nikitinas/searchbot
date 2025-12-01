import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:19006',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  /* Note: Set SKIP_SERVERS=true to skip server startup */
  webServer: process.env.SKIP_SERVERS ? undefined : [
    {
      command: 'bash',
      args: ['-c', 'cd ../backend && source venv/bin/activate && uvicorn main:app --port 8000'],
      port: 8000,
      reuseExistingServer: true, // Reuse if server is already running
      timeout: 120000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        ...process.env,
        CORS_ORIGINS: 'http://localhost:8081,http://localhost:19006',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'test-key',
      },
    },
    {
      command: 'node',
      args: ['./scripts/start-frontend.js'],
      cwd: __dirname,
      url: 'http://localhost:19006', // URL to check for readiness
      port: 19006,
      reuseExistingServer: true, // Reuse if server is already running
      timeout: 300000, // Building can take time (5 minutes)
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        ...process.env,
        PORT: '19006',
        EXPO_PUBLIC_API_URL: 'http://localhost:8000/v1',
        EXPO_PUBLIC_ENABLE_LIVE_SEARCH: 'true',
      },
    },
  ],
});

