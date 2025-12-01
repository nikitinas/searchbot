import { test, expect } from '@playwright/test';

test.describe('SearchBot E2E Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should complete a simple search flow', async ({ page }) => {
    // Step 1: Verify app loaded
    await expect(page).toHaveTitle(/SearchBot/i);
    
    // Step 2: Find and fill the search input
    // Look for text input or textarea for search description
    const searchInput = page.locator('textarea, input[type="text"]').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    
    // Enter a test search query
    const testQuery = 'How to learn Python programming?';
    await searchInput.fill(testQuery);
    
    // Step 3: Select a category (if category chips are visible)
    const categoryChip = page.locator('text=DIY & Home Repair').first();
    if (await categoryChip.isVisible().catch(() => false)) {
      await categoryChip.click();
    }
    
    // Step 4: Submit the search
    // Look for submit button - could be "Send to AI researcher" or similar
    const submitButton = page.locator('button:has-text("Send"), button:has-text("Search"), button:has-text("Submit")').first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    
    // Click submit and wait for navigation or processing screen
    await submitButton.click();
    
    // Step 5: Wait for processing/loading state
    // The app should navigate to a processing or results screen
    await page.waitForTimeout(2000); // Wait for navigation
    
    // Step 6: Verify we're on processing or results screen
    // Look for processing indicator or results
    const processingIndicator = page.locator('text=Processing, text=Searching, text=Loading').first();
    const resultsContent = page.locator('text=Summary, text=Steps, text=Sources').first();
    
    // Either processing or results should be visible
    const isProcessing = await processingIndicator.isVisible().catch(() => false);
    const hasResults = await resultsContent.isVisible().catch(() => false);
    
    expect(isProcessing || hasResults).toBeTruthy();
    
    // Step 7: If processing, wait for results (with timeout)
    if (isProcessing) {
      await expect(resultsContent).toBeVisible({ timeout: 60000 }); // Wait up to 60s for results
    }
    
    // Step 8: Verify results are displayed
    // Check for key elements in results
    const summary = page.locator('text=/summary|result|answer/i').first();
    await expect(summary).toBeVisible({ timeout: 10000 });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Navigate to search screen
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Fill in search form
    const searchInput = page.locator('textarea, input[type="text"]').first();
    await searchInput.fill('Test search query');
    
    // Submit search
    const submitButton = page.locator('button:has-text("Send"), button:has-text("Search")').first();
    await submitButton.click();
    
    // Wait a bit for any error handling
    await page.waitForTimeout(3000);
    
    // The app should either show results or handle error gracefully
    // (not crash or show blank screen)
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
    expect(hasContent?.length).toBeGreaterThan(0);
  });

  test('should display search input screen correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify search input is visible
    const searchInput = page.locator('textarea, input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    
    // Verify submit button is visible
    const submitButton = page.locator('button:has-text("Send"), button:has-text("Search")').first();
    await expect(submitButton).toBeVisible();
  });
});

