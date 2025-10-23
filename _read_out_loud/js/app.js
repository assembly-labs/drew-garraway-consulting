// Main Application Entry Point
class TextReaderApp {
  constructor() {
    this.speechEngine = null;
    this.storageManager = null;
    this.fileImporter = null;
    this.uiController = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      console.log('Initializing Text Reader App...');

      // Check browser compatibility
      if (!this.checkCompatibility()) {
        this.showIncompatibilityMessage();
        return;
      }

      // Initialize modules
      this.storageManager = new StorageManager();
      this.speechEngine = new SpeechEngine();
      this.fileImporter = new FileImporter();

      // Initialize speech engine (load voices)
      await this.speechEngine.initialize();

      // Initialize UI controller
      this.uiController = new UIController(
        this.speechEngine,
        this.storageManager,
        this.fileImporter
      );
      this.uiController.initialize();

      // Register service worker for PWA
      this.registerServiceWorker();

      // Handle PWA install prompt
      this.handleInstallPrompt();

      // Check for app updates
      this.checkForUpdates();

      // Mark as initialized
      this.isInitialized = true;

      console.log('Text Reader App initialized successfully');

      // Show welcome message for first-time users
      this.showWelcomeMessage();

    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showErrorMessage(error.message);
    }
  }

  checkCompatibility() {
    const issues = [];

    // Check for Speech Synthesis API
    if (!('speechSynthesis' in window)) {
      issues.push('Speech Synthesis API is not supported');
    }

    // Check for localStorage
    if (!window.localStorage) {
      issues.push('localStorage is not supported');
    }

    // Check for Service Worker
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported - offline mode will not be available');
    }

    // Check for File API
    if (!window.File || !window.FileReader) {
      console.warn('File API not fully supported - file import may not work');
    }

    if (issues.length > 0) {
      console.error('Compatibility issues:', issues);
      return false;
    }

    return true;
  }

  showIncompatibilityMessage() {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: -apple-system, sans-serif;">
        <h1>Browser Not Supported</h1>
        <p>Your browser doesn't support the required features for this app.</p>
        <p>Please use one of the following browsers:</p>
        <ul style="list-style: none; padding: 0;">
          <li>Safari 16+ on iOS</li>
          <li>Chrome 110+ on iOS</li>
          <li>Safari on macOS</li>
          <li>Chrome on desktop</li>
        </ul>
      </div>
    `;
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff3b30;
      color: white;
      padding: 20px;
      border-radius: 12px;
      max-width: 80%;
      text-align: center;
      z-index: 9999;
    `;
    errorDiv.textContent = `Error: ${message}`;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 5000);
  }

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            this.showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  handleInstallPrompt() {
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      deferredPrompt = event;

      // Show custom install button/banner
      const installBanner = document.createElement('div');
      installBanner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
        z-index: 1000;
        font-weight: 500;
      `;
      installBanner.textContent = 'Install App';
      installBanner.id = 'installBanner';

      installBanner.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const result = await deferredPrompt.userChoice;
          console.log('Install prompt result:', result);

          if (result.outcome === 'accepted') {
            // Track installation
            console.log('App installed');
          }

          deferredPrompt = null;
          document.body.removeChild(installBanner);
        }
      });

      // Add to body after a delay
      setTimeout(() => {
        if (!document.getElementById('installBanner')) {
          document.body.appendChild(installBanner);
        }
      }, 3000);
    });

    // iOS specific install instructions
    if (this.isIOS() && !this.isInStandaloneMode()) {
      setTimeout(() => {
        this.showiOSInstallInstructions();
      }, 5000);
    }
  }

  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  showiOSInstallInstructions() {
    if (localStorage.getItem('iosInstallShown')) {
      return;
    }

    const instructions = document.createElement('div');
    instructions.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 10px;
      right: 10px;
      background: var(--surface);
      color: var(--text-primary);
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      font-size: 14px;
      line-height: 1.5;
    `;
    instructions.innerHTML = `
      <div style="font-weight: 600; margin-bottom: 8px;">Install This App</div>
      <div>Tap the share button <span style="color: var(--primary-color);">⬆</span> and select "Add to Home Screen"</div>
      <button id="dismissInstall" style="
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        margin-top: 12px;
        cursor: pointer;
      ">Got it</button>
    `;

    document.body.appendChild(instructions);

    document.getElementById('dismissInstall').addEventListener('click', () => {
      document.body.removeChild(instructions);
      localStorage.setItem('iosInstallShown', 'true');
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--success-color);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      cursor: pointer;
    `;
    notification.textContent = 'New version available! Tap to update.';

    notification.addEventListener('click', () => {
      window.location.reload();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 10000);
  }

  checkForUpdates() {
    // Check for app updates periodically
    setInterval(() => {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
      }
    }, 60000); // Check every minute
  }

  showWelcomeMessage() {
    if (localStorage.getItem('welcomeShown')) {
      return;
    }

    setTimeout(() => {
      if (this.uiController) {
        this.uiController.showToast(
          'Welcome! Paste or import text to get started.',
          'info',
          5000
        );
        localStorage.setItem('welcomeShown', 'true');
      }
    }, 1000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new TextReaderApp();
  app.initialize();

  // Make app globally accessible for debugging
  window.textReaderApp = app;
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause if playing
    if (window.textReaderApp?.speechEngine?.state === 'PLAYING') {
      window.textReaderApp.uiController.pausePlayback();
    }
  }
});

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('App is online');
});

window.addEventListener('offline', () => {
  console.log('App is offline - using cached resources');
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (event) => {
  if (window.textReaderApp?.speechEngine?.state === 'PLAYING') {
    event.preventDefault();
    event.returnValue = 'Playback is in progress. Are you sure you want to leave?';
  }
});