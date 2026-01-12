/**
 * Puppeteer script to capture ALL screens for all 6 personas
 * FIXED: Properly closes the Session Logger overlay before capturing
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5174';

// iPhone dimensions
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2 };

// Persona definitions
const PERSONAS = [
  { key: 'white-excelling', name: 'Jake', belt: 'white', suffix: 'WHITE-EXC' },
  { key: 'white-at-risk', name: 'David', belt: 'white', suffix: 'WHITE-RISK' },
  { key: 'blue-excelling', name: 'Marcus', belt: 'blue', suffix: 'BLUE-EXC' },
  { key: 'blue-at-risk', name: 'Ryan', belt: 'blue', suffix: 'BLUE-RISK' },
  { key: 'purple-average', name: 'Sofia', belt: 'purple', suffix: 'PURPLE' },
  { key: 'brown-average', name: 'Elena', belt: 'brown', suffix: 'BROWN' },
];

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function closeSessionLogger(page) {
  // Wait for the logger to be visible
  await delay(500);

  // Look for the X close button in the top right of the logger overlay
  const closed = await page.evaluate(() => {
    // Find all SVG elements that could be close buttons
    const svgs = document.querySelectorAll('svg');
    for (const svg of svgs) {
      const rect = svg.getBoundingClientRect();
      // Close button should be in top-right area (x > 300, y < 100)
      if (rect.x > 300 && rect.y < 100 && rect.width < 40) {
        // Find the parent button
        let el = svg;
        while (el && el.tagName !== 'BUTTON') {
          el = el.parentElement;
        }
        if (el) {
          el.click();
          return true;
        }
      }
    }

    // Alternative: look for button with X icon near top-right
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const rect = btn.getBoundingClientRect();
      if (rect.right > 340 && rect.top < 80 && rect.width < 60) {
        btn.click();
        return true;
      }
    }

    return false;
  });

  if (closed) {
    console.log('    Closed Session Logger overlay');
    await delay(500);
  } else {
    console.log('    WARNING: Could not find close button');
  }

  return closed;
}

async function clickTab(page, tabName) {
  const clicked = await page.evaluate((name) => {
    // Find tab bar buttons at the bottom
    const buttons = Array.from(document.querySelectorAll('button'));
    for (const btn of buttons) {
      const text = btn.textContent || '';
      const rect = btn.getBoundingClientRect();
      // Tab bar is at the bottom (y > 550)
      if (rect.top > 550 && text.toUpperCase().includes(name.toUpperCase())) {
        btn.click();
        return true;
      }
    }
    return false;
  }, tabName);

  await delay(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(200);

  return clicked;
}

async function captureScreen(page, folder, filename) {
  const dir = path.join(SCREENSHOTS_DIR, folder);
  fs.mkdirSync(dir, { recursive: true });

  await page.screenshot({
    path: path.join(dir, filename),
    fullPage: false
  });
  console.log(`    Captured: ${folder}/${filename}`);
}

async function captureForPersona(browser, persona) {
  console.log(`\n=== ${persona.name} (${persona.suffix}) ===`);

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Load the app first
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await delay(500);

  // Set persona in localStorage
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

  // Reload to apply persona
  await page.reload({ waitUntil: 'networkidle0' });
  await delay(1000);

  // Close the Session Logger overlay
  await closeSessionLogger(page);
  await delay(300);

  // === STATS / DASHBOARD ===
  console.log('  Capturing STATS...');
  await clickTab(page, 'STATS');
  await delay(300);

  await captureScreen(page, 'dashboard', `STATS-01-top-${persona.suffix}.png`);

  await page.evaluate(() => window.scrollBy(0, 500));
  await delay(200);
  await captureScreen(page, 'dashboard', `STATS-02-mid-${persona.suffix}.png`);

  await page.evaluate(() => window.scrollBy(0, 500));
  await delay(200);
  await captureScreen(page, 'dashboard', `STATS-03-bottom-${persona.suffix}.png`);

  // === JOURNAL ===
  console.log('  Capturing JOURNAL...');
  await clickTab(page, 'JOURNAL');
  await delay(300);

  await captureScreen(page, 'journal', `JRNL-01-feed-${persona.suffix}.png`);

  await page.evaluate(() => window.scrollBy(0, 400));
  await delay(200);
  await captureScreen(page, 'journal', `JRNL-02-feed-scroll-${persona.suffix}.png`);

  // === TECHNIQUES / LIBRARY ===
  console.log('  Capturing TECHNIQUES...');
  await clickTab(page, 'TECHNIQUES');
  await delay(300);

  await captureScreen(page, 'techniques', `LIB-01-foryou-${persona.suffix}.png`);

  await page.evaluate(() => window.scrollBy(0, 400));
  await delay(200);
  await captureScreen(page, 'techniques', `LIB-02-foryou-scroll-${persona.suffix}.png`);

  // Click Browse tab within Techniques
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button');
    for (const tab of tabs) {
      if (tab.textContent && tab.textContent.includes('Browse')) {
        tab.click();
        return;
      }
    }
  });
  await delay(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(200);
  await captureScreen(page, 'techniques', `LIB-03-browse-${persona.suffix}.png`);

  // === INSIGHTS ===
  console.log('  Capturing INSIGHTS...');
  await clickTab(page, 'INSIGHTS');
  await delay(300);

  await captureScreen(page, 'insights', `INS-01-main-${persona.suffix}.png`);

  await page.evaluate(() => window.scrollBy(0, 400));
  await delay(200);
  await captureScreen(page, 'insights', `INS-02-scroll-${persona.suffix}.png`);

  // === PROFILE ===
  console.log('  Capturing PROFILE...');
  // Click profile avatar in header
  await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) {
      const buttons = header.querySelectorAll('button');
      for (const btn of buttons) {
        const rect = btn.getBoundingClientRect();
        if (rect.right > 340) { // Right side of header
          btn.click();
          return;
        }
      }
    }
  });
  await delay(500);

  await captureScreen(page, 'profile', `PROF-01-main-${persona.suffix}.png`);

  await page.evaluate(() => window.scrollBy(0, 300));
  await delay(200);
  await captureScreen(page, 'profile', `PROF-02-scroll-${persona.suffix}.png`);

  await page.close();
}

async function captureLoggerFlow(browser) {
  console.log('\n=== SESSION LOGGER FLOW ===');

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Load the app - logger opens by default
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await delay(1000);

  // Logger should be open by default - capture it
  await captureScreen(page, 'logger', 'LOG-01-entry.png');

  // Scroll down within the logger overlay to see more
  await page.evaluate(() => {
    // Find the fixed overlay container and scroll it
    const overlays = document.querySelectorAll('div');
    for (const div of overlays) {
      const style = window.getComputedStyle(div);
      if (style.position === 'fixed' && style.inset === '0px') {
        div.scrollTop = 300;
        return;
      }
    }
    // Fallback: scroll the main window
    window.scrollBy(0, 300);
  });
  await delay(200);
  await captureScreen(page, 'logger', 'LOG-02-entry-scroll.png');

  await page.close();
}

async function main() {
  // Clear old screenshots
  console.log('Clearing old screenshots...');
  const folders = ['dashboard', 'journal', 'techniques', 'insights', 'profile', 'logger'];
  for (const folder of folders) {
    const dir = path.join(SCREENSHOTS_DIR, folder);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Capture logger flow first (while it auto-opens)
  await captureLoggerFlow(browser);

  // Capture all screens for each persona
  for (const persona of PERSONAS) {
    await captureForPersona(browser, persona);
  }

  console.log('\n=== ALL SCREENSHOTS CAPTURED ===');
  console.log(`Location: ${SCREENSHOTS_DIR}`);

  // List captured files
  console.log('\nCaptured files by folder:');
  for (const folder of folders) {
    const dir = path.join(SCREENSHOTS_DIR, folder);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log(`\n  ${folder}/ (${files.length} files)`);
      files.slice(0, 5).forEach(f => console.log(`    - ${f}`));
      if (files.length > 5) console.log(`    ... and ${files.length - 5} more`);
    }
  }

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
