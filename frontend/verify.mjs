import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  
  const viewports = [
    { width: 375, height: 812, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1440, height: 900, name: 'desktop' }
  ];

  const routes = [
    { path: '/', name: 'home' },
    { path: '/refund-policy', name: 'refund' },
    { path: '/return-policy', name: 'return' },
    { path: '/disclaimer', name: 'disclaimer' }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    
    for (const route of routes) {
      console.log(`Checking ${route.name} at ${vp.name}...`);
      await page.goto(`http://localhost:5173${route.path}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `screenshot_${route.name}_${vp.name}.png`, fullPage: true });
    }
    await context.close();
  }

  await browser.close();
  console.log('Done! Screenshots taken.');
})();
