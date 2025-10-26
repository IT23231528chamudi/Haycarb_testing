import { test, expect } from '@playwright/test';

test.setTimeout(120_000);
test.use({ navigationTimeout: 60_000, actionTimeout: 30_000 });

test.describe('Fuel Tracker - Public pages', () => {
  test('homepage should load and show main heading and navigation', async ({ page }) => {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/');

    // Common checks: try to find a prominent heading or app container.
    // We accept a few possibilities because demo apps sometimes use generic titles.
    const title = await page.title();
    if (!/Fuel|Tracker|Fuel Tracker/i.test(title)) {
      // Fall back to checking for visible main landmarks or text containing 'fuel' or 'tracker'
      const mainSelectors = ['main', '[role="main"]', 'text=/fuel/i', 'text=/tracker/i'];
      let mainFound: any = null;
      for (const sel of mainSelectors) {
        const l = page.locator(sel);
        if (await l.count() > 0) { mainFound = l; break; }
      }
      if (!mainFound) {
        // give a helpful failure message if neither title nor main content found
        throw new Error('Homepage did not contain an expected title or main content');
      }
      await expect(mainFound.first()).toBeVisible();
    }

    // Basic navigation links expected on most apps; optional
    const nav = page.locator('nav');
    if (await nav.count() > 0) await expect(nav.first()).toBeVisible();
  });

  test('responsive layout: mobile and desktop sizes', async ({ browser }) => {
    const selectors = ['h1', 'h2', 'main', '[role="main"]', 'text=/fuel/i', 'text=/tracker/i', 'nav'];

    const verifyViewport = async (viewport: { width: number; height: number }) => {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto('https://fuel-tracker-4kyf.vercel.app/');
      await page.waitForLoadState('networkidle');

      let visible = false;
      for (const sel of selectors) {
        const loc = page.locator(sel);
        if ((await loc.count()) > 0) {
          if (await loc.first().isVisible().catch(() => false)) { visible = true; break; }
        }
      }
      await context.close();
      return visible;
    };

    const desktopVisible = await verifyViewport({ width: 1280, height: 800 });
    expect(desktopVisible, 'Expected a visible heading or main content on desktop').toBeTruthy();

    const mobileVisible = await verifyViewport({ width: 375, height: 812 });
    expect(mobileVisible, 'Expected a visible heading or main content on mobile').toBeTruthy();
  });
});
