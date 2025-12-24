# Claude API Quick Reference - Librarian LLM
**⚠️ ALWAYS CHECK THIS BEFORE EDITING CLAUDE INTEGRATION ⚠️**

## Current Working Configuration
```javascript
// File: netlify/functions/claude-chat.js
// SDK: @anthropic-ai/sdk v0.27.3

const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20240620',  // ✅ VERIFIED WORKING
  max_tokens: 1500,
  temperature: 0.2,                      // Low = follows instructions better
  system: systemPrompt,                  // String format (not array!)
  messages: messages
});
```

## DO NOT USE (Common Mistakes)
```javascript
// ❌ These will break the app:
model: 'claude-3-5-sonnet-20241022'     // Doesn't exist
model: 'claude-sonnet-4-5'              // Not available yet
system: [{...}]                          // Array format not supported in v0.27.3
temperature: 0.7                         // Too high - ignores catalog
```

## Environment Variables
```bash
# Both uppercase and lowercase supported
CLAUDE_API_KEY=sk-ant-api03-...
claude_api_key=sk-ant-api03-...
```

## Testing Workflow
1. **Before making changes:** Read this file
2. **After making changes:**
   ```bash
   # Local test
   npm run dev:netlify
   curl http://localhost:8888/.netlify/functions/claude-chat

   # Deploy
   git add . && git commit -m "fix: ..." && git push

   # Production test (wait 2 min after push)
   curl https://librarian-llm.netlify.app/.netlify/functions/claude-chat
   ```

## Model Selection Guide
| Use Case | Model | Why |
|----------|-------|-----|
| Production (Current) | `claude-3-5-sonnet-20240620` | Best instruction following |
| Fast/Cheap Testing | `claude-3-haiku-20240307` | 10x cheaper, still good |
| Maximum Quality | `claude-3-opus-20240229` | Most capable but slow |

## Red Flags to Watch For
- 🚨 Model name doesn't match YYYYMMDD format
- 🚨 Using array syntax for system prompt
- 🚨 Temperature above 0.3 for catalog search
- 🚨 Not testing locally before deploying

## Error Messages & Solutions
| Error | Cause | Fix |
|-------|-------|-----|
| "model: claude-3-5-sonnet-XXXXX" | Invalid model name | Use verified model from list |
| "having trouble connecting" | API call failed | Check model name & syntax |
| Returns web results | Temperature too high | Lower to 0.2 |
| Returns non-catalog books | Weak system prompt | Strengthen "ONLY from catalog" |

---
**Last Updated:** October 2024
**Last Verified Working:** Production deployment with claude-3-5-sonnet-20240620