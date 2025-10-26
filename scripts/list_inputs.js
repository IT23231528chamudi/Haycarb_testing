const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/', { waitUntil: 'load', timeout: 30000 });
    // Collect inputs and print their types and attributes
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map(i => {
        return {
          outer: i.outerHTML.slice(0, 500),
          type: i.type,
          name: i.getAttribute('name'),
          placeholder: i.getAttribute('placeholder'),
          id: i.id,
          ariaLabel: i.getAttribute('aria-label')
        };
      });
    });
    console.log('Found inputs:', JSON.stringify(inputs, null, 2));
  } catch (e) {
    console.error('Error listing inputs:', e);
  } finally {
    await browser.close();
  }
})();
