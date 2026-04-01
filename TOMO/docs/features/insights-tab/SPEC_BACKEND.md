# FEAT-002: Backend Development Spec

**Edge functions:** Supabase Edge Functions (Deno)
**Database:** Supabase PostgreSQL
**Model:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
**Cost:** ~$0.0003 per weekly insight generation

---

## Database

### Migration: insights tables (already written)

**File:** `tomo/supabase/migrations/20260322100000_insights_tables.sql`

3 tables, all with RLS. Deploy with `supabase db push`.

**Table: `insights`**
- id, user_id, tier, period_start, period_end
- `insight_data` JSONB -- stores the `WeeklyInsightOutput`
- `context_for_lower_tiers` JSONB -- for monthly/quarterly cascade (Phase 2+)
- model, input_tokens, output_tokens
- `has_been_viewed` BOOLEAN DEFAULT false
- `first_viewed_at` TIMESTAMPTZ
- feedback TEXT (helpful/not_helpful/null)
- UNIQUE(user_id, tier, period_start) -- prevents duplicate weekly insights

**Table: `insight_conversations`** (Phase 3, not needed now)

**Table: `user_context`** (Phase 2, not needed now but created with migration)

**RLS Policies:**
- Users can SELECT their own insights
- Users can UPDATE feedback + has_been_viewed on their own insights
- Service role can INSERT/UPDATE/DELETE (edge functions)

### FEAT-008 fields (already shipped)

The profiles table now has:
- `birthday DATE` (mandatory, 18+)
- `gender TEXT` (mandatory)
- `weight_lbs NUMERIC` (optional)
- `training_goals TEXT[]` (expanded options)

These are available for the edge function to query.

---

## Edge Function: generate-weekly

**File:** `tomo/supabase/functions/generate-weekly/index.ts`

### Endpoint

```
POST /functions/v1/generate-weekly
Authorization: Bearer <user_jwt>
Content-Type: application/json

{
  "user_id": "uuid",
  "week_start": "2026-03-24"  // Monday of the target week
}
```

### Deploy Command

```bash
supabase functions deploy generate-weekly --no-verify-jwt
```

CRITICAL: `--no-verify-jwt` is required. Has caused P0 outages 3 times without it.

### Logic Flow

```
1. Authenticate user from JWT
2. Query profiles table for: name, belt, stripes, birthday, gender,
   weight_lbs, training_goals, experience_level, gym_name,
   gym_affiliation, target_frequency, session_count
3. Compute age from birthday
4. Query sessions for the target week (Monday-Sunday)
5. Query sessions for the prior week (for delta)
6. If 0 sessions this week → return error "no sessions"
7. Check for existing insight with same (user_id, 'weekly', week_start)
   → if exists, return error "already generated"
8. Aggregate week data:
   - Total minutes, mode/kind breakdown
   - Unique techniques drilled
   - Sparring rounds, submissions given/received
   - Injuries mentioned
   - Unique instructor names
   - Unique lesson topics
   - Compute sentiment from notes/transcript
   - Detect patterns via journal-patterns
9. Compute prior week delta (sessions, sparring, new techniques, recurring injuries)
10. Fetch monthly/quarterly context if exists (null for Phase 1)
11. Build system prompt from PROMPT_ENGINEERING.md template
12. Call Claude Haiku with assembled prompt
13. Parse JSON response, validate schema
14. Insert into insights table
15. Return the insight to the client
```

### System Prompt

Use the redesigned prompt from PROMPT_ENGINEERING.md. Key sections:

1. **WHO THIS PERSON IS** -- name, belt, stripes, session count, months training, experience level, gym
2. **WHY THEY TRAIN** -- training_goals with motivation-specific framing instructions
3. **AGE CONTEXT** -- computed from birthday, adjusts recovery/volume language
4. **GENDER CONTEXT** -- if provided, subtle social dynamics adjustments
5. **BELT-SPECIFIC RULES** -- tone, vocabulary ceiling, forbidden topics, 3-4 stripe adjustment
6. **THIS WEEK'S DATA** -- sessions, minutes, techniques, sparring, injuries, sentiment, patterns, instructors, topics
7. **COMPARED TO LAST WEEK** -- deltas
8. **OUTPUT RULES** -- paragraph format, bold markers, watch items, focus recommendation

### Output Schema (Updated for Message Style)

```typescript
interface WeeklyInsightOutput {
  paragraphs: Array<{
    text: string;       // Paragraph body. **bold** for emphasis.
    isWatch: boolean;   // True = injury/risk paragraph
    defer?: string;     // Coach deferral line (only when isWatch)
  }>;
  focusNext: string;    // "This week, try this" recommendation
}
```

