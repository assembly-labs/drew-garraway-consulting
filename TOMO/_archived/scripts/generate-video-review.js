#!/usr/bin/env node
/**
 * Generate video-review.html from techniqueVideos.ts database
 *
 * This script parses the TypeScript file and generates a static HTML
 * review tool for verifying video content.
 *
 * Usage: node scripts/generate-video-review.js
 */

const fs = require('fs');
const path = require('path');

// ===========================================
// VERIFIED VIDEO IDs
// Source: /docs/data-and-ai/VIDEO_VERIFICATION.md
// Verified via noembed.com API on 2026-01-26
// ===========================================

const VERIFIED_VIDEO_IDS = new Set([
  // BJJ Fanatics / Bernardo Faria Channel
  'ypi3ie6hKTI',  // John Danaher Explains Closed Guard Fundamentals
  'tyI3aszI4qo',  // Gordon Ryan - Early Hand Fighting From Mount
  'JX0HL0WpYPs',  // How To Do The Perfect Front Headlock And Turtle Escapes
  'MXcQfCIh7n4',  // The Most Basic Principles Of Butterfly And Open Guard
  '-zgwLkCoWDw',  // The Importance Of BJJ Fundamentals
  'E8x1Cva8hJ8',  // How To Build The Perfect Half Guard Game
  'Fcg4mtegux0',  // Understanding The Open Guard In BJJ
  'FpJTnOEkqYI',  // Finishing a Mandible Rear Naked
  'Jz4oLDOHxLM',  // How To Do The Perfect Jiu Jitsu Half Guard Passing
  'VA6zjDN690s',  // Wrist Controls To Triangles
  'WnNtD9kPBvs',  // Rear Ezekiel
  'Zp9O6YpHKeE',  // 5 Tips To Pass Any Guard No Gi
  'cuXq-k__9lQ',  // How To Do The Perfect BJJ Side Control Escape
  'i-GjsFQbziE',  // Kimura Escape from Top Half Guard
  'iMI43_ct0_o',  // Gordon Ryan - Intro to Escaping Turtle Position
  'isv_6Hd1Iac',  // How To Perfect Your Guard Passing No Gi
  'nU9YxDabnSU',  // Understanding The Closed Guard
  'qrlXfEOk_44',  // How To Pass The BJJ Half Guard No Gi
  'r-FNcolHsg4',  // Learn How To Do The Perfect Jiu Jitsu Body Lock Pass
  'xnlx_hNfuZ4',  // New BJJ Triangle Choke Set Up On The Mount
  'LDE0fkzZT6I',  // How To Do The Perfect Triangle Choke
  'ODuQCA88oY4',  // 5 Tips To Pass ANY Guard
  'Ze10eulM1xg',  // How To Build The Perfect Half Guard Game For No Gi
  'Zvn--8vW1sI',  // Head And Arm Guillotine Choke Escape

  // Absolute MMA St Kilda (Lachlan Giles)
  'gnAhAdE_A90',  // The best way to escape side control
  '59NfnauqwIQ',  // Escape side control fundamentals part 2
  '7c_QyTpJy-k',  // Guard Recovery and Inverting
  '8XBJboAGzRk',  // Escape the back PT2
  'CFTLb8iywJg',  // Defending and escaping the saddle
  'DrjbaXt-nTo',  // Rolling out of Heel Hooks
  'GCWfLiI51ds',  // Understanding Guard Passing: Concepts & Heuristics
  'KG916GxW-88',  // Escaping north south
  'LLSSUrds01E',  // Passing butterfly guard with the body lock
  'PLa07zdiPZk',  // How to control opponent with kimura grip
  'k-lCzVAzJpg',  // Escaping the back - Pay attention to the leg work
  'rhYdYtMhDac',  // The Best Way To Escape Side Control Part 2
  'swEcP2QWHs8',  // Linking 4 different side control escapes
  'yZ4mrxCUl_Q',  // 6 approaches to passing the knee shield

  // MMA Leech Channel (Gustavo Gasperin)
  '3jnfMMh_tkQ',  // Paper Cutter Choke & Armbar Combo From Side Control
  'I66SzufFJT0',  // Top 6 Knee Cut Pass Variations
  'LU7bEi96ink',  // Low Risk Sweep From Closed Guard - BJJ Flower Sweep
  'R9U6Fbnlv2g',  // 3 De La Riva sweeps combo
  'kzTdXfDIndw',  // Knee Shield Half Guard Pass Combo
  's7Fp2Qegr6w',  // The Most Hated Armbar Finish: The Dog Pee Armbar

  // Other Sources
  'A8JVwd_OoSY',  // Jiu Jitsu vs Wrestling - Understanding Turtle Position
  'FksRO4JgQck',  // Two Radical NEW Takedowns for BJJ and No Gi
  'uT-7lJxykCg',  // Back Escape Technique
]);

