import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', msg => {
	console.log('CONSOLE:', msg.type(), msg.text());
});
page.on('pageerror', error => {
	console.log('PAGEERROR:', error.message);
});
await page.goto('https://fuel-tracker-4kyf.vercel.app/dashboard', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
const finalUrl = await page.url();
const bodyText = await page.evaluate(() => document.body?.innerText || '');
const bodyHtml = await page.evaluate(() => document.body?.innerHTML || '');
console.log('URL:', finalUrl);
console.log('BODY:', bodyText.replace(/\s+/g, ' ').trim().slice(0, 500));
console.log('HTML:', bodyHtml.slice(0, 500));
await browser.close();
