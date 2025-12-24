# Prototype vs. Production Architecture Conflicts

**Version:** 1.0
**Last Updated:** October 8, 2025
**Status:** Gap Analysis Complete

---

## Executive Summary

The current prototype demonstrates core functionality (conversational AI book discovery) but lacks production-grade infrastructure, caching, authentication, and scalability. This document identifies conflicts between the prototype and the production architecture defined in the TRD.

**Key Takeaway:** The prototype's frontend can be preserved with minimal changes, but the backend requires a complete rewrite.

---

## 1. Architecture Comparison

### 1.1 Current Prototype (As-Is)

```
┌─────────────────────────────────────────────┐
│  React Frontend (Vite + TypeScript)         │
│  - Components: SearchInput, BookCard, etc.  │
│  - Hooks: useClaudeChat, useConversation    │
│  - Mock Catalog: public/data/catalog.json   │
└────────────────────┬────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────┐
│  Netlify Serverless Function                │
│  - netlify/functions/claude-chat.js         │
│  - Direct call to Anthropic API             │
│  - No caching, no rate limiting             │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│  Anthropic Claude API                       │
│  - Model: claude-3-haiku-20240307           │
│  - Temperature: 0.3                         │
│  - Max tokens: 1500                         │
└─────────────────────────────────────────────┘
```

**Characteristics:**
- ✅ Fast to deploy (Netlify auto-deployment)
- ✅ Zero infrastructure management
- ✅ Demonstrates conversational UX effectively
- ❌ No caching (every query costs $0.02)
- ❌ No vector search (Claude parses entire catalog in prompt)
- ❌ No authentication
- ❌ No rate limiting
- ❌ No error resilience (fallbacks)
- ❌ Doesn't scale beyond 50 concurrent users

---

### 1.2 Production Architecture (To-Be from TRD)

```
┌─────────────────────────────────────────────┐
│  React PWA (Same Frontend Components)      │
│  - API endpoint changes only                │
└────────────────────┬────────────────────────┘
                     │ HTTPS via CloudFront CDN
                     ▼
┌─────────────────────────────────────────────┐
│  FastAPI Backend (AWS ECS Fargate)          │
│  - Python 3.11, async/await                 │
│  - Orchestrates multi-API calls             │
└──┬──────────┬──────────┬──────────┬─────────┘
   │          │          │          │
   ▼          ▼          ▼          ▼
┌──────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│Redis │ │Pinecone │ │PostgreSQL│ │Claude API│
│Cache │ │ Vector  │ │   RDS    │ │          │
│      │ │   DB    │ │          │ │          │
└──────┘ └─────────┘ └──────────┘ └──────────┘
   ▲                       ▲
   │                       │
   └───────────────────────┘
   Plus: ILS APIs (Polaris/Koha)
         OverDrive API
```

**Characteristics:**
- ✅ 60-70% cache hit rate (Redis)
- ✅ Semantic vector search (Pinecone)
- ✅ JWT authentication with ILS validation
- ✅ Rate limiting per library (Redis)
- ✅ Circuit breakers + fallbacks
- ✅ Scales to 500+ concurrent users
- ✅ Monitoring & observability (CloudWatch, X-Ray)
- ❌ More complex to deploy and maintain
- ❌ Higher infrastructure costs ($137-270/month per library)

---

## 2. Detailed Conflict Analysis

### 2.1 Backend Framework

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **Runtime** | Node.js (Netlify Functions) | Python 3.11 (FastAPI) | ⚠️ **MAJOR** |
| **Deployment** | Serverless (Netlify) | Containerized (ECS Fargate) | ⚠️ **MAJOR** |
| **Concurrency** | Single-threaded per invocation | Async multi-tasking | ⚠️ **MAJOR** |

**Impact:**
- Backend must be **rewritten from scratch** in Python
- Cannot migrate Node.js code to FastAPI (different ecosystems)
- Deployment pipeline changes (GitHub Actions → ECS instead of Netlify)

**Migration Strategy:**
1. Week 1-2: Scaffold FastAPI project (see TRD Section 4.2)
2. Week 3: Reimplement Netlify function logic in FastAPI
3. Week 4: Add caching, rate limiting, auth layers
4. Week 5-6: End-to-end testing before cutover

---

