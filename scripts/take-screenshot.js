import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const outputDir = path.resolve('screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Desktop View (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outputDir, 'landing-desktop.png') });
  console.log('Saved landing-desktop.png');

  // 2. Mobile View (390x844 iPhone style)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outputDir, 'landing-mobile.png') });
  console.log('Saved landing-mobile.png');

  // 3. Test Create Account Modal
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const createBtn = buttons.find((b) => b.textContent?.includes('Create new account'));
    if (createBtn) createBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outputDir, 'create-account-modal.png') });
  console.log('Saved create-account-modal.png');

  // 4. Test Login -> Feed Dashboard
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });
  const inputs = await page.$$('input');
  if (inputs.length >= 2) {
    await inputs[0].type('alex.rivera');
    await inputs[1].type('password123');
  }
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(outputDir, 'feed-dashboard.png') });
    console.log('Saved feed-dashboard.png');
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
