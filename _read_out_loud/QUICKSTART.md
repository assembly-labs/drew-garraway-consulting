# Text Reader - Quick Start Guide

## 🚀 Start Testing NOW (5 Minutes)

### Step 1: Install mkcert (One-time, 30 seconds)
```bash
brew install mkcert
mkcert -install
```

### Step 2: Start HTTPS Server (10 seconds)
```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/_read_out_loud
python3 server_https.py
```

**You'll see:**
```
🚀 Text Reader App - HTTPS Development Server
📱 LOCAL ACCESS: https://localhost:8443
📱 iOS DEVICE ACCESS: https://192.168.1.XXX:8443
```

### Step 3: Generate Icons (1 minute)
1. Open: `https://localhost:8443/icons/generate-icons.html`
2. Click **"Generate Icons"**
3. Right-click each icon → **Save Image As:**
   - Save `icon-192.png` to `/icons/` folder
   - Save `icon-512.png` to `/icons/` folder

### Step 4: Test on Your Laptop (2 minutes)
1. Open: `https://localhost:8443`
2. Accept the security warning (this is normal for local dev)
3. **Quick Tests:**
   - Click "Import File" → select a PDF
   - Click Play button
   - Adjust speed slider

### Step 5: Test on iPhone (2 minutes)

#### Connect to iPhone:
1. **Both devices on same WiFi** ✓
2. **On iPhone Safari, open:** `https://192.168.1.XXX:8443` (use IP from Step 2)
3. **Tap "Advanced" → "Proceed to..."** (accept security warning)
4. **Test file import:**
   - Tap "Import File"
   - Select a file from Files app
   - Should load text

#### Install as PWA:
1. Tap **Share button** (bottom center)
2. Scroll down → Tap **"Add to Home Screen"**
3. Tap **"Add"**
4. Launch from home screen icon

---

## 🐛 Troubleshooting

### "File picker doesn't open on iOS"
**→ Solution:** Make sure you're using HTTPS (lock icon visible)

### "Site can't be reached"
**→ Solution:** Check both devices on same WiFi, verify IP address is correct

### "This connection is not private" warning
**→ Solution:** Tap "Advanced" or "Details" → "Proceed" (this is normal for local dev)

### "PDF files won't import"
**→ Solution:** Ensure iPhone has internet connection (PDF.js loads from CDN)

---

## ✅ Success Criteria

Your app is working correctly if:
- ✓ File import opens iOS Files picker
- ✓ PDF/DOCX files extract text
- ✓ Text-to-speech plays audio
- ✓ Can install as PWA from Safari
- ✓ Saved texts persist in library

---

## 📋 Full Testing Checklist

See [TESTING.md](TESTING.md) for complete testing procedures.

## 🚀 Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment to GitHub Pages or Vercel.

---

## 💡 Common Issues & Why

| Issue | Cause | Solution |
|-------|-------|----------|
| File import fails | Using HTTP not HTTPS | Use `server_https.py` |
| No PWA install option | Not HTTPS or missing icons | Check server URL has 🔒 |
| PDFs don't import | No internet (CDN blocked) | Connect iPhone to WiFi |
| Silent on iOS | Silent switch ON | Check side switch |

---

## 🎯 Your Current IP Address

Run this to find your current IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
```

Use this IP for iOS testing: `https://[YOUR-IP]:8443`

---

**Questions?** Open [TESTING.md](TESTING.md) or [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.