### 2.2 Data Storage

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **Catalog** | Static JSON (69 books) | PostgreSQL + Pinecone (100K+ books) | ⚠️ **MAJOR** |
| **Sessions** | None (anonymous) | PostgreSQL + Redis | ⚠️ **MAJOR** |
| **Embeddings** | None (Claude parses JSON) | Pinecone vector DB | ⚠️ **MAJOR** |

**Current Prototype Approach:**
```javascript
// netlify/functions/claude-chat.js (line 40)
const { messages, systemPrompt } = JSON.parse(event.body);

// systemPrompt includes entire catalog JSON (line 23 in promptBuilder.ts)
const catalogSummary = catalog.map(book => ({...}));
return `AVAILABLE BOOKS CATALOG:\n${JSON.stringify(catalogSummary, null, 2)}`;
```

**Problem:** This approach breaks at scale:
- 69 books = ~5K tokens (~$0.015 per query)
- 1,000 books = ~75K tokens (exceeds Claude's context window)
- 100,000 books = impossible

**Production Approach (TRD Section 5.3):**
```python
# 1. Embed query
query_vector = await embed_query("I want beach reads")

# 2. Semantic search in Pinecone (top 20 most relevant)
candidates = await pinecone.query(
    vector=query_vector,
    filter={"library_id": "lib_123"},
    top_k=20
)

# 3. Only send top 20 to Claude (not entire catalog)
prompt = build_prompt(query, candidates)  # ~2K tokens
```

**Migration Path:**
1. Week 1: Set up Pinecone index
2. Week 2: Run ETL job to embed all books (see TRD Section 15.5)
3. Week 3: Update backend to query Pinecone before Claude
4. Week 4: Replace catalog.json references with database queries

---

### 2.3 Caching

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **Query Cache** | None | Redis (1h TTL) | ⚠️ **MAJOR** |
| **Embedding Cache** | None | Redis (permanent) | ⚠️ **MAJOR** |
| **Catalog Cache** | None | Redis (24h TTL) | ⚠️ **MAJOR** |

**Current Behavior:**
- Every query = fresh Claude API call ($0.02 each)
- No deduplication of identical queries
- 1,000 queries/day × $0.02 = $20/day = $600/month per library

**Production Savings (TRD Section 8.1):**
- 60% cache hit rate → 400 Claude calls (vs. 1,000)
- Cost: $8/day = $240/month per library (60% savings)

**Implementation Gap:**
```python
# Production caching layer (TRD Section 4.2.1)
cache_key = f"search:{library_id}:{hash(query)}"
cached = await redis.get(cache_key)
if cached:
    return cached  # Skip Claude API call entirely
```

**Migration Action:**
- Add Redis to infrastructure (ElastiCache)
- Wrap search function with cache-aside pattern
- Set appropriate TTLs per data type (see TRD Section 8.2)

---

### 2.4 Authentication

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **User Auth** | None (fully anonymous) | JWT with ILS validation | ⚠️ **MAJOR** |
| **API Keys** | Stored in Netlify env vars | AWS Secrets Manager | ⚠️ **MODERATE** |
| **Rate Limiting** | None | 100 req/min per library | ⚠️ **MAJOR** |

**Current Prototype:**
- Anyone can query the API without authentication
- No rate limiting → vulnerable to abuse
- No concept of "library" (single catalog)

**Production Requirements (TRD Section 7.1):**
```python
# 1. Patron logs in with library card + PIN
@app.post("/api/auth/login")
async def login(card_number: str, pin: str, library_id: str):
    # Validate with ILS API
    patron = await ils_client.authenticate(card_number, pin)

    # Generate JWT (no PII in payload)
    jwt_token = create_jwt(library_id=library_id)

    # Return httpOnly cookie
    response.set_cookie("session", jwt_token, httponly=True, secure=True)
    return {"ok": True}

# 2. All API requests require valid JWT
@app.middleware("http")
async def validate_auth(request: Request, call_next):
    jwt_token = request.cookies.get("session")
    if not jwt_token:
        raise HTTPException(401, "Unauthorized")
    # Decode and validate
    payload = jwt.decode(jwt_token, SECRET_KEY)
    request.state.library_id = payload["library_id"]
    return await call_next(request)
```

**Migration Decision:**
- **Prototype Phase:** Keep anonymous (simplifies demos)
- **Production Phase 1:** Add JWT auth before pilot launch
- **Backward Compatibility:** Frontend can work with or without auth

---

### 2.5 Error Handling

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **Retry Logic** | Basic (2 retries) | Exponential backoff + jitter | ✅ **MINOR** |
| **Fallbacks** | None | Keyword search, cached similar queries | ⚠️ **MAJOR** |
| **Circuit Breakers** | None | For ILS/OverDrive APIs | ⚠️ **MAJOR** |

**Current Prototype (useClaudeChat.ts:89-94):**
```typescript
if (shouldRetry && retryCount < 2) {
    // Wait before retrying (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
    return sendMessage(userMessage, conversationHistory, retryCount + 1);
}
```

**Good:** Has basic retry logic
**Missing:**
- No fallback if all retries fail → user sees error
- No cached similar query fallback
- No circuit breaker (keeps hammering failing API)

**Production Approach (TRD Section 9.1):**
```python
try:
    return await rag_search(query, library_id)
except ClaudeAPIError as e:
    if e.is_rate_limit:
        return await cache_search_similar(query, library_id)  # Fallback 1
    elif e.is_overloaded:
        return await keyword_search(query, library_id)        # Fallback 2
except PineconeTimeout:
    return await keyword_search(query, library_id)            # Fallback 3
```

**Migration Action:**
- Add fallback layers gradually (Phase 1.5)
- Implement circuit breaker library (e.g., `circuitbreaker` package)

---

### 2.6 Monitoring & Observability

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **Logging** | Console.log only | Structured JSON logs → CloudWatch | ⚠️ **MAJOR** |
| **Metrics** | None | Custom CloudWatch metrics | ⚠️ **MAJOR** |
| **Tracing** | None | AWS X-Ray distributed tracing | ⚠️ **MAJOR** |
| **Alerts** | None | PagerDuty for P95 latency > 3s | ⚠️ **MAJOR** |

**Current Prototype:**
```javascript
// netlify/functions/claude-chat.js:77-79
console.log(`Initializing Anthropic with model: claude-3-haiku-20240307`);
console.log(`API Key present: ${apiKey ? 'Yes' : 'No'}`);
console.log('Successfully processed Claude API request');
```

**Problems:**
- No structured logging (hard to parse)
- No request tracing (can't debug slow queries)
- No metrics (can't measure cache hit rate, latency)

**Production Requirements (TRD Section 13.1):**
```python
import logging
import json

logger.info("Search completed", extra={
    "request_id": "uuid",
    "library_id": "lib_123",
    "duration_ms": 1847,
    "cache_hit": False,
    "claude_tokens": 1500
})

# Distributed tracing (TRD Section 13.3)
from aws_xray_sdk.core import xray_recorder

@xray_recorder.capture('search_service')
async def search(query, library_id):
    # X-Ray automatically traces subsegments
    with xray_recorder.capture('embed_query'):
        vector = await embed_query(query)
```

**Migration Action:**
- Set up CloudWatch Logs + X-Ray at infrastructure layer
- Replace `console.log` with structured logging library
- Add custom metrics for business KPIs

---

### 2.7 Model Choice

| Aspect | Prototype | Production (TRD) | Conflict? |
|--------|-----------|------------------|-----------|
| **Claude Model** | Haiku (claude-3-haiku-20240307) | Sonnet 4.5 (claude-sonnet-4-5-20250929) | ⚠️ **MODERATE** |

**Current Prototype (netlify/functions/claude-chat.js:82-87):**
```javascript
const response = await client.messages.create({
  model: 'claude-3-haiku-20240307',  // Fastest, cheapest
  max_tokens: 1500,
  temperature: 0.3,
  system: systemPrompt,
  messages: messages
});
```

**Haiku Specs:**
- Speed: ~1s response time
- Cost: $0.25/1M input tokens, $1.25/1M output tokens
- Quality: Good for simple tasks

**Sonnet 4.5 Specs (TRD recommendation):**
- Speed: ~1.5s response time
- Cost: $3/1M input tokens, $15/1M output tokens
- Quality: Superior reasoning, fewer hallucinations

**Cost Comparison (1,000 queries/day):**
- Haiku: (1M tokens in + 0.5M tokens out) × 1K queries = $0.25 + $0.625 = ~$0.88/day = $26/month
- Sonnet: (1M tokens in + 0.5M tokens out) × 1K queries = $3 + $7.50 = ~$10.50/day = $315/month

**Decision:**
- **Prototype:** Keep Haiku (fast, cheap, good enough for demos)
- **Production:** Switch to Sonnet 4.5 (better quality matters more)
- **Migration:** Change model string in one line

---

## 3. Frontend Impact Analysis

### 3.1 What Stays the Same ✅

| Component | Reusable? | Notes |
|-----------|-----------|-------|
| **React Components** | Yes (100%) | All components reusable as-is |
| **TypeScript Types** | Yes (95%) | Minor additions for new API fields |
| **UI/UX Flow** | Yes (100%) | User experience unchanged |
| **Styling (Tailwind)** | Yes (100%) | No CSS changes needed |

**Example: SearchInput Component**
```typescript
// src/components/SearchInput.tsx
// ✅ No changes needed - just update API endpoint
const response = await fetch('/api/search', {  // Was: /.netlify/functions/claude-chat
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({messages, systemPrompt})
});
```

---

### 3.2 What Needs Minor Changes ⚠️

| Aspect | Change Required | Complexity |
|--------|----------------|------------|
| **API Endpoint URLs** | Change from Netlify Functions to FastAPI | Low |
| **Response Schema** | Add `cache_hit`, `confidence` fields | Low |
| **Error Handling** | Handle new error codes (429 rate limit) | Low |
| **Auth Headers** | Send JWT cookie (automatic) | None |

**Example: Updated API Response**
```typescript
// Before (Prototype)
{
  "content": "Here are some books...",
  "usage": {input_tokens: 1000, output_tokens: 500}
}

// After (Production)
{
  "recommendations": [
    {isbn: "...", title: "...", availability: {...}}
  ],
  "response_text": "Here are some books...",
  "confidence": 0.92,
  "handoff_to_librarian": false,
  "cache_hit": true,  // NEW
  "response_time_ms": 45  // NEW
}
```

**Frontend Change:**
```typescript
// src/hooks/useClaudeChat.ts
const data = await response.json();
const content = data.response_text;  // Was: data.content
const books = data.recommendations;  // NEW: Backend extracts books
```

---

## 4. Migration Strategy

### 4.1 Phased Approach (Recommended)

**Phase 1: Backend Scaffold (Week 1-2)**
- Set up FastAPI project structure (TRD Section 4.2)
- Implement PostgreSQL schema (TRD Section 5.1)
- Deploy Redis locally for development
- Containerize with Docker

**Phase 2: Core Services (Week 3-5)**
- Implement search service with caching
- Integrate Pinecone for vector search
- Build ILS abstraction layer
- Add JWT authentication
- Add rate limiting middleware

**Phase 3: Integration (Week 6-8)**
- Update frontend API endpoints
- Replace catalog.json with PostgreSQL + Pinecone
- Connect to ILS sandbox environments
- End-to-end testing

**Phase 4: Production Hardening (Week 9-12)**
- Implement error handling & fallbacks
- Set up monitoring (CloudWatch, X-Ray)
- Security hardening (penetration test)
- Load testing (500 concurrent users)

**Phase 5: Pilot Launch (Week 13-16)**
- Deploy to AWS production
- Onboard 5-7 pilot libraries
- Monitor & iterate based on feedback

---

### 4.2 Backward Compatibility Strategy

**Option 1: Feature Flag (Recommended for Gradual Migration)**
```typescript
// Frontend: Toggle between old and new backend
const API_BASE_URL = import.meta.env.VITE_USE_NEW_BACKEND === 'true'
  ? 'https://api.librarian-llm.com'  // Production FastAPI
  : '/.netlify/functions';           // Prototype Netlify

// Gradual rollout: 10% → 50% → 100% traffic
```

**Option 2: Hard Cutover**
- Keep Netlify Functions running for 2 weeks as backup
- Switch all traffic to FastAPI on launch day
- Rollback to Netlify if critical issues found

**Recommendation:** Use **Option 1** for risk mitigation

---

## 5. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Backend rewrite takes longer than 6 weeks** | Medium | High | Start early; use TRD as blueprint |
| **Frontend API changes break prototype** | Low | Medium | Feature flag allows rollback |
| **Pinecone ingestion fails for large catalogs** | Low | High | Test with 10K books first, then scale |
| **ILS API quirks delay integration** | Medium | High | Sandbox testing + abstraction layer |
| **Cache invalidation bugs** | Medium | Low | Conservative TTLs (1h → 5m if issues) |
| **Costs exceed budget** | Low | Medium | Monitor daily; aggressive caching |

---

## 6. Cost Impact Analysis

### 6.1 Prototype Costs (Current)

| Item | Monthly Cost | Notes |
|------|--------------|-------|
| Netlify Hosting | $0 | Free tier (100GB bandwidth) |
| Claude API (Haiku) | ~$100 | 5K queries/month, no caching |
| **Total** | **~$100/month** | |

### 6.2 Production Costs (TRD Section 14.1)

| Item | Monthly Cost | Notes |
|------|--------------|-------|
| AWS Infrastructure | $106 | ECS, RDS, ElastiCache, CloudFront |
| Claude API (Sonnet 4.5) | $42 | 10K queries/month, 60% cache hit rate |
| Pinecone | $7 | 100K vectors (shared across libraries) |
| **Total** | **~$155/library/month** | |

**Cost Increase:** $55/month per library (+55%)
**But:** Production scales to 500+ users (vs. prototype's 50)

**Revenue Model (TRD Section 14.3):**
- Small library: $300/month revenue - $155 cost = $145 profit (48% margin)
- Medium library: $600/month revenue - $155 cost = $445 profit (74% margin)

**Verdict:** Increased cost is justified by scalability and features

---

## 7. Recommended Next Steps

### 7.1 Immediate Actions (This Week)

1. ✅ **TRD Approved:** Stakeholder review of technical architecture
2. ⬜ **AWS Account Setup:** Provision dev/staging/prod environments
3. ⬜ **Terraform Infrastructure:** Deploy VPC, ECS, RDS, Redis
4. ⬜ **Pinecone Account:** Create index, test ingestion with 100 books

### 7.2 Week 1-2: Backend Scaffold

1. ⬜ Scaffold FastAPI project (TRD Section 4.2)
2. ⬜ Implement PostgreSQL schema (TRD Section 5.1)
3. ⬜ Set up Docker + GitHub Actions CI/CD
4. ⬜ Deploy to AWS staging environment

### 7.3 Week 3-4: Core Services

1. ⬜ Implement search service with Redis caching
2. ⬜ Integrate Pinecone vector search
3. ⬜ Build ILS abstraction layer (Polaris client first)
4. ⬜ Add JWT authentication middleware

### 7.4 Week 5-6: Frontend Integration

1. ⬜ Update frontend to call FastAPI (feature flag)
2. ⬜ Replace catalog.json with database queries
3. ⬜ End-to-end testing on staging
4. ⬜ Accessibility audit (WCAG 2.1 AA)

### 7.5 Week 7-8: Production Hardening

1. ⬜ Implement fallback layers (TRD Section 9.1)
2. ⬜ Set up CloudWatch monitoring
3. ⬜ Security penetration test
4. ⬜ Load test (500 concurrent users)

### 7.6 Week 9+: Pilot Launch

1. ⬜ Onboard 5-7 pilot libraries
2. ⬜ Deploy to production (gradual traffic shift)
3. ⬜ Monitor metrics, iterate based on feedback

---

## 8. Conclusion

### 8.1 Summary of Conflicts

| Category | Severity | Count |
|----------|----------|-------|
| **MAJOR (Requires Rewrite)** | 🔴 Critical | 9 |
| **MODERATE (Significant Work)** | 🟡 Important | 2 |
| **MINOR (Simple Changes)** | 🟢 Easy | 3 |

**Key Takeaway:** Prototype demonstrates UX effectively, but production requires backend rewrite. Frontend can be preserved with minimal changes.

### 8.2 Go/No-Go Decision

**Recommendation: ✅ GO**

**Rationale:**
1. Prototype validates product-market fit (conversational search works)
2. TRD provides clear implementation path (6-month timeline realistic)
3. Frontend reusability reduces risk (50% of code preserved)
4. Cost model is sustainable (48-74% gross margins)
5. Technology choices are battle-tested (FastAPI, PostgreSQL, Redis)

**Critical Path:**
1. Secure pilot library commitments (5-7 libraries) → **Week 1**
2. Provision AWS infrastructure → **Week 1-2**
3. Backend rewrite sprint → **Week 3-8**
4. Integration testing → **Week 9-10**
5. Pilot launch → **Week 11-12**

---

**Document Status:** ✅ Complete
**Next Action:** Stakeholder review of migration timeline
**Owner:** Engineering Team
**Approval Required From:** Product, Engineering, Finance

