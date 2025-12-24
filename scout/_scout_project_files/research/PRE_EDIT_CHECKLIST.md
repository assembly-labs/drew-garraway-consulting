# 🔴 STOP! Pre-Edit Checklist for Claude Integration

**Before editing ANY Claude API related files, complete this checklist:**

## 📋 Pre-Edit Checklist

### 1. Review Documentation
- [ ] Read `CRITICAL_ERRORS_LOG.md`
- [ ] Read `CLAUDE_API_REFERENCE.md`
- [ ] Check current SDK version in `package.json`

### 2. Verify Model Names
- [ ] Model name follows format: `claude-X-X-YYYYMMDD`
- [ ] Model exists in Anthropic docs (not guessing)
- [ ] Using `claude-3-5-sonnet-20240620` unless specifically changing

### 3. Check Syntax Compatibility
- [ ] Using string format for `system:` (not array)
- [ ] No prompt caching syntax unless SDK updated
- [ ] Temperature ≤ 0.2 for catalog adherence

### 4. Files to Check Before Editing
```
netlify/functions/claude-chat.js    # Main API function
src/hooks/useClaudeChat.ts          # Frontend integration
src/utils/promptBuilder.ts          # System prompt
.env                                 # API keys (local)
```

### 5. Test Plan
- [ ] Will test locally with `npm run dev:netlify`
- [ ] Will test with curl before deploying
- [ ] Will test production after deployment

## 🚨 High-Risk Changes (Double Check!)
- Changing model name
- Modifying system prompt format
- Updating SDK version
- Adding new API parameters
- Changing temperature settings

## ✅ Safe Changes
- Updating system prompt content (not format)
- Adjusting max_tokens
- Adding error handling
- Improving logging

## 🧪 Test Commands Ready
```bash
# Local test
curl -X POST http://localhost:8888/.netlify/functions/claude-chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"recommend a mystery book"}],"systemPrompt":"You are a librarian. Only recommend: Test Book by Test Author"}'

# Production test
curl -X POST https://librarian-llm.netlify.app/.netlify/functions/claude-chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"systemPrompt":"test"}'
```

## 📝 Commit Message Template
```
fix(claude): [description]

- Model: claude-3-5-sonnet-20240620 ✓
- SDK: v0.27.3 ✓
- Tested: local ✓, production ✓
```

---
**IF UNSURE ABOUT ANYTHING, USE THE WORKING CONFIG IN CLAUDE_API_REFERENCE.md**