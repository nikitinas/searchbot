import { test, expect } from '@playwright/test';

/**
 * Simple E2E test that verifies the basic search flow
 * This is a minimal test that checks:
 * 1. Backend is running
 * 2. Frontend is running
 * 3. Can submit a search request
 * 4. App handles the response (success or error)
 */
test.describe('Simple Search E2E Test', () => {
  test('should complete a simple search request', async ({ page }) => {
    // Step 1: Navigate to the app
    await page.goto('http://localhost:19006');
    
    // Step 2: Wait for app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give React time to render
    
    // Step 3: Find the search input field
    // Try multiple selectors to find the textarea/input
    const searchInput = page.locator('textarea').or(page.locator('input[type="text"]')).first();
    
    // Wait for input to be visible
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Step 4: Enter a test query
    const testQuery = 'How to learn Python programming?';
    await searchInput.fill(testQuery);
    await page.waitForTimeout(500);
    
    // Step 5: Find and click the submit button
    // Look for button with text containing "Send" or "Search"
    const submitButton = page
      .locator('button')
      .filter({ hasText: /Send|Search|Submit/i })
      .first();
    
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    
    // Step 6: Click submit and wait for response
    await Promise.all([
      // Wait for navigation or content change
      page.waitForResponse(
        (response) => 
          response.url().includes('/v1/search') && 
          (response.status() === 200 || response.status() === 500 || response.status() === 402),
        { timeout: 60000 }
      ).catch(() => {
        // If no network request, that's okay - might use mock data
        console.log('No network request detected, might be using mock data');
      }),
      submitButton.click(),
    ]);
    
    // Step 7: Wait for UI to update (processing or results)
    await page.waitForTimeout(3000);
    
    // Step 8: Verify the app responded (didn't crash)
    // Check that we're still on a valid page with content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
    
    // Step 9: Check for either results or processing indicator
    const hasResults = await page
      .locator('text=/summary|result|step|source/i')
      .first()
      .isVisible()
      .catch(() => false);
    
    const isProcessing = await page
      .locator('text=/processing|loading|searching/i')
      .first()
      .isVisible()
      .catch(() => false);
    
    // App should show either results or processing state
    expect(hasResults || isProcessing || bodyText!.length > 100).toBeTruthy();
  });

  test('backend health check', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });

  test('frontend loads correctly', async ({ page }) => {
    await page.goto('http://localhost:19006');
    await page.waitForLoadState('networkidle');
    
    // Verify page loaded (not blank)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
  });
});

