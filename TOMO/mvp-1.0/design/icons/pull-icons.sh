#!/bin/bash
# Pull curated Lucide icons for TOMO (MIT License)
# Source: https://github.com/lucide-icons/lucide
# License: ISC (MIT-compatible) — free for commercial use, no attribution required

BASE_URL="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons"
ICON_DIR="$(dirname "$0")"
TOTAL=0
FAILED=0

download_icon() {
  local category="$1"
  local name="$2"
  local url="${BASE_URL}/${name}.svg"
  local dest="${ICON_DIR}/${category}/${name}.svg"

  if [ -f "$dest" ]; then
    return 0
  fi

  if curl -sf -o "$dest" "$url"; then
    TOTAL=$((TOTAL + 1))
  else
    FAILED=$((FAILED + 1))
    rm -f "$dest"
  fi
}

echo "Pulling Lucide icons for TOMO..."
echo "================================"

# ─────────────────────────────────────────────
# 01 — NAVIGATION (40 icons)
# ─────────────────────────────────────────────
echo "01 — Navigation..."
for icon in \
  arrow-left arrow-right arrow-up arrow-down \
  arrow-up-left arrow-up-right arrow-down-left arrow-down-right \
  chevron-left chevron-right chevron-up chevron-down \
  chevrons-left chevrons-right chevrons-up chevrons-down \
  corner-down-left corner-down-right corner-up-left corner-up-right \
  move-left move-right move-up move-down \
  undo undo-2 redo redo-2 \
  x circle-x square-x \
  menu ellipsis ellipsis-vertical \
  grip-horizontal grip-vertical \
  maximize minimize shrink expand \
  external-link link unlink \
  home log-out log-in; do
  download_icon "01-navigation" "$icon"
done

# ─────────────────────────────────────────────
# 02 — SESSION LOGGING & VOICE (45 icons)
# ─────────────────────────────────────────────
echo "02 — Session Logging & Voice..."
for icon in \
  mic mic-off mic-vocal \
  audio-waveform audio-lines volume volume-1 volume-2 volume-x \
  circle-stop circle-play circle-pause \
  play pause square stop-circle \
  record skip-forward skip-back \
  save save-all \
  check check-circle check-check circle-check-big \
  send send-horizontal corner-down-right \
  text-cursor-input keyboard type whole-word \
  pencil pen pen-line pen-tool \
  eraser wand wand-sparkles \
  clipboard clipboard-check clipboard-list clipboard-copy \
  file-text file-check file-plus file-minus \
  notebook notebook-pen notebook-text; do
  download_icon "02-session-logging" "$icon"
done

# ─────────────────────────────────────────────
# 03 — TRAINING & FITNESS (50 icons)
# ─────────────────────────────────────────────
echo "03 — Training & Fitness..."
for icon in \
  dumbbell activity heart-pulse flame flame-kindling \
  trophy medal award crown star \
  target crosshair goal \
  trending-up trending-down bar-chart bar-chart-2 chart-line chart-area chart-no-axes-combined \
  zap battery battery-charging gauge gauge-circle \
  shield shield-check shield-alert shield-half shield-plus \
  swords sword axe \
  footprints accessibility person-standing \
  biceps-flexed bone hand-metal hand \
  timer timer-off timer-reset alarm-clock \
  scale weight mountain mountain-snow \
  repeat repeat-1 repeat-2 infinity \
  rocket fuel pizza apple coffee \
  bed moon sunrise sunset thermometer droplets wind; do
  download_icon "03-training-fitness" "$icon"
done

# ─────────────────────────────────────────────
# 04 — BJJ & COMBAT (35 icons)
# ─────────────────────────────────────────────
echo "04 — BJJ & Combat..."
for icon in \
  lock lock-open lock-keyhole lock-keyhole-open \
  grip-horizontal grip-vertical grab \
  move rotate-3d rotate-ccw rotate-cw flip-horizontal flip-vertical \
  shield-off shield-ban \
  skull skull-crossbones \
  alert-triangle alert-octagon circle-alert triangle-alert \
  scan scan-line focus \
  layers layers-2 layers-3 \
  git-merge git-branch git-fork \
  circle-dot circle-dashed radar \
  milestone flag flag-triangle-right \
  waypoints workflow; do
  download_icon "04-bjj-combat" "$icon"
done

# ─────────────────────────────────────────────
# 05 — PROFILE & SETTINGS (45 icons)
# ─────────────────────────────────────────────
echo "05 — Profile & Settings..."
for icon in \
  user user-circle user-check user-plus user-minus user-x user-cog \
  users users-round \
  circle-user circle-user-round \
  settings settings-2 sliders sliders-horizontal \
  toggle-left toggle-right \
  bell bell-off bell-ring bell-dot bell-minus bell-plus \
  eye eye-off eye-closed \
  lock unlock key key-round key-square \
  mail mail-open at-sign inbox \
  camera image image-plus image-off \
  palette paintbrush paintbrush-vertical \
  globe globe-2 map map-pin map-pinned navigation compass \
  id-card badge badge-check badge-info badge-alert; do
  download_icon "05-profile-settings" "$icon"
