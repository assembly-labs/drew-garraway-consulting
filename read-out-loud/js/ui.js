// UI Module - Handles all user interface interactions
class UIController {
  constructor(speechEngine, storageManager, fileImporter) {
    this.speechEngine = speechEngine;
    this.storageManager = storageManager;
    this.fileImporter = fileImporter;

    // UI Elements
    this.elements = {};
    this.autoSaveTimer = null;
    this.isHighlighting = false;
    this.currentTextId = null;
  }

  initialize() {
    this.cacheElements();
    this.attachEventListeners();
    this.loadSavedState();
    this.initializeVoiceList();
  }

  cacheElements() {
    // Text area
    this.elements.textInput = document.getElementById('textInput');

    // Action buttons
    this.elements.pasteBtn = document.getElementById('pasteBtn');
    this.elements.importBtn = document.getElementById('importBtn');
    this.elements.saveBtn = document.getElementById('saveBtn');
    this.elements.clearBtn = document.getElementById('clearBtn');
    this.elements.fileInput = document.getElementById('fileInput');

    // Playback controls
    this.elements.playPauseBtn = document.getElementById('playPauseBtn');
    this.elements.playIcon = document.getElementById('playIcon');
    this.elements.pauseIcon = document.getElementById('pauseIcon');
    this.elements.stopBtn = document.getElementById('stopBtn');

    // Speed controls
    this.elements.speedSlider = document.getElementById('speedSlider');
    this.elements.speedValue = document.getElementById('speedValue');
    this.elements.speedPresets = document.querySelectorAll('.speed-preset');

    // Voice selection
    this.elements.voiceSelectBtn = document.getElementById('voiceSelectBtn');
    this.elements.currentVoiceName = document.getElementById('currentVoiceName');
    this.elements.voiceModal = document.getElementById('voiceModal');
    this.elements.voiceSearch = document.getElementById('voiceSearch');
    this.elements.voiceList = document.getElementById('voiceList');
    this.elements.closeVoiceModal = document.getElementById('closeVoiceModal');

    // Progress
    this.elements.progressFill = document.getElementById('progressFill');
    this.elements.progressPercent = document.getElementById('progressPercent');
    this.elements.progressTime = document.getElementById('progressTime');

    // Text stats
    this.elements.charCount = document.getElementById('charCount');
    this.elements.wordCount = document.getElementById('wordCount');
    this.elements.readingTime = document.getElementById('readingTime');

    // Library
    this.elements.libraryBtn = document.getElementById('libraryBtn');
    this.elements.libraryModal = document.getElementById('libraryModal');
    this.elements.librarySearch = document.getElementById('librarySearch');
    this.elements.libraryList = document.getElementById('libraryList');
    this.elements.closeLibraryModal = document.getElementById('closeLibraryModal');

    // Loading and toast
    this.elements.loadingIndicator = document.getElementById('loadingIndicator');
    this.elements.loadingMessage = document.getElementById('loadingMessage');
    this.elements.toastContainer = document.getElementById('toastContainer');
  }

