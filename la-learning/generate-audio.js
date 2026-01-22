#!/usr/bin/env node
/**
 * DISCOVER LA - Google Cloud TTS Audio Generator
 *
 * This script generates high-quality audio files for all session content
 * using Google Cloud Text-to-Speech API.
 *
 * SETUP:
 * 1. Enable the Cloud Text-to-Speech API in your Google Cloud Console
 * 2. Create an API key or service account
 * 3. Set your API key: export GOOGLE_TTS_API_KEY="your-api-key"
 * 4. Run: node generate-audio.js
 *
 * The script will create an 'audio' folder with MP3 files for each session.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
    // Google Cloud TTS API endpoint
    apiEndpoint: 'texttospeech.googleapis.com',

    // Voice settings - kid-friendly, clear female voice
    voice: {
        languageCode: 'en-US',
        name: 'en-US-Neural2-F', // Clear, friendly female voice
        // Alternatives:
        // 'en-US-Neural2-C' - Male voice
        // 'en-US-Wavenet-F' - Female Wavenet
        // 'en-US-Studio-O' - Studio quality (costs more)
    },

    // Audio settings
    audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.95, // Slightly slower for kids
        pitch: 1.0,
        volumeGainDb: 0.0,
    },

    // Output directory
    outputDir: path.join(__dirname, 'audio'),
};

// Load session data
const sessionsPath = path.join(__dirname, 'sessions.js');
let SESSIONS_DATA;

try {
    const sessionsContent = fs.readFileSync(sessionsPath, 'utf8');
    // Extract the SESSIONS_DATA array from the file
    const match = sessionsContent.match(/const SESSIONS_DATA = (\[[\s\S]*?\]);/);
    if (match) {
        SESSIONS_DATA = eval(match[1]);
    } else {
        throw new Error('Could not find SESSIONS_DATA in sessions.js');
    }
} catch (error) {
    console.error('Error loading sessions.js:', error.message);
    process.exit(1);
}

/**
 * Call Google Cloud TTS API
 */