done

# ─────────────────────────────────────────────
# 06 — INSIGHTS & ANALYTICS (45 icons)
# ─────────────────────────────────────────────
echo "06 — Insights & Analytics..."
for icon in \
  brain lightbulb sparkle sparkles \
  bar-chart-3 bar-chart-4 bar-chart-big bar-chart-horizontal bar-chart-horizontal-big \
  chart-pie chart-candlestick chart-column chart-column-big chart-column-stacked \
  chart-scatter chart-spline chart-no-axes-column \
  trending-up trending-down move-up-right move-down-right \
  arrow-up-narrow-wide arrow-down-narrow-wide \
  database server \
  message-circle message-square messages-square speech \
  book-open notebook-pen file-text scroll-text \
  radar signal signal-high signal-low signal-zero \
  telescope binoculars search-check \
  table table-2 kanban \
  presentation pie-chart percent hash \
  calculator sigma omega; do
  download_icon "06-insights-analytics" "$icon"
done

# ─────────────────────────────────────────────
# 07 — STATUS & FEEDBACK (35 icons)
# ─────────────────────────────────────────────
echo "07 — Status & Feedback..."
for icon in \
  check check-circle circle-check circle-check-big \
  x x-circle circle-x \
  alert-triangle alert-circle circle-alert info \
  help-circle circle-help badge-info badge-alert \
  loader loader-circle loader-pinwheel refresh-cw refresh-ccw \
  wifi wifi-off wifi-high wifi-low wifi-zero \
  cloud cloud-off cloud-upload cloud-download \
  thumbs-up thumbs-down \
  circle-dot circle-dashed circle-off \
  ban octagon-alert shield-x \
  hourglass clock; do
  download_icon "07-status-feedback" "$icon"
done

# ─────────────────────────────────────────────
# 08 — GYM & LOCATION (30 icons)
# ─────────────────────────────────────────────
echo "08 — Gym & Location..."
for icon in \
  map-pin map-pinned map-pin-off map-pin-plus map-pin-check \
  map map-pin-house locate locate-fixed locate-off \
  navigation navigation-2 navigation-off compass \
  building building-2 warehouse house landmark school \
  route milestone signpost sign-post \
  globe-2 earth \
  parking-meter construction door-open door-closed \
  fence trees; do
  download_icon "08-gym-location" "$icon"
done

# ─────────────────────────────────────────────
# 09 — DATA & CONTENT (35 icons)
# ─────────────────────────────────────────────
echo "09 — Data & Content..."
for icon in \
  file file-text file-check file-plus file-minus file-x file-search \
  folder folder-open folder-plus folder-minus folder-check \
  clipboard clipboard-check clipboard-list clipboard-copy clipboard-x \
  copy scissors trash trash-2 archive archive-restore \
  download upload share share-2 \
  bookmark bookmark-check bookmark-minus bookmark-plus \
  tag tags \
  pin pin-off \
  package box; do
  download_icon "09-data-content" "$icon"
done

# ─────────────────────────────────────────────
# 10 — COMMUNICATION (25 icons)
# ─────────────────────────────────────────────
echo "10 — Communication..."
for icon in \
  message-circle message-square message-circle-plus message-square-plus \
  messages-square mail mail-open mail-plus mail-check mail-x \
  send reply reply-all forward \
  phone phone-call phone-off \
  video video-off \
  megaphone radio rss \
  at-sign hash headphones headset; do
  download_icon "10-communication" "$icon"
done

# ─────────────────────────────────────────────
# 11 — TIME & CALENDAR (30 icons)
# ─────────────────────────────────────────────
echo "11 — Time & Calendar..."
for icon in \
  clock clock-1 clock-2 clock-3 clock-4 clock-5 clock-6 clock-7 clock-8 clock-9 clock-10 clock-11 clock-12 \
  timer timer-off timer-reset \
  alarm-clock alarm-clock-off alarm-clock-check alarm-clock-minus alarm-clock-plus \
  calendar calendar-days calendar-check calendar-plus calendar-minus calendar-x calendar-range calendar-clock calendar-heart \
  hourglass history; do
  download_icon "11-time-calendar" "$icon"
done

# ─────────────────────────────────────────────
# 12 — MISC & DELIGHT (30 icons)
# ─────────────────────────────────────────────
echo "12 — Misc & Delight..."
for icon in \
  sparkles stars party-popper confetti \
  gift heart heart-pulse heart-handshake \
  sunrise sunset moon sun cloud-sun \
  music headphones \
  coffee pizza apple beer \
  smile laugh frown meh annoyed angry \
  fingerprint scan-face eye-off \
  flower-2 leaf sprout clover \
  gem diamond crown; do
  download_icon "12-misc-delight" "$icon"
done

echo ""
echo "================================"
echo "Downloaded: ${TOTAL} icons"
echo "Failed:     ${FAILED}"
echo "================================"
echo ""
echo "License: ISC (MIT-compatible)"
echo "Source:  github.com/lucide-icons/lucide"
echo "Usage:   Free for commercial use, no attribution required"
