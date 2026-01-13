// Google Cloud TTS Module
// High-quality neural voices with 1M characters/month free (WaveNet)
// API Key stored locally in browser - never sent anywhere except Google's API

class GoogleTTS {
  constructor() {
    this.apiKey = null;
    this.baseUrl = 'https://texttospeech.googleapis.com/v1';
    this.isConfigured = false;

    // Voice cache
    this.voices = [];
    this.voicesLoaded = false;

    // Selected voice settings
    this.selectedVoice = null;
    this.speakingRate = 1.0;
    this.pitch = 0; // -20.0 to 20.0
    this.volumeGainDb = 0; // -96.0 to 16.0

    // Audio playback
    this.audioElement = null;
    this.audioQueue = [];
    this.currentQueueIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;

    // Callbacks
    this.onProgress = null;
    this.onEnd = null;
    this.onError = null;
    this.onBoundary = null;

    // Text tracking for progress
    this.fullText = '';
    this.chunkOffsets = [];

    // Load saved settings
    this.loadSettings();
  }

  loadSettings() {
    try {
      // Pre-configured API key (domain-restricted to read-out-loud.pages.dev)
      this.apiKey = 'AIzaSyCoSmPdMc6cgri3PWm3nx7BZ0ZA2PV49Bg';
      this.isConfigured = true;

      const voice = localStorage.getItem('google_tts_voice');
      if (voice) {
        this.selectedVoice = JSON.parse(voice);
      }

      const rate = localStorage.getItem('google_tts_rate');
      if (rate) {
        this.speakingRate = parseFloat(rate);
      }
    } catch (e) {
      console.warn('Could not load Google TTS settings from storage');
    }
  }

  setVoice(voice) {
    this.selectedVoice = voice;
    try {
      localStorage.setItem('google_tts_voice', JSON.stringify(voice));
    } catch (e) {
      console.warn('Could not save voice selection');
    }
  }

  setRate(rate) {
    this.speakingRate = Math.max(0.25, Math.min(4.0, rate));
    try {
      localStorage.setItem('google_tts_rate', this.speakingRate.toString());
    } catch (e) {
      console.warn('Could not save rate setting');
    }
  }

