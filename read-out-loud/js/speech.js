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

    // Premium indicators
    if (uri.includes('premium')) score += 100;
    if (uri.includes('enhanced')) score += 80;
    if (uri.includes('natural')) score += 60;

    // Apple-specific high-quality voices
    if (uri.includes('com.apple.voice.premium')) score += 100;
    if (uri.includes('com.apple.voice.enhanced')) score += 80;
    if (uri.includes('com.apple.ttsbundle')) score += 70;
    if (uri.includes('com.apple.eloquence')) score += 60;

    // Prefer local voices
    if (voice.localService) score += 50;

    // English preference for default
    if (voice.lang.startsWith('en-')) score += 20;
    if (voice.lang === 'en-US') score += 10;

    // Specific high-quality voice names
    const highQualityNames = ['samantha', 'alex', 'siri', 'karen', 'daniel', 'moira', 'rishi', 'tessa', 'fiona'];
    if (highQualityNames.some(hqName => name.includes(hqName))) {
      score += 40;
    }

    // Avoid network voices
    if (uri.includes('network')) score -= 50;
    if (!voice.localService) score -= 20;

    return score;
  }

  getVoiceQuality(voice) {
    const uri = voice.voiceURI.toLowerCase();

    if (uri.includes('premium') || uri.includes('com.apple.voice.premium')) {
      return 'premium';
    }
    if (uri.includes('enhanced') || uri.includes('natural') || uri.includes('com.apple.voice.enhanced')) {
      return 'enhanced';
    }
    return 'standard';
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

  // Skip functions removed - no longer needed after UI update
  // These were used for sentence-by-sentence navigation

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

  isSupported() {
    return 'speechSynthesis' in window;
  }
}

// Export for use in other modules
window.SpeechEngine = SpeechEngine;