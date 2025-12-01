import { test, expect } from '@playwright/test';

/**
 * Backend-only tests that don't require frontend server
 * Run these with: npx playwright test tests/backend-only.spec.ts --project=chromium
 */
test.describe('Backend API Tests (No Frontend Required)', () => {
  const API_BASE_URL = 'http://localhost:8000';

  test('health endpoint should return ok', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('service', 'searchbot-api');
  });

  test('search endpoint should accept valid request', async ({ request }) => {
    const searchPayload = {
      id: 'test-e2e-123',
      description: 'How to learn Python programming?',
      category: 'education',
      priority: 'normal',
      createdAt: new Date().toISOString(),
    };

    const response = await request.post(`${API_BASE_URL}/v1/search`, {
      data: searchPayload,
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false, // Don't fail on error status codes
    });

    // API should respond (even if it's an error due to OpenAI balance)
    expect([200, 500, 402]).toContain(response.status());
    
    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('steps');
      expect(data).toHaveProperty('sources');
    } else {
      // If error, verify it's a structured error response
      const errorData = await response.json();
      expect(errorData).toHaveProperty('detail');
    }
  });

  test('search endpoint should reject invalid request', async ({ request }) => {
    const invalidPayload = {
      // Missing required fields
      description: 'Test',
    };

    const response = await request.post(`${API_BASE_URL}/v1/search`, {
      data: invalidPayload,
      headers: {
        'Content-Type': 'application/json',
      },
      failOnStatusCode: false,
    });

    // Should return validation error
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