async function synthesizeSpeech(text, outputFile) {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_TTS_API_KEY environment variable not set');
    }

    const requestBody = JSON.stringify({
        input: { text },
        voice: CONFIG.voice,
        audioConfig: CONFIG.audioConfig,
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: CONFIG.apiEndpoint,
            port: 443,
            path: `/v1/text:synthesize?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`API error ${res.statusCode}: ${data}`));
                    return;
                }

                try {
                    const response = JSON.parse(data);
                    const audioContent = Buffer.from(response.audioContent, 'base64');
                    fs.writeFileSync(outputFile, audioContent);
                    resolve(outputFile);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(requestBody);
        req.end();
    });
}

/**
 * Extract all text segments from a session
 */
function extractSessionText(session) {
    const segments = [];

    // Session intro
    segments.push({
        id: 'intro',
        text: `Session ${session.number}: ${session.title}. ${session.subtitle}.`,
        type: 'heading'
    });

    // Process each section
    session.sections.forEach((section, sectionIndex) => {
        // Section heading
        segments.push({
            id: `section-${sectionIndex}-heading`,
            text: section.heading,
            type: 'heading'
        });

        // Paragraphs
        section.paragraphs.forEach((paragraph, paragraphIndex) => {
            // Split into sentences for better sync
            const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
            sentences.forEach((sentence, sentenceIndex) => {
                const trimmed = sentence.trim();
                if (trimmed) {
                    segments.push({
                        id: `section-${sectionIndex}-para-${paragraphIndex}-sent-${sentenceIndex}`,
                        text: trimmed,
                        type: 'sentence'
                    });
                }
            });
        });
    });

    // Facts
    if (session.facts) {
        session.facts.forEach((fact, factIndex) => {
            segments.push({
                id: `fact-${factIndex}`,
                text: `Did you know? ${fact.content}`,
                type: 'fact'
            });
        });
    }

    return segments;
}

/**
 * Generate audio for a single session
 */
async function generateSessionAudio(session, sessionIndex) {
    const sessionDir = path.join(CONFIG.outputDir, `session-${sessionIndex + 1}`);

    // Create directory
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    const segments = extractSessionText(session);
    const manifest = {
        sessionId: session.id,
        sessionNumber: session.number,
        title: session.title,
        generatedAt: new Date().toISOString(),
        voice: CONFIG.voice.name,
        segments: []
    };

    console.log(`\nGenerating audio for Session ${session.number}: ${session.title}`);
    console.log(`  ${segments.length} segments to process...`);

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const filename = `${segment.id}.mp3`;
        const outputFile = path.join(sessionDir, filename);

        // Skip if already generated
        if (fs.existsSync(outputFile)) {
            console.log(`  [${i + 1}/${segments.length}] Skipping ${segment.id} (exists)`);
            manifest.segments.push({
                id: segment.id,
                type: segment.type,
                text: segment.text,
                file: filename
            });
            continue;
        }

        try {
            process.stdout.write(`  [${i + 1}/${segments.length}] Generating ${segment.id}...`);
            await synthesizeSpeech(segment.text, outputFile);
            console.log(' OK');

            manifest.segments.push({
                id: segment.id,
                type: segment.type,
                text: segment.text,
                file: filename
            });

            // Rate limiting - Google allows 1000 requests per 100 seconds
            await new Promise(resolve => setTimeout(resolve, 150));

        } catch (error) {
            console.log(` FAILED: ${error.message}`);
        }
    }

    // Write manifest
    const manifestFile = path.join(sessionDir, 'manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    console.log(`  Manifest saved to ${manifestFile}`);

    return manifest;
}

/**
 * Generate a combined audio file for each session (optional)
 */
async function generateCombinedAudio(session, sessionIndex) {
    const sessionDir = path.join(CONFIG.outputDir, `session-${sessionIndex + 1}`);
    const segments = extractSessionText(session);

    // Combine all text
    const fullText = segments.map(s => s.text).join(' ');

    // Google TTS has a 5000 byte limit, so we might need to split
    const maxBytes = 4500;
    const chunks = [];
    let currentChunk = '';

    const sentences = fullText.match(/[^.!?]+[.!?]+/g) || [fullText];

    for (const sentence of sentences) {
        if (Buffer.byteLength(currentChunk + sentence, 'utf8') > maxBytes) {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += sentence;
        }
    }
    if (currentChunk) chunks.push(currentChunk);

    console.log(`\nGenerating combined audio (${chunks.length} chunks)...`);

    for (let i = 0; i < chunks.length; i++) {
        const outputFile = path.join(sessionDir, `combined-${i + 1}.mp3`);

        if (fs.existsSync(outputFile)) {
            console.log(`  [${i + 1}/${chunks.length}] Skipping combined-${i + 1} (exists)`);
            continue;
        }

        try {
            process.stdout.write(`  [${i + 1}/${chunks.length}] Generating combined-${i + 1}...`);
            await synthesizeSpeech(chunks[i], outputFile);
            console.log(' OK');
            await new Promise(resolve => setTimeout(resolve, 150));
        } catch (error) {
            console.log(` FAILED: ${error.message}`);
        }
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('========================================');
    console.log('DISCOVER LA - Audio Generator');
    console.log('========================================');

    // Check API key
    if (!process.env.GOOGLE_TTS_API_KEY) {
        console.error('\nError: GOOGLE_TTS_API_KEY environment variable not set');
        console.log('\nTo set it:');
        console.log('  export GOOGLE_TTS_API_KEY="your-api-key-here"');
        console.log('\nThen run this script again.');
        process.exit(1);
    }

    // Create output directory
    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    console.log(`\nVoice: ${CONFIG.voice.name}`);
    console.log(`Output: ${CONFIG.outputDir}`);
    console.log(`Sessions: ${SESSIONS_DATA.length}`);

    // Process command line args
    const args = process.argv.slice(2);
    let sessionsToProcess = SESSIONS_DATA;

    if (args.includes('--session')) {
        const sessionNum = parseInt(args[args.indexOf('--session') + 1]);
        if (sessionNum >= 1 && sessionNum <= SESSIONS_DATA.length) {
            sessionsToProcess = [SESSIONS_DATA[sessionNum - 1]];
            console.log(`\nProcessing only Session ${sessionNum}`);
        }
    }

    const allManifests = [];

    // Generate audio for each session
    for (let i = 0; i < SESSIONS_DATA.length; i++) {
        if (sessionsToProcess.includes(SESSIONS_DATA[i])) {
            const manifest = await generateSessionAudio(SESSIONS_DATA[i], i);
            allManifests.push(manifest);

            // Optionally generate combined audio
            if (args.includes('--combined')) {
                await generateCombinedAudio(SESSIONS_DATA[i], i);
            }
        }
    }

    // Write master manifest
    const masterManifest = {
        generatedAt: new Date().toISOString(),
        voice: CONFIG.voice,
        audioConfig: CONFIG.audioConfig,
        sessions: allManifests.map((m, i) => ({
            number: i + 1,
            id: m.sessionId,
            title: m.title,
            segmentCount: m.segments.length,
            directory: `session-${i + 1}`
        }))
    };

    const masterManifestFile = path.join(CONFIG.outputDir, 'manifest.json');
    fs.writeFileSync(masterManifestFile, JSON.stringify(masterManifest, null, 2));

    console.log('\n========================================');
    console.log('Audio generation complete!');
    console.log(`Master manifest: ${masterManifestFile}`);
    console.log('========================================');
}

// Run
main().catch(console.error);
