/**
 * Puppeteer script to capture screens for all 6 personas
 * Switches persona via localStorage and captures each screen variant
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5174';

// iPhone dimensions
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2 };

// Persona definitions matching personas.ts
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

async function setPersona(page, personaKey) {
  await page.evaluate((key) => {
    // Set the persona in localStorage (this is how Settings does it)
    localStorage.setItem('tomo-demo-persona', key);
    // Also set belt for older code paths
    const beltMap = {
      'white-excelling': 'white',
      'white-at-risk': 'white',
      'blue-excelling': 'blue',
      'blue-at-risk': 'blue',
      'purple-average': 'purple',
      'brown-average': 'brown',
    };
    localStorage.setItem('tomo-user-belt', beltMap[key]);
  }, personaKey);
}

async function clickTab(page, tabName) {
  await page.evaluate((name) => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const tab = tabs.find(b => b.textContent && b.textContent.toUpperCase().includes(name.toUpperCase()));
    if (tab) {
      tab.click();
      return true;
    }
    return false;
  }, tabName);
  await delay(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(200);
}

async function closeSessionLogger(page) {
  await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    for (const btn of allButtons) {
      const rect = btn.getBoundingClientRect();
      if (rect.top < 80 && rect.right > 300 && rect.width < 60) {
        btn.click();
        return;
      }
    }
  });
  await delay(500);
}

async function captureForPersona(page, persona, screens) {
  console.log(`\n=== ${persona.name} (${persona.suffix}) ===`);

  // Set persona
  await setPersona(page, persona.key);

  // Reload to apply persona
  await page.reload({ waitUntil: 'networkidle0' });
  await delay(800);

  // Close session logger overlay
  await closeSessionLogger(page);
  await delay(300);

  for (const screen of screens) {
    const dir = path.join(SCREENSHOTS_DIR, screen.folder);
    fs.mkdirSync(dir, { recursive: true });

    // Navigate to the right tab
    if (screen.tab) {
      await clickTab(page, screen.tab);
    }

    // Apply scroll if specified
    if (screen.scroll) {
      await page.evaluate((scrollY) => window.scrollBy(0, scrollY), screen.scroll);
      await delay(200);
    }

    // Take screenshot
    const filename = `${screen.prefix}-${persona.suffix}.png`;
    await page.screenshot({
      path: path.join(dir, filename),
      fullPage: false
    });
    console.log(`  Captured: ${screen.folder}/${filename}`);

    // Reset scroll
    if (screen.scroll) {
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  }
}

async function captureAllPersonas() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Initial load
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await delay(1000);

  // Screens to capture per persona
  const screens = [
    // Dashboard / Stats
    { folder: 'dashboard', prefix: 'STATS-01-top', tab: 'STATS', scroll: 0 },
    { folder: 'dashboard', prefix: 'STATS-02-mid', tab: 'STATS', scroll: 600 },
    { folder: 'dashboard', prefix: 'STATS-03-bottom', tab: 'STATS', scroll: 1200 },

    // Journal
    { folder: 'journal', prefix: 'JRNL-01-feed', tab: 'JOURNAL', scroll: 0 },

    // Insights
    { folder: 'insights', prefix: 'INS-01-main', tab: 'INSIGHTS', scroll: 0 },
  ];

  // Capture for each persona
  for (const persona of PERSONAS) {
    await captureForPersona(page, persona, screens);
  }

  console.log('\n=== All Persona Screenshots Captured ===');
  console.log(`Location: ${SCREENSHOTS_DIR}`);

  await browser.close();
}

captureAllPersonas().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
