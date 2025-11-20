import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.setTimeout(60000);

const BASE_URL = 'https://fuel-tracker-4kyf.vercel.app/';

test.describe('Fuel Tracker Tests', () => {
  test('should load homepage in desktop view', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Navigate to the page
    console.log('Navigating to homepage...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // Wait for content to be visible
    await page.waitForSelector('body', { state: 'visible' });
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/desktop.png' });
    
    // Basic content check
    const bodyText = await page.textContent('body');
    expect(bodyText?.length).toBeGreaterThan(0);
    
    // Check viewport
    const bodyWidth = await page.evaluate(() => document.body.clientWidth);
    console.log(`Desktop body width: ${bodyWidth}px`);
  });

  test('should be responsive in mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Navigate to the page
    console.log('Navigating to homepage in mobile view...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/mobile.png' });
    
    // Check viewport
    const bodyWidth = await page.evaluate(() => document.body.clientWidth);
    console.log(`Mobile body width: ${bodyWidth}px`);
    
    // Verify it's using mobile viewport
    expect(bodyWidth).toBeLessThan(500);
  });
});
