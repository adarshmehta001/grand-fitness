import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  page.on('request', request => {
    if (request.url().includes(':3001')) {
      requests.push(request.url());
      console.log(`REQ: ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', response => {
    if (response.url().includes(':3001')) {
      console.log(`RES: ${response.status()} ${response.url()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`CONSOLE ${msg.type()}: ${msg.text()}`);
    }
  });

  console.log('--- Testing Dev Server ---');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  
  console.log('--- Testing Prod Server ---');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

  await browser.close();
})();
