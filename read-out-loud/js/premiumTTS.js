// Premium TTS Module - OpenAI TTS Integration
// Enables MP3 download and background audio playback on iOS

class PremiumTTS {
  constructor() {
    this.apiKey = null;
    this.baseUrl = 'https://api.openai.com/v1/audio/speech';
    this.isConfigured = false;

    // Available OpenAI voices
    this.voices = [
      { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
      { id: 'echo', name: 'Echo', description: 'Warm and engaging' },
      { id: 'fable', name: 'Fable', description: 'Expressive and dynamic' },
      { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
      { id: 'nova', name: 'Nova', description: 'Friendly and upbeat' },
      { id: 'shimmer', name: 'Shimmer', description: 'Clear and pleasant' }
    ];

    this.selectedVoice = 'nova';
    this.model = 'tts-1'; // or 'tts-1-hd' for higher quality

    // Audio playback
    this.audioElement = null;
    this.audioBlob = null;
    this.isPlaying = false;

    // Callbacks
    this.onProgress = null;
    this.onEnd = null;
    this.onError = null;

    // Load saved API key
    this.loadApiKey();
  }

  loadApiKey() {
    try {
      const key = localStorage.getItem('premium_tts_api_key');
      if (key) {
        this.apiKey = key;
        this.isConfigured = true;
      }
    } catch (e) {
      console.warn('Could not load API key from storage');
    }
  }

  saveApiKey(key) {
    try {
      localStorage.setItem('premium_tts_api_key', key);
      this.apiKey = key;
      this.isConfigured = true;
      return true;
    } catch (e) {
      console.error('Failed to save API key:', e);
      return false;
    }
  }

  clearApiKey() {
    try {
      localStorage.removeItem('premium_tts_api_key');
      this.apiKey = null;
      this.isConfigured = false;
      return true;
    } catch (e) {
      return false;
    }
  }

  setVoice(voiceId) {
    if (this.voices.find(v => v.id === voiceId)) {
      this.selectedVoice = voiceId;
      localStorage.setItem('premium_tts_voice', voiceId);
      return true;
    }
    return false;
  }

  getVoices() {
    return this.voices;
  }

  /**
   * Estimate cost for text
   * OpenAI TTS: $0.015 per 1K characters (tts-1), $0.030 per 1K characters (tts-1-hd)
   */
  estimateCost(text) {
    const chars = text.length;
    const costPer1K = this.model === 'tts-1-hd' ? 0.030 : 0.015;
    const cost = (chars / 1000) * costPer1K;
    return {
      characters: chars,
      cost: cost.toFixed(4),
      formatted: `$${cost.toFixed(2)}`
    };
  }

  /**
   * Generate audio from text using OpenAI TTS API
   * Returns a Blob containing the audio data
   */
  async generateAudio(text, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Premium TTS not configured. Please add your OpenAI API key.');
    }

    const voice = options.voice || this.selectedVoice;
    const model = options.model || this.model;
    const format = options.format || 'mp3';

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          input: text,
          voice: voice,
          response_format: format
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      this.audioBlob = audioBlob;
      return audioBlob;

    } catch (error) {
      console.error('Premium TTS generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate and play audio (supports iOS background playback)
   */
  async playText(text, options = {}) {
    try {
      // Generate audio
      const audioBlob = await this.generateAudio(text, options);

      // Create audio element for playback
      if (this.audioElement) {
        this.audioElement.pause();
        URL.revokeObjectURL(this.audioElement.src);
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      this.audioElement = new Audio(audioUrl);

      // iOS background playback support
      this.audioElement.setAttribute('playsinline', '');
      this.audioElement.setAttribute('webkit-playsinline', '');

      // Set up event handlers
      this.audioElement.onended = () => {
        this.isPlaying = false;
        if (this.onEnd) this.onEnd();
      };

      this.audioElement.onerror = (e) => {
        this.isPlaying = false;
        if (this.onError) this.onError(e);
      };

      this.audioElement.ontimeupdate = () => {
        if (this.onProgress && this.audioElement.duration) {
          const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
          this.onProgress({
            currentTime: this.audioElement.currentTime,
            duration: this.audioElement.duration,
            progress: progress
          });
        }
      };

      // Play
      await this.audioElement.play();
      this.isPlaying = true;

      return true;
    } catch (error) {
      this.isPlaying = false;
      throw error;
    }
  }

  pause() {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    }
  }

  resume() {
    if (this.audioElement && !this.isPlaying) {
      this.audioElement.play();
      this.isPlaying = true;
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
    }
  }

  /**
   * Download the last generated audio as MP3
   */
  downloadAudio(filename = 'audio.mp3') {
    if (!this.audioBlob) {
      throw new Error('No audio to download. Generate audio first.');
    }

    const url = URL.createObjectURL(this.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  }

  /**
   * Generate audio and return download URL
   */
  async generateDownload(text, filename = 'read-out-loud.mp3', options = {}) {
    const audioBlob = await this.generateAudio(text, options);
    this.downloadAudio(filename);
    return true;
  }

  /**
   * Check if API key is valid by making a minimal request
   */
  async validateApiKey(key) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: 'Test',
          voice: 'nova',
          response_format: 'mp3'
        })
      });

      if (response.ok) {
        return { valid: true };
      } else {
        const error = await response.json().catch(() => ({}));
        return {
          valid: false,
          error: error.error?.message || 'Invalid API key'
        };
      }
    } catch (e) {
      return { valid: false, error: 'Network error' };
    }
  }
}

// Export
window.PremiumTTS = PremiumTTS;
