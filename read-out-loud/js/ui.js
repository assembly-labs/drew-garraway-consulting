// UI Module - Handles all user interface interactions
class UIController {
  constructor(speechEngine, storageManager, fileImporter) {
    this.speechEngine = speechEngine;
    this.storageManager = storageManager;
    this.fileImporter = fileImporter;

    // UI Elements
    this.elements = {};
    this.autoSaveTimer = null;
    this.isHighlighting = true;
    this.currentTextId = null;
    this.savedPosition = 0;
    this.premiumTTS = null;
    this.googleTTS = null;
    this.currentEngine = 'browser';
    this.wordSpans = []; // Pre-built spans for performant highlighting
    this.currentHighlightIndex = -1;
    this._confirmResolve = null; // For custom confirm/prompt modals
    this._lastTriggerBtn = null; // For focus restoration after modals

    // Auto-scroll control: tracks whether user scrolled away during playback
    this.userScrolledAway = false;
    this.isProgrammaticScroll = false;

    // Prefetch: cache first audio chunk so playback starts instantly
    this.prefetchedAudio = null; // { text, audioUrl, chunkIndex }
    this.prefetchTimer = null;
  }

  initialize() {
    this.cacheElements();
    this.attachEventListeners();
    this.loadSavedState();
    this.initializeVoiceList();
    this.initializePremiumTTS();
    this.initializeGoogleTTS();
    this.initializeSettingsModal();
    this.checkResumeBanner();
    this.loadSampleTextIfFirstVisit();
    this.setupOfflineIndicator();
  }

  initializePremiumTTS() {
    if (window.PremiumTTS) {
      this.premiumTTS = new PremiumTTS();
    }
  }

  initializeGoogleTTS() {
    if (window.GoogleTTS) {
      this.googleTTS = new GoogleTTS();

      this.googleTTS.onProgress = (data) => {
        this.elements.progressFill.style.width = `${data.progress}%`;
        this.elements.progressFill.setAttribute('aria-valuenow', Math.round(data.progress));
        this.elements.progressPercent.textContent = `${Math.round(data.progress)}%`;
      };

      this.googleTTS.onBoundary = (data) => {
        if (this.isHighlighting && this.elements.textDisplay) {
          this.highlightWordAt(data.charIndex, data.charLength);
        }
        this.savedPosition = data.charIndex;
        this.saveCurrentPosition();
      };

      this.googleTTS.onEnd = () => {
        this.handlePlaybackEnd();
      };

      this.googleTTS.onError = (error) => {
        this.fallbackToBrowserVoices('Playback error, using offline voices');
        this.handlePlaybackError({ error: error.message || 'Google TTS error' });
      };

      if (this.googleTTS.isConfigured) {
        this.currentEngine = 'google';
        localStorage.setItem('tts_engine', 'google');
        this.autoLoadPremiumVoices();
      } else {
        this.currentEngine = 'browser';
      }
    }
  }

  async autoLoadPremiumVoices() {
    try {
      await this.googleTTS.fetchVoices();
      const selectedVoice = this.googleTTS.selectedVoice;
      if (selectedVoice) {
        this.updateVoiceDisplay({ name: selectedVoice.displayName });
      }
    } catch (error) {
      console.warn('Failed to load premium voices, falling back to browser:', error);
      this.fallbackToBrowserVoices('Using offline voices');
    }
  }

  fallbackToBrowserVoices(message = null) {
    this.currentEngine = 'browser';
    localStorage.setItem('tts_engine', 'browser');
    this.updateEngineUI();
    this.renderVoiceList();

    if (this.speechEngine.selectedVoice) {
      this.updateVoiceDisplay(this.speechEngine.selectedVoice);
    }

    if (message) {
      this.showToast(message, 'info');
    }
  }

  initializeSettingsModal() {
    this.updateEngineUI();
  }

  // ==========================================
  // Sample text on first visit
  // ==========================================

  loadSampleTextIfFirstVisit() {
    const hasVisited = localStorage.getItem('rol_has_visited');
    const currentText = this.elements.textInput.value;
    if (hasVisited || currentText) return;

    localStorage.setItem('rol_has_visited', '1');
    const sample = `The old lighthouse keeper climbed the spiral staircase one last time, his weathered hands gripping the iron railing that had guided him for thirty years. Outside, the November wind howled against the stone walls, carrying with it the salt spray of waves crashing far below.

He reached the lamp room and paused to catch his breath. Through the thick glass panels, he could see the fishing boats returning to harbor, their lights bobbing like fireflies on the dark water. Each one carried someone's father, someone's child, guided safely home by this beam of light.

Tomorrow the automated system would take over. No more climbing these stairs at dusk. No more watching through the long winter nights. Progress, they called it. He called it the end of something worth keeping.

Press play to hear this text read aloud. The words will highlight as they are spoken. You can paste your own text, import a file, or save texts to your library.`;

    this.elements.textInput.value = sample;
    this.handleTextChange();
  }

  // ==========================================
  // Offline indicator
  // ==========================================

