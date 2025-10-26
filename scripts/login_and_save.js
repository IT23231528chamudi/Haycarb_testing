const { chromium } = require('playwright');
const USER = process.env.FUEL_USERNAME || 'chamudisashanka@haycarb.com';
const PASS = process.env.FUEL_PASSWORD || 'Chamudi@123';
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/', { waitUntil: 'networkidle' });
    // If login form not visible, try clicking add or login button to reveal it
  const loginFormSelector = 'input[type="email"], input[placeholder*="Email"], input[placeholder*="Email Address"], input[name="email"], input[name="username"]';
    let loginVisible = (await page.locator(loginFormSelector).count()) > 0;
    if (!loginVisible) {
      const addSel = ['button:has-text("Add")', 'text=Add', 'button:has-text("Login")'];
      for (const s of addSel) {
        const loc = page.locator(s);
        if ((await loc.count()) > 0) { await loc.first().click().catch(() => {}); break; }
      }
      await page.waitForTimeout(500);
      loginVisible = (await page.locator(loginFormSelector).count()) > 0;
    }

    if (!loginVisible) {
      const snippet = await page.locator('body').innerText().catch(() => '');
      console.error('Login form not found; cannot perform scripted login');
      console.error('PAGE BODY SNIPPET (first 800 chars):', snippet.slice(0, 800));
      process.exitCode = 2;
      return;
    }

    // Fill fields
  const userInput = page.locator('input[type="email"], input[placeholder*="Email"], input[placeholder*="Email Address"], input[name="email"], input[name="username"]');
    const passInput = page.locator('input[type="password"]');
    await userInput.first().fill(USER);
    await passInput.first().fill(PASS);

    // Click sign in button
    const signBtn = page.locator('button:has-text("Sign In"), button:has-text("Sign in"), button:has-text("Sign In to continue"), button:has-text("Log in"), button:has-text("Login")');
    if ((await signBtn.count()) === 0) {
      const snippet = await page.locator('body').innerText().catch(() => '');
      console.error('Sign in button not found. PAGE BODY SNIPPET:', snippet.slice(0, 800));
      process.exitCode = 2;
      return;
    }
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
      signBtn.first().click()
    ]);

    // Detect success (Logout or Dashboard)
    const logout = page.locator('text=Logout, text=Sign out, text=Log out');
    const dashboard = page.locator('text=Dashboard, text=My Fuel, text=Fuel Entries');
    let success = false;
    if ((await logout.count()) > 0 && await logout.first().isVisible().catch(() => false)) success = true;
    if (!success && (await dashboard.count()) > 0 && await dashboard.first().isVisible().catch(() => false)) success = true;

    if (!success) {
      console.error('Login did not appear successful; page URL:', page.url());
      const body = await page.locator('body').innerText().catch(() => '');
      console.error('PAGE BODY SNIPPET:', body.slice(0, 800));
      process.exitCode = 2;
      return;
    }

    // Save storage state
    await context.storageState({ path: 'playwright/.authStorage.json' });
    console.log('Saved storage state to playwright/.authStorage.json');
  } catch (e) {
    console.error('Error during login script:', e);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
