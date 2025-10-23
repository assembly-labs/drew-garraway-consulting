# Text Reader - Testing Guide

## Local Development Testing

### Prerequisites
- Python 3.x installed
- mkcert installed (recommended) or OpenSSL
- iPhone/iPad on same WiFi network as laptop

### Install mkcert (One-time setup)
```bash
# macOS
brew install mkcert
mkcert -install
```

---

## Testing Process

### Step 1: Start HTTPS Development Server

```bash
# Navigate to project directory
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/_read_out_loud

# Start HTTPS server (generates SSL certs automatically)
python3 server_https.py
```

**Expected Output:**
```
🚀 Text Reader App - HTTPS Development Server
📱 LOCAL ACCESS: https://localhost:8443
📱 iOS DEVICE ACCESS: https://192.168.1.XXX:8443
```

---

### Step 2: Generate App Icons

1. **Open Icon Generator:**
   ```
   https://localhost:8443/icons/generate-icons.html
   ```

2. **Save Icons:**
   - Click "Generate Icons" button
   - Right-click each icon → Save as:
     - Save 192x192 as `icon-192.png`
     - Save 512x512 as `icon-512.png`
   - Place in `/icons/` folder

---

### Step 3: Test on Laptop (Desktop Browser)

**URL:** `https://localhost:8443`

**Tests to perform:**

#### 3.1 File Import
- [ ] Click "Import File" button
- [ ] Select a `.txt` file → Should load text
- [ ] Select a `.pdf` file → Should extract text
- [ ] Select a `.docx` file → Should extract text

#### 3.2 Text-to-Speech
- [ ] Paste text in the textarea
- [ ] Click Play button
- [ ] Verify audio plays
- [ ] Test Pause, Stop, Skip buttons
- [ ] Adjust speed slider (0.5x - 2.5x)

#### 3.3 Voice Selection
- [ ] Click voice selector button
- [ ] Browse available voices
- [ ] Select different voice
- [ ] Test playback with new voice

#### 3.4 Library
- [ ] Click "Save" button
- [ ] Enter a title
- [ ] Save text to library
- [ ] Click Library icon (top right)
- [ ] Verify saved text appears
- [ ] Load saved text
- [ ] Delete saved text

#### 3.5 UI/UX
- [ ] Check character/word count updates
- [ ] Check progress bar during playback
- [ ] Test Clear button
- [ ] Test Paste button

---

### Step 4: Test on iOS Device

#### 4.1 Connect to Server

1. **Find your laptop's IP:**
   ```bash
   # The server will display it, or run:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Open on iPhone/iPad:**
   ```
   https://192.168.1.XXX:8443
   ```

3. **Accept Security Warning:**
   - Tap "Advanced" or "Details"
   - Tap "Proceed to 192.168.1.XXX (unsafe)" or "Visit this website"
   - This is normal for self-signed certificates in development

#### 4.2 iOS-Specific Tests

##### File Import (CRITICAL)
- [ ] Tap "Import File"
- [ ] Should see file picker (Files app)
- [ ] Select PDF from iCloud Drive → Should import
- [ ] Select DOCX from Files → Should import
- [ ] Select TXT file → Should import

**Common Issues:**
- **File picker doesn't open:** Check HTTPS is working (lock icon in Safari)
- **Files don't load:** Check browser console for errors
- **PDF/DOCX fails:** Check internet connection (CDN libraries needed)

##### Text-to-Speech on iOS
- [ ] Paste text
- [ ] Click Play
- [ ] Verify iOS voice plays (may differ from desktop)
- [ ] Test with iPhone locked (may pause)
- [ ] Test with headphones

##### PWA Installation
- [ ] Tap Share button (center bottom in Safari)
- [ ] Scroll down → Tap "Add to Home Screen"
- [ ] Edit name if desired → Tap "Add"
- [ ] Verify icon appears on home screen
- [ ] Launch from home screen
- [ ] Should open fullscreen (no Safari UI)

##### Library & Storage
- [ ] Save text to library
- [ ] Close app completely
- [ ] Reopen from home screen
- [ ] Check library persists (localStorage)

##### Offline Mode
- [ ] Use app with WiFi ON
- [ ] Turn on Airplane mode
- [ ] Launch app from home screen
- [ ] Should still work (basic features)
- [ ] File import will fail (no CDN access)

---

### Step 5: Cross-Browser Testing

Test on multiple browsers/devices:

| Browser | Platform | Priority | Tests |
|---------|----------|----------|-------|
| Safari | iOS | 🔴 High | File import, PWA, TTS |
| Chrome | iOS | 🟡 Medium | Basic functionality |
| Safari | macOS | 🟡 Medium | Desktop features |
| Chrome | Desktop | 🟢 Low | Compatibility |

---

## Troubleshooting

### SSL Certificate Issues

**Problem:** Browser shows "Not Secure" or blocks page

**Solution:**
```bash
# Reinstall mkcert
mkcert -uninstall
mkcert -install

