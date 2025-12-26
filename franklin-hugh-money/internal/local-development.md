# Local Development Guide

## Testing Flashcards Locally

### 1. Start the Server

```bash
cd /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/franklin-hugh-money
npx serve .
```

Note: If a port is in use, serve will auto-assign an available port. Check the terminal output for the actual URL (e.g., `http://localhost:53091`).

### 2. Verify the Server is Running

```bash
# Check which port serve is using
lsof -i :<PORT_NUMBER>

# Or check common ports
lsof -i :3000
lsof -i :5000
lsof -i :8000
```

### 3. Test the Flashcard JSON Endpoint

```bash
# Verify JSON loads correctly (replace PORT with actual port)
curl -s http://localhost:PORT/assets/data/flashcards.json | head -30
```

Expected output: Valid JSON with `cards` array containing objects with `id`, `front`, `back`, `chapter`, `section`, `tags`, `weight`.

### 4. Open Flashcards in Browser

```bash
open http://localhost:PORT/pages/sie/sie-flashcards.html
```

Or navigate directly in browser.

---

## Troubleshooting

### Server Not Responding
- Server may have stopped. Restart with `npx serve .`
- Check if port is in use by another process with `lsof -i :PORT`

### JSON Not Loading
- Verify path: `/assets/data/flashcards.json` (absolute from server root)
- Test endpoint directly with curl before debugging JS

### Flashcards Not Displaying
Required card properties:
- `id` - unique identifier (string)
- `front` - question text
- `back` - answer text
- `weight` - priority weight for session queue (number, e.g., 0.44)
- `chapter` - chapter identifier
- `section` - section number

---

## File Locations

| File | Purpose |
|------|---------|
| `assets/data/flashcards.json` | Flashcard database |
| `assets/js/flashcards/flashcard-data.js` | Loads JSON via fetch |
| `assets/js/flashcards/flashcard-session.js` | Queue/priority logic |
| `assets/js/flashcards/flashcard-progress.js` | localStorage persistence |
| `assets/js/flashcards/flashcard-ui.js` | Renders UI, handles events |
| `pages/sie/sie-flashcards.html` | Main flashcard page |
