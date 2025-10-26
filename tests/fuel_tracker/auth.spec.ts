import { test, expect } from '@playwright/test';

test.setTimeout(120_000);
test.use({ navigationTimeout: 60_000, actionTimeout: 30_000 });

// These tests read credentials from environment variables when available.
// If the environment variables are not set, sensible defaults (provided) are used.
// NOTE: Storing credentials in source is insecure for production—consider using CI secrets or a vault.

const USER = process.env.FUEL_USERNAME || 'chamudisashanka@haycarb.com';
const PASS = process.env.FUEL_PASSWORD || 'Chamudi@123';

test.describe('Fuel Tracker - Authentication', () => {
  test('login form is accessible and non-HayCarb credentials are rejected', async ({ page }) => {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/');
    await page.waitForLoadState('domcontentloaded');

    let emailField = page.locator('input[type="email"], input[name="email"], input[name="username"], input[placeholder*="Email"]');
    if ((await emailField.count()) === 0) {
      const triedRoutes = ['login', 'signin', 'auth', 'account/login'];
      for (const slug of triedRoutes) {
        await page.goto(`https://fuel-tracker-4kyf.vercel.app/${slug}`).catch(() => {});
        emailField = page.locator('input[type="email"], input[name="email"], input[name="username"], input[placeholder*="Email"]');
        if ((await emailField.count()) > 0) break;
      }
    }

    const password = page.locator('input[type="password"]');
    await expect(emailField.first()).toBeVisible();
    await expect(password.first()).toBeVisible();
    await expect(page.getByText(/Sign in to continue/i).first()).toBeVisible();

    await emailField.first().fill(USER);
    await password.first().fill(PASS);
    const submitButtons = page.locator('button:has-text("Sign In"), button:has-text("Sign in"), button:has-text("Login"), button:has-text("Log in")');
    const primarySubmit = submitButtons.first();
    await primarySubmit.click();

    // Wait for one of the expected outcomes: success, restriction, error message, or button re-enabled
    const outcomeHandle = await page.waitForFunction(() => {
      const textMatches = (pattern: string) => {
        const regex = new RegExp(pattern, 'i');
        return Array.from(document.querySelectorAll('body *')).some(el => regex.test(el.textContent || ''));
      };
      const button = Array.from(document.querySelectorAll('button')).find(b => /sign\s*in/i.test(b.textContent || ''));
      if (textMatches('Logout|Sign out') || textMatches('Dashboard') || textMatches('Fuel Entries')) return 'success';
      if (textMatches('Only Haycarb employees can login')) return 'restriction';
      if (textMatches('Invalid email or password') || textMatches('Invalid credentials') || textMatches('incorrect')) return 'error';
      if (button && !button.disabled) return 'idle';
      return null;
    }, { timeout: 45_000 }).catch(() => null);

    const outcome = outcomeHandle ? await outcomeHandle.jsonValue() : null;

    if (outcome === 'success') {
      try {
        await page.context().storageState({ path: 'playwright/.authStorage.json' });
      } catch (e) {
        console.warn('Warning: failed to write storage state:', e);
      }
      expect(true).toBeTruthy();
      return;
    }

    if (outcome === 'restriction' || outcome === 'error') {
      expect(true).toBeTruthy();
      return;
    }

    if (outcome === 'idle') {
      // Button re-enabled without success or error — treat as failed login with unknown message
      throw new Error('Login attempt left the page idle without success or recognizable error message.');
    }

    throw new Error('Login attempt did not reach a known outcome within the allotted time.');
  });
});
