import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0' });

  const info = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg')).map((s) => ({
      label: s.getAttribute('aria-label'),
      rect: s.getBoundingClientRect(),
      parent: s.parentElement ? s.parentElement.className : '',
    }));
    return {
      windowHeight: window.innerHeight,
      scrollY: window.scrollY,
      svgs,
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch(console.error);