# Regenerate certificates
rm localhost.pem localhost-key.pem
python3 server_https.py
```

---

### iOS File Import Not Working

**Problem:** File picker doesn't open or files don't load

**Checklist:**
1. ✓ Using HTTPS (not HTTP)
2. ✓ Accepted security warning on iOS
3. ✓ Internet connection active (for CDN libraries)
4. ✓ File size under 10MB
5. ✓ Supported file type (.txt, .pdf, .docx)

**Debug:**
1. Open Safari Developer Tools on Mac:
   - Safari → Develop → [Your iPhone] → [Page name]
2. Check Console for errors
3. Look for FileReader or library loading errors

---

### PWA Not Installing

**Problem:** "Add to Home Screen" doesn't show PWA option

**Requirements:**
- ✓ HTTPS connection
- ✓ Valid `manifest.json`
- ✓ Icons accessible (192x192, 512x512)
- ✓ Opened in Safari (not Chrome on iOS)

---

### Audio Not Playing on iOS

**Problem:** Text-to-speech doesn't work

**Possible causes:**
1. Silent mode enabled (check side switch)
2. No iOS voices installed (Settings → Accessibility → Spoken Content)
3. Browser tab backgrounded (iOS pauses audio)
4. Autoplay blocked (requires user interaction first)

---

## Testing Checklist Summary

### Before Each Test Session
- [ ] HTTPS server running
- [ ] SSL certificates valid
- [ ] Icons generated and saved
- [ ] iOS device on same WiFi
- [ ] Internet connection active

### Core Features
- [ ] File import (TXT, PDF, DOCX)
- [ ] Text-to-speech playback
- [ ] Speed control
- [ ] Voice selection
- [ ] Library save/load
- [ ] PWA installation
- [ ] Offline functionality

### Edge Cases
- [ ] Large files (near 10MB limit)
- [ ] Empty files
- [ ] Corrupted PDFs
- [ ] Special characters in text
- [ ] Very long documents
- [ ] Multiple files in sequence

---

## Performance Benchmarks

| Test | Expected Time | Pass Criteria |
|------|---------------|---------------|
| TXT import (1MB) | < 1 second | Instant load |
| PDF import (10 pages) | < 5 seconds | All text extracted |
| DOCX import (20 pages) | < 5 seconds | Formatting preserved |
| Library save | < 500ms | Immediate feedback |
| Voice change | < 1 second | No playback interruption |
| PWA install | < 10 seconds | Icon on home screen |

---

## Test Data

Create test files for consistent testing:

### test.txt
```
This is a test text file for the Text Reader app.
It should import quickly and play back clearly.
```

### Sample PDF
- Use any multi-page PDF (article, ebook chapter)
- Should have selectable text (not scanned image)

### Sample DOCX
- Create in Microsoft Word or Google Docs
- Include formatted text, paragraphs, headings

---

## Reporting Issues

When filing bugs, include:
1. Device/browser (iPhone 12, iOS 17.2, Safari)
2. Server URL used (localhost vs IP address)
3. HTTPS status (lock icon visible?)
4. Steps to reproduce
5. Console errors (if any)
6. Expected vs actual behavior

---

## Next: Production Deployment

Once local testing passes, see [DEPLOYMENT.md](DEPLOYMENT.md) for production release process.
