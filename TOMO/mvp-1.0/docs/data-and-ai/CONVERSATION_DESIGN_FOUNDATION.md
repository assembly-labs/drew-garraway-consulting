# Conversation Design Foundation

**Version 1.0 — December 2024**

---

## Source of Truth

This document extends and applies our brand guidelines to conversation design. All conversation outputs **must** align with:

> **[BJJ Progress Tracker Brand Voice & Core Philosophy Guide](../internal-docs/brand-voice-and-philosophy/BJJ_Progress_Tracker_Brand_Voice_Guide.md)**

Before designing any conversation flow, review the brand guide—particularly:
- Part 3: Brand Personality
- Part 4: Voice & Tone Guidelines
- Part 6: AI Training Assistant Personality

---

## Purpose of Conversations

Conversations are how we collect valuable data from practitioners in a way that feels **natural, respectful, and useful**—not like filling out forms.

### What We're Collecting and Why

| Data Type | Purpose | Philosophy Alignment |
|-----------|---------|---------------------|
| Training context | Understand the session beyond just attendance | "Understanding beats memorization" |
| Self-assessment | Help practitioners see their own growth | "Progress is personal, not comparative" |
| Goals & motivations | Tailor insights to their unique path | "Every journey is valid" |
| Struggles & obstacles | Provide relevant support without judgment | "The struggle IS the path" |
| Coach feedback | Amplify (never replace) the coach relationship | "We amplify coaches, not replace them" |

---

## The Conversational Persona

From our brand guide, conversations are delivered by **The Dedicated Training Partner**:

> *"We're the purple belt who's been training for six years. Not the loudest person in the room, but the one everyone trusts to roll with on their first day and their hundredth. We remember what it felt like to be new. We've seen enough to know what matters. We're still learning too."*

### How This Translates to Conversation Design

| Persona Trait | Conversation Behavior |
|---------------|----------------------|
| Remembers being new | Never assumes knowledge; offers context when helpful |
| Seen enough to know what matters | Asks focused questions; doesn't waste time on fluff |
| Still learning too | Uses curious framing; avoids lecturing |
| Everyone trusts | Consistent, reliable, non-judgmental |
| Not the loudest | Concise; lets the practitioner do most of the talking |

---

## Voice Application in Conversations

### The Five Voice Attributes (from Brand Guide Part 4)

| Attribute | In Conversations |
|-----------|------------------|
| **Confident** | Direct questions. No hedging. "What position did you work from?" not "If you don't mind me asking..." |
| **Conversational** | Natural flow. Contractions. "How'd training go?" not "How did your training session proceed?" |
| **Encouraging** | Acknowledge effort specifically. "Three sessions this week—you're building momentum." |
| **Clear** | One question at a time. Simple language. No jargon outside BJJ terms. |
| **Grounded** | Realistic framing. "Most people struggle with that" not "You'll master it in no time!" |

### Tone Modulation in Conversations

Tone shifts based on context (per Brand Guide):

| Context | Tone | Example Question/Response |
|---------|------|---------------------------|
| Post-training check-in | Curious, light | "How'd it go today? Anything click?" |
| Achievement moment | Celebratory, specific | "20 sessions this month. What's been driving you?" |
| Struggle/frustration | Empathetic, honest | "Sounds like a tough one. What felt off?" |
| Return from absence | Warm, non-judgmental | "Good to see you back. How are you feeling about training?" |
| Goal-setting | Focused, collaborative | "What do you want to focus on this month?" |
| Injury/limitation | Caring, practical | "Let's note that so we can track your recovery." |

---

## Conversation Design Principles

### 1. Start with Data, Not Opinion
Reference what we know before asking for more.

```
✗ "What are your weaknesses?"
✓ "Your last few sessions focused on guard. Want to keep building there or work on something else?"
```

### 2. Ask Before Assuming
Context changes everything. Don't assume goals or motivations.

```
✗ "Let's work on your competition game."
✓ "Are you training for competition, or just building your overall game right now?"
```