  setupOfflineIndicator() {
    const banner = document.getElementById('offlineBanner');
    if (!banner) return;

    const updateOnlineStatus = () => {
      if (!navigator.onLine) {
        banner.style.display = 'block';
        if (this.currentEngine === 'google') {
          this.fallbackToBrowserVoices();
        }
      } else {
        banner.style.display = 'none';
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  // ==========================================
  // Listen Mode (transforms UI during playback)
  // ==========================================

  enterListenMode() {
    if (this.elements.appContainer) {
      this.elements.appContainer.classList.add('listen-mode');
    }
    if (this.elements.editModeBtn) {
      this.elements.editModeBtn.style.display = 'flex';
    }
  }

  exitListenMode() {
    if (this.elements.appContainer) {
      this.elements.appContainer.classList.remove('listen-mode');
    }
    if (this.elements.editModeBtn) {
      this.elements.editModeBtn.style.display = 'none';
    }
    this.stopPlayback();
  }

  // ==========================================
  // Speed popover
  // ==========================================

  toggleSpeedPopover() {
    const popover = this.elements.speedPopover;
    if (!popover) return;
    const isVisible = popover.style.display !== 'none';
    popover.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) this.updateSpeedPresetActive();
  }

  closeSpeedPopover() {
    if (this.elements.speedPopover) {
      this.elements.speedPopover.style.display = 'none';
    }
  }

  updateSpeedPresetActive() {
    const currentSpeed = parseFloat(this.elements.speedSlider.value);
    this.elements.speedPresets.forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.speed) === currentSpeed);
    });
  }

  // ==========================================
  // Custom confirm/prompt modals (replaces native dialogs)
  // ==========================================

  showConfirm(title, message, { okText = 'OK', cancelText = 'Cancel', showInput = false, inputValue = '', inputPlaceholder = '' } = {}) {
    return new Promise((resolve) => {
      this._confirmResolve = resolve;

      this.elements.confirmTitle.textContent = title;
      this.elements.confirmMessage.textContent = message;
      this.elements.confirmOk.textContent = okText;
      this.elements.confirmCancel.textContent = cancelText;

      if (showInput) {
        this.elements.confirmInput.style.display = 'block';
        this.elements.confirmInput.value = inputValue;
        this.elements.confirmInput.placeholder = inputPlaceholder;
      } else {
        this.elements.confirmInput.style.display = 'none';
      }

      this.elements.confirmModal.style.display = 'flex';

      // Focus the first action button (or input if prompt)
      setTimeout(() => {
        if (showInput) {
          this.elements.confirmInput.focus();
          this.elements.confirmInput.select();
        } else {
          this.elements.confirmOk.focus();
        }
      }, 50);
    });
  }

  closeConfirm(result) {
    this.elements.confirmModal.style.display = 'none';
    if (this._confirmResolve) {
      this._confirmResolve(result);
      this._confirmResolve = null;
    }
    // Restore focus to trigger button
    if (this._lastTriggerBtn) {
      this._lastTriggerBtn.focus();
      this._lastTriggerBtn = null;
    }
  }

  // ==========================================
  // Cache DOM Elements
  // ==========================================

  cacheElements() {
    this.elements.textInput = document.getElementById('textInput');
    this.elements.textDisplay = document.getElementById('textDisplay');

    this.elements.pasteBtn = document.getElementById('pasteBtn');
    this.elements.importBtn = document.getElementById('importBtn');
    this.elements.saveBtn = document.getElementById('saveBtn');
    this.elements.downloadBtn = document.getElementById('downloadBtn');
    this.elements.clearBtn = document.getElementById('clearBtn');
    this.elements.fileInput = document.getElementById('fileInput');

    this.elements.playPauseBtn = document.getElementById('playPauseBtn');
    this.elements.playIcon = document.getElementById('playIcon');
    this.elements.pauseIcon = document.getElementById('pauseIcon');
    this.elements.playSpinner = document.getElementById('playSpinner');
    this.elements.stopBtn = document.getElementById('stopBtn');
    this.elements.skipBackBtn = document.getElementById('skipBackBtn');
    this.elements.skipForwardBtn = document.getElementById('skipForwardBtn');

    this.elements.speedSlider = document.getElementById('speedSlider');
    this.elements.speedValue = document.getElementById('speedValue');
    this.elements.speedBadge = document.getElementById('speedBadge');
    this.elements.speedPopover = document.getElementById('speedPopover');
    this.elements.closeSpeedPopover = document.getElementById('closeSpeedPopover');
    this.elements.speedSliderDisplay = document.getElementById('speedSliderDisplay');
    this.elements.speedPresets = document.querySelectorAll('.speed-preset');

    this.elements.editModeBtn = document.getElementById('editModeBtn');
    this.elements.appContainer = document.getElementById('app');

    this.elements.voiceSelectBtn = document.getElementById('voiceSelectBtn');
    this.elements.currentVoiceName = document.getElementById('currentVoiceName');
    this.elements.voiceModal = document.getElementById('voiceModal');
    this.elements.voiceSearch = document.getElementById('voiceSearch');
    this.elements.voiceList = document.getElementById('voiceList');
    this.elements.closeVoiceModal = document.getElementById('closeVoiceModal');

    this.elements.progressBar = document.getElementById('progressBar');
    this.elements.progressFill = document.getElementById('progressFill');
    this.elements.progressPercent = document.getElementById('progressPercent');
    this.elements.progressTime = document.getElementById('progressTime');

    this.elements.charCount = document.getElementById('charCount');
    this.elements.wordCount = document.getElementById('wordCount');
    this.elements.readingTime = document.getElementById('readingTime');
    this.elements.autoSaveIndicator = document.getElementById('autoSaveIndicator');

    this.elements.libraryBtn = document.getElementById('libraryBtn');
    this.elements.libraryModal = document.getElementById('libraryModal');
    this.elements.librarySearch = document.getElementById('librarySearch');
    this.elements.libraryList = document.getElementById('libraryList');
    this.elements.closeLibraryModal = document.getElementById('closeLibraryModal');

    this.elements.loadingIndicator = document.getElementById('loadingIndicator');
    this.elements.loadingMessage = document.getElementById('loadingMessage');
    this.elements.toastContainer = document.getElementById('toastContainer');

    this.elements.settingsBtn = document.getElementById('settingsBtn');
    this.elements.settingsModal = document.getElementById('settingsModal');
    this.elements.closeSettingsModal = document.getElementById('closeSettingsModal');
    this.elements.engineBrowser = document.getElementById('engineBrowser');
    this.elements.engineGoogle = document.getElementById('engineGoogle');

    // Resume banner
    this.elements.resumeBanner = document.getElementById('resumeBanner');
    this.elements.resumeText = document.getElementById('resumeText');
    this.elements.resumeBtn = document.getElementById('resumeBtn');
    this.elements.startOverBtn = document.getElementById('startOverBtn');

    // Follow along button (auto-scroll control)
    this.elements.followAlongBtn = document.getElementById('followAlongBtn');

    // Confirm modal
    this.elements.confirmModal = document.getElementById('confirmModal');
    this.elements.confirmTitle = document.getElementById('confirmTitle');
    this.elements.confirmMessage = document.getElementById('confirmMessage');
    this.elements.confirmInput = document.getElementById('confirmInput');
    this.elements.confirmOk = document.getElementById('confirmOk');
    this.elements.confirmCancel = document.getElementById('confirmCancel');
  }

  attachEventListeners() {
    if (this.elements.textInput) {
      this.elements.textInput.addEventListener('input', () => this.handleTextChange());
    }

    if (this.elements.pasteBtn) {
      this.elements.pasteBtn.addEventListener('click', () => this.pasteText());
    }
    if (this.elements.importBtn) {
      this.elements.importBtn.addEventListener('click', () => this.importFile());
    }
    if (this.elements.saveBtn) {
      this.elements.saveBtn.addEventListener('click', () => this.saveToLibrary());
    }
    if (this.elements.clearBtn) {
      this.elements.clearBtn.addEventListener('click', () => this.clearText());
    }
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.addEventListener('click', () => this.downloadMP3());
    }
    if (this.elements.fileInput) {
      this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    if (this.elements.playPauseBtn) {
      this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    }
    if (this.elements.stopBtn) {
      this.elements.stopBtn.addEventListener('click', () => this.stopPlayback());
    }
    if (this.elements.skipBackBtn) {
      this.elements.skipBackBtn.addEventListener('click', () => this.skipBack());
    }
    if (this.elements.skipForwardBtn) {
      this.elements.skipForwardBtn.addEventListener('click', () => this.skipForward());
    }

    // Click-to-seek on progress bar
    if (this.elements.progressBar) {
      this.elements.progressBar.addEventListener('click', (e) => this.seekToPosition(e));
    }

    if (this.elements.speedSlider) {
      this.elements.speedSlider.addEventListener('input', (e) => this.updateSpeed(e.target.value));
    }
    if (this.elements.speedPresets) {
      this.elements.speedPresets.forEach(btn => {
        btn.addEventListener('click', () => this.updateSpeed(btn.dataset.speed));
      });
    }

    // Speed badge opens popover
    if (this.elements.speedBadge) {
      this.elements.speedBadge.addEventListener('click', () => this.toggleSpeedPopover());
    }
    if (this.elements.closeSpeedPopover) {
      this.elements.closeSpeedPopover.addEventListener('click', () => this.closeSpeedPopover());
    }

    // Edit mode button (exits listen mode)
    if (this.elements.editModeBtn) {
      this.elements.editModeBtn.addEventListener('click', () => this.exitListenMode());
    }

    if (this.elements.voiceSelectBtn) {
      this.elements.voiceSelectBtn.addEventListener('click', () => this.openVoiceModal());
    }
    if (this.elements.closeVoiceModal) {
      this.elements.closeVoiceModal.addEventListener('click', () => this.closeVoiceModal());
    }
    if (this.elements.voiceSearch) {
      this.elements.voiceSearch.addEventListener('input', (e) => this.filterVoices(e.target.value));
    }

    if (this.elements.libraryBtn) {
      this.elements.libraryBtn.addEventListener('click', () => this.openLibraryModal());
    }
    if (this.elements.closeLibraryModal) {
      this.elements.closeLibraryModal.addEventListener('click', () => this.closeLibraryModal());
    }
    if (this.elements.librarySearch) {
      this.elements.librarySearch.addEventListener('input', (e) => this.filterLibrary(e.target.value));
    }

    // Resume banner
    if (this.elements.resumeBtn) {
      this.elements.resumeBtn.addEventListener('click', () => this.resumeFromSaved());
    }
    if (this.elements.startOverBtn) {
      this.elements.startOverBtn.addEventListener('click', () => this.startFresh());
    }

    // Confirm modal
    if (this.elements.confirmOk) {
      this.elements.confirmOk.addEventListener('click', () => {
        const input = this.elements.confirmInput;
        const value = input.style.display !== 'none' ? input.value : true;
        this.closeConfirm(value);
      });
    }
    if (this.elements.confirmCancel) {
      this.elements.confirmCancel.addEventListener('click', () => this.closeConfirm(null));
    }
    // Close button on confirm modal
    const confirmClose = document.querySelector('.confirm-close');
    if (confirmClose) {
      confirmClose.addEventListener('click', () => this.closeConfirm(null));
    }
    if (this.elements.confirmModal) {
      this.elements.confirmModal.addEventListener('click', (e) => {
        if (e.target === this.elements.confirmModal) this.closeConfirm(null);
      });
    }
    // Enter key in confirm input
    if (this.elements.confirmInput) {
      this.elements.confirmInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.closeConfirm(this.elements.confirmInput.value);
        }
      });
    }

    // Follow along button and scroll tracking
    if (this.elements.followAlongBtn) {
      this.elements.followAlongBtn.addEventListener('click', () => {
        this.userScrolledAway = false;
        this.elements.followAlongBtn.style.display = 'none';
        // Scroll to the currently highlighted word
        if (this.currentHighlightIndex >= 0 && this.currentHighlightIndex < this.wordSpans.length) {
          this.isProgrammaticScroll = true;
          this.wordSpans[this.currentHighlightIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => { this.isProgrammaticScroll = false; }, 500);
        }
      });
    }
    if (this.elements.textDisplay) {
      this.elements.textDisplay.addEventListener('scroll', () => {
        // Only mark as user-scrolled if it wasn't triggered by our code
        if (!this.isProgrammaticScroll) {
          this.userScrolledAway = true;
          this.showFollowAlongBtn();
        }
      });
    }

    // Speech engine callbacks
    this.speechEngine.boundaryCallback = (data) => this.handleWordBoundary(data);
    this.speechEngine.startCallback = () => this.handlePlaybackStarted();
    this.speechEngine.endCallback = () => this.handlePlaybackEnd();
    this.speechEngine.errorCallback = (error) => this.handlePlaybackError(error);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // Modal close on outside click with focus trap
    [
      { modal: this.elements.voiceModal, close: () => this.closeVoiceModal() },
      { modal: this.elements.libraryModal, close: () => this.closeLibraryModal() },
      { modal: this.elements.settingsModal, close: () => this.closeSettingsModal() }
    ].forEach(({ modal, close }) => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) close();
        });
        // Focus trap
        modal.addEventListener('keydown', (e) => this.trapFocus(e, modal));
      }
    });

    // Settings modal
    if (this.elements.settingsBtn) {
      this.elements.settingsBtn.addEventListener('click', () => this.openSettingsModal());
    }
    if (this.elements.closeSettingsModal) {
      this.elements.closeSettingsModal.addEventListener('click', () => this.closeSettingsModal());
    }

    // Engine toggle
    if (this.elements.engineBrowser) {
      this.elements.engineBrowser.addEventListener('click', () => this.setEngine('browser'));
    }
    if (this.elements.engineGoogle) {
      this.elements.engineGoogle.addEventListener('click', () => this.setEngine('google'));
    }
  }

  // ==========================================
  // Focus trap for modals
  // ==========================================

  trapFocus(event, modal) {
    if (event.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  // ==========================================
  // Resume banner
  // ==========================================

  checkResumeBanner() {
    const savedPos = this.loadSavedPosition();
    const text = this.elements.textInput.value;
    if (savedPos > 0 && text && savedPos < text.length) {
      const percent = Math.round((savedPos / text.length) * 100);
      this.elements.resumeText.textContent = `Resume from ${percent}%`;
      this.elements.resumeBanner.style.display = 'flex';
    } else {
      this.elements.resumeBanner.style.display = 'none';
    }
  }

  resumeFromSaved() {
    this.elements.resumeBanner.style.display = 'none';
    const text = this.elements.textInput.value;
    const savedPos = this.loadSavedPosition();
    if (!text) return;

    this.updatePlayPauseButton('loading');
    if (this.currentEngine === 'google' && this.googleTTS?.isConfigured) {
      this.startGooglePlayback(text, savedPos);
    } else {
      this.speechEngine.play(text, savedPos);
      this.showTextDisplay();
      this.startProgressTracking();
    }
  }

  startFresh() {
    this.elements.resumeBanner.style.display = 'none';
    this.clearSavedPosition();
    this.startPlayback();
  }

  // ==========================================
  // State management
  // ==========================================

  loadSavedState() {
    const savedText = this.storageManager.getCurrentText();
    if (savedText) {
      this.elements.textInput.value = savedText;
      this.updateTextStats();
    }

    const savedSpeed = this.storageManager.getPlaybackSpeed();
    this.elements.speedSlider.value = savedSpeed;
    this.updateSpeed(savedSpeed);

    const savedVoiceURI = this.storageManager.getSelectedVoice();
    if (savedVoiceURI && this.speechEngine.voices.length > 0) {
      const voice = this.speechEngine.voices.find(v => v.voiceURI === savedVoiceURI);
      if (voice) {
        this.speechEngine.setVoice(voice);
        this.updateVoiceDisplay(voice);
      }
    }
  }

  handleTextChange() {
    this.updateTextStats();
    this.scheduleAutoSave();
    this.checkResumeBanner();
    this.schedulePrefetch();
  }

  // ==========================================
  // Prefetch first audio chunk (reduces play lag)
  // ==========================================

  /**
   * Schedule a prefetch of the first audio chunk after text changes.
   * Debounced to 2 seconds so we don't spam the API while typing.
   */
  schedulePrefetch() {
    // Clear any existing prefetch data since text changed
    this.clearPrefetch();

    if (this.prefetchTimer) {
      clearTimeout(this.prefetchTimer);
    }

    this.prefetchTimer = setTimeout(() => {
      this.prefetchFirstChunk();
    }, 2000);
  }

  /**
   * Pre-generate audio for the first chunk of text so playback can start instantly.
   * Only runs when Google TTS is active and configured.
   */
  async prefetchFirstChunk() {
    // Only prefetch for Google TTS engine
    if (this.currentEngine !== 'google' || !this.googleTTS?.isConfigured) return;

    const text = this.elements.textInput.value;
    if (!text || text.length < 10) return;

    try {
      const chunks = this.googleTTS.chunkText(text);
      if (chunks.length === 0) return;

      const firstChunk = chunks[0];
      const audioBlob = await this.googleTTS.generateAudio(firstChunk);
      const audioUrl = URL.createObjectURL(audioBlob);

      // Store the prefetched result with the full text for matching later
      this.prefetchedAudio = {
        text: text,
        audioUrl: audioUrl,
        chunkIndex: 0
      };
    } catch (error) {
      // Prefetch failure is non-critical; playback will generate on demand
      console.warn('Prefetch failed (non-critical):', error);
    }
  }

  clearPrefetch() {
    if (this.prefetchedAudio) {
      URL.revokeObjectURL(this.prefetchedAudio.audioUrl);
      this.prefetchedAudio = null;
    }
  }

  updateTextStats() {
    const text = this.elements.textInput.value;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / (200 * this.speechEngine.rate));

    this.elements.charCount.textContent = `${charCount.toLocaleString()} characters`;
    this.elements.wordCount.textContent = `${wordCount.toLocaleString()} words`;
    this.elements.readingTime.textContent = `~${readingTime} min`;

    if (charCount > 150000) {
      this.elements.charCount.style.color = 'var(--danger)';
    } else {
      this.elements.charCount.style.color = '';
    }
  }

  scheduleAutoSave() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }

    this.autoSaveTimer = setTimeout(() => {
      const text = this.elements.textInput.value;
      if (this.storageManager.saveCurrentText(text)) {
        // Subtle inline indicator instead of toast
        if (this.elements.autoSaveIndicator) {
          this.elements.autoSaveIndicator.style.display = 'inline';
          this.elements.autoSaveIndicator.style.opacity = '1';
          setTimeout(() => {
            this.elements.autoSaveIndicator.style.opacity = '0';
            setTimeout(() => {
              this.elements.autoSaveIndicator.style.display = 'none';
            }, 400);
          }, 1500);
        }
      }
    }, 3000);
  }

  // ==========================================
  // Text actions
  // ==========================================

  async pasteText() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        this.elements.textInput.value = text;
        this.handleTextChange();
        this.showToast('Text pasted', 'success');

        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
    } catch (error) {
      this.showToast('Failed to paste text. Please use Ctrl+V or Cmd+V', 'error');
    }
  }

  importFile() {
    this.elements.fileInput.click();
  }

  async handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    this.showLoading('Importing file...');

    try {
      const file = files[0];
      const result = await this.fileImporter.importFile(file, (progress) => {
        if (progress.message) {
          this.elements.loadingMessage.textContent = progress.message;
        }
      });

      if (result.success) {
        this.elements.textInput.value = result.text;
        this.handleTextChange();
        this.showToast(`Successfully imported ${result.filename}`, 'success');
      } else {
        this.showToast(`Failed to import ${result.filename}`, 'error');
      }
    } catch (error) {
      this.showToast(error.message, 'error');
    } finally {
      this.hideLoading();
      this.elements.fileInput.value = '';
    }
  }

  async saveToLibrary() {
    this._lastTriggerBtn = this.elements.saveBtn;
    const text = this.elements.textInput.value;
    if (!text) {
      this.showToast('No text to save', 'error');
      return;
    }

    const title = await this.showConfirm('Save to Library', 'Enter a title for this text:', {
      okText: 'Save',
      showInput: true,
      inputPlaceholder: 'Enter title...'
    });

    if (title !== null && title !== '') {
      const entry = this.storageManager.saveToLibrary(title || 'Untitled', text);
      if (entry) {
        this.currentTextId = entry.id;
        this.showToast('Saved to library', 'success');

        const storageStatus = this.storageManager.checkStorageUsage();
        if (storageStatus.warning) {
          this.showToast(storageStatus.message, 'warning', 5000);
        }
      } else {
        this.showToast('Failed to save to library', 'error');
      }
    }
  }

  async clearText() {
    if (this.elements.textInput.value) {
      this._lastTriggerBtn = this.elements.clearBtn;
      const confirmed = await this.showConfirm('Clear Text', 'Clear all text? This cannot be undone.', {
        okText: 'Clear',
        cancelText: 'Keep'
      });
      if (!confirmed) return;
    }

    this.stopPlayback();
    this.elements.textInput.value = '';
    this.currentTextId = null;
    this.handleTextChange();
    this.storageManager.clearCurrentText();
    this.showToast('Text cleared', 'success');
  }

  // ==========================================
  // Playback button states
  // ==========================================

  updatePlayPauseButton(state) {
    const showPlay = state === 'play';
    const showPause = state === 'pause';
    const showSpinner = state === 'loading';

    this.elements.playIcon.style.display = showPlay ? 'block' : 'none';
    this.elements.pauseIcon.style.display = showPause ? 'block' : 'none';
    this.elements.playSpinner.style.display = showSpinner ? 'block' : 'none';
    this.elements.playPauseBtn.disabled = showSpinner;

    // Paused visual state
    this.elements.playPauseBtn.classList.toggle('paused-state', state === 'play' && this.speechEngine.state === 'PAUSED');
  }

  updateSpeed(speed) {
    const speedValue = parseFloat(speed);
    this.speechEngine.setRate(speedValue);
    this.storageManager.savePlaybackSpeed(speedValue);
    this.elements.speedSlider.value = speedValue;
    this.elements.speedValue.textContent = `${speedValue.toFixed(1)}x`;
    if (this.elements.speedSliderDisplay) {
      this.elements.speedSliderDisplay.textContent = `${speedValue.toFixed(1)}x`;
    }
    this.updateTextStats();
    this.updateSpeedPresetActive();
  }

  // ==========================================
  // Progress tracking and seeking
  // ==========================================

  startProgressTracking() {
    this.progressInterval = setInterval(() => {
      this.updateProgress();
    }, 500);
  }

  updateProgress() {
    if (this.speechEngine.state === 'IDLE') {
      clearInterval(this.progressInterval);
      return;
    }

    const progress = this.speechEngine.getProgress();
    const currentPos = this.speechEngine.getCurrentPosition();
    const totalLength = this.speechEngine.getTotalLength();

    this.elements.progressFill.style.width = `${progress}%`;
    this.elements.progressFill.setAttribute('aria-valuenow', Math.round(progress));
    this.elements.progressPercent.textContent = `${Math.round(progress)}%`;

    const wordsPerChar = 0.2;
    const wordsRead = currentPos * wordsPerChar;
    const totalWords = totalLength * wordsPerChar;
    const currentTime = wordsRead / (200 * this.speechEngine.rate);
    const totalTime = totalWords / (200 * this.speechEngine.rate);

    this.elements.progressTime.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(totalTime)}`;
  }

  seekToPosition(event) {
    const text = this.elements.textInput.value;
    if (!text) return;

    const bar = this.elements.progressBar;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const charOffset = Math.floor(percent * text.length);

    const wasPlaying = this.speechEngine.state === 'PLAYING' ||
      (this.currentEngine === 'google' && this.googleTTS?.isPlaying);

    if (wasPlaying || this.speechEngine.state === 'PAUSED') {
      this.stopPlayback();
      this.savedPosition = charOffset;
      this.saveCurrentPosition();

      // Restart from new position
      this.updatePlayPauseButton('loading');
      if (this.currentEngine === 'google' && this.googleTTS?.isConfigured) {
        this.showTextDisplay();
        this.googleTTS.play(text, charOffset).then(() => {
          this.updatePlayPauseButton('pause');
        }).catch(() => {
          this.updatePlayPauseButton('play');
        });
      } else {
        this.speechEngine.play(text, charOffset);
        this.showTextDisplay();
        this.startProgressTracking();
      }
    } else {
      // Not playing - just update saved position and show in progress bar
      this.savedPosition = charOffset;
      this.saveCurrentPosition();
      this.elements.progressFill.style.width = `${percent * 100}%`;
      this.elements.progressPercent.textContent = `${Math.round(percent * 100)}%`;
      this.checkResumeBanner();
    }
  }

  skipForward() {
    this.skipByChars(500);
  }

  skipBack() {
    this.skipByChars(-500);
  }

  skipByChars(chars) {
    const text = this.elements.textInput.value;
    if (!text) return;

    const currentPos = this.speechEngine.getCurrentPosition();
    const newPos = Math.max(0, Math.min(text.length - 1, currentPos + chars));

    if (this.speechEngine.state === 'PLAYING' || this.speechEngine.state === 'PAUSED') {
      this.speechEngine.stop();
      this.updatePlayPauseButton('loading');
      this.speechEngine.play(text, newPos);
      this.showTextDisplay();
      this.startProgressTracking();
    }
  }

  resetProgress() {
    clearInterval(this.progressInterval);
    this.elements.progressFill.style.width = '0%';
    this.elements.progressFill.setAttribute('aria-valuenow', 0);
    this.elements.progressPercent.textContent = '0%';
    this.elements.progressTime.textContent = '0:00 / 0:00';
  }

  formatTime(minutes) {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ==========================================
  // Word highlighting (performant span-based)
  // ==========================================

  handleWordBoundary(data) {
    this.savedPosition = data.charIndex;
    this.saveCurrentPosition();

    if (this.isHighlighting && this.elements.textDisplay) {
      this.highlightWordAt(data.charIndex, data.charLength);
    }
  }

  highlightWordAt(charIndex, charLength) {
    // If we have pre-built spans, use class toggling (fast path)
    if (this.wordSpans.length > 0) {
      // Find the span that contains this char index
      for (let i = 0; i < this.wordSpans.length; i++) {
        const span = this.wordSpans[i];
        const start = parseInt(span.dataset.start, 10);
        const end = parseInt(span.dataset.end, 10);
        if (charIndex >= start && charIndex < end) {
          if (this.currentHighlightIndex !== i) {
            // Remove old highlight
            if (this.currentHighlightIndex >= 0 && this.currentHighlightIndex < this.wordSpans.length) {
              this.wordSpans[this.currentHighlightIndex].classList.remove('current-word');
            }
            // Add new highlight (always highlight, even if user scrolled away)
            span.classList.add('current-word');
            this.currentHighlightIndex = i;

            // Only auto-scroll if the user hasn't manually scrolled away
            if (!this.userScrolledAway) {
              const container = this.elements.textDisplay;
              const spanRect = span.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              if (spanRect.top < containerRect.top || spanRect.bottom > containerRect.bottom) {
                this.isProgrammaticScroll = true;
                span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => { this.isProgrammaticScroll = false; }, 500);
              }
            }
          }
          return;
        }
      }
    }

    // Fallback: innerHTML rebuild (for when spans aren't built)
    const text = this.elements.textInput.value;
    if (!text) return;

    const before = this.escapeHtml(text.substring(0, charIndex));
    const word = this.escapeHtml(text.substring(charIndex, charIndex + charLength));
    const after = this.escapeHtml(text.substring(charIndex + charLength));

    this.elements.textDisplay.innerHTML = `${before}<mark class="current-word">${word}</mark>${after}`;

    // Only auto-scroll if the user hasn't manually scrolled away
    if (!this.userScrolledAway) {
      const mark = this.elements.textDisplay.querySelector('.current-word');
      if (mark) {
        const container = this.elements.textDisplay;
        const markRect = mark.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (markRect.top < containerRect.top || markRect.bottom > containerRect.bottom) {
          this.isProgrammaticScroll = true;
          mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => { this.isProgrammaticScroll = false; }, 500);
        }
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  showTextDisplay() {
    if (this.elements.textDisplay && this.elements.textInput) {
      const text = this.elements.textInput.value;
      this.buildWordSpans(text);
      this.elements.textDisplay.style.display = 'block';
      this.elements.textInput.style.display = 'none';
      this.enterListenMode();
    }
  }

  buildWordSpans(text) {
    this.wordSpans = [];
    this.currentHighlightIndex = -1;
    const container = this.elements.textDisplay;

    // Split text into tokens (words and whitespace)
    const tokens = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    let charPos = 0;

    tokens.forEach(token => {
      if (/^\s+$/.test(token)) {
        // Whitespace - render as text nodes with <br> for newlines
        const parts = token.split('\n');
        parts.forEach((part, i) => {
          if (i > 0) {
            fragment.appendChild(document.createElement('br'));
          }
          if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });
      } else if (token) {
        // Word - wrap in span with position data
        const span = document.createElement('span');
        span.textContent = token;
        span.dataset.start = charPos;
        span.dataset.end = charPos + token.length;
        fragment.appendChild(span);
        this.wordSpans.push(span);
      }
      charPos += token.length;
    });

    container.innerHTML = '';
    container.appendChild(fragment);
  }

  hideTextDisplay() {
    if (this.elements.textDisplay && this.elements.textInput) {
      this.elements.textDisplay.style.display = 'none';
      this.elements.textInput.style.display = 'block';
      this.wordSpans = [];
      this.currentHighlightIndex = -1;
    }
    // Reset scroll tracking and hide follow-along button
    this.userScrolledAway = false;
    this.hideFollowAlongBtn();
    // Exit listen mode
    if (this.elements.appContainer) {
      this.elements.appContainer.classList.remove('listen-mode');
    }
    if (this.elements.editModeBtn) {
      this.elements.editModeBtn.style.display = 'none';
    }
  }

  /**
   * Show the "Follow along" pill button when user scrolls away during playback.
   * Only visible if playback is active.
   */
  showFollowAlongBtn() {
    const isPlaying = (this.currentEngine === 'google' && this.googleTTS?.isPlaying) ||
      this.speechEngine.state === 'PLAYING';
    if (isPlaying && this.userScrolledAway && this.elements.followAlongBtn) {
      this.elements.followAlongBtn.style.display = 'block';
    }
  }

  hideFollowAlongBtn() {
    if (this.elements.followAlongBtn) {
      this.elements.followAlongBtn.style.display = 'none';
    }
  }

  saveCurrentPosition() {
    const textId = this.currentTextId || 'current';
    this.storageManager.saveLastPosition(textId, this.savedPosition);
  }

  loadSavedPosition() {
    const textId = this.currentTextId || 'current';
    return this.storageManager.getLastPosition(textId);
  }

  clearSavedPosition() {
    const textId = this.currentTextId || 'current';
    this.storageManager.saveLastPosition(textId, 0);
    this.savedPosition = 0;
  }

  // ==========================================
  // Playback event handlers
  // ==========================================

  handlePlaybackStarted() {
    this.updatePlayPauseButton('pause');
  }

  handlePlaybackEnd() {
    this.updatePlayPauseButton('play');
    this.resetProgress();
    this.hideTextDisplay();
    this.clearSavedPosition();
    this.showToast('Finished reading', 'success');
  }

  handlePlaybackError(error) {
    this.updatePlayPauseButton('play');
    this.resetProgress();
    this.hideTextDisplay();
    this.showToast('Playback error: ' + error.error, 'error');
  }

  // ==========================================
  // MP3 download
  // ==========================================

  async downloadMP3() {
    const text = this.elements.textInput.value;
    if (!text) {
      this.showToast('No text to convert', 'error');
      return;
    }

    if (!this.premiumTTS || !this.premiumTTS.isConfigured) {
      this._lastTriggerBtn = this.elements.downloadBtn;
      const apiKey = await this.showConfirm(
        'MP3 Download',
        'MP3 download uses ElevenLabs (best voice quality). Free tier: 10,000 characters/month. Get your free API key at elevenlabs.io.',
        { okText: 'Connect', showInput: true, inputPlaceholder: 'Enter ElevenLabs API key...' }
      );

      if (!apiKey) return;

      this.showLoading('Validating API key...');
      const validation = await this.premiumTTS.validateApiKey(apiKey);
      this.hideLoading();

      if (!validation.valid) {
        this.showToast('Invalid API key: ' + validation.error, 'error');
        return;
      }

      this.premiumTTS.saveApiKey(apiKey);
      const remaining = validation.charactersLimit - validation.charactersUsed;
      this.showToast(`Connected! ${remaining.toLocaleString()} chars remaining this month`, 'success');
    }

    const estimate = this.premiumTTS.estimateCost(text);
    const voiceName = this.premiumTTS.getSelectedVoiceName();
    this._lastTriggerBtn = this.elements.downloadBtn;
    const proceed = await this.showConfirm(
      'Generate MP3',
      `Voice: ${voiceName} | Characters: ${estimate.characters.toLocaleString()} | Cost: Free (10K chars/month)`,
      { okText: 'Generate', cancelText: 'Cancel' }
    );

    if (!proceed) return;

    this.showLoading('Generating MP3 audio...');

    try {
      const filename = text.substring(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.mp3';
      await this.premiumTTS.generateDownload(text, filename);
      this.hideLoading();
      this.showToast('MP3 downloaded successfully!', 'success');
    } catch (error) {
      this.hideLoading();
      this.showToast('Failed to generate MP3: ' + error.message, 'error');
    }
  }

  // ==========================================
  // Voice list
  // ==========================================

  initializeVoiceList() {
    if (!this.speechEngine.voices.length) {
      setTimeout(() => this.initializeVoiceList(), 500);
      return;
    }

    this.renderVoiceList();

    if (this.speechEngine.selectedVoice) {
      this.updateVoiceDisplay(this.speechEngine.selectedVoice);
    }
  }

  getQualityLabel(quality) {
    const labels = {
      'premium': 'Premium',
      'enhanced': 'Enhanced',
      'good': 'Good',
      'standard': 'Standard'
    };
    return labels[quality] || quality;
  }

  selectVoice(voiceURI) {
    const voice = this.speechEngine.voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      this.speechEngine.setVoice(voice);
      this.storageManager.saveSelectedVoice(voiceURI);
      this.updateVoiceDisplay(voice);
      this.renderVoiceList(this.elements.voiceSearch.value);
      this.showToast(`Selected: ${voice.name}`, 'success');
    }
  }

  previewVoice(voiceURI) {
    const voice = this.speechEngine.voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      this.speechEngine.previewVoice(voice);
    }
  }

  updateVoiceDisplay(voice) {
    this.elements.currentVoiceName.textContent = voice ? voice.name : 'Select Voice';
  }

  openVoiceModal() {
    this._lastTriggerBtn = this.elements.voiceSelectBtn;
    this.elements.voiceModal.style.display = 'flex';
    this.elements.voiceSearch.value = '';
    this.renderVoiceList();
    setTimeout(() => this.elements.voiceSearch.focus(), 50);
  }

  closeVoiceModal() {
    this.elements.voiceModal.style.display = 'none';
    if (this._lastTriggerBtn) {
      this._lastTriggerBtn.focus();
      this._lastTriggerBtn = null;
    }
  }

  filterVoices(query) {
    this.renderVoiceList(query);
  }

  openLibraryModal() {
    this._lastTriggerBtn = this.elements.libraryBtn;
    this.elements.libraryModal.style.display = 'flex';
    this.elements.librarySearch.value = '';
    this.renderLibrary();
    setTimeout(() => this.elements.librarySearch.focus(), 50);
  }

  closeLibraryModal() {
    this.elements.libraryModal.style.display = 'none';
    if (this._lastTriggerBtn) {
      this._lastTriggerBtn.focus();
      this._lastTriggerBtn = null;
    }
  }

  renderLibrary(filter = '') {
    const texts = filter
      ? this.storageManager.searchSavedTexts(filter)
      : this.storageManager.getSavedTexts();

    if (texts.length === 0) {
      this.elements.libraryList.innerHTML = `<div class="empty-state">${filter ? 'No matching texts' : 'No saved texts yet. Use the Save button to store texts here for quick access.'}</div>`;
      return;
    }

    let html = '';
    texts.sort((a, b) => b.modified - a.modified).forEach(text => {
      const preview = text.content.substring(0, 150);
      const date = new Date(text.modified).toLocaleDateString();

      html += `
        <div class="library-item">
          <div class="library-title">${text.title}</div>
          <div class="library-preview">${preview}...</div>
          <div class="library-meta">
            ${text.wordCount.toLocaleString()} words | ${date}
          </div>
          <div class="library-actions">
            <button class="library-action" data-action="load" data-id="${text.id}">Load</button>
            <button class="library-action" data-action="rename" data-id="${text.id}">Rename</button>
            <button class="library-action delete-action" data-action="delete" data-id="${text.id}">Delete</button>
          </div>
        </div>
      `;
    });

    this.elements.libraryList.innerHTML = html;

    this.elements.libraryList.querySelectorAll('.library-action').forEach(btn => {
      btn.addEventListener('click', () => {
        this.handleLibraryAction(btn.dataset.action, btn.dataset.id);
      });
    });
  }

  filterLibrary(query) {
    this.renderLibrary(query);
  }

  handleLibraryAction(action, id) {
    switch (action) {
      case 'load':
        this.loadFromLibrary(id);
        break;
      case 'rename':
        this.renameLibraryItem(id);
        break;
      case 'delete':
        this.deleteLibraryItem(id);
        break;
    }
  }

  loadFromLibrary(id) {
    const text = this.storageManager.getSavedText(id);
    if (text) {
      this.elements.textInput.value = text.content;
      this.currentTextId = id;
      this.handleTextChange();
      this.closeLibraryModal();
      this.showToast(`Loaded: ${text.title}`, 'success');
    }
  }

  async renameLibraryItem(id) {
    const text = this.storageManager.getSavedText(id);
    if (text) {
      const newTitle = await this.showConfirm('Rename', 'Enter new title:', {
        okText: 'Rename',
        showInput: true,
        inputValue: text.title
      });
      if (newTitle) {
        this.storageManager.updateSavedText(id, { title: newTitle });
        this.renderLibrary(this.elements.librarySearch.value);
        this.showToast('Renamed successfully', 'success');
      }
    }
  }

  async deleteLibraryItem(id) {
    const confirmed = await this.showConfirm('Delete Text', 'Delete this saved text?', {
      okText: 'Delete',
      cancelText: 'Keep'
    });
    if (confirmed) {
      if (this.storageManager.deleteSavedText(id)) {
        this.renderLibrary(this.elements.librarySearch.value);
        this.showToast('Deleted successfully', 'success');

        if (this.currentTextId === id) {
          this.currentTextId = null;
        }
      }
    }
  }

  // ==========================================
  // Keyboard shortcuts
  // ==========================================

  handleKeyboardShortcuts(event) {
    if (event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT') {
      return;
    }

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'Escape':
        this.stopPlayback();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.skipBack();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.skipForward();
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.updateSpeed(Math.min(2.5, parseFloat(this.elements.speedSlider.value) + 0.1));
        break;
      case '-':
        event.preventDefault();
        this.updateSpeed(Math.max(0.5, parseFloat(this.elements.speedSlider.value) - 0.1));
        break;
    }
  }

  // ==========================================
  // Loading and toasts
  // ==========================================

  showLoading(message = 'Loading...') {
    this.elements.loadingMessage.textContent = message;
    this.elements.loadingIndicator.style.display = 'block';
  }

  hideLoading() {
    this.elements.loadingIndicator.style.display = 'none';
  }

  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          this.elements.toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // ==========================================
  // Settings Modal Methods
  // ==========================================

  openSettingsModal() {
    this._lastTriggerBtn = this.elements.settingsBtn;
    this.elements.settingsModal.style.display = 'flex';
    this.updateEngineUI();
    setTimeout(() => {
      const firstBtn = this.elements.settingsModal.querySelector('.engine-btn');
      if (firstBtn) firstBtn.focus();
    }, 50);
  }

  closeSettingsModal() {
    this.elements.settingsModal.style.display = 'none';
    if (this._lastTriggerBtn) {
      this._lastTriggerBtn.focus();
      this._lastTriggerBtn = null;
    }
  }

  setEngine(engine) {
    this.currentEngine = engine;
    localStorage.setItem('tts_engine', engine);
    this.updateEngineUI();

    this.stopPlayback();

    if (engine === 'google') {
      if (this.googleTTS?.isConfigured) {
        this.loadGoogleVoices();
        if (this.googleTTS.selectedVoice) {
          this.updateVoiceDisplay({ name: this.googleTTS.selectedVoice.displayName });
        }
      }
    } else {
      this.renderVoiceList();
      if (this.speechEngine.selectedVoice) {
        this.updateVoiceDisplay(this.speechEngine.selectedVoice);
      }
    }

    this.showToast(`Switched to ${engine === 'google' ? 'premium' : 'offline'} voices`, 'success');
  }

  updateEngineUI() {
    if (this.elements.engineBrowser && this.elements.engineGoogle) {
      this.elements.engineBrowser.classList.toggle('active', this.currentEngine === 'browser');
      this.elements.engineGoogle.classList.toggle('active', this.currentEngine === 'google');
    }
  }

  async loadGoogleVoices() {
    if (!this.googleTTS?.isConfigured) return;

    this.showLoading('Loading Google voices...');

    try {
      await this.googleTTS.fetchVoices();
      this.renderVoiceList();
      this.hideLoading();
    } catch (error) {
      this.hideLoading();
      this.showToast('Failed to load Google voices: ' + error.message, 'error');
    }
  }

  // ==========================================
  // Playback methods (both engines)
  // ==========================================

  startPlayback() {
    const text = this.elements.textInput.value;
    if (!text) {
      this.showToast('No text to read', 'error');
      return;
    }

    // Hide resume banner if visible
    this.elements.resumeBanner.style.display = 'none';

    // Reset scroll tracking for fresh playback
    this.userScrolledAway = false;
    this.hideFollowAlongBtn();

    this.updatePlayPauseButton('loading');

    if (this.currentEngine === 'google' && this.googleTTS?.isConfigured) {
      this.startGooglePlayback(text, 0);
    } else {
      this.speechEngine.play(text);
      this.showTextDisplay();
      this.startProgressTracking();
    }
  }

  async startGooglePlayback(text, savedPos = 0) {
    this.showTextDisplay();

    try {
      // Check if we have a prefetched first chunk that matches the current text
      if (savedPos === 0 && this.prefetchedAudio && this.prefetchedAudio.text === text) {
        await this.googleTTS.playWithPrefetch(text, this.prefetchedAudio.audioUrl);
        // Clear the prefetch reference (don't revoke URL - googleTTS owns it now)
        this.prefetchedAudio = null;
      } else {
        // Clear stale prefetch if any
        this.clearPrefetch();
        await this.googleTTS.play(text, savedPos);
      }
      this.updatePlayPauseButton('pause');
    } catch (error) {
      this.fallbackToBrowserVoices('Premium unavailable, using offline voices');
      this.hideTextDisplay();
      this.updatePlayPauseButton('play');

      if (this.speechEngine) {
        this.showTextDisplay();
        this.updatePlayPauseButton('loading');
        this.speechEngine.play(text, savedPos > 0 ? savedPos : 0);
        this.startProgressTracking();
      }
    }
  }

  pausePlayback() {
    if (this.currentEngine === 'google' && this.googleTTS) {
      this.googleTTS.pause();
    } else {
      this.speechEngine.pause();
    }
    this.updatePlayPauseButton('play');
  }

  resumePlayback() {
    if (this.currentEngine === 'google' && this.googleTTS) {
      this.googleTTS.resume();
    } else {
      this.speechEngine.resume();
    }
    this.updatePlayPauseButton('pause');
  }

  stopPlayback() {
    if (this.currentEngine === 'google' && this.googleTTS) {
      this.googleTTS.stop();
    } else {
      this.speechEngine.stop();
    }
    this.updatePlayPauseButton('play');
    this.resetProgress();
    this.hideTextDisplay();
    this.checkResumeBanner();

    // Reset scroll tracking
    this.userScrolledAway = false;
    this.hideFollowAlongBtn();
  }

  togglePlayPause() {
    if (this.speechEngine.isLoading) return;

    if (this.currentEngine === 'google' && this.googleTTS) {
      if (!this.googleTTS.isPlaying && !this.googleTTS.isPaused) {
        this.startPlayback();
      } else if (this.googleTTS.isPlaying && !this.googleTTS.isPaused) {
        this.pausePlayback();
      } else if (this.googleTTS.isPaused) {
        this.resumePlayback();
      }
    } else {
      if (this.speechEngine.state === 'IDLE') {
        this.startPlayback();
      } else if (this.speechEngine.state === 'PLAYING') {
        this.pausePlayback();
      } else if (this.speechEngine.state === 'PAUSED') {
        this.resumePlayback();
      }
    }
  }

  // ==========================================
  // Voice list rendering
  // ==========================================

  renderVoiceList(filter = '') {
    let voices;
    let isGoogleEngine = this.currentEngine === 'google' && this.googleTTS?.isConfigured;

    if (isGoogleEngine && this.googleTTS.voicesLoaded) {
      voices = this.googleTTS.getTopVoices(12);

      if (filter) {
        voices = voices.filter(voice =>
          voice.displayName.toLowerCase().includes(filter.toLowerCase()) ||
          voice.name.toLowerCase().includes(filter.toLowerCase())
        );
      }

      this.renderGoogleVoiceList(voices, filter);
    } else {
      if (filter) {
        const topVoices = this.speechEngine.getTopVoices(8);
        voices = topVoices.filter(voice =>
          voice.name.toLowerCase().includes(filter.toLowerCase()) ||
          voice.lang.toLowerCase().includes(filter.toLowerCase())
        );
      } else {
        voices = this.speechEngine.getTopVoices(8);
      }

      this.renderBrowserVoiceList(voices, filter);
    }
  }

  renderBrowserVoiceList(voices, filter) {
    let html = '';

    const voiceCountText = filter
      ? `${voices.length} matching`
      : 'Select a voice';

    html += `
      <div class="voice-list-header">
        <span class="voice-count">${voiceCountText}</span>
      </div>
    `;

    voices.forEach(voice => {
      const quality = this.speechEngine.getVoiceQuality(voice);
      const isSelected = voice.voiceURI === this.speechEngine.selectedVoice?.voiceURI;
      const displayName = this.speechEngine.getDisplayName(voice);
      const qualityLabel = this.getQualityLabel(quality);

      html += `
        <div class="voice-item ${isSelected ? 'selected' : ''}" data-voice-uri="${voice.voiceURI}">
          <div class="voice-info">
            <div class="voice-name">${displayName}</div>
            <div class="voice-meta">
              <span class="voice-lang">${voice.lang}</span>
              <span class="voice-quality ${quality}">${qualityLabel}</span>
            </div>
          </div>
          <button class="voice-preview" data-voice-uri="${voice.voiceURI}" title="Preview voice" aria-label="Preview ${displayName}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      `;
    });

    if (voices.length === 0) {
      html += `
        <div class="voice-empty">
          ${filter ? 'No voices match your search' : 'No voices available'}
        </div>
      `;
    }

    this.elements.voiceList.innerHTML = html;
    this.attachBrowserVoiceListeners();
  }

  renderGoogleVoiceList(voices, filter) {
    let html = '';

    const voiceCountText = filter
      ? `${voices.length} matching`
      : `${voices.length} premium voices`;

    html += `
      <div class="voice-list-header">
        <span class="voice-count">${voiceCountText}</span>
        <span class="voice-source premium">Premium</span>
      </div>
    `;

    const voicesByRegion = {};
    voices.forEach(voice => {
      const lang = voice.languageCodes?.[0] || 'en-US';
      const region = lang.split('-')[1] || 'US';
      if (!voicesByRegion[region]) {
        voicesByRegion[region] = [];
      }
      voicesByRegion[region].push(voice);
    });

    const regionOrder = ['US', 'GB', 'AU', 'IN'];
    const renderVoice = (voice) => {
      const isSelected = this.googleTTS.selectedVoice?.name === voice.name;
      return `
        <div class="voice-item ${isSelected ? 'selected' : ''}" data-google-voice="${voice.name}">
          <div class="voice-info">
            <div class="voice-name">${voice.displayName}</div>
          </div>
          <button class="voice-preview" data-google-voice="${voice.name}" title="Preview voice" aria-label="Preview ${voice.displayName}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
      `;
    };

    regionOrder.forEach(region => {
      if (voicesByRegion[region]) {
        voicesByRegion[region].forEach(v => { html += renderVoice(v); });
      }
    });

    Object.keys(voicesByRegion).forEach(region => {
      if (!regionOrder.includes(region)) {
        voicesByRegion[region].forEach(v => { html += renderVoice(v); });
      }
    });

    if (voices.length === 0) {
      html += `
        <div class="voice-empty">
          ${filter ? 'No voices match your search' : 'Loading premium voices...'}
        </div>
      `;
    }

    this.elements.voiceList.innerHTML = html;
    this.attachGoogleVoiceListeners();
  }

  attachBrowserVoiceListeners() {
    this.elements.voiceList.querySelectorAll('.voice-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.voice-preview')) {
          this.selectVoice(item.dataset.voiceUri);
        }
      });
    });

    this.elements.voiceList.querySelectorAll('.voice-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.previewVoice(btn.dataset.voiceUri);
      });
    });
  }

  attachGoogleVoiceListeners() {
    this.elements.voiceList.querySelectorAll('.voice-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.voice-preview')) {
          this.selectGoogleVoice(item.dataset.googleVoice);
        }
      });
    });

    this.elements.voiceList.querySelectorAll('.voice-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.previewGoogleVoice(btn.dataset.googleVoice);
      });
    });
  }

  selectGoogleVoice(voiceName) {
    const voice = this.googleTTS.voices.find(v => v.name === voiceName);
    if (voice) {
      this.googleTTS.setVoice(voice);
      this.updateVoiceDisplay({ name: voice.displayName });
      this.renderVoiceList(this.elements.voiceSearch.value);
      this.showToast(`Selected: ${voice.displayName}`, 'success');
    }
  }

  async previewGoogleVoice(voiceName) {
    const voice = this.googleTTS.voices.find(v => v.name === voiceName);
    if (voice) {
      try {
        await this.googleTTS.previewVoice(voice);
      } catch (error) {
        this.showToast('Preview failed: ' + error.message, 'error');
      }
    }
  }
}

window.UIController = UIController;
