// Premium TTS Module - ElevenLabs Integration
// Enables MP3 download and background audio playback on iOS
// Free tier: 10,000 characters/month

class PremiumTTS {
  constructor() {
    this.apiKey = null;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    this.isConfigured = false;

    // ElevenLabs voices (curated selection of best voices)
    this.voices = [
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Soft, young female' },
      { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', description: 'Calm, professional female' },
      { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Natural, conversational male' },
      { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Warm, mature male' },
      { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', description: 'Young, articulate male' },
      { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Warm, engaging female' },
      { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', description: 'Confident, clear female' },
      { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Authoritative British male' },
      { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', description: 'Warm British female' },
      { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', description: 'Trustworthy American male' }
    ];

    this.selectedVoice = 'EXAVITQu4vr4xnSDxMaL'; // Sarah (default)
    this.model = 'eleven_monolingual_v1'; // or 'eleven_multilingual_v2'

    // Audio playback
    this.audioElement = null;
    this.audioBlob = null;
    this.isPlaying = false;

    // Callbacks
    this.onProgress = null;
    this.onEnd = null;
    this.onError = null;

    // Load saved settings
    this.loadSettings();
  }

  loadSettings() {
    try {
      const key = localStorage.getItem('elevenlabs_api_key');
      if (key) {
        this.apiKey = key;
        this.isConfigured = true;
      }

      const voice = localStorage.getItem('elevenlabs_voice');
      if (voice) {
        this.selectedVoice = voice;
      }
    } catch (e) {
      console.warn('Could not load ElevenLabs settings from storage');
    }
  }

  saveApiKey(key) {
    try {
      localStorage.setItem('elevenlabs_api_key', key);
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
      localStorage.removeItem('elevenlabs_api_key');
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
      localStorage.setItem('elevenlabs_voice', voiceId);
      return true;
    }
    return false;
  }

  getVoices() {
    return this.voices;
  }

  getSelectedVoiceName() {
    const voice = this.voices.find(v => v.id === this.selectedVoice);
    return voice ? voice.name : 'Sarah';
  }

  /**
   * Estimate usage for text
   * ElevenLabs free tier: 10,000 chars/month
   */
  estimateCost(text) {
    const chars = text.length;
    return {
      characters: chars,
      cost: '0.00', // Free tier
      formatted: 'Free tier',
      freeRemaining: '~10K chars/month'
    };
  }

  /**
   * Generate audio from text using ElevenLabs API
   * Returns a Blob containing the audio data
   */
  async generateAudio(text, options = {}) {
    if (!this.isConfigured) {
      throw new Error('ElevenLabs not configured. Please add your API key.');
    }

    const voiceId = options.voiceId || this.selectedVoice;
    const model = options.model || this.model;

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your ElevenLabs API key.');
        }
        if (response.status === 429) {
          throw new Error('Character limit reached. Free tier allows 10K chars/month.');
        }

        throw new Error(error.detail?.message || `API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      this.audioBlob = audioBlob;
      return audioBlob;

    } catch (error) {
      console.error('ElevenLabs TTS generation failed:', error);
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
   * Check if API key is valid by getting user info
   */
  async validateApiKey(key) {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': key
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          valid: true,
          subscription: data.subscription?.tier || 'free',
          charactersUsed: data.subscription?.character_count || 0,
          charactersLimit: data.subscription?.character_limit || 10000
        };
      } else {
        const error = await response.json().catch(() => ({}));
        return {
          valid: false,
          error: error.detail?.message || 'Invalid API key'
        };
      }
    } catch (e) {
      return { valid: false, error: 'Network error' };
    }
  }

  /**
   * Get current usage stats
   */
  async getUsage() {
    if (!this.isConfigured) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        const used = data.subscription?.character_count || 0;
        const limit = data.subscription?.character_limit || 10000;
        const remaining = limit - used;

        return {
          used,
          limit,
          remaining,
          percentUsed: Math.round((used / limit) * 100)
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

// Export
window.PremiumTTS = PremiumTTS;