// Non-BJJ videos that should NEVER be in the database
const INVALID_VIDEO_IDS = new Set([
  '6uFS3J4Hqyo',  // Jocko Podcast 27 - NOT BJJ
  'GqqrTLwxE_Y',  // Tim Ferriss/Jocko interview - NOT BJJ
  'IdTMDpizis8',  // Jocko "GOOD" motivational - NOT BJJ
  'QorFNL9CRrU',  // Jocko Podcast 16 - NOT BJJ
  'yNN0dnB6ivY',  // Jocko Podcast 20 - NOT BJJ
  '_fbCcWyYthQ',  // Joe Rogan workout - NOT BJJ
]);

// Read the TypeScript file
const tsFilePath = path.join(__dirname, '../prototype/src/data/techniqueVideos.ts');
const tsContent = fs.readFileSync(tsFilePath, 'utf-8');

// Parse video entries using regex
const videoEntries = [];
const videoRegex = /\{\s*technique_id:\s*'([^']+)',\s*video_type:\s*'([^']+)',\s*youtube_id:\s*'([^']+)',\s*instructor:\s*'([^']+)',\s*title:\s*'([^']+)',\s*duration_seconds:\s*(\d+)\s*\}/g;

let match;
while ((match = videoRegex.exec(tsContent)) !== null) {
  const youtubeId = match[3];
  videoEntries.push({
    technique_id: match[1],
    video_type: match[2],
    youtube_id: youtubeId,
    instructor: match[4],
    title: match[5],
    duration_seconds: parseInt(match[6]),
    // Validation status
    isVerified: VERIFIED_VIDEO_IDS.has(youtubeId),
    isInvalid: INVALID_VIDEO_IDS.has(youtubeId),
  });
}

console.log(`Found ${videoEntries.length} video entries`);

// Get unique videos by youtube_id
const uniqueVideos = new Map();
videoEntries.forEach(v => {
  if (!uniqueVideos.has(v.youtube_id)) {
    uniqueVideos.set(v.youtube_id, v);
  }
});
console.log(`Unique YouTube videos: ${uniqueVideos.size}`);

// Count validation status
const verifiedCount = videoEntries.filter(v => v.isVerified).length;
const unverifiedCount = videoEntries.filter(v => !v.isVerified && !v.isInvalid).length;
const invalidCount = videoEntries.filter(v => v.isInvalid).length;
console.log(`Verified: ${verifiedCount}, Unverified: ${unverifiedCount}, Invalid: ${invalidCount}`);

// Get unique instructors
const instructors = [...new Set(videoEntries.map(v => v.instructor))].sort();
console.log(`Instructors: ${instructors.join(', ')}`);

// Position category mapping
const positionMap = {
  'CG': 'Closed Guard',
  'HG': 'Half Guard',
  'OG': 'Open Guards',
  'MT': 'Mount',
  'SC': 'Side Control',
  'BC': 'Back Control',
  'NS': 'North-South',
  'TT': 'Turtle',
  'TD': 'Takedowns',
  'CL': 'Clinch',
  'GP': 'Guard Passing',
  'KB': 'Knee on Belly',
  'SM': 'Submissions',
  'TR': 'Transitions',
  'LE': 'Leg Entanglements',
  'BJ': 'Belt Journey',
  'MG': 'Mental Game',
  'AL': 'Age & Longevity',
  'LB': 'Lifestyle',
  'IR': 'Injury & Recovery'
};

function getPosition(techniqueId) {
  const prefix = techniqueId.substring(0, 2);
  return positionMap[prefix] || 'General';
}

// Instructor style mapping (new-wave vs traditional)
const newWaveInstructors = ['John Danaher', 'Gordon Ryan', 'Craig Jones', 'Lachlan Giles', 'Mikey Musumeci', 'Kade Ruotolo'];
function getStyle(instructor) {
  return newWaveInstructors.includes(instructor) ? 'new-wave' : 'mixed';
}

// Belt level heuristics based on technique complexity
function getBelt(techniqueId) {
  const prefix = techniqueId.substring(0, 2);
  const whiteBeltPrefixes = ['CG', 'SC', 'MT', 'BC', 'TD'];
  const id = techniqueId.split('_')[1];
  const num = parseInt(id) || 0;

  if (whiteBeltPrefixes.includes(prefix) && num < 10) return 'white';
  if (num < 20) return 'blue';
  return 'purple';
}

