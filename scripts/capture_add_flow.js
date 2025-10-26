const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  page.on('request', req => requests.push({ url: req.url(), method: req.method(), postData: req.postData() }));
  try {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/', { waitUntil: 'load', timeout: 30000 });
    // try to find add button
    const addSelectors = [
      'button:has-text("Add")',
      'button:has-text("New Entry")',
      'text=Add Entry',
      'text=Add'
    ];
    let found = false;
    for (const sel of addSelectors) {
      const loc = page.locator(sel);
      if ((await loc.count()) > 0) { await loc.first().click().catch(() => {}); found = true; break; }
    }
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    const html = await page.content();
    console.log('URL after click:', page.url());
    console.log('Found add button and clicked?', found);
    console.log('Captured requests (last 20):', requests.slice(-20));
    // Print some of the page text to see whether a login UI appeared
    const bodyText = await page.locator('body').innerText().catch(() => '');
    console.log('BODY TEXT SNIPPET:', bodyText.slice(0, 1000));
  } catch (e) {
    console.error('Error during capture:', e);
  } finally {
    await browser.close();
  }
})();
