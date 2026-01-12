/**
 * Capture FULL PAGE screenshots by scrolling through entire page length
 * Creates stitched full-height images for each screen
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5174';

// iPhone dimensions
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2 };

// Personas to capture - all 6
const PERSONAS = [
  { key: 'white-excelling', name: 'Jake', suffix: 'WHITE-EXC' },
  { key: 'white-at-risk', name: 'David', suffix: 'WHITE-RISK' },
  { key: 'blue-excelling', name: 'Marcus', suffix: 'BLUE-EXC' },
  { key: 'blue-at-risk', name: 'Ryan', suffix: 'BLUE-RISK' },
  { key: 'purple-average', name: 'Sofia', suffix: 'PURPLE' },
  { key: 'brown-average', name: 'Elena', suffix: 'BROWN' },
];

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function closeSessionLogger(page) {
  console.log('    Attempting to close Session Logger...');

  // Find the close button by aria-label="Close"
  const clicked = await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close"]');
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
    return false;
  });

  if (clicked) {
    console.log('    Found and clicked Close button');
    await delay(1500); // Wait for React state to update and re-render
  } else {
    console.log('    WARNING: Could not find Close button');
  }

  // Verify the overlay is gone
  const overlayGone = await page.evaluate(() => {
    // The logger overlay is a div with position: fixed and z-index: 100
    // If showSessionLogger is false, it won't render at all
    const logSessionText = document.body.innerText.includes('LOG SESSION');
    const tapToRecordText = document.body.innerText.includes('TAP TO RECORD');
    return !logSessionText && !tapToRecordText;
  });

  if (overlayGone) {
    console.log('    Logger overlay successfully closed');
  } else {
    console.log('    WARNING: Logger overlay may still be visible');
  }

  return clicked;
}

async function clickTab(page, tabName) {
  console.log(`    Clicking tab: ${tabName}`);
  const clicked = await page.evaluate((name) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    for (const btn of buttons) {
      const text = btn.textContent || '';
      const rect = btn.getBoundingClientRect();
      // Tab bar is at the bottom
      if (rect.top > 550 && text.toUpperCase().includes(name.toUpperCase())) {
        btn.click();
        return true;
      }
    }
    return false;
  }, tabName);

  await delay(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  return clicked;
}

async function captureFullPage(page, folder, filename) {
  const dir = path.join(SCREENSHOTS_DIR, folder);
  fs.mkdirSync(dir, { recursive: true });

  // Scroll to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(300);

  // Get page dimensions
  const dimensions = await page.evaluate(() => {
    return {
      height: Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.scrollHeight
      ),
      viewportHeight: window.innerHeight
    };
  });

  // Take full page screenshot
  await page.screenshot({
    path: path.join(dir, filename),
    fullPage: true
  });

  console.log(`    Captured: ${folder}/${filename} (${dimensions.height}px tall)`);
}

async function captureAllScreens(browser, persona) {
  console.log(`\n========================================`);
  console.log(`  PERSONA: ${persona.name} (${persona.suffix})`);
  console.log(`========================================`);

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Load and set persona
  console.log('\n  Loading app and setting persona...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await delay(1000);

  await page.evaluate((key) => {
    localStorage.setItem('tomo-demo-persona', key);
    const beltMap = {
      'white-excelling': 'white',
      'white-at-risk': 'white',
      'blue-excelling': 'blue',
      'blue-at-risk': 'blue',
      'purple-average': 'purple',
      'brown-average': 'brown',
    };
    localStorage.setItem('tomo-user-belt', beltMap[key]);
  }, persona.key);

  await page.reload({ waitUntil: 'networkidle0' });
  await delay(1500);

  // === CAPTURE LOGGER FIRST (before closing) ===
  console.log('\n  [1/8] LOGGER');
  await captureFullPage(page, 'full-pages', `LOGGER-${persona.suffix}.png`);

  // Close the logger overlay
  await closeSessionLogger(page);
  await delay(1000);

  // === STATS ===
  console.log('\n  [2/8] STATS');
  await clickTab(page, 'STATS');
  await delay(800);
  await captureFullPage(page, 'full-pages', `STATS-${persona.suffix}.png`);

  // === JOURNAL ===
  console.log('\n  [3/8] JOURNAL');
  await clickTab(page, 'JOURNAL');
  await delay(800);
  await captureFullPage(page, 'full-pages', `JOURNAL-${persona.suffix}.png`);

  // === TECHNIQUES - For You ===
  console.log('\n  [4/8] TECHNIQUES (For You)');
  await clickTab(page, 'TECHNIQUES');
  await delay(800);
  await captureFullPage(page, 'full-pages', `TECHNIQUES-FORYOU-${persona.suffix}.png`);

  // === TECHNIQUES - Browse ===
  console.log('\n  [5/8] TECHNIQUES (Browse)');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const tab of tabs) {
      if (tab.textContent && tab.textContent.includes('Browse')) {
        tab.click();
        return;
      }
    }
  });
  await delay(800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
  await captureFullPage(page, 'full-pages', `TECHNIQUES-BROWSE-${persona.suffix}.png`);

  // === INSIGHTS ===
  console.log('\n  [6/8] INSIGHTS');
  await clickTab(page, 'INSIGHTS');
  await delay(800);
  await captureFullPage(page, 'full-pages', `INSIGHTS-${persona.suffix}.png`);

  // === PROFILE ===
  console.log('\n  [7/8] PROFILE');
  // Click profile avatar in header (top right)
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const rect = btn.getBoundingClientRect();
      // Profile button is top-right, circular avatar
      if (rect.top < 80 && rect.right > 340 && rect.width > 30 && rect.width < 60) {
        btn.click();
        return true;
      }
    }
    return false;
  });
  await delay(800);
  await captureFullPage(page, 'full-pages', `PROFILE-${persona.suffix}.png`);

  // === SETTINGS ===
  console.log('\n  [8/8] SETTINGS');
  await page.evaluate(() => {
    const links = document.querySelectorAll('button, a');
    for (const link of links) {
      if (link.textContent && link.textContent.toLowerCase().includes('setting')) {
        link.click();
        return true;
      }
    }
    return false;
  });
  await delay(800);
  await captureFullPage(page, 'full-pages', `SETTINGS-${persona.suffix}.png`);

  await page.close();
  console.log('\n  Done with persona.');
}

async function main() {
  console.log('========================================');
  console.log('  TOMO Full Page Screenshot Capture');
  console.log('========================================\n');

  // Clear old full-page screenshots
  const fullPagesDir = path.join(SCREENSHOTS_DIR, 'full-pages');
  if (fs.existsSync(fullPagesDir)) {
    console.log('Clearing old screenshots...');
    fs.rmSync(fullPagesDir, { recursive: true });
  }
  fs.mkdirSync(fullPagesDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const persona of PERSONAS) {
    await captureAllScreens(browser, persona);
  }

  console.log('\n========================================');
  console.log('  ALL SCREENSHOTS CAPTURED');
  console.log('========================================');
  console.log(`\nLocation: ${fullPagesDir}\n`);

  const files = fs.readdirSync(fullPagesDir).sort();
  console.log(`Captured ${files.length} full-page screenshots:`);
  files.forEach(f => {
    const stats = fs.statSync(path.join(fullPagesDir, f));
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`  - ${f} (${sizeKB} KB)`);
  });

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