// Generate HTML
function generateHTML() {
  const totalVideos = videoEntries.length;
  const uniqueCount = uniqueVideos.size;

  // Get all positions used
  const positions = [...new Set(videoEntries.map(v => getPosition(v.technique_id)))].sort();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TOMO Video Review</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #eee; padding: 16px; line-height: 1.4; }

    .header { background: #111; padding: 20px; border-radius: 10px; margin-bottom: 14px; border: 1px solid #222; }
    h1 { color: #F5A623; font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 12px; }
    .stats { display: flex; gap: 20px; margin-top: 14px; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: #F5A623; }
    .stat-value.verified { color: #22c55e; }
    .stat-value.unverified { color: #f59e0b; }
    .stat-value.invalid { color: #ef4444; }
    .stat-label { font-size: 10px; color: #666; text-transform: uppercase; }
    .generated { color: #555; font-size: 10px; margin-top: 12px; }

    .filters { background: #111; border: 1px solid #222; border-radius: 8px; padding: 14px; margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-end; }
    .filter-group { display: flex; flex-direction: column; gap: 3px; }
    .filter-label { font-size: 9px; text-transform: uppercase; color: #555; font-weight: 600; }
    select { background: #1a1a1a; border: 1px solid #333; color: #eee; padding: 6px 8px; border-radius: 5px; font-size: 12px; min-width: 110px; }
    select:focus { border-color: #F5A623; outline: none; }
    .btn { padding: 6px 14px; border-radius: 5px; font-size: 12px; cursor: pointer; border: none; background: #222; color: #888; }
    .btn:hover { background: #333; color: #eee; }

    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .results-count { color: #666; font-size: 12px; }

    .legend { background: #111; border: 1px solid #222; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; display: flex; gap: 20px; font-size: 11px; }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .legend-icon { width: 16px; height: 16px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 10px; }
    .legend-icon.verified { background: #22c55e33; color: #22c55e; }
    .legend-icon.unverified { background: #f59e0b33; color: #f59e0b; }
    .legend-icon.invalid { background: #ef444433; color: #ef4444; }

    /* List View */
    #list-view { display: flex; flex-direction: column; gap: 1px; }
    .list-row { display: flex; align-items: center; gap: 12px; padding: 8px 10px; background: #111; border-radius: 6px; border-left: 3px solid transparent; }
    .list-row:hover { background: #151515; }
    .list-row.hidden { display: none; }
    .list-row.verified { border-left-color: #22c55e; }
    .list-row.unverified { border-left-color: #f59e0b; background: #1a1a0a; }
    .list-row.invalid { border-left-color: #ef4444; background: #1a0a0a; }
    .list-status { width: 20px; flex-shrink: 0; text-align: center; font-size: 12px; }
    .list-status.verified { color: #22c55e; }
    .list-status.unverified { color: #f59e0b; }
    .list-status.invalid { color: #ef4444; }
    .list-thumb { width: 80px; height: 45px; object-fit: cover; border-radius: 3px; flex-shrink: 0; cursor: pointer; }
    .list-thumb:hover { opacity: 0.8; }
    .list-id { font-family: monospace; color: #F5A623; font-size: 11px; width: 90px; flex-shrink: 0; }
    .list-title { flex: 1; font-size: 13px; font-weight: 500; min-width: 0; }
    .list-instructor { color: #88c0d0; font-size: 12px; width: 120px; flex-shrink: 0; }
    .list-tags { display: flex; gap: 4px; flex-shrink: 0; }
    .mini { padding: 2px 5px; border-radius: 3px; font-size: 9px; font-weight: 500; }
    .list-cat { color: #555; font-size: 11px; width: 100px; flex-shrink: 0; }
    .list-link { color: #ef4444; text-decoration: none; padding: 4px 10px; background: #ef444422; border-radius: 4px; font-size: 11px; flex-shrink: 0; }
    .list-link:hover { background: #ef444433; }
    .list-youtube-id { font-family: monospace; font-size: 10px; color: #555; width: 100px; flex-shrink: 0; }

    .badge-white { background: #f5f5f5; color: #111; }
    .badge-blue { background: #3b82f6; color: white; }
    .badge-purple { background: #8b5cf6; color: white; }
    .meta-new-wave { background: #ef444422; color: #ef4444; }
    .meta-mixed { background: #8b5cf622; color: #a78bfa; }
  </style>
</head>
<body>
  <div class="header">
    <h1>TOMO Video Review</h1>
    <p class="subtitle">Video database with validation status</p>
    <div class="stats">
      <div class="stat"><div class="stat-value">${totalVideos}</div><div class="stat-label">Total Entries</div></div>
      <div class="stat"><div class="stat-value">${uniqueCount}</div><div class="stat-label">Unique Videos</div></div>
      <div class="stat"><div class="stat-value verified">${verifiedCount}</div><div class="stat-label">Verified</div></div>
      <div class="stat"><div class="stat-value unverified">${unverifiedCount}</div><div class="stat-label">Unverified</div></div>
      <div class="stat"><div class="stat-value invalid">${invalidCount}</div><div class="stat-label">Invalid</div></div>
      <div class="stat"><div class="stat-value">${instructors.length}</div><div class="stat-label">Instructors</div></div>
    </div>
    <p class="generated">Generated: ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</p>
  </div>

  <div class="legend">
    <div class="legend-item"><div class="legend-icon verified">&#10003;</div><span>Verified via noembed API</span></div>
    <div class="legend-item"><div class="legend-icon unverified">?</div><span>Needs verification</span></div>
    <div class="legend-item"><div class="legend-icon invalid">&#10005;</div><span>Invalid (not BJJ content)</span></div>
  </div>

  <div class="filters">
    <div class="filter-group"><label class="filter-label">Validation</label><select id="f-valid"><option value="">All</option><option value="verified">Verified Only</option><option value="unverified">Unverified Only</option><option value="invalid">Invalid Only</option></select></div>
    <div class="filter-group"><label class="filter-label">Style</label><select id="f-style"><option value="">All</option><option value="new-wave">New Wave</option><option value="mixed">Mixed</option></select></div>
    <div class="filter-group"><label class="filter-label">Belt</label><select id="f-belt"><option value="">All</option><option value="white">White</option><option value="blue">Blue</option><option value="purple">Purple</option></select></div>
    <div class="filter-group"><label class="filter-label">Instructor</label><select id="f-inst"><option value="">All</option>${instructors.map(i => `<option value="${i}">${i}</option>`).join('')}</select></div>
    <div class="filter-group"><label class="filter-label">Position</label><select id="f-cat"><option value="">All</option>${positions.map(p => `<option value="${p}">${p}</option>`).join('')}</select></div>
    <button class="btn" onclick="reset()">Reset</button>
  </div>

  <div class="toolbar">
    <span class="results-count"><span id="count">${totalVideos}</span> videos</span>
  </div>

  <div id="list-view">
${videoEntries.map(v => {
  const position = getPosition(v.technique_id);
  const style = getStyle(v.instructor);
  const belt = getBelt(v.technique_id);
  const validStatus = v.isInvalid ? 'invalid' : (v.isVerified ? 'verified' : 'unverified');
  const statusIcon = v.isInvalid ? '&#10005;' : (v.isVerified ? '&#10003;' : '?');
  return `    <div class="list-row ${validStatus}" data-valid="${validStatus}" data-style="${style}" data-belt="${belt}" data-inst="${v.instructor}" data-cat="${position}">
      <span class="list-status ${validStatus}" title="${validStatus}">${statusIcon}</span>
      <a href="https://youtube.com/watch?v=${v.youtube_id}" target="_blank"><img src="https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg" class="list-thumb" loading="lazy"></a>
      <span class="list-id">${v.technique_id}</span>
      <span class="list-title">${v.title}</span>
      <span class="list-instructor">${v.instructor}</span>
      <span class="list-youtube-id">${v.youtube_id}</span>
      <span class="list-tags"><span class="mini badge-${belt}">${belt[0].toUpperCase()}</span><span class="mini meta-${style}">${style === 'new-wave' ? 'new' : 'mix'}</span></span>
      <span class="list-cat">${position}</span>
      <a href="https://youtube.com/watch?v=${v.youtube_id}" target="_blank" class="list-link">Watch</a>
    </div>`;
}).join('\n')}
  </div>

  <script>
    const f = {valid:document.getElementById('f-valid'),style:document.getElementById('f-style'),belt:document.getElementById('f-belt'),inst:document.getElementById('f-inst'),cat:document.getElementById('f-cat')};
    function filter() {
      let c = 0;
      document.querySelectorAll('.list-row').forEach(el => {
        let show = true;
        if (f.valid.value && el.dataset.valid !== f.valid.value) show = false;
        if (f.style.value && el.dataset.style !== f.style.value) show = false;
        if (f.belt.value && el.dataset.belt !== f.belt.value) show = false;
        if (f.inst.value && el.dataset.inst !== f.inst.value) show = false;
        if (f.cat.value && el.dataset.cat !== f.cat.value) show = false;
        el.classList.toggle('hidden', !show);
        if (show) c++;
      });
      document.getElementById('count').textContent = c;
    }
    function reset() { Object.values(f).forEach(s => s.value = ''); filter(); }
    Object.values(f).forEach(s => s.addEventListener('change', filter));
  </script>
</body>
</html>`;

  return html;
}

// Write the HTML file
const outputPath = path.join(__dirname, '../docs/product/video-review.html');
const html = generateHTML();
fs.writeFileSync(outputPath, html, 'utf-8');
console.log(`\nGenerated: ${outputPath}`);
console.log(`File size: ${(html.length / 1024).toFixed(1)} KB`);
