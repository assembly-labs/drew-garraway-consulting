# Text Reader - Modern Text-to-Speech Web App

A beautiful, modern text-to-speech web application with a premium UI design featuring glassmorphism effects, gradient animations, and a sophisticated dark theme.

## ✨ Features

### Core Functionality
- 🎙️ **High-quality text-to-speech** using Web Speech API
- 🗣️ **Multiple voices** - Choose from various voices and languages
- ⚡ **Speed control** - Adjustable playback (0.5x to 2.5x)
- 📁 **File import** - Support for TXT, PDF, and DOCX files
- 💾 **Text library** - Save and manage your texts
- 📱 **PWA ready** - Installable Progressive Web App
- 🔒 **100% private** - No data leaves your device
- ✨ **Modern UI** - Premium glassmorphism design with gradients

### New Modern Design
- 🎨 **Glassmorphism effects** - Frosted glass cards with backdrop blur
- 🌈 **Gradient animations** - Beautiful animated backgrounds
- 💫 **Smooth transitions** - Spring animations and hover effects
- 🌙 **Dark theme** - Sophisticated dark mode with vibrant accents
- 📱 **Responsive** - Optimized for all devices

## 🚀 Quick Deployment

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/text-reader)

1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Deploy automatically

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/text-reader)

1. Push code to GitHub
2. Import repo to Vercel
3. Deploy instantly

### Deploy to GitHub Pages

1. Go to repo Settings → Pages
2. Set source to "Deploy from a branch"
3. Select main branch and / (root) folder
4. Save and wait for deployment

## 📂 File Structure

```
/
├── index.html          # Main application
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── netlify.toml       # Netlify configuration
├── vercel.json        # Vercel configuration
├── _redirects         # Netlify redirects
├── css/
│   └── styles.css     # Modern styles with glassmorphism
├── js/
│   ├── app.js         # Main application logic
│   ├── speech.js      # Text-to-speech functionality
│   ├── storage.js     # Local storage management
│   ├── fileImport.js  # File import handling
│   └── ui.js          # UI interactions
└── icons/
    ├── icon-192.png   # PWA icon
    └── icon-512.png   # PWA icon
```

## 🛠️ Local Development

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/text-reader.git
cd text-reader

# For HTTP (basic testing)
python3 -m http.server 8080
# Open: http://localhost:8080

# For HTTPS (required for iOS/PWA features)
python3 server_https.py
# Open: https://localhost:8443
```

### Testing on iOS

iOS requires HTTPS for file imports and PWA features:

1. **Both devices on same WiFi**
2. **Run:** `python3 server_https.py`
3. **On iPhone:** Open `https://[YOUR-IP]:8443`
4. **Accept security warning** (Advanced → Proceed)
5. **Install PWA:** Share → Add to Home Screen

## 🎨 Design Features

### Modern UI Components
- **Glassmorphism cards** with backdrop blur
- **Gradient buttons** with hover animations
- **Animated backgrounds** with radial gradients
- **Spring animations** for interactive elements
- **Shimmer effects** on progress bars
- **Smooth modal transitions**

### Color System
- **Primary:** Purple-blue gradient (#667eea → #764ba2)
- **Accent:** Cyan gradient (#4facfe → #00f2fe)
- **Success:** Green gradient (#43e97b → #38f9d7)
- **Dark backgrounds** with subtle glass effects

## 📱 Browser Support

### Fully Supported
- ✅ Chrome 33+
- ✅ Safari 14+
- ✅ Edge 79+
- ✅ iOS Safari 16+
- ✅ Mobile Chrome

### Limited Support
- ⚠️ Firefox (no Web Speech API)

## ⚙️ Configuration

### Custom Domain
Update `start_url` in `manifest.json` if deploying to subdirectory

### Security Headers
Configured in:
- `netlify.toml` for Netlify
- `vercel.json` for Vercel
- Configure in web server for other deployments

### Cache Strategy
Service worker caching configured in `sw.js`

## 🔧 Troubleshooting

### File import not working on iOS
- Must use HTTPS (run `python3 server_https.py`)
- iOS Safari blocks file access over HTTP

### PWA won't install
- Ensure HTTPS connection
- Must use Safari on iOS (not Chrome)
- Check that icons exist

### No voices available
- Refresh the page
- Check iOS Settings → Accessibility → Spoken Content
- Download additional voices if needed

## 📄 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues or questions, please open an issue on GitHub.