  attachEventListeners() {
    // Text input
    if (this.elements.textInput) {
      this.elements.textInput.addEventListener('input', () => this.handleTextChange());
    }

    // Action buttons
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
    if (this.elements.fileInput) {
      this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    // Playback controls
    if (this.elements.playPauseBtn) {
      this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    }
    if (this.elements.stopBtn) {
      this.elements.stopBtn.addEventListener('click', () => this.stopPlayback());
    }

    // Speed controls
    if (this.elements.speedSlider) {
      this.elements.speedSlider.addEventListener('input', (e) => this.updateSpeed(e.target.value));
    }
    if (this.elements.speedPresets) {
      this.elements.speedPresets.forEach(btn => {
        btn.addEventListener('click', () => this.updateSpeed(btn.dataset.speed));
      });
    }

    // Voice selection
    if (this.elements.voiceSelectBtn) {
      this.elements.voiceSelectBtn.addEventListener('click', () => this.openVoiceModal());
    }
    if (this.elements.closeVoiceModal) {
      this.elements.closeVoiceModal.addEventListener('click', () => this.closeVoiceModal());
    }
    if (this.elements.voiceSearch) {
      this.elements.voiceSearch.addEventListener('input', (e) => this.filterVoices(e.target.value));
    }

    // Library
    if (this.elements.libraryBtn) {
      this.elements.libraryBtn.addEventListener('click', () => this.openLibraryModal());
    }
    if (this.elements.closeLibraryModal) {
      this.elements.closeLibraryModal.addEventListener('click', () => this.closeLibraryModal());
    }
    if (this.elements.librarySearch) {
      this.elements.librarySearch.addEventListener('input', (e) => this.filterLibrary(e.target.value));
    }

    // Speech engine callbacks
    this.speechEngine.boundaryCallback = (data) => this.handleWordBoundary(data);
    this.speechEngine.endCallback = () => this.handlePlaybackEnd();
    this.speechEngine.errorCallback = (error) => this.handlePlaybackError(error);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // Modal close on outside click
    if (this.elements.voiceModal) {
      this.elements.voiceModal.addEventListener('click', (e) => {
        if (e.target === this.elements.voiceModal) this.closeVoiceModal();
      });
    }
    if (this.elements.libraryModal) {
      this.elements.libraryModal.addEventListener('click', (e) => {
        if (e.target === this.elements.libraryModal) this.closeLibraryModal();
      });
    }
  }

  loadSavedState() {
    // Load saved text
    const savedText = this.storageManager.getCurrentText();
    if (savedText) {
      this.elements.textInput.value = savedText;
      this.updateTextStats();
    }

    // Load saved speed
    const savedSpeed = this.storageManager.getPlaybackSpeed();
    this.elements.speedSlider.value = savedSpeed;
    this.updateSpeed(savedSpeed);

    // Load saved voice
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
  }

  updateTextStats() {
    const text = this.elements.textInput.value;
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / (200 * this.speechEngine.rate)); // Assume 200 WPM base rate

    this.elements.charCount.textContent = `${charCount.toLocaleString()} characters`;
    this.elements.wordCount.textContent = `${wordCount.toLocaleString()} words`;
    this.elements.readingTime.textContent = `~${readingTime} min`;

    // Warn if approaching character limit
    if (charCount > 150000) {
      this.elements.charCount.style.color = 'var(--warning-color)';
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
        // Show subtle save indicator
        this.showToast('Auto-saved', 'success', 1000);
      }
    }, 3000);
  }

  async pasteText() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        this.elements.textInput.value = text;
        this.handleTextChange();
        this.showToast('Text pasted', 'success');

        // Vibration feedback on iOS
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
      // Reset file input
      this.elements.fileInput.value = '';
    }
  }

  saveToLibrary() {
    const text = this.elements.textInput.value;
    if (!text) {
      this.showToast('No text to save', 'error');
      return;
    }

    const title = prompt('Enter a title for this text:');
    if (title !== null) {
      const entry = this.storageManager.saveToLibrary(title || 'Untitled', text);
      if (entry) {
        this.currentTextId = entry.id;
        this.showToast('Saved to library', 'success');

        // Check storage usage
        const storageStatus = this.storageManager.checkStorageUsage();
        if (storageStatus.warning) {
          this.showToast(storageStatus.message, 'warning', 5000);
        }
      } else {
        this.showToast('Failed to save to library', 'error');
      }
    }
  }

  clearText() {
    if (this.elements.textInput.value && !confirm('Clear all text? This cannot be undone.')) {
      return;
    }

    this.stopPlayback();
    this.elements.textInput.value = '';
    this.currentTextId = null;
    this.handleTextChange();
    this.storageManager.clearCurrentText();
    this.showToast('Text cleared', 'success');
  }

  togglePlayPause() {
    if (this.speechEngine.state === 'IDLE') {
      this.startPlayback();
    } else if (this.speechEngine.state === 'PLAYING') {
      this.pausePlayback();
    } else if (this.speechEngine.state === 'PAUSED') {
      this.resumePlayback();
    }
  }

  startPlayback() {
    const text = this.elements.textInput.value;
    if (!text) {
      this.showToast('No text to read', 'error');
      return;
    }

    this.speechEngine.play(text);
    this.updatePlayPauseButton(true);
    this.startProgressTracking();
  }

  pausePlayback() {
    this.speechEngine.pause();
    this.updatePlayPauseButton(false);
  }

  resumePlayback() {
    this.speechEngine.resume();
    this.updatePlayPauseButton(true);
  }

  stopPlayback() {
    this.speechEngine.stop();
    this.updatePlayPauseButton(false);
    this.resetProgress();
  }

  updatePlayPauseButton(isPlaying) {
    if (isPlaying) {
      this.elements.playIcon.style.display = 'none';
      this.elements.pauseIcon.style.display = 'block';
    } else {
      this.elements.playIcon.style.display = 'block';
      this.elements.pauseIcon.style.display = 'none';
    }
  }

  updateSpeed(speed) {
    const speedValue = parseFloat(speed);
    this.speechEngine.setRate(speedValue);
    this.storageManager.savePlaybackSpeed(speedValue);
    this.elements.speedSlider.value = speedValue;
    this.elements.speedValue.textContent = `${speedValue}x`;
    this.updateTextStats(); // Update reading time estimate
  }

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
    this.elements.progressPercent.textContent = `${Math.round(progress)}%`;

    // Calculate time
    const wordsPerChar = 0.2; // Approximate
    const wordsRead = currentPos * wordsPerChar;
    const totalWords = totalLength * wordsPerChar;
    const currentTime = wordsRead / (200 * this.speechEngine.rate);
    const totalTime = totalWords / (200 * this.speechEngine.rate);

    this.elements.progressTime.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(totalTime)}`;
  }

  resetProgress() {
    clearInterval(this.progressInterval);
    this.elements.progressFill.style.width = '0%';
    this.elements.progressPercent.textContent = '0%';
    this.elements.progressTime.textContent = '0:00 / 0:00';
  }

  formatTime(minutes) {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  handleWordBoundary(data) {
    // Future: Implement word highlighting
    if (this.isHighlighting) {
      // Update highlighted word in text display
    }
  }

  handlePlaybackEnd() {
    this.updatePlayPauseButton(false);
    this.resetProgress();
    this.showToast('Finished reading', 'success');
  }

  handlePlaybackError(error) {
    this.updatePlayPauseButton(false);
    this.resetProgress();
    this.showToast('Playback error: ' + error.error, 'error');
  }

  initializeVoiceList() {
    if (!this.speechEngine.voices.length) {
      setTimeout(() => this.initializeVoiceList(), 500);
      return;
    }

    this.renderVoiceList();

    // Set initial voice display
    if (this.speechEngine.selectedVoice) {
      this.updateVoiceDisplay(this.speechEngine.selectedVoice);
    }
  }

  renderVoiceList(filter = '') {
    const voices = filter
      ? this.speechEngine.voices.filter(voice =>
          voice.name.toLowerCase().includes(filter.toLowerCase()) ||
          voice.lang.toLowerCase().includes(filter.toLowerCase())
        )
      : this.speechEngine.voices;

    // Group voices by language
    const grouped = {};
    voices.forEach(voice => {
      const lang = voice.lang;
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(voice);
    });

    // Render grouped voices
    let html = '';
    Object.keys(grouped).sort().forEach(lang => {
      html += `<div class="voice-group">`;
      html += `<div class="voice-group-header">${lang}</div>`;

      grouped[lang].forEach(voice => {
        const quality = this.speechEngine.getVoiceQuality(voice);
        const isSelected = voice === this.speechEngine.selectedVoice;

        html += `
          <div class="voice-item ${isSelected ? 'selected' : ''}" data-voice-uri="${voice.voiceURI}">
            <div class="voice-name">
              ${voice.name}
              <span class="voice-quality ${quality}">${quality}</span>
            </div>
            <div class="voice-lang">${voice.lang}</div>
            <button class="voice-preview" data-voice-uri="${voice.voiceURI}">Preview</button>
          </div>
        `;
      });

      html += `</div>`;
    });

    this.elements.voiceList.innerHTML = html;

    // Attach event listeners to voice items
    this.elements.voiceList.querySelectorAll('.voice-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('voice-preview')) {
          this.selectVoice(item.dataset.voiceUri);
        }
      });
    });

    // Attach preview button listeners
    this.elements.voiceList.querySelectorAll('.voice-preview').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.previewVoice(btn.dataset.voiceUri);
      });
    });
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
    this.elements.voiceModal.style.display = 'flex';
    this.elements.voiceSearch.value = '';
    this.renderVoiceList();
  }

  closeVoiceModal() {
    this.elements.voiceModal.style.display = 'none';
  }

  filterVoices(query) {
    this.renderVoiceList(query);
  }

  openLibraryModal() {
    this.elements.libraryModal.style.display = 'flex';
    this.elements.librarySearch.value = '';
    this.renderLibrary();
  }

  closeLibraryModal() {
    this.elements.libraryModal.style.display = 'none';
  }

  renderLibrary(filter = '') {
    const texts = filter
      ? this.storageManager.searchSavedTexts(filter)
      : this.storageManager.getSavedTexts();

    if (texts.length === 0) {
      this.elements.libraryList.innerHTML = '<div class="empty-state">No saved texts</div>';
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
            ${text.wordCount.toLocaleString()} words • ${date}
          </div>
          <div class="library-actions">
            <button class="library-action" data-action="load" data-id="${text.id}">Load</button>
            <button class="library-action" data-action="rename" data-id="${text.id}">Rename</button>
            <button class="library-action" data-action="delete" data-id="${text.id}">Delete</button>
          </div>
        </div>
      `;
    });

    this.elements.libraryList.innerHTML = html;

    // Attach event listeners
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

  renameLibraryItem(id) {
    const text = this.storageManager.getSavedText(id);
    if (text) {
      const newTitle = prompt('Enter new title:', text.title);
      if (newTitle) {
        this.storageManager.updateSavedText(id, { title: newTitle });
        this.renderLibrary(this.elements.librarySearch.value);
        this.showToast('Renamed successfully', 'success');
      }
    }
  }

  deleteLibraryItem(id) {
    if (confirm('Delete this saved text?')) {
      if (this.storageManager.deleteSavedText(id)) {
        this.renderLibrary(this.elements.librarySearch.value);
        this.showToast('Deleted successfully', 'success');

        if (this.currentTextId === id) {
          this.currentTextId = null;
        }
      }
    }
  }

  openSettings() {
    // Future: Implement settings modal
    this.showToast('Settings coming soon', 'info');
  }

  handleKeyboardShortcuts(event) {
    // Skip if user is typing in an input field
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
    }
  }

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
        this.elements.toastContainer.removeChild(toast);
      }, 300);
    }, duration);
  }
}

// Export for use in other modules
window.UIController = UIController;