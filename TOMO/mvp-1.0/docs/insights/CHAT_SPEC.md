# Chat Follow-Up Spec

## Overview

After reading any insight (weekly/monthly/quarterly), users can tap "Ask about this" to chat with the same model. Max 5 user messages. Scoped to the parent insight's context.

## UI Flow

1. User reads insight card
2. Taps "Ask about this" -> chat interface slides up
3. Input field + "(0/5)" counter
4. Each exchange: user message -> model response -> counter increments
5. After 5th exchange: conversation closes, coach deferral message shown
6. Conversation remains readable in history, can't be continued

## Conversation Payload Structure

```typescript
interface ChatRequest {
  insightId: string; // parent insight UUID
  tier: 'weekly' | 'monthly' | 'quarterly';
  userMessage: string;
  // Everything below is sent on first message, cached server-side after
  context?: {
    insightData: object; // the parent insight's full output
    userContext: UserContextDocument;
    belt: BeltLevel;
    chatbotConfig: ChatbotAdaptation;
  };
}

interface ChatResponse {
  message: string;
  exchangeCount: number; // 1-5
  complete: boolean; // true after 5th exchange
  closeMessage?: string; // coach deferral, only when complete=true
}
```

## Model Routing

Same model as the parent insight:

- Weekly -> Haiku
- Monthly -> Sonnet
- Quarterly -> Opus

## System Prompt Per Tier

- **Weekly (Haiku):** "You're continuing a conversation about this week's training. Keep answers tactical, 1-3 sentences. Suggest specific drills or positions."
- **Monthly (Sonnet):** "You're continuing a conversation about this month's training review. Provide development-oriented answers, 2-4 sentences. Connect to the bigger picture."
- **Quarterly (Opus):** "You're continuing a conversation about the quarterly assessment. Provide strategic, analytical answers. This is a private lesson -- give it the weight it deserves."

## Token Budget

- First exchange: system prompt + insight + UCD + user message = ~800-2000 tokens input
- Each subsequent: adds ~200-400 tokens (conversation history growth)
- 5th exchange worst case: ~3000-5000 tokens input
- Output per exchange: 100-400 tokens depending on tier

## Conversation Storage

```typescript
interface StoredConversation {
  id: string;
  userId: string;
  insightId: string;
  tier: 'weekly' | 'monthly' | 'quarterly';
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  exchangeCount: number;
  model: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  createdAt: string;
  updatedAt: string;
}
```

## UCD Learning From Conversations

After a conversation completes, the pattern engine analyzes:

- What type of questions did the user ask? (tactical, conceptual, emotional)
- Which topics did they dig into? (technique, sparring, consistency)
- Did they express preferences? ("I prefer specific drills over concepts")

This feeds into the UCD's `chatPreferences` field.

## Close Message

After 5th exchange: "That's our 5 for this one. Bring these questions to your next session with your coach -- they'll have the best answers for your specific game."

## Edge Cases

- **User sends empty message:** reject with "Ask anything about this insight"
- **User sends very long message (>500 chars):** truncate with notice
- **Model error:** "Couldn't process that -- try rephrasing"
- **Insight was generated before UCD existed:** use belt defaults only
