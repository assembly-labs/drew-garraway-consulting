// Speech Engine Module
class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.chunks = [];
    this.currentChunkIndex = 0;
    this.currentCharIndex = 0;
    this.state = 'IDLE';
    this.selectedVoice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    this.voices = [];
    this.boundaryCallback = null;
    this.endCallback = null;
    this.errorCallback = null;
    this.text = '';
    this.isPaused = false;
  }

  async initialize() {
    return new Promise((resolve) => {
      const loadVoices = () => {
        const availableVoices = this.synth.getVoices();
        if (availableVoices.length > 0) {
          this.voices = this.prioritizeVoices(availableVoices);
          this.selectedVoice = this.voices[0] || null;
          resolve();
        }
      };

      loadVoices();

      if (this.voices.length === 0) {
        this.synth.addEventListener('voiceschanged', () => {
          loadVoices();
        });

        // Fallback timeout
        setTimeout(() => {
          if (this.voices.length === 0) {
            console.warn('No voices loaded after timeout');
            resolve();
          }
        }, 1000);
      }
    });
  }

  prioritizeVoices(voices) {
    console.log(`Total voices available: ${voices.length}`);

    // Filter to only English-speaking voices
    const englishVoices = voices.filter(voice => {
      // Check if language code starts with 'en' (English)
      const isEnglish = voice.lang && voice.lang.toLowerCase().startsWith('en');
      if (!isEnglish) {
        console.log(`Filtering out non-English voice: ${voice.name} (${voice.lang})`);
      }
      return isEnglish;
    });

    console.log(`English voices after filter: ${englishVoices.length}`);

    // Score each English voice based on quality indicators
    const scoredVoices = englishVoices.map(voice => ({
      voice,
      score: this.scoreVoice(voice)
    }));

    // Sort by score (highest first)
    scoredVoices.sort((a, b) => b.score - a.score);

    return scoredVoices.map(item => item.voice);
  }

  scoreVoice(voice) {
    let score = 0;
    const uri = voice.voiceURI.toLowerCase();
    const name = voice.name.toLowerCase();

    // ============================================
    // TIER 1: Premium/Neural Voices (Score: 200+)
    // ============================================

    // Apple Premium voices (highest quality on macOS/iOS)
    if (uri.includes('com.apple.voice.premium')) score += 250;
    if (uri.includes('premium')) score += 200;

    // Neural/AI voices (Windows, Edge, Chrome)
    if (name.includes('neural') || uri.includes('neural')) score += 200;
    if (name.includes('natural') || uri.includes('natural')) score += 180;

    // Microsoft Edge neural voices
    if (uri.includes('microsoft') && (name.includes('online') || name.includes('neural'))) score += 200;

    // Google neural voices
    if (uri.includes('google') && name.includes('wavenet')) score += 200;

    // ============================================
    // TIER 2: Enhanced Voices (Score: 100-199)
    // ============================================

    // Apple Enhanced voices
    if (uri.includes('com.apple.voice.enhanced')) score += 150;
    if (uri.includes('enhanced')) score += 120;

    // Apple TTSBundle (good quality default voices)
    if (uri.includes('com.apple.ttsbundle')) score += 100;

    // Known high-quality voice names (cross-platform)
    const premiumNames = [
      'samantha', 'alex', 'siri',           // Apple
      'zira', 'david', 'mark', 'eva',       // Microsoft
      'google us english', 'google uk english' // Google
    ];
    if (premiumNames.some(pn => name.includes(pn))) score += 100;

    // ============================================
    // TIER 3: Good Quality Voices (Score: 50-99)
    // ============================================

    // Known decent voice names
    const goodNames = [
      'karen', 'daniel', 'moira', 'rishi', 'tessa', 'fiona', // Apple regional
      'hazel', 'george', 'susan',           // Microsoft
      'allison', 'ava', 'tom', 'kate'       // Various
    ];
    if (goodNames.some(gn => name.includes(gn))) score += 60;

    // Apple Eloquence (accessible but robotic)
    if (uri.includes('com.apple.eloquence')) score += 40;

    // ============================================
    // MODIFIERS
    // ============================================

    // Strongly prefer local voices (no latency, works offline)
    if (voice.localService) score += 50;

    // Prefer US/UK English for consistency
    if (voice.lang === 'en-US') score += 15;
    if (voice.lang === 'en-GB') score += 12;
    if (voice.lang === 'en-AU') score += 10;

    // ============================================
    // PENALTIES
    // ============================================

    // Network-only voices (latency, may fail offline)
    if (uri.includes('network')) score -= 30;
    if (!voice.localService) score -= 15;

    // Compact/low-quality indicators
    if (name.includes('compact')) score -= 50;
    if (uri.includes('compact')) score -= 50;

    // espeak/festival (very robotic)
    if (uri.includes('espeak') || uri.includes('festival')) score -= 100;

    return score;
  }

  getVoiceQuality(voice) {
    const score = this.scoreVoice(voice);

    if (score >= 200) return 'premium';
    if (score >= 100) return 'enhanced';
    if (score >= 50) return 'good';
    return 'standard';
  }

  /**
   * Get the top N best voices, deduplicated by display name
   * @param {number} limit - Maximum number of voices to return (default: 8)
   * @returns {Array} - Top voices sorted by quality
   */
  getTopVoices(limit = 8) {
    // Create a map to deduplicate by cleaned voice name
    const seenNames = new Map();

    for (const voice of this.voices) {
      // Clean the name for deduplication (remove quality suffixes)
      const cleanName = this.getCleanVoiceName(voice);
      const score = this.scoreVoice(voice);

      // Keep the highest-scoring version of each voice name
      if (!seenNames.has(cleanName) || seenNames.get(cleanName).score < score) {
        seenNames.set(cleanName, { voice, score });
      }
    }

    // Convert back to array, sort by score, and take top N
    const dedupedVoices = Array.from(seenNames.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.voice);

    return dedupedVoices;
  }

  /**
   * Get a clean display name for the voice (removes quality suffixes)
   * @param {SpeechSynthesisVoice} voice
   * @returns {string}
   */
  getCleanVoiceName(voice) {
    let name = voice.name;

    // Remove common suffixes/prefixes
    const removePatterns = [
      /\s*\(Premium\)/i,
      /\s*\(Enhanced\)/i,
      /\s*\(Natural\)/i,
      /\s*\(Online\)/i,
      /\s*\(Network\)/i,
      /\s*- English.*$/i,
      /\s*English \(.*\)$/i,
      /^Microsoft\s+/i,
      /^Google\s+/i
    ];

    for (const pattern of removePatterns) {
      name = name.replace(pattern, '');
    }

    return name.trim().toLowerCase();
  }

  /**
   * Get a user-friendly display name for the voice
   * @param {SpeechSynthesisVoice} voice
   * @returns {string}
   */
  getDisplayName(voice) {
    let name = voice.name;

    // Clean up common prefixes while keeping it readable
    name = name.replace(/^Microsoft\s+/i, '');
    name = name.replace(/^Google\s+/i, '');

    // Remove redundant language info if it's in the name
    name = name.replace(/\s*- English.*$/i, '');

    return name;
  }

  /**
   * Check if we have enough high-quality voices
   * @returns {boolean}
   */
  hasQualityVoices() {
    const topVoices = this.getTopVoices(3);
    if (topVoices.length === 0) return false;

    // Check if at least one voice scores above "good" threshold
    return topVoices.some(v => this.scoreVoice(v) >= 100);
  }

  chunkText(text) {
    const maxChunkSize = 30000;
    const chunks = [];

    // First try to split by paragraphs
    const paragraphs = text.split(/\n\n+/);
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      // If a single paragraph is too large, split by sentences
      if (paragraph.length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = '';
        }

        // Split large paragraph by sentences
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > maxChunkSize) {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
          }
        }
      } else if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
        // Adding this paragraph would exceed limit
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        // Add paragraph to current chunk
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks.length > 0 ? chunks : [text];
  }

  play(text, startChar = 0) {
    if (!text) return;

    this.stop(); // Clear any existing playback

    this.text = text;
    this.chunks = this.chunkText(text);
    this.currentChunkIndex = 0;
    this.currentCharIndex = startChar;
    this.isPaused = false;

    // Find the right chunk for the start character
    if (startChar > 0) {
      let charCount = 0;
      for (let i = 0; i < this.chunks.length; i++) {
        if (charCount + this.chunks[i].length > startChar) {
          this.currentChunkIndex = i;
          this.currentCharIndex = startChar - charCount;
          break;
        }
        charCount += this.chunks[i].length;
      }
    }

    this.state = 'PLAYING';
    this.speakCurrentChunk();
  }

  speakCurrentChunk() {
    if (this.currentChunkIndex >= this.chunks.length) {
      this.state = 'IDLE';
      if (this.endCallback) this.endCallback();
      return;
    }

    const chunk = this.chunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);

    // Set voice and parameters
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    // Track current utterance
    this.currentUtterance = utterance;

    // Handle boundary events for word tracking
    utterance.onboundary = (event) => {
      if (event.name === 'word' && this.boundaryCallback) {
        // Calculate absolute position in full text
        let chunkOffset = 0;
        for (let i = 0; i < this.currentChunkIndex; i++) {
          chunkOffset += this.chunks[i].length;
        }
        const absoluteChar = chunkOffset + event.charIndex;
        this.currentCharIndex = event.charIndex;

        this.boundaryCallback({
          charIndex: absoluteChar,
          charLength: event.charLength,
          word: chunk.substr(event.charIndex, event.charLength)
        });
      }
    };

    // Handle end of chunk
    utterance.onend = () => {
      if (this.state === 'PLAYING' && !this.isPaused) {
        this.currentChunkIndex++;
        this.currentCharIndex = 0;
        this.speakCurrentChunk();
      } else if (this.currentChunkIndex >= this.chunks.length - 1) {
        this.state = 'IDLE';
        if (this.endCallback) this.endCallback();
      }
    };

    // Handle errors
    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      this.state = 'IDLE';
      if (this.errorCallback) {
        this.errorCallback(event);
      }
    };

    // Speak the chunk
    this.synth.speak(utterance);
  }

  pause() {
    if (this.state === 'PLAYING') {
      this.synth.pause();
      this.state = 'PAUSED';
      this.isPaused = true;
    }
  }

  resume() {
    if (this.state === 'PAUSED') {
      this.synth.resume();
      this.state = 'PLAYING';
      this.isPaused = false;
    }
  }

  stop() {
    this.synth.cancel();
    this.state = 'IDLE';
    this.currentChunkIndex = 0;
    this.currentCharIndex = 0;
    this.isPaused = false;
    this.currentUtterance = null;
  }

  setVoice(voice) {
    this.selectedVoice = voice;
  }

  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.5, rate));
  }

  setPitch(pitch) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getCurrentPosition() {
    let position = 0;
    for (let i = 0; i < this.currentChunkIndex; i++) {
      position += this.chunks[i].length;
    }
    position += this.currentCharIndex;
    return position;
  }

  getTotalLength() {
    return this.text.length;
  }

  getProgress() {
    const total = this.getTotalLength();
    if (total === 0) return 0;
    return (this.getCurrentPosition() / total) * 100;
  }

  // Preview a voice with sample text
  previewVoice(voice, text = "Hello, this is how I sound when reading your text.") {
    this.synth.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    this.synth.speak(utterance);
  }
}

// Export for use in other modules
window.SpeechEngine = SpeechEngine;