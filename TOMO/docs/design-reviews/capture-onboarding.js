/**
 * Puppeteer script to capture onboarding flow screenshots
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', 'onboarding');
const BASE_URL = 'http://localhost:5174';

// iPhone dimensions
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2 };

async function captureOnboarding() {
  // Ensure screenshots directory exists
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  console.log('Capturing onboarding flow...\n');

  // First, go to page and clear ALL localStorage
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  // Clear all storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  console.log('  Cleared localStorage, reloading...');

  // Reload to trigger fresh onboarding
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000)); // Wait for app to initialize

  // Check what's on screen
  const pageContent = await page.evaluate(() => document.body.innerText);
  console.log('  Page content preview:', pageContent.substring(0, 100));

  // Look for the ALLY branding or Get Started button
  const hasWelcome = await page.evaluate(() => {
    return document.body.innerText.includes('ALLY') ||
           document.body.innerText.includes('Get Started') ||
           document.body.innerText.includes('Track your journey');
  });

  if (!hasWelcome) {
    console.log('  WARNING: Onboarding not showing. App may have stored profile.');
    console.log('  Taking screenshot of current state...');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'debug-current-state.png'),
      fullPage: false
    });

    // Try one more clear and reload
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      // Also clear any IndexedDB
      indexedDB.deleteDatabase('tomo-db');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
  }

  // 1. Welcome screen
  console.log('\n  ONB-01-A: Welcome');
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'ONB-01-A-welcome.png'),
    fullPage: false
  });

  // Find and click "Get Started" button
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const getStarted = buttons.find(b => b.textContent.includes('Get Started'));
      if (getStarted) getStarted.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 2. Identity screen (empty)
    console.log('  ONB-01-B: Identity (empty)');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'ONB-01-B-identity-empty.png'),
      fullPage: false
    });

    // Find input and type name
    const input = await page.$('input');
    if (input) {
      await input.type('Jake', { delay: 50 });
      await new Promise(r => setTimeout(r, 300));

      // 3. Identity screen (name entered)
      console.log('  ONB-01-B: Identity (name entered)');
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'ONB-01-B-identity-name.png'),
        fullPage: false
      });

      // Click White belt
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const whiteBelt = buttons.find(b => b.textContent && b.textContent.includes('White'));
        if (whiteBelt) whiteBelt.click();
      });
      await new Promise(r => setTimeout(r, 300));

      // 4. Identity screen (complete)
      console.log('  ONB-01-B: Identity (complete)');
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'ONB-01-B-identity-complete.png'),
        fullPage: false
      });

      // Click Continue
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const continueBtn = buttons.find(b => b.textContent && b.textContent.includes('Continue'));
        if (continueBtn) continueBtn.click();
      });
      await new Promise(r => setTimeout(r, 500));

      // 5. Mic permission screen
      console.log('  ONB-01-C: Mic Permission');
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'ONB-01-C-mic-permission.png'),
        fullPage: false
      });

      // Click "Enable Voice Logging"
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const voiceBtn = buttons.find(b => b.textContent && b.textContent.includes('Enable Voice'));
        if (voiceBtn) voiceBtn.click();
      });
      await new Promise(r => setTimeout(r, 500));

      // 6. Ready screen
      console.log('  ONB-01-D: Ready');
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'ONB-01-D-ready.png'),
        fullPage: false
      });

      console.log('\nOnboarding screenshots captured successfully!');
    } else {
      console.log('  ERROR: Could not find input element on identity screen');
    }
  } catch (err) {
    console.log('  Error during capture:', err.message);
  }

  console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);

  // List what was captured
  const files = fs.readdirSync(SCREENSHOTS_DIR);
  console.log('\nCaptured files:');
  files.forEach(f => console.log(`  - ${f}`));

  await browser.close();
}

captureOnboarding().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
