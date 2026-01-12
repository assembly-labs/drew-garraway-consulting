// Storage Manager Module
class StorageManager {
  constructor() {
    this.STORAGE_KEYS = {
      CURRENT_TEXT: 'tts_current_text',
      SAVED_TEXTS: 'tts_saved_texts',
      SETTINGS: 'tts_settings',
      SELECTED_VOICE: 'tts_selected_voice',
      PLAYBACK_SPEED: 'tts_playback_speed',
      LAST_POSITION: 'tts_last_position'
    };

    this.MAX_SAVED_TEXTS = 50;
    this.MAX_TEXT_LENGTH = 200000;
    this.STORAGE_WARNING_THRESHOLD = 0.8; // Warn at 80% capacity
  }

  // Check if localStorage is available
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Get current text
  getCurrentText() {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.CURRENT_TEXT) || '';
    } catch (e) {
      console.error('Failed to get current text:', e);
      return '';
    }
  }

  // Save current text
  saveCurrentText(text) {
    try {
      if (text.length > this.MAX_TEXT_LENGTH) {
        throw new Error(`Text exceeds maximum length of ${this.MAX_TEXT_LENGTH} characters`);
      }
      localStorage.setItem(this.STORAGE_KEYS.CURRENT_TEXT, text);
      return true;
    } catch (e) {
      console.error('Failed to save current text:', e);
      return false;
    }
  }

  // Clear current text
  clearCurrentText() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.CURRENT_TEXT);
      return true;
    } catch (e) {
      console.error('Failed to clear current text:', e);
      return false;
    }
  }

  // Get all saved texts
  getSavedTexts() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.SAVED_TEXTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to get saved texts:', e);
      return [];
    }
  }

  // Save a text to library
  saveToLibrary(title, content) {
    try {
      const savedTexts = this.getSavedTexts();

      // Check if we've hit the limit
      if (savedTexts.length >= this.MAX_SAVED_TEXTS) {
        // Remove the oldest (LRU - least recently used)
        savedTexts.sort((a, b) => a.lastAccessed - b.lastAccessed);
        savedTexts.shift();
      }

      // Generate ID
      const id = this.generateId();

      // Auto-generate title if not provided
      if (!title) {
        title = content.substring(0, 50).trim();
        if (content.length > 50) title += '...';
      }

      // Create new entry
      const entry = {
        id,
        title,
        content: content.substring(0, this.MAX_TEXT_LENGTH),
        created: Date.now(),
        modified: Date.now(),
        lastAccessed: Date.now(),
        charCount: content.length,
        wordCount: this.countWords(content)
      };

      savedTexts.push(entry);
      localStorage.setItem(this.STORAGE_KEYS.SAVED_TEXTS, JSON.stringify(savedTexts));

      // Check storage usage
      this.checkStorageUsage();

      return entry;
    } catch (e) {
      console.error('Failed to save to library:', e);
      return null;
    }
  }

  // Update a saved text
  updateSavedText(id, updates) {
    try {
      const savedTexts = this.getSavedTexts();
      const index = savedTexts.findIndex(text => text.id === id);

      if (index === -1) {
        throw new Error('Text not found');
      }

      savedTexts[index] = {
        ...savedTexts[index],
        ...updates,
        modified: Date.now()
      };

      if (updates.content) {
        savedTexts[index].charCount = updates.content.length;
        savedTexts[index].wordCount = this.countWords(updates.content);
      }

      localStorage.setItem(this.STORAGE_KEYS.SAVED_TEXTS, JSON.stringify(savedTexts));
      return savedTexts[index];
    } catch (e) {
      console.error('Failed to update saved text:', e);
      return null;
    }
  }

  // Delete a saved text
  deleteSavedText(id) {
    try {
      const savedTexts = this.getSavedTexts();
      const filtered = savedTexts.filter(text => text.id !== id);
      localStorage.setItem(this.STORAGE_KEYS.SAVED_TEXTS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete saved text:', e);
      return false;
    }
  }

  // Get a specific saved text
  getSavedText(id) {
    try {
      const savedTexts = this.getSavedTexts();
      const text = savedTexts.find(t => t.id === id);

      if (text) {
        // Update last accessed time
        text.lastAccessed = Date.now();
        this.updateSavedText(id, { lastAccessed: Date.now() });
      }

      return text;
    } catch (e) {
      console.error('Failed to get saved text:', e);
      return null;
    }
  }

  // Search saved texts
  searchSavedTexts(query) {
    try {
      const savedTexts = this.getSavedTexts();
      const lowercaseQuery = query.toLowerCase();

      return savedTexts.filter(text =>
        text.title.toLowerCase().includes(lowercaseQuery) ||
        text.content.toLowerCase().includes(lowercaseQuery)
      );
    } catch (e) {
      console.error('Failed to search saved texts:', e);
      return [];
    }
  }

  // Settings management
  getSettings() {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (e) {
      console.error('Failed to get settings:', e);
      return this.getDefaultSettings();
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  }

  getDefaultSettings() {
    return {
      theme: 'dark',
      autoSave: true,
      autoSaveInterval: 3000,
      highlightWord: true,
      autoScroll: true,
      fontSize: 16,
      fontFamily: 'default'
    };
  }

  // Voice selection persistence
  saveSelectedVoice(voiceURI) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SELECTED_VOICE, voiceURI);
      return true;
    } catch (e) {
      console.error('Failed to save selected voice:', e);
      return false;
    }
  }

  getSelectedVoice() {
    try {
      return localStorage.getItem(this.STORAGE_KEYS.SELECTED_VOICE) || null;
    } catch (e) {
      console.error('Failed to get selected voice:', e);
      return null;
    }
  }

  // Playback speed persistence
  savePlaybackSpeed(speed) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.PLAYBACK_SPEED, speed.toString());
      return true;
    } catch (e) {
      console.error('Failed to save playback speed:', e);
      return false;
    }
  }

  getPlaybackSpeed() {
    try {
      const speed = localStorage.getItem(this.STORAGE_KEYS.PLAYBACK_SPEED);
      return speed ? parseFloat(speed) : 1.0;
    } catch (e) {
      console.error('Failed to get playback speed:', e);
      return 1.0;
    }
  }

  // Position tracking
  saveLastPosition(textId, position) {
    try {
      const positions = this.getLastPositions();
      positions[textId] = position;
      localStorage.setItem(this.STORAGE_KEYS.LAST_POSITION, JSON.stringify(positions));
      return true;
    } catch (e) {
      console.error('Failed to save last position:', e);
      return false;
    }
  }

  getLastPosition(textId) {
    try {
      const positions = this.getLastPositions();
      return positions[textId] || 0;
    } catch (e) {
      console.error('Failed to get last position:', e);
      return 0;
    }
  }

  getLastPositions() {
    try {
      const positions = localStorage.getItem(this.STORAGE_KEYS.LAST_POSITION);
      return positions ? JSON.parse(positions) : {};
    } catch (e) {
      return {};
    }
  }

  // Storage management utilities
  getStorageUsage() {
    try {
      let totalSize = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      // Approximate size in MB (characters * 2 bytes for Unicode)
      return (totalSize * 2) / (1024 * 1024);
    } catch (e) {
      console.error('Failed to calculate storage usage:', e);
      return 0;
    }
  }

  checkStorageUsage() {
    const usage = this.getStorageUsage();
    const estimatedMax = 5; // 5MB typical localStorage limit
    const usagePercent = usage / estimatedMax;

    if (usagePercent > this.STORAGE_WARNING_THRESHOLD) {
      return {
        warning: true,
        usage: usage.toFixed(2),
        percent: (usagePercent * 100).toFixed(0),
        message: `Storage is ${(usagePercent * 100).toFixed(0)}% full. Consider removing old texts.`
      };
    }

    return {
      warning: false,
      usage: usage.toFixed(2),
      percent: (usagePercent * 100).toFixed(0)
    };
  }

  clearAllData() {
    try {
      // Clear only our app's data
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Failed to clear all data:', e);
      return false;
    }
  }

  // Utility functions
  generateId() {
    return `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  exportData() {
    try {
      const data = {
        version: '1.0',
        exported: new Date().toISOString(),
        savedTexts: this.getSavedTexts(),
        settings: this.getSettings(),
        currentText: this.getCurrentText()
      };
      return JSON.stringify(data, null, 2);
    } catch (e) {
      console.error('Failed to export data:', e);
      return null;
    }
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);

      if (data.savedTexts) {
        localStorage.setItem(this.STORAGE_KEYS.SAVED_TEXTS, JSON.stringify(data.savedTexts));
      }
      if (data.settings) {
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      if (data.currentText) {
        localStorage.setItem(this.STORAGE_KEYS.CURRENT_TEXT, data.currentText);
      }

      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }
}

// Export for use in other modules
window.StorageManager = StorageManager;