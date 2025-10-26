const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/', { waitUntil: 'load', timeout: 30000 });
    const localStorage = await page.evaluate(() => {
      const obj = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        obj[k] = localStorage.getItem(k);
      }
      return obj;
    });
    const sessionStorage = await page.evaluate(() => {
      const obj = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        obj[k] = sessionStorage.getItem(k);
      }
      return obj;
    });
    const cookies = await context.cookies();
    console.log('LOCAL_STORAGE:', JSON.stringify(localStorage, null, 2));
    console.log('SESSION_STORAGE:', JSON.stringify(sessionStorage, null, 2));
    console.log('COOKIES:', JSON.stringify(cookies, null, 2));
  } catch (e) {
    console.error('Error inspecting storage:', e);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
