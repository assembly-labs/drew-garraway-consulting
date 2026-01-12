/**
 * Puppeteer script to capture all available screens from the app
 * Tab names: INSIGHTS, JOURNAL, TECHNIQUES, STATS
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5174';

// iPhone dimensions
const VIEWPORT = { width: 375, height: 667, deviceScaleFactor: 2 };

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
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
  // Scroll to top after tab change
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(200);
}

async function captureAllScreens() {
  // Ensure screenshots directories exist
  const dirs = ['dashboard', 'journal', 'techniques', 'insights', 'profile', 'logger'];
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(SCREENSHOTS_DIR, dir), { recursive: true });
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  console.log('Capturing app screens...\n');

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await delay(1000);

  // 1. SESSION LOGGER (shown by default)
  console.log('1. Session Logger');
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'logger', 'LOG-01-entry.png'),
    fullPage: false
  });

  // Scroll down to see more of logger
  await page.evaluate(() => window.scrollBy(0, 400));
  await delay(200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'logger', 'LOG-02-entry-scroll.png'),
    fullPage: false
  });

  // Close session logger by clicking the X button in top right
  console.log('  Closing logger...');
  await page.evaluate(() => {
    // Find button with X icon (close button is typically top-right)
    const allButtons = Array.from(document.querySelectorAll('button'));
    // Look for a button that's near the top of the page
    for (const btn of allButtons) {
      const rect = btn.getBoundingClientRect();
      // Top right area and small button
      if (rect.top < 80 && rect.right > 300 && rect.width < 60) {
        btn.click();
        return;
      }
    }
  });
  await delay(500);

  // 2. STATS TAB (Dashboard)
  console.log('2. Stats (Dashboard)');
  await clickTab(page, 'STATS');

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'dashboard', 'STATS-01-top.png'),
    fullPage: false
  });

  // Scroll and capture more
  await page.evaluate(() => window.scrollBy(0, 600));
  await delay(200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'dashboard', 'STATS-02-mid.png'),
    fullPage: false
  });

  await page.evaluate(() => window.scrollBy(0, 600));
  await delay(200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'dashboard', 'STATS-03-more.png'),
    fullPage: false
  });

  await page.evaluate(() => window.scrollBy(0, 600));
  await delay(200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'dashboard', 'STATS-04-bottom.png'),
    fullPage: false
  });

  // 3. JOURNAL TAB
  console.log('3. Journal');
  await clickTab(page, 'JOURNAL');

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'journal', 'JRNL-01-feed.png'),
    fullPage: false
  });

  // Scroll to see more entries
  await page.evaluate(() => window.scrollBy(0, 500));
  await delay(200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'journal', 'JRNL-02-feed-scroll.png'),
    fullPage: false
  });

  // 4. TECHNIQUES TAB (Library)
  console.log('4. Techniques (Library)');
  await clickTab(page, 'TECHNIQUES');

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'techniques', 'LIB-01-foryou.png'),
    fullPage: false
  });

  // Scroll to see more videos
  await page.evaluate(() => window.scrollBy(0, 500));
  await delay(200);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'techniques', 'LIB-02-foryou-scroll.png'),
    fullPage: false
  });

  // Try to click Browse tab within the page
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(200);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const browseBtn = btns.find(b => b.textContent && b.textContent.toLowerCase() === 'browse');
    if (browseBtn) browseBtn.click();
  });
  await delay(500);

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'techniques', 'LIB-03-browse.png'),
    fullPage: false
  });

  // 5. INSIGHTS TAB
  console.log('5. Insights');
  await clickTab(page, 'INSIGHTS');

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'insights', 'INS-01-main.png'),
    fullPage: false
  });

  // 6. PROFILE
  console.log('6. Profile');
  // Click avatar button in header (circle with initial, top right)
  await page.evaluate(() => {
    // Find circular button with single letter in top area
    const btns = Array.from(document.querySelectorAll('button'));
    for (const btn of btns) {
      const rect = btn.getBoundingClientRect();
      // Look for round button in header area
      if (rect.top < 80 && rect.right > 300 && rect.width >= 40 && rect.width <= 60) {
        const text = btn.textContent?.trim();
        if (text && text.length === 1) {
          btn.click();
          return;
        }
      }
    }
  });
  await delay(500);

  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, 'profile', 'PROF-01-main.png'),
    fullPage: false
  });

  console.log('\n=== Screenshots captured ===');
  console.log(`Location: ${SCREENSHOTS_DIR}`);

  // List all captured files
  console.log('\nCaptured files:');
  dirs.forEach(dir => {
    const dirPath = path.join(SCREENSHOTS_DIR, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      files.forEach(f => console.log(`  ${dir}/${f}`));
    }
  });

  await browser.close();
}

captureAllScreens().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
