# Critical Errors Log - Librarian LLM
**IMPORTANT: Read this before making ANY changes to Claude API integration**

---

## Error #001: Invalid Claude Model Name (October 2024)
**Date:** October 2024
**Severity:** CRITICAL - Complete API failure
**Impact:** Chatbot returns "I apologize, but I'm having trouble connecting right now"

### What Went Wrong:
1. **Used non-existent model:** `claude-3-5-sonnet-20241022` ❌
2. **Used incompatible prompt caching syntax** with SDK v0.27.3 ❌

### Root Causes:
- Assumed model `claude-3-5-sonnet-20241022` existed (it doesn't)
- Tried to use array-based system prompt with caching (not supported in SDK 0.27.3)

### The Fix:
```javascript
// ❌ WRONG - What broke the app:
const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20241022', // DOESN'T EXIST!
  system: [{
    type: "text",
    text: systemPrompt,
    cache_control: { type: "ephemeral" } // NOT SUPPORTED in v0.27.3
  }],
  //...
});

// ✅ CORRECT - What works:
const response = await client.messages.create({
  model: 'claude-3-5-sonnet-20240620', // Valid model
  system: systemPrompt, // Simple string format
  temperature: 0.2, // Low for catalog adherence
  max_tokens: 1500,
  messages: messages
});
```

### Valid Claude Models (as of Oct 2024):
```
✅ claude-3-5-sonnet-20240620    - Best quality, good instruction following
✅ claude-3-haiku-20240307       - Fast and cheap
✅ claude-3-opus-20240229        - Most capable but slower
✅ claude-3-sonnet-20240229      - Balanced

❌ claude-3-5-sonnet-20241022    - DOESN'T EXIST
❌ claude-sonnet-4-5             - Future model, not yet available
```

### SDK Compatibility Notes:
- **Current SDK:** @anthropic-ai/sdk v0.27.3
- **System prompt:** Use simple string `system: "prompt text"`
- **Prompt caching:** NOT supported in array format until later versions
- **Temperature:** Use 0.2 or lower for catalog-only responses

### Testing Commands:
```bash
# Test local function
npm run dev:netlify
# Then: curl -X POST http://localhost:8888/.netlify/functions/claude-chat ...

# Test production function
curl -X POST https://librarian-llm.netlify.app/.netlify/functions/claude-chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"systemPrompt\":\"test\"}"
```

### Lessons Learned:
1. **Always verify model names** against official Anthropic docs
2. **Check SDK version compatibility** before using new features
3. **Test locally AND in production** after changes
4. **Model names include dates** (YYYYMMDD format)
5. **Prompt caching syntax varies** by SDK version

### Prevention Checklist:
- [ ] Verify model name exists in Anthropic docs
- [ ] Check SDK version in package.json
- [ ] Use compatible syntax for that SDK version
- [ ] Test with curl locally first
- [ ] Deploy and test production endpoint

---

## Error #002: [Reserved for next critical error]

---

**Remember:** When in doubt, use the stable, proven configuration above!