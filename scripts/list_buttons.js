const { firefox } = require('playwright');
(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  try {
    await page.goto('https://fuel-tracker-4kyf.vercel.app/', { waitUntil: 'load' });
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(btn => ({
        text: btn.innerText,
        html: btn.outerHTML.slice(0, 200)
      }));
    });
    console.log(buttons);
  } finally {
    await browser.close();
  }
})();
