# Insights Feature — Claude Context

## Read First

Before working on any insights code, read these documents in order:

1. This file (CLAUDE.md)
2. `README.md` — Architecture overview
3. The relevant model spec in `models/`
4. `PERSONALIZATION.md` — UCD structure
5. `SCHEMA.md` — Database schema

## Project Location

- **Docs:** `/docs/insights/`
- **Edge functions:** `/tomo/supabase/functions/generate-weekly/`, `generate-monthly/`, `generate-quarterly/`, `chat-with-insight/`
- **Client services:** `/tomo/src/services/insights-engine.ts`, `user-context.ts`
- **Types:** `/tomo/src/types/insights-types.ts`
- **Screen:** `/tomo/src/screens/InsightsScreen.tsx`
- **Config:** `/tomo/src/config/belt-system/feature-adaptations.ts` (chatbot adaptation)

## Architecture Rules

### Data Flow

- Raw sessions NEVER go to AI models — only pre-computed summaries
- Pattern engine runs client-side (free, fast, offline-capable)
- Each tier's `context_for_lower_tiers` is extracted after generation and stored
- Client orchestrates context cascade — edge functions don't query each other

### Model Routing

| Tier | Model | Edge Function |
|------|-------|---------------|
| Weekly | claude-haiku-4-5-20251001 | generate-weekly |
| Monthly | claude-sonnet-4-6-20250514 | generate-monthly |
| Quarterly | claude-opus-4-6-20250514 | generate-quarterly |
| Chat | Same as parent insight's tier | chat-with-insight |

### Belt Personalization

ALWAYS use the chatbot adaptation from belt-system. Import `getChatbotAdaptation(belt)` and inject the tone profile, vocabulary level, response depth, encouragement level, emphasized/avoided topics into the system prompt.

### Token Budgets

| Tier | Max Input | Max Output | Hard Limit |
|------|-----------|------------|------------|
| Weekly | 1,200 | 400 | 2,000 total |
| Monthly | 2,500 | 800 | 4,000 total |
| Quarterly | 4,500 | 1,200 | 6,000 total |
| Chat (per exchange) | Grows with history | 300 | 8,000 cumulative |

### Conversation Rules

- Server-side enforcement of 5-exchange maximum
- Each exchange carries full conversation history (token growth accounted for)
- After 5th exchange, return `{ complete: true }` with coach deferral message
- Store conversations for UCD learning

### UCD Rules

- Rebuild after each new session logged
- Only update on "meaningful change" (new top-5 technique, ratio shift >0.2, new recurring injury, style shift)
- Always log changes to changelog for quarterly review reference
- UCD is ~200-400 tokens — keep it concise

## Non-Negotiables

1. **Never fabricate data.** If the pattern engine can't compute a stat, don't guess. Omit it or say there isn't enough data.
2. **Never give medical advice.** Flag injuries, direct to professionals.
3. **Always defer to coach.** Frame as observations, not instructions. Use language like "you might explore" or "worth discussing with your coach."
4. **Never expose pipeline metadata.** Users don't see model names, token counts, tier labels, or any implementation details.
5. **Respect belt system.** White belt tone != purple belt tone. Always adapt vocabulary, depth, and encouragement level.
6. **Handle cold start gracefully.** Missing monthly/quarterly context = omit from prompt, don't hallucinate prior assessments.
7. **Follow TOMO design system.** Dark theme, no emojis, Unbounded/Inter/JetBrains Mono, 12px minimum font size.

## Edge Function Pattern

Follow the existing `extract-session` function pattern:

- CORS headers on all responses (including OPTIONS preflight)
- JWT authentication required
- Supabase client for DB access
- Anthropic SDK for Claude calls
- Timeout handling (30s for Haiku, 60s for Sonnet, 90s for Opus)
- Structured JSON output with validation
- Error returns that don't block the UI (client should degrade gracefully)

Reminder: edge functions MUST deploy with `--no-verify-jwt` flag. This has caused P0 outages before.

## Testing

- Run `npx tsc --noEmit` after any TypeScript changes
- Test locally before suggesting TestFlight deployment
- Pattern engine should be testable with mock session data (no Supabase dependency)
- Edge functions testable via curl with Supabase JWT:

```bash
curl -X POST https://<project>.supabase.co/functions/v1/generate-weekly \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "...", "week_start": "2026-03-16"}'
```

- Always tell Drew whether to test locally or deploy to TestFlight after changes
