#!/usr/bin/env node

/**
 * Icon Generator for PWA
 *
 * This script generates PNG icons from SVG for the PWA.
 *
 * INSTALLATION:
 * npm install --save-dev sharp
 *
 * USAGE:
 * node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, '../public/icon.svg');
const outputDir = join(__dirname, '../public');

const sizes = [
  { size: 192, output: 'icon-192.png' },
  { size: 512, output: 'icon-512.png' },
  { size: 180, output: 'apple-touch-icon.png' },
];

async function generateIcons() {
  try {
    const svgBuffer = readFileSync(svgPath);

    for (const { size, output } of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(join(outputDir, output));

      console.log(`✓ Generated ${output} (${size}x${size})`);
    }

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('\nTo install sharp: npm install --save-dev sharp');
    process.exit(1);
  }
}

generateIcons();
