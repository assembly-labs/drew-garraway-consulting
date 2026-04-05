# FEAT-009: Post-Save Quote Screen

**Priority:** P2
**Status:** Exploring
**Added:** 2026-03-31
**Owner:** Drew

---

## The Idea

After a session is saved, a 4-second screen shows an elevating quote from a BJJ expert before transitioning to the Journal. The quote is belt-aware, occasionally topic-aware, and always attributed to a real person.

## Why It Works

The post-save moment is unique. The user just trained AND logged it. They're exhausted but accomplished. A brief pause with a resonant quote gives them a moment of reflection -- a breath between effort and the rest of their day.

## Design Rules

- 4 seconds, then auto-transitions to Journal
- Tap anywhere to dismiss early (no visible skip button)
- Quote text: Inter 17px 500wt, gray300, centered, lineHeight 28
- Attribution: JetBrains Mono 12px 600wt, gray500, below quote
- Background: colors.black (#111111), no cards, no borders, just text
- No fade-in animation needed -- the quote is just there
- Subtle fade-out on transition (200ms)

## Quote Selection Logic

1. Filter by belt level (white, blue, purple, brown, black, or global)
2. If session had sparring, prefer sparring/competition quotes (30% weight)
3. If session notes had negative sentiment, prefer resilience/perseverance quotes
4. Never show the same quote twice in a row (track last shown quote ID)
5. Weighted random from eligible pool

## Legal

Short quotes with attribution = fair use. All quotes from public sources (interviews, books, podcasts, social media). Attribution is mandatory. No endorsement implied. No trademarked catchphrases. No fabricated quotes. See QUOTE_LIBRARY.md for source citations.

## Files

| File | Purpose |
|------|---------|
| [QUOTE_LIBRARY.md](QUOTE_LIBRARY.md) | Full curated quote library with belt tags, topics, and sources |
| README.md | This file |