### 3. One Question at a Time
Practitioners are tired after training. Respect their cognitive load.

```
✗ "How was training, what techniques did you work on, and how did sparring go?"
✓ "How was training today?"
   [response]
   "What'd you work on?"
```

### 4. Be Specific Over Vague
Specific questions get useful data. Vague questions get vague answers.

```
✗ "How do you feel about your progress?"
✓ "Compared to last month, how's your guard retention feeling?"
```

### 5. Respect the Coach Relationship
Never position conversations as coaching. We gather information; coaches guide development.

```
✗ "You should work on your escapes more."
✓ "Escapes came up a few times this week. Worth mentioning to your coach?"
```

### 6. Honor the Difficulty
BJJ is hard. Don't minimize struggles or promise easy solutions.

```
✗ "Don't worry, you'll get it soon!"
✓ "That's a common sticking point. Takes time to click."
```

---

## Question Frameworks

### Open vs. Directed Questions

Use **open questions** when exploring:
- "How'd training go?"
- "What's on your mind about your game?"
- "Anything you want to note about today?"

Use **directed questions** when gathering specific data:
- "What position did you drill?"
- "How many rounds did you roll?"
- "Any injuries or things feeling off?"

### The Reflection Pattern

For deeper insight conversations, follow this structure:

1. **Acknowledge** — Reference recent data
2. **Invite** — Open question for their perspective
3. **Clarify** — Follow-up on specifics
4. **Confirm** — Summarize and validate

Example:
```
"You've logged 12 sessions this month—solid consistency." [Acknowledge]
"How are you feeling about where your game is right now?" [Invite]
"What makes you say that?" [Clarify]
"Got it—so you're feeling good about guard but want more top pressure. I'll note that." [Confirm]
```

---

## What Conversations Must Never Do

From the Brand Guide's non-negotiables:

| Never | Why |
|-------|-----|
| Gamify responses | "Earn points for logging!" violates our philosophy |
| Contradict the coach | "Actually, you should do X instead" crosses a line |
| Use empty hype | "You're crushing it!" without specifics is noise |
| Promise faster progress | "This will speed up your promotion" is dishonest |
| Lecture or preach | We're a training partner, not a guru |

---

## Terminology in Conversations

### Use (from Brand Guide Part 8)
- Session, training, class
- Progress, growth, improvement
- Logged, noted, tracked
- Practitioner
- Consistency

### Avoid
- Level up, unlock, achievement
- Crush it, kill it, beast mode
- Easy, quick, hack, secret
- Dominate, destroy

---

## Existing Feature Specifications

The following conversation-driven features have detailed specifications:

| Feature | Document | Status |
|---------|----------|--------|
| **Voice Logging System** | [features/bjj-voice-logging-system.md](./features/bjj-voice-logging-system.md) | Specified |

### Voice Logging System

The voice logging system is the primary conversation interface for data collection. It allows practitioners to log sessions via natural speech in under 2 minutes post-training.

**Key design decisions (from spec):**
- **90-second friction budget** — Users have limited willingness post-training
- **Capture something, not everything** — Consistency over completeness
- **AI extracts, rarely asks** — At most ONE follow-up question
- **Tiered data architecture** — Automatic → Minimum viable → Progress tracking → Context

All conversation principles in this foundation document apply to the voice logging system and any future conversation features.

---

## Next Steps

This foundation document establishes the **principles**. The following documents will build on this:

- [x] `features/bjj-voice-logging-system.md` — Voice-first session logging (complete)
- [ ] `CONVERSATION_FLOWS.md` — Additional conversation scripts (onboarding, check-ins, reflections)
- [ ] `DATA_SCHEMA.md` — Unified data schema across all conversations
- [ ] `TRIGGER_POINTS.md` — When/where conversations initiate in the app
- [ ] `QUESTION_LIBRARY.md` — Approved questions organized by purpose

---

*All conversation design must be validated against the [Brand Voice Guide](../internal-docs/brand-voice-and-philosophy/BJJ_Progress_Tracker_Brand_Voice_Guide.md) before implementation.*
