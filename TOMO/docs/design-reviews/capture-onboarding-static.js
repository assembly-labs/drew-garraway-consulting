/**
 * Puppeteer script to capture onboarding screens from static HTML
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'onboarding');
const HTML_FILE = path.join(__dirname, 'onboarding-capture.html');

// iPhone dimensions
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2 };

const SCREENS = [
  { name: 'welcome', id: 'ONB-01-A-welcome' },
  { name: 'identityEmpty', id: 'ONB-01-B-identity-empty' },
  { name: 'identityComplete', id: 'ONB-01-B-identity-complete' },
  { name: 'mic', id: 'ONB-01-C-mic-permission' },
  { name: 'ready', id: 'ONB-01-D-ready' },
];

async function captureOnboardingStatic() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  console.log('Capturing onboarding screens from static HTML...\n');

  for (const screen of SCREENS) {
    const url = `file://${HTML_FILE}?screen=${screen.name}`;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300));

    const filename = `${screen.id}.png`;
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, filename),
      fullPage: false
    });
    console.log(`  Captured: ${filename}`);
  }

  console.log('\n=== Onboarding Screenshots Captured ===');
  console.log(`Location: ${SCREENSHOTS_DIR}`);

  const files = fs.readdirSync(SCREENSHOTS_DIR);
  console.log('\nCaptured files:');
  files.forEach(f => console.log(`  - ${f}`));

  await browser.close();
}

captureOnboardingStatic().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
