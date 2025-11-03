# PWA Icon Setup Instructions

## Quick Option: Use Online Tool

1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload the SVG icon from: `public/icon.svg`
3. Generate all required sizes
4. Download and extract to `public/` folder

## Required Icon Files

Place these in `/accountable/habit-tracker/public/`:

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `apple-touch-icon.png` (180x180px)

## Manual Creation (if you have design tools)

Use the `public/icon.svg` as a template and export to PNG at:
- 192x192 → `icon-192.png`
- 512x512 → `icon-512.png`
- 180x180 → `apple-touch-icon.png`

## Temporary Workaround

For now, I've created placeholder files that will allow the PWA to install.
Replace these with proper icons when you have time.

## Icon Design

Current icon features:
- Blue background (#2563eb - matching app theme)
- White checkmark in circle (habit completion symbol)
- Letter "A" for Accountable
- Rounded corners for modern iOS look