The prompt must be explicit about this output format:

```
OUTPUT FORMAT -- respond with valid JSON only, no markdown wrapping:
{
  "paragraphs": [
    {
      "text": "Paragraph text. Use **bold** for key phrases.",
      "isWatch": false
    },
    {
      "text": "Injury or risk paragraph.",
      "isWatch": true,
      "defer": "Worth talking to your coach about this."
    }
  ],
  "focusNext": "One specific, actionable recommendation."
}

RULES:
- 2-4 paragraphs. Lead with the most interesting pattern.
- Only mark isWatch: true for injuries or genuine concerns.
- Vary your opening. Do not start with the user's name.
- Use **bold** sparingly -- 1-2 phrases per insight, max.
- focusNext must pass the "can they do this tomorrow" test.
```

### Error Handling

- If Claude returns invalid JSON: retry once with `temperature: 0`
- If second attempt fails: return error to client, don't insert garbage
- If Anthropic API is down: return error, client shows "pull down to retry"
- Timeout: 30s for Haiku (generous -- typical response is 2-5s)
- Strip code fences if Claude wraps JSON in ```json``` markers

### Token Tracking

Store `input_tokens` and `output_tokens` from the Anthropic response in the insights row. This lets us monitor cost and prompt efficiency over time.

### CORS

Must handle OPTIONS preflight. Follow the pattern in `extract-session` edge function:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## Trigger: When to Generate

### Client-Side Trigger (in session-service.ts)

After a session is saved successfully:

```typescript
async function maybeTriggerWeeklyInsight(userId: string) {
  // 1. Get current week bounds (Monday-Sunday)
  const weekStart = getMonday(new Date());

  // 2. Check if weekly insight already exists for this week
  const existing = await insightService.getWeeklyForPeriod(userId, weekStart);
  if (existing) return; // Already generated

  // 3. Check if enough time since last insight (7+ days)
  const lastInsight = await insightService.getLatestWeekly(userId);
  if (lastInsight) {
    const daysSince = daysBetween(lastInsight.period_end, new Date());
    if (daysSince < 7) return; // Too soon
  }

  // 4. Check if 1+ session this week (we just saved one, so yes)
  // But verify in case of edge cases

  // 5. Fire and forget -- don't block session save
  insightService.generateWeekly(userId, weekStart).catch(console.error);
}
```

This runs in the background after session save. The user doesn't wait for it. Next time they open the Insights tab, the new insight is there.

### Manual Trigger (Pull-to-Refresh)

When user pulls to refresh on the Insights tab:
1. Reload existing insights from Supabase
2. Check generation eligibility (same logic as above)
3. If eligible, trigger generation and refresh again on completion

---

## Testing

### Curl Test

```bash
# Get JWT from Supabase auth
JWT="<user_jwt>"
PROJECT="<supabase_project_ref>"

curl -X POST "https://$PROJECT.supabase.co/functions/v1/generate-weekly" \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<user_uuid>",
    "week_start": "2026-03-24"
  }'
```

### Expected Response

```json
{
  "id": "uuid",
  "paragraphs": [
    {
      "text": "Three sessions this week, right at your target. At this stage, showing up IS the progress.",
      "isWatch": false
    },
    {
      "text": "You drilled hip escapes in two of three sessions. That repetition is the point -- your body is memorizing a movement that shows up everywhere.",
      "isWatch": false
    }
  ],
  "focusNext": "During sparring, count how many times you get back to guard after being passed. That number is your real progress metric right now."
}
```

### Validation Checklist

- [ ] Edge function deploys without error
- [ ] CORS preflight returns 200
- [ ] Auth: rejects requests without valid JWT
- [ ] Auth: rejects requests for other users' data
- [ ] Returns valid JSON matching WeeklyInsightOutput schema
- [ ] Respects belt-specific tone rules (test with white belt and blue belt profiles)
- [ ] Uses training_goals in framing (test with "Self-Defense" vs "Fitness")
- [ ] Age context adjusts language (test with 25-year-old vs 45-year-old)
- [ ] Injury paragraphs have isWatch: true and defer string
- [ ] No duplicate insights for same week (unique constraint)
- [ ] Token counts stored in insights row
- [ ] 30s timeout doesn't trigger on normal requests
- [ ] Handles Anthropic API errors gracefully
- [ ] Handles invalid JSON from Claude (retry with temperature 0)