  /**
   * Fetch available voices from Google Cloud
   */
  async fetchVoices() {
    if (!this.isConfigured) {
      throw new Error('Google TTS not configured. Please add your API key.');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/voices?key=${this.apiKey}`
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (response.status === 403) {
          throw new Error('API key invalid or Text-to-Speech API not enabled.');
        }
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Filter and sort voices - prioritize English neural voices
      this.voices = this.processVoices(data.voices || []);
      this.voicesLoaded = true;

      // Cache voices
      try {
        localStorage.setItem('google_tts_voices_cache', JSON.stringify({
          voices: this.voices,
          timestamp: Date.now()
        }));
      } catch (e) {
        // Cache failure is non-critical
      }

      // Set default voice if not set
      if (!this.selectedVoice && this.voices.length > 0) {
        this.setVoice(this.voices[0]);
      }

      return this.voices;
    } catch (error) {
      console.error('Failed to fetch Google TTS voices:', error);
      throw error;
    }
  }

  /**
   * Process and prioritize voices
   */
  processVoices(voices) {
    // Filter to English voices only
    const englishVoices = voices.filter(v =>
      v.languageCodes && v.languageCodes.some(lc => lc.startsWith('en'))
    );

    // Score and sort voices
    const scoredVoices = englishVoices.map(voice => ({
      ...voice,
      score: this.scoreVoice(voice),
      quality: this.getVoiceQuality(voice),
      displayName: this.getDisplayName(voice)
    }));

    // Sort by score (highest first)
    scoredVoices.sort((a, b) => b.score - a.score);

    return scoredVoices;
  }

  scoreVoice(voice) {
    let score = 0;
    const name = voice.name || '';

    // Neural2 voices (best quality)
    if (name.includes('Neural2')) score += 300;

    // Studio voices (professional quality)
    if (name.includes('Studio')) score += 280;

    // Polyglot voices
    if (name.includes('Polyglot')) score += 250;

    // WaveNet voices (great quality, free tier)
    if (name.includes('Wavenet')) score += 200;

    // Journey voices (conversational)
    if (name.includes('Journey')) score += 180;

    // News voices
    if (name.includes('News')) score += 150;

    // Standard voices (basic)
    if (name.includes('Standard')) score += 50;

    // Prefer US English
    if (voice.languageCodes?.includes('en-US')) score += 20;
    if (voice.languageCodes?.includes('en-GB')) score += 15;
    if (voice.languageCodes?.includes('en-AU')) score += 10;

    // Prefer natural gender expressions
    if (voice.ssmlGender === 'FEMALE') score += 5;
    if (voice.ssmlGender === 'MALE') score += 5;

    return score;
  }

  getVoiceQuality(voice) {
    const name = voice.name || '';
    if (name.includes('Neural2') || name.includes('Studio')) return 'premium';
    if (name.includes('Wavenet') || name.includes('Journey')) return 'enhanced';
    if (name.includes('News') || name.includes('Polyglot')) return 'good';
    return 'standard';
  }

  getDisplayName(voice) {
    // Extract readable name from voice name
    // e.g., "en-US-Neural2-A" -> "Neural2 A (US)"
    const name = voice.name || '';
    const parts = name.split('-');

    if (parts.length >= 4) {
      const region = parts[1]; // US, GB, AU
      const type = parts[2]; // Neural2, Wavenet, Standard
      const variant = parts.slice(3).join('-'); // A, B, C, etc.
      return `${type} ${variant} (${region})`;
    }

    return name;
  }

  /**
   * Get top voices for display
   */
  getTopVoices(limit = 12) {
    if (!this.voicesLoaded) {
      // Try to load from cache
      try {
        const cached = localStorage.getItem('google_tts_voices_cache');
        if (cached) {
          const { voices, timestamp } = JSON.parse(cached);
          // Use cache if less than 24 hours old
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            this.voices = voices;
            this.voicesLoaded = true;
          }
        }
      } catch (e) {
        // Cache read failure is non-critical
      }
    }

    return this.voices.slice(0, limit);
  }

  /**
   * Chunk text for API limits (5000 bytes per request)
   */
  chunkText(text) {
    const maxBytes = 4500; // Leave buffer under 5000 limit
    const chunks = [];
    let currentChunk = '';
    let currentBytes = 0;

    // Split by sentences first
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

    for (const sentence of sentences) {
      const sentenceBytes = new Blob([sentence]).size;

      if (currentBytes + sentenceBytes > maxBytes) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }

        // If single sentence exceeds limit, split by words
        if (sentenceBytes > maxBytes) {
          const words = sentence.split(/\s+/);
          currentChunk = '';
          currentBytes = 0;

          for (const word of words) {
            const wordBytes = new Blob([word + ' ']).size;
            if (currentBytes + wordBytes > maxBytes) {
              if (currentChunk) chunks.push(currentChunk.trim());
              currentChunk = word + ' ';
              currentBytes = wordBytes;
            } else {
              currentChunk += word + ' ';
              currentBytes += wordBytes;
            }
          }
        } else {
          currentChunk = sentence;
          currentBytes = sentenceBytes;
        }
      } else {
        currentChunk += sentence;
        currentBytes += sentenceBytes;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Generate audio from text
   */
  async generateAudio(text, options = {}) {
    if (!this.isConfigured) {
      throw new Error('Google TTS not configured. Please add your API key.');
    }

    const voice = options.voice || this.selectedVoice;
    if (!voice) {
      throw new Error('No voice selected. Please select a voice first.');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/text:synthesize?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: { text: text },
            voice: {
              languageCode: voice.languageCodes?.[0] || 'en-US',
              name: voice.name,
              ssmlGender: voice.ssmlGender
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: options.rate || this.speakingRate,
              pitch: options.pitch || this.pitch,
              volumeGainDb: options.volumeGainDb || this.volumeGainDb
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        if (response.status === 403) {
          throw new Error('API key invalid or quota exceeded.');
        }
        if (response.status === 400) {
          throw new Error('Invalid request: ' + (error.error?.message || 'Check text and voice settings'));
        }

        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Decode base64 audio content
      const audioContent = data.audioContent;
      const binaryString = atob(audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return new Blob([bytes], { type: 'audio/mpeg' });
    } catch (error) {
      console.error('Google TTS generation failed:', error);
      throw error;
    }
  }

  /**
   * Play text with chunking support
   */
  async play(text, startChar = 0) {
    if (!text) return;

    this.stop();
    this.fullText = text;

    // Chunk the text
    const chunks = this.chunkText(text);

    // Calculate chunk offsets for progress tracking
    this.chunkOffsets = [];
    let offset = 0;
    for (const chunk of chunks) {
      this.chunkOffsets.push(offset);
      offset += chunk.length;
    }

    // Find starting chunk if resuming
    let startChunk = 0;
    if (startChar > 0) {
      for (let i = 0; i < this.chunkOffsets.length; i++) {
        if (i + 1 < this.chunkOffsets.length && this.chunkOffsets[i + 1] > startChar) {
          startChunk = i;
          break;
        }
        if (i === this.chunkOffsets.length - 1) {
          startChunk = i;
        }
      }
    }

    // Generate audio for all chunks
    this.audioQueue = [];
    this.currentQueueIndex = startChunk;

    try {
      // Generate first chunk immediately for faster start
      const firstAudio = await this.generateAudio(chunks[startChunk]);
      this.audioQueue[startChunk] = URL.createObjectURL(firstAudio);

      // Start playing immediately
      this.isPlaying = true;
      this.isPaused = false;
      this.playCurrentChunk();

      // Generate remaining chunks in background
      for (let i = 0; i < chunks.length; i++) {
        if (i !== startChunk) {
          this.generateAudio(chunks[i]).then(blob => {
            this.audioQueue[i] = URL.createObjectURL(blob);
          }).catch(err => {
            console.error(`Failed to generate chunk ${i}:`, err);
          });
        }
      }
    } catch (error) {
      this.isPlaying = false;
      if (this.onError) this.onError(error);
      throw error;
    }
  }

  playCurrentChunk() {
    if (this.currentQueueIndex >= this.chunkOffsets.length) {
      this.isPlaying = false;
      if (this.onEnd) this.onEnd();
      return;
    }

    const audioUrl = this.audioQueue[this.currentQueueIndex];

    if (!audioUrl) {
      // Audio not ready yet, wait and retry
      setTimeout(() => this.playCurrentChunk(), 100);
      return;
    }

    // Clean up previous audio element
    if (this.audioElement) {
      this.audioElement.pause();
      URL.revokeObjectURL(this.audioElement.src);
    }

    this.audioElement = new Audio(audioUrl);

    // iOS background playback support
    this.audioElement.setAttribute('playsinline', '');
    this.audioElement.setAttribute('webkit-playsinline', '');

    this.audioElement.onended = () => {
      if (this.isPlaying && !this.isPaused) {
        this.currentQueueIndex++;
        this.playCurrentChunk();
      }
    };

    this.audioElement.onerror = (e) => {
      console.error('Audio playback error:', e);
      if (this.onError) this.onError(e);
    };

    this.audioElement.ontimeupdate = () => {
      if (this.onProgress && this.audioElement.duration) {
        // Calculate overall progress
        const chunkProgress = this.audioElement.currentTime / this.audioElement.duration;
        const chunkStart = this.chunkOffsets[this.currentQueueIndex] || 0;
        const chunkEnd = this.chunkOffsets[this.currentQueueIndex + 1] || this.fullText.length;
        const chunkLength = chunkEnd - chunkStart;

        const currentChar = chunkStart + (chunkProgress * chunkLength);
        const overallProgress = (currentChar / this.fullText.length) * 100;

        this.onProgress({
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration,
          progress: overallProgress,
          charIndex: Math.floor(currentChar)
        });

        // Emit boundary callback for word highlighting approximation
        if (this.onBoundary) {
          this.onBoundary({
            charIndex: Math.floor(currentChar),
            charLength: 10 // Approximate
          });
        }
      }
    };

    this.audioElement.play().catch(err => {
      console.error('Failed to play audio:', err);
      if (this.onError) this.onError(err);
    });
  }

  pause() {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.audioElement && this.isPaused) {
      this.audioElement.play();
      this.isPaused = false;
    }
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }

    // Clean up audio URLs
    for (const url of this.audioQueue) {
      if (url) URL.revokeObjectURL(url);
    }
    this.audioQueue = [];
    this.currentQueueIndex = 0;
  }

  /**
   * Get current playback position in characters
   */
  getCurrentPosition() {
    if (!this.audioElement || !this.audioElement.duration) {
      return this.chunkOffsets[this.currentQueueIndex] || 0;
    }

    const chunkProgress = this.audioElement.currentTime / this.audioElement.duration;
    const chunkStart = this.chunkOffsets[this.currentQueueIndex] || 0;
    const chunkEnd = this.chunkOffsets[this.currentQueueIndex + 1] || this.fullText.length;
    const chunkLength = chunkEnd - chunkStart;

    return Math.floor(chunkStart + (chunkProgress * chunkLength));
  }

  /**
   * Get playback progress percentage
   */
  getProgress() {
    if (!this.fullText.length) return 0;
    return (this.getCurrentPosition() / this.fullText.length) * 100;
  }

  /**
   * Validate API key
   */
  async validateApiKey(key) {
    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/voices?key=${key}`
      );

      if (response.ok) {
        const data = await response.json();
        return {
          valid: true,
          voiceCount: data.voices?.length || 0
        };
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

  /**
   * Estimate character usage
   */
  estimateUsage(text) {
    const chars = text.length;
    const isWaveNet = this.selectedVoice?.name?.includes('Wavenet');
    const isNeural2 = this.selectedVoice?.name?.includes('Neural2');

    // Free tier limits per month
    const freeLimit = isNeural2 ? 1000000 : (isWaveNet ? 1000000 : 4000000);

    return {
      characters: chars,
      voiceType: isNeural2 ? 'Neural2' : (isWaveNet ? 'WaveNet' : 'Standard'),
      freeMonthlyLimit: freeLimit,
      estimatedCost: 'Free (within monthly limit)'
    };
  }

  /**
   * Preview a voice
   */
  async previewVoice(voice, text = "Hello, this is how I sound when reading your text.") {
    this.stop();

    try {
      const audioBlob = await this.generateAudio(text, { voice });
      const audioUrl = URL.createObjectURL(audioBlob);

      const previewAudio = new Audio(audioUrl);
      previewAudio.onended = () => URL.revokeObjectURL(audioUrl);
      previewAudio.play();
    } catch (error) {
      console.error('Voice preview failed:', error);
      throw error;
    }
  }
}

// Export
window.GoogleTTS = GoogleTTS;
