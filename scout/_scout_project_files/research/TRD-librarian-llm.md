# Librarian LLM - Technical Requirements Document (TRD)

**Version:** 1.0
**Last Updated:** October 8, 2025
**Status:** Production Architecture Specification
**Author:** Senior Backend Engineering Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack Rationale](#3-technology-stack-rationale)
4. [System Components](#4-system-components)
5. [Data Architecture](#5-data-architecture)
6. [API Specifications](#6-api-specifications)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Caching Strategy](#8-caching-strategy)
9. [Error Handling & Resilience](#9-error-handling--resilience)
10. [Performance Requirements](#10-performance-requirements)
11. [Security Architecture](#11-security-architecture)
12. [Deployment Architecture](#12-deployment-architecture)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Cost Analysis](#14-cost-analysis)
15. [Migration Path: Prototype to Production](#15-migration-path-prototype-to-production)

---

## 1. Executive Summary

### 1.1 Purpose

This Technical Requirements Document (TRD) defines the production architecture for Librarian LLM, translating the Product Requirements Document (PRD) into specific technical implementation details. This document serves as:

- **Engineering blueprint** for the 6-month MVP build
- **Decision record** for technology choices with rationale
- **Reference guide** for deployment, scaling, and operations
- **Gap analysis** between current prototype and production system

### 1.2 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend Framework** | FastAPI (Python) | Native Anthropic SDK, async-first, automatic OpenAPI docs |
| **Frontend** | React 18 + TypeScript | Already prototyped, component reusability, strong typing |
| **LLM Provider** | Claude (Anthropic Sonnet 4.5) | Superior reasoning, zero-retention API, constitutional AI |
| **Vector Database** | Pinecone | Managed service, <100ms queries, metadata filtering |
| **Primary Database** | PostgreSQL 15 | ACID compliance, mature tooling, library familiarity |
| **Caching Layer** | Redis 7 | Sub-10ms latency, automatic TTL, pub/sub for real-time |
| **Authentication** | JWT (not OAuth) | ILS systems don't support OAuth, simpler for Phase 1 |
| **Deployment** | AWS ECS Fargate | No server management, auto-scaling, library sector trust |
| **CDN** | CloudFront | Low latency, HTTPS termination, DDoS protection |

### 1.3 Critical Non-Goals (Out of Scope for Phase 1)

- ❌ OAuth/SAML integration (Phase 2)
- ❌ Real-time collaboration features
- ❌ Mobile native apps (PWA sufficient)
- ❌ Multi-tenancy database sharing (isolated per library)
- ❌ Voice input/output (Phase 2)
- ❌ Streaming media integration (Hoopla/Kanopy - Phase 3)

---

## 2. Architecture Overview

### 2.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Layer (Browsers)                         │
│  Mobile Safari, Chrome, Firefox, Edge                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                CloudFront CDN (Global Edge)                      │
│  - Static assets (React app, images)                            │
│  - Cache: HTML (1h), JS/CSS (1y), images (30d)                  │
│  - TLS 1.3 termination                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│        Application Load Balancer (ALB)                           │
│  - Path-based routing: /api/* → Backend                         │
│  - Health checks every 30s                                       │
│  - Sticky sessions (for WebSocket future)                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           ECS Fargate Cluster (Auto-scaling 2-10 tasks)         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  FastAPI Backend (Python 3.11)                          │    │
│  │  - API Gateway & Request Router                         │    │
│  │  - Business Logic Layer                                 │    │
│  │  - Integration Orchestrator                             │    │
│  └───┬─────────────┬────────────┬────────────┬────────────┘    │
└──────┼─────────────┼────────────┼────────────┼─────────────────┘
       │             │            │            │
       ▼             ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐
│  Claude  │  │   ILS    │  │OverDrive │  │  Pinecone  │
│   API    │  │   APIs   │  │   API    │  │ Vector DB  │
│ (Sonnet) │  │(Polaris, │  │          │  │ (Managed)  │
│          │  │  Koha)   │  │          │  │            │
└──────────┘  └──────────┘  └──────────┘  └────────────┘
       │
       └──────────────┬────────────────┬──────────────────┐
                      ▼                ▼                  ▼
              ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
              │  PostgreSQL  │  │ElastiCache   │  │   Secrets    │
              │   (RDS)      │  │  (Redis)     │  │   Manager    │
              │              │  │              │  │              │
              └──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Request Flow (Critical Path)

**Typical Search Query: "I want beach reads"**

```
1. User Query Entry (Frontend)
   └─> Input validation (TypeScript)
   └─> Send POST /api/search
   └─> Time: 5ms

2. API Gateway (FastAPI)
   ├─> Extract JWT from cookie (httpOnly)
   ├─> Validate session (Redis lookup)
   ├─> Rate limit check (Redis INCR)
   ├─> Extract library_id from token
   └─> Time: 15ms

3. Cache Check (Redis)
   ├─> Key: search:{library_id}:{hash(query)}
   ├─> If HIT: Return cached response → END
   └─> If MISS: Continue to Step 4
   └─> Time: 10ms

4. Query Embedding (Anthropic Voyage)
   ├─> POST to Anthropic embeddings API
   ├─> Model: voyage-large-2
   ├─> Input: user query string
   ├─> Output: 1024-dim vector
   ├─> Cache embedding (Redis, permanent)
   └─> Time: 50ms

5. Vector Search (Pinecone)
   ├─> Query with embedded vector
   ├─> Metadata filter: library_id = {X}
   ├─> Top-k: 20 results
   ├─> Include: metadata (title, author, ISBN, subjects)
   └─> Time: 80ms

6. Availability Enrichment (ILS API - Parallel)
   ├─> Batch request: 20 ISBNs → ILS API
   ├─> Parse physical copy availability
   ├─> Parallel: Query OverDrive API for digital availability
   ├─> Merge results into catalog_context
   └─> Time: 200ms (ILS) + 150ms (OverDrive) = 200ms (parallel)

7. RAG Prompt Construction
   ├─> Build system prompt with catalog_context
   ├─> Format conversation history (last 5 turns)
   ├─> Inject grounding rules
   └─> Time: 5ms

8. Claude API Call (Streaming)
   ├─> POST to Anthropic messages API
   ├─> Model: claude-sonnet-4-5-20250929
   ├─> Max tokens: 1500
   ├─> Temperature: 0.3
   ├─> Stream: true (reduces TTFB)
   └─> Time: 1500ms (TTFB: 300ms, full stream: 1200ms)

9. Response Processing
   ├─> Extract book recommendations
   ├─> Calculate confidence score
   ├─> Determine if librarian handoff needed
   └─> Time: 10ms

10. Cache Result (Redis)
    ├─> Store in Redis with 1h TTL
    └─> Time: 5ms

11. Return to Client (Streaming)
    └─> Stream response chunks to frontend
    └─> Frontend renders incrementally

Total Time: ~1885ms (first-time) | ~30ms (cached)
Target SLA: <3000ms (P95)
```

### 2.3 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Data Sources                             │
└─────────────────────────────────────────────────────────────────┘
         │                    │                      │
         │ ILS API            │ OverDrive API        │ Manual Curation
         │ (Real-time)        │ (Real-time)          │ (Weekly)
         ▼                    ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Data Ingestion Pipeline                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ETL Process (Daily Batch Job)                            │  │
│  │  - Fetch catalog updates from ILS                         │  │
│  │  - Deduplicate and normalize metadata                     │  │
│  │  - Generate embeddings (Anthropic Voyage)                 │  │
│  │  - Upsert to Pinecone with metadata                       │  │
│  │  - Store full records in PostgreSQL                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Storage Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │  Pinecone    │  │    Redis     │          │
│  │              │  │              │  │              │          │
│  │ - Full book  │  │ - Embeddings │  │ - Hot cache  │          │
│  │   metadata   │  │ - Sparse     │  │ - Sessions   │          │
│  │ - Library    │  │   vectors    │  │ - Rate limit │          │
│  │   config     │  │ - Metadata   │  │   counters   │          │
│  │ - Metrics    │  │   filters    │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ Query Time
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Application Layer (FastAPI)                    │
│  - Orchestrates data access                                      │
│  - Implements caching strategy                                   │
│  - Enforces business logic                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack Rationale

### 3.1 Backend: FastAPI over Node.js/Flask/Django

**Decision: FastAPI (Python 3.11)**

**Why FastAPI:**

1. **Native Async Support:** Built on Starlette (async ASGI framework)
   ```python
   @app.post("/api/search")
   async def search(query: SearchQuery):
       # Concurrent API calls without blocking
       results = await asyncio.gather(
           pinecone.query(query.vector),
           ils_client.get_availability(query.library_id),
           overdrive_client.search(query.text)
       )
       return results
   ```

2. **Anthropic SDK Native:** Official Python SDK is first-class
   ```python
   from anthropic import Anthropic
   client = Anthropic(api_key=os.getenv("CLAUDE_API_KEY"))
   # Streaming support built-in
   ```

3. **Automatic API Documentation:** OpenAPI/Swagger out-of-box
   - Critical for ILS vendors to understand integration
   - Interactive testing UI at `/docs`

4. **Pydantic Data Validation:** Type safety at runtime
   ```python
   class SearchRequest(BaseModel):
       query: str = Field(..., min_length=1, max_length=500)
       library_id: str = Field(..., regex=r'^lib_\d+$')
       session_id: Optional[str] = None
   ```

5. **Performance:** Benchmarks (requests/sec)
   - FastAPI: 50,000 req/s
   - Flask: 10,000 req/s
   - Django: 8,000 req/s
   - Express (Node): 30,000 req/s

**Why NOT Node.js (Express/Fastify):**
- Anthropic SDK is Python-first (Node SDK is community-maintained)
- Vector operations (numpy) and ML tooling better in Python
- Team familiarity: Most data/ML engineers prefer Python

**Why NOT Flask:**
- No native async (requires flask-async extension)
- Manual request validation (error-prone)
- No automatic OpenAPI docs

**Why NOT Django:**
- Too heavyweight (ORM, admin panel, template engine not needed)
- Slower startup time
- Designed for monolithic apps, not microservices

---

### 3.2 Database: PostgreSQL over MySQL/MongoDB

**Decision: PostgreSQL 15**

**Why PostgreSQL:**

1. **JSONB Support:** Store flexible metadata without schema rigidity
   ```sql
   CREATE TABLE books (
       isbn VARCHAR(13) PRIMARY KEY,
       metadata JSONB NOT NULL,
       library_id VARCHAR(50) NOT NULL
   );
   -- Query JSON fields efficiently
   SELECT * FROM books WHERE metadata->>'genre' = 'mystery';
   ```

2. **Full-Text Search (FTS):** Built-in tsvector for keyword fallback
   ```sql
   ALTER TABLE books ADD COLUMN search_vector tsvector;
   CREATE INDEX idx_fts ON books USING gin(search_vector);
   ```

3. **pgvector Extension (Future):** Native vector similarity search
   - If Pinecone costs balloon, can migrate to self-hosted pgvector

4. **Mature Ecosystem:** Battle-tested in library sector
   - Koha and Evergreen ILS both use Postgres
   - Library IT teams already familiar

5. **ACID Guarantees:** Critical for hold placements and fines

**Why NOT MySQL:**
- JSON support inferior (no JSONB, slower queries)
- Licensing confusion (Oracle-owned)
- Weaker FTS capabilities

**Why NOT MongoDB:**
- No ACID guarantees (until recently)
- Poor fit for relational data (patron ↔ holds ↔ books)
- Library sector unfamiliar with NoSQL

**Why NOT Supabase (Managed Postgres):**
- You don't need Supabase's auth (building custom ILS auth)
- You don't need realtime (no WebSocket features in Phase 1)
- RDS Postgres gives more control over backups and scaling
- Cost: Supabase charges per GB stored; RDS charges per instance (cheaper at scale)

---

### 3.3 Caching: Redis over Memcached/In-Memory

**Decision: Redis 7 (ElastiCache)**

**Why Redis:**

1. **Rich Data Structures:** Not just key-value
   ```python
   # Rate limiting with sliding window
   pipeline = redis.pipeline()
   now = time.time()
   key = f"ratelimit:{library_id}:{ip}"
   pipeline.zadd(key, {now: now})
   pipeline.zremrangebyscore(key, 0, now - 60)
   pipeline.zcard(key)
   pipeline.expire(key, 60)
   results = pipeline.execute()
   request_count = results[2]
   ```

2. **Automatic TTL:** Set-and-forget expiration
   ```python
   redis.setex(f"search:{hash(query)}", 3600, json.dumps(result))
   ```

3. **Pub/Sub (Future):** Real-time notifications for Phase 2
   ```python
   # When book becomes available, notify holds
   redis.publish(f"holds:isbn:{isbn}", "available")
   ```

4. **Persistence Options:** AOF (append-only file) for durability

5. **ElastiCache Benefits:**
   - Automatic failover (Multi-AZ)
   - Managed backups
   - Encryption at rest/transit

**Why NOT Memcached:**
- No TTL per key (must track expiration manually)
- Only strings (no sorted sets, hashes, lists)
- No persistence (data lost on restart)

**Why NOT In-Memory (LRU cache in app):**
- Doesn't scale across multiple ECS tasks
- Lost on deployment
- No shared state

---

### 3.4 Vector Database: Pinecone over Weaviate/Qdrant/pgvector

**Decision: Pinecone (Managed Service)**

**Why Pinecone:**

1. **Zero DevOps:** No Kubernetes clusters to manage
   ```python
   import pinecone
   pinecone.init(api_key=os.getenv("PINECONE_API_KEY"))
   index = pinecone.Index("librarian-catalog")
   # That's it. No servers to provision.
   ```

2. **Metadata Filtering:** Filter by library during search
   ```python
   results = index.query(
       vector=query_embedding,
       filter={"library_id": "lib_123", "format": "audiobook"},
       top_k=20
   )
   ```

3. **Performance:** <100ms at p95 for 1M vectors

4. **Cost-Effective at MVP Scale:**
   - 100K vectors: $70/month
   - 1M vectors: $150/month
   - Scales linearly

5. **Managed Backups & Replication:** Built-in

**Why NOT Weaviate (self-hosted):**
- Requires Kubernetes + DevOps resources (2-3 engineer-weeks setup)
- Cost: $200-300/month in AWS (EC2 + storage)
- Operational burden (security patches, scaling)

**Why NOT Qdrant (self-hosted):**
- Same DevOps burden as Weaviate
- Smaller community/ecosystem

**Why NOT pgvector (Postgres extension):**
- Query performance degrades at >1M vectors
- No built-in metadata filtering (must use SQL WHERE)
- Good for Phase 3 cost optimization, not Phase 1 speed

**Pinecone Trade-offs:**
- **Vendor lock-in:** Mitigated by exporting embeddings monthly
- **Cost at scale:** At 10M+ vectors ($1K+/month), revisit decision
- **Cold start:** First query after idle = ~200ms (acceptable)

---

### 3.5 Authentication: JWT over OAuth/SAML

**Decision: JWT (JSON Web Tokens) with httpOnly cookies**

**Why JWT:**

1. **ILS Systems Don't Support OAuth:** Legacy protocols (NCIP, SIP2)
   ```python
   # ILS authentication returns session token, not OAuth
   ils_session = ils_client.authenticate(card_number, pin)
   # Must translate to our own JWT
   jwt_token = create_jwt(library_id=ils_session.library_id)
   ```

2. **Stateless:** No session store required
   ```python
   # Decode JWT on every request (no DB lookup)
   payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
   library_id = payload["library_id"]
   ```

3. **Security via httpOnly Cookie:** XSS protection
   ```python
   response.set_cookie(
       "session",
       jwt_token,
       httponly=True,  # Not accessible to JavaScript
       secure=True,    # HTTPS only
       samesite="strict"
   )
   ```

4. **Simple for Phase 1:** No external IdP dependencies

**Why NOT OAuth 2.0:**
- ILS systems don't act as OAuth providers
- OAuth is for delegated authorization (3rd-party apps)
- You control both client and server → unnecessary complexity

**Why NOT SAML:**
- XML-based (verbose, error-prone)
- Designed for enterprise SSO (not applicable)
- No library ILS supports SAML

**When to Use OAuth/SAML:**
- Phase 3: If integrating with Goodreads, Amazon, or university SSO

**JWT Structure:**
```json
{
  "sub": "anonymous_uuid_v4",        // No patron PII
  "library_id": "lib_123",
  "iat": 1696723200,
  "exp": 1696809600,                 // 24 hour expiration
  "jti": "unique_token_id"           // Prevents replay attacks
}
```

**Security Measures:**
- **Token rotation:** Issue new JWT every 12 hours
- **Revocation:** Blacklist JTI in Redis if patron logs out
- **Rate limiting:** 100 requests/min per token

---

## 4. System Components

### 4.1 Frontend Architecture

**Technology:** React 18 + TypeScript + Vite

**Key Components:**

```
src/
├── components/
│   ├── SearchInput.tsx              # Main query entry
│   ├── ConversationHistory.tsx      # Message thread
│   ├── BookCard.tsx                 # Result display
│   ├── LoadingSpinner.tsx           # Streaming indicator
│   └── ErrorBoundary.tsx            # Error handling
├── hooks/
│   ├── useClaudeChat.ts             # API communication
│   ├── useConversation.ts           # State management
│   └── useCatalog.ts                # Data fetching
├── utils/
│   ├── promptBuilder.ts             # System prompt generation
│   └── formatters.ts                # Date/time/currency
└── types/
    └── index.ts                     # TypeScript definitions
```

**State Management:**
- **React Query:** Server state (API responses, caching)
- **Context API:** Global state (theme, library config)
- **Local State:** Component-specific (form inputs)

**Accessibility:**
- **react-aria:** Keyboard navigation, ARIA labels
- **focus-trap-react:** Modal focus management
- **Lighthouse CI:** Automated a11y tests on every PR

---

### 4.2 Backend Architecture

**Project Structure:**

```python
app/
├── main.py                          # FastAPI app entry point
├── api/
│   ├── routes/
│   │   ├── search.py                # POST /api/search
│   │   ├── auth.py                  # POST /api/auth/login
│   │   └── availability.py          # GET /api/availability/{isbn}
│   └── dependencies.py              # Shared dependencies (DB, Redis)
├── core/
│   ├── search_service.py            # Business logic for search
│   ├── recommendation_engine.py     # RAG orchestration
│   └── confidence_scorer.py         # Determine handoff threshold
├── integrations/
│   ├── claude_client.py             # Anthropic SDK wrapper
│   ├── pinecone_client.py           # Vector DB queries
│   ├── ils/
│   │   ├── base.py                  # Abstract ILS interface
│   │   ├── polaris_client.py        # Polaris implementation
│   │   └── koha_client.py           # Koha implementation
│   └── overdrive_client.py          # OverDrive API
├── models/
│   ├── schemas.py                   # Pydantic request/response models
│   └── database.py                  # SQLAlchemy ORM models
├── utils/
│   ├── auth.py                      # JWT generation/validation
│   ├── cache.py                     # Redis operations
│   ├── rate_limiter.py              # Token bucket algorithm
│   └── logger.py                    # Structured logging
└── config.py                        # Environment variables
```

**Key Services:**

#### 4.2.1 Search Service (RAG Orchestration)

```python
# app/core/search_service.py

from typing import List, Optional
import anthropic
from app.integrations.pinecone_client import PineconeClient
from app.integrations.ils.base import ILSClient
from app.utils.cache import cache_get, cache_set, generate_cache_key

class SearchService:
    def __init__(
        self,
        claude_client: anthropic.Anthropic,
        pinecone: PineconeClient,
        ils: ILSClient,
        redis: aioredis.Redis
    ):
        self.claude = claude_client
        self.pinecone = pinecone
        self.ils = ils
        self.redis = redis

    async def search(
        self,
        query: str,
        library_id: str,
        session_id: str
    ) -> dict:
        """
        Main search orchestration with caching and error handling.

        Returns:
            {
                "recommendations": [...],
                "confidence": 0.85,
                "handoff_to_librarian": false,
                "response_text": "..."
            }
        """
        # 1. Generate cache key
        cache_key = generate_cache_key("search", library_id, query)

        # 2. Check cache
        cached = await cache_get(self.redis, cache_key)
        if cached:
            return cached

        try:
            # 3. Embed query
            query_vector = await self._embed_query(query)

            # 4. Vector search in Pinecone
            candidates = await self.pinecone.query(
                vector=query_vector,
                filter={"library_id": library_id},
                top_k=20,
                include_metadata=True
            )

            # 5. Enrich with availability (parallel)
            enriched_catalog = await self._enrich_availability(
                candidates, library_id
            )

            # 6. Build RAG prompt
            prompt = self._build_prompt(query, enriched_catalog)

            # 7. Call Claude API (streaming)
            response = await self.claude.messages.create(
                model="claude-sonnet-4-5-20250929",
                max_tokens=1500,
                temperature=0.3,
                system=prompt["system"],
                messages=prompt["messages"],
                stream=False  # TODO: Implement streaming in Phase 1.5
            )

            # 8. Extract recommendations
            response_text = response.content[0].text
            recommendations = self._parse_recommendations(
                response_text, enriched_catalog
            )

            # 9. Calculate confidence
            confidence = self._calculate_confidence(response_text)

            # 10. Determine handoff
            handoff = confidence < 0.7 or len(recommendations) == 0

            result = {
                "recommendations": recommendations,
                "confidence": confidence,
                "handoff_to_librarian": handoff,
                "response_text": response_text
            }

            # 11. Cache result (1 hour TTL)
            await cache_set(self.redis, cache_key, result, ttl=3600)

            return result

        except ClaudeAPIError as e:
            # Fallback to cached similar query
            return await self._fallback_search(query, library_id)

        except PineconeTimeout as e:
            # Fallback to PostgreSQL full-text search
            return await self._keyword_search(query, library_id)

    async def _embed_query(self, query: str) -> List[float]:
        """Generate embedding for query using Anthropic Voyage."""
        cache_key = f"embedding:{hash(query)}"
        cached = await self.redis.get(cache_key)

        if cached:
            return json.loads(cached)

        # Call Anthropic embeddings API
        response = await self.claude.embeddings.create(
            model="voyage-large-2",
            input=[query]
        )

        embedding = response.embeddings[0]

        # Cache permanently (embeddings never change)
        await self.redis.set(cache_key, json.dumps(embedding))

        return embedding

    async def _enrich_availability(
        self,
        books: List[dict],
        library_id: str
    ) -> List[dict]:
        """
        Fetch real-time availability from ILS and OverDrive.
        Executes in parallel to minimize latency.
        """
        isbns = [book["metadata"]["isbn"] for book in books]

        # Parallel API calls
        ils_availability, overdrive_availability = await asyncio.gather(
            self.ils.batch_check_availability(library_id, isbns),
            self.overdrive.batch_check_availability(library_id, isbns)
        )

        # Merge availability data
        for book in books:
            isbn = book["metadata"]["isbn"]
            book["availability"] = {
                "physical": ils_availability.get(isbn, {}),
                "digital": overdrive_availability.get(isbn, {})
            }

        return books

    def _calculate_confidence(self, response_text: str) -> float:
        """
        Heuristic confidence scoring based on hedge language.
        Returns 0.0-1.0 where <0.7 triggers librarian handoff.
        """
        hedge_words = [
            "might", "maybe", "possibly", "perhaps",
            "i think", "i'm not sure", "unclear"
        ]

        text_lower = response_text.lower()
        hedge_count = sum(
            1 for word in hedge_words if word in text_lower
        )

        # Each hedge reduces confidence by 15%
        confidence = max(0.5, 1.0 - (hedge_count * 0.15))

        return round(confidence, 2)
```

---

#### 4.2.2 ILS Integration Layer (Abstract Interface)

```python
# app/integrations/ils/base.py

from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from pydantic import BaseModel

class AvailabilityStatus(BaseModel):
    status: str  # "available" | "checked_out" | "on_hold"
    copies_available: Optional[int] = None
    copies_total: Optional[int] = None
    due_date: Optional[str] = None
    hold_queue: Optional[int] = None

class ILSClient(ABC):
    """
    Abstract interface for ILS systems.
    Concrete implementations: PolarisClient, KohaClient, SierraClient.
    """

    @abstractmethod
    async def authenticate_patron(
        self,
        library_id: str,
        card_number: str,
        pin: str
    ) -> Dict:
        """
        Validate patron credentials against ILS.

        Returns:
            {
                "patron_id": "...",
                "name": "...",
                "session_token": "..."
            }
        Raises:
            AuthenticationError if invalid
        """
        pass

    @abstractmethod
    async def check_availability(
        self,
        library_id: str,
        isbn: str
    ) -> AvailabilityStatus:
        """Check availability for a single item."""
        pass

    @abstractmethod
    async def batch_check_availability(
        self,
        library_id: str,
        isbns: List[str]
    ) -> Dict[str, AvailabilityStatus]:
        """
        Check availability for multiple items (more efficient).

        Returns:
            {"9781234567890": AvailabilityStatus(...), ...}
        """
        pass

    @abstractmethod
    async def place_hold(
        self,
        library_id: str,
        patron_id: str,
        isbn: str,
        pickup_location: str
    ) -> Dict:
        """
        Place a hold on an item.

        Returns:
            {
                "hold_id": "...",
                "queue_position": 3,
                "estimated_wait": "2 weeks"
            }
        """
        pass
```

```python
# app/integrations/ils/polaris_client.py

import httpx
from app.integrations.ils.base import ILSClient, AvailabilityStatus

class PolarisClient(ILSClient):
    """
    Polaris ILS API implementation.
    Docs: https://developer.iii.com/docs/polaris-api
    """

    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.client = httpx.AsyncClient(
            timeout=5.0,
            headers={"Authorization": f"Bearer {api_key}"}
        )

    async def authenticate_patron(
        self,
        library_id: str,
        card_number: str,
        pin: str
    ) -> Dict:
        """Polaris uses HTTP Basic Auth with card + PIN."""
        response = await self.client.post(
            f"{self.base_url}/patron/authenticate",
            json={
                "barcode": card_number,
                "password": pin,
                "library_id": library_id
            }
        )

        if response.status_code == 401:
            raise AuthenticationError("Invalid card number or PIN")

        data = response.json()
        return {
            "patron_id": data["PatronID"],
            "name": f"{data['FirstName']} {data['LastName']}",
            "session_token": data["SessionToken"]
        }

    async def batch_check_availability(
        self,
        library_id: str,
        isbns: List[str]
    ) -> Dict[str, AvailabilityStatus]:
        """
        Polaris batch endpoint: POST /items/availability
        """
        response = await self.client.post(
            f"{self.base_url}/items/availability",
            json={
                "library_id": library_id,
                "isbns": isbns
            }
        )

        results = {}
        for item in response.json()["items"]:
            isbn = item["ISBN"]
            results[isbn] = AvailabilityStatus(
                status="available" if item["AvailableCopies"] > 0 else "checked_out",
                copies_available=item["AvailableCopies"],
                copies_total=item["TotalCopies"],
                hold_queue=item["HoldQueueLength"]
            )

        return results
```

---

## 5. Data Architecture

### 5.1 PostgreSQL Schema

```sql
-- Database: librarian_llm

-- ============================================================================
-- CORE ENTITIES
-- ============================================================================

-- Library configuration
CREATE TABLE libraries (
    id VARCHAR(50) PRIMARY KEY,  -- 'lib_123'
    name VARCHAR(255) NOT NULL,
    ils_type VARCHAR(50) NOT NULL,  -- 'polaris' | 'koha' | 'sierra'
    ils_api_url VARCHAR(500) NOT NULL,
    ils_api_key_encrypted TEXT NOT NULL,  -- AES-256 encrypted
    overdrive_library_id VARCHAR(100),
    overdrive_api_key_encrypted TEXT,
    rate_limit_per_minute INTEGER DEFAULT 100,
    tier VARCHAR(20) DEFAULT 'basic',  -- 'basic' | 'standard' | 'premium'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Anonymous sessions (24-hour expiration)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    library_id VARCHAR(50) NOT NULL REFERENCES libraries(id),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Index for automatic cleanup
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_library ON sessions(library_id);

-- Catalog items (synchronized from ILS daily)
CREATE TABLE catalog_items (
    isbn VARCHAR(13) PRIMARY KEY,
    library_id VARCHAR(50) NOT NULL REFERENCES libraries(id),
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255),
    description TEXT,
    subjects TEXT[],  -- PostgreSQL array
    publication_year INTEGER,
    cover_url VARCHAR(500),
    metadata JSONB,  -- Flexible additional fields
    embedding_id VARCHAR(100),  -- Pinecone vector ID
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_catalog_library ON catalog_items(library_id);
CREATE INDEX idx_catalog_subjects ON catalog_items USING gin(subjects);

-- Full-text search index (fallback when Pinecone unavailable)
ALTER TABLE catalog_items ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, '') || ' ' || coalesce(description, ''))
    ) STORED;

CREATE INDEX idx_catalog_fts ON catalog_items USING gin(search_vector);

-- ============================================================================
-- ANALYTICS (NO QUERY CONTENT - PRIVACY COMPLIANT)
-- ============================================================================

-- Aggregate query metrics (no PII, no query text)
CREATE TABLE query_metrics (
    id SERIAL PRIMARY KEY,
    library_id VARCHAR(50) NOT NULL REFERENCES libraries(id),
    query_date DATE NOT NULL,
    query_count INTEGER DEFAULT 0,
    avg_response_time_ms INTEGER,
    cache_hit_rate DECIMAL(5,2),  -- 0.00 to 100.00
    claude_api_calls INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    handoff_count INTEGER DEFAULT 0  -- How many triggered librarian handoff
);

CREATE INDEX idx_metrics_library_date ON query_metrics(library_id, query_date);

-- API usage tracking (for billing)
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    library_id VARCHAR(50) NOT NULL REFERENCES libraries(id),
    date DATE NOT NULL,
    claude_input_tokens BIGINT DEFAULT 0,
    claude_output_tokens BIGINT DEFAULT 0,
    pinecone_queries INTEGER DEFAULT 0,
    ils_api_calls INTEGER DEFAULT 0,
    overdrive_api_calls INTEGER DEFAULT 0
);

CREATE UNIQUE INDEX idx_usage_library_date ON api_usage(library_id, date);

-- ============================================================================
-- PRIVACY COMPLIANCE
-- ============================================================================

-- NO patron PII stored
-- NO query content stored
-- Sessions expire after 24 hours (automatic cleanup job)

-- Cleanup job (runs daily via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

### 5.2 Redis Cache Structure

```python
# Key patterns and TTLs

# Session validation (fast lookup)
session:{session_id} → JSON {library_id, expires_at}
TTL: 24 hours (86400 seconds)

# Search query cache
search:{library_id}:{sha256(query)} → JSON {recommendations, response_text}
TTL: 1 hour (3600 seconds)

# Catalog metadata cache (reduce ILS API calls)
catalog:{library_id}:{isbn} → JSON {title, author, availability}
TTL: 24 hours

# Embedding cache (permanent - embeddings never change)
embedding:{sha256(text)} → JSON [0.123, 0.456, ...]
TTL: None (permanent)

# Rate limiting (sliding window)
ratelimit:{library_id}:{ip} → ZSET {timestamp: timestamp}
TTL: 60 seconds

# ILS API response cache
ils:availability:{library_id}:{isbn} → JSON {status, copies}
TTL: 5 minutes (300 seconds)

# OverDrive API cache
overdrive:availability:{library_id}:{isbn} → JSON {status, wait_time}
TTL: 10 minutes (600 seconds)
```

### 5.3 Pinecone Vector Database

**Index Configuration:**

```python
import pinecone

pinecone.init(api_key=os.getenv("PINECONE_API_KEY"))

# Create index
pinecone.create_index(
    name="librarian-catalog",
    dimension=1024,  # Anthropic Voyage embedding dimension
    metric="cosine",
    pods=1,
    pod_type="p1.x1"  # Starter pod
)

# Index metadata schema
{
    "id": "lib_123:isbn_9781234567890",  # Composite key
    "values": [0.123, 0.456, ...],       # 1024-dim vector
    "metadata": {
        "library_id": "lib_123",
        "isbn": "9781234567890",
        "title": "Where the Crawdads Sing",
        "author": "Delia Owens",
        "subjects": ["fiction", "mystery"],
        "publication_year": 2018,
        "formats": ["physical", "ebook", "audiobook"]
    }
}
```

**Query Pattern:**

```python
# Search with metadata filtering
results = index.query(
    vector=query_embedding,
    filter={
        "library_id": {"$eq": "lib_123"},
        "formats": {"$in": ["audiobook"]},  # Only audiobooks
        "publication_year": {"$gte": 2015}  # Recent books
    },
    top_k=20,
    include_metadata=True
)
```

---

## 6. API Specifications

### 6.1 RESTful Endpoints

**Base URL:** `https://api.librarian-llm.com`

#### 6.1.1 POST /api/search

**Purpose:** Execute conversational book search.

**Authentication:** Required (JWT in cookie)

**Rate Limit:** 100 requests/minute per library

**Request:**

```json
{
  "query": "I want something funny for the beach",
  "conversation_history": [
    {"role": "user", "content": "Do you have mystery books?"},
    {"role": "assistant", "content": "Yes, here are some mysteries..."}
  ],
  "filters": {
    "formats": ["audiobook"],
    "publication_year_min": 2015
  }
}
```

**Response (200 OK):**

```json
{
  "recommendations": [
    {
      "isbn": "9781234567890",
      "title": "The Thursday Murder Club",
      "author": "Richard Osman",
      "cover_url": "https://...",
      "formats": [
        {"type": "physical", "status": "available", "copies": 3},
        {"type": "ebook", "status": "waitlist", "wait_time": "1 week"},
        {"type": "audiobook", "status": "available"}
      ],
      "reason": "This witty mystery featuring a group of retirees is both funny and engaging—perfect for light beach reading.",
      "subjects": ["mystery", "humor", "seniors"]
    }
  ],
  "response_text": "Great choice! Here are some light, funny reads...",
  "confidence": 0.92,
  "handoff_to_librarian": false,
  "cache_hit": false,
  "response_time_ms": 1847
}
```

**Error Responses:**

```json
// 429 Too Many Requests
{
  "error": "Rate limit exceeded",
  "retry_after": 45  // seconds
}

// 500 Internal Server Error
{
  "error": "Claude API unavailable",
  "fallback_used": "keyword_search"
}
```

---

#### 6.1.2 POST /api/auth/login

**Purpose:** Authenticate patron via ILS credentials.

**Request:**

```json
{
  "library_id": "lib_123",
  "card_number": "12345678901234",
  "pin": "1234"
}
```

**Response (200 OK):**

```json
{
  "session_id": "uuid-v4-here",
  "expires_at": "2025-10-09T14:30:00Z"
}
```

**Side Effect:** Sets `session` httpOnly cookie.

---

#### 6.1.3 GET /api/availability/:isbn

**Purpose:** Check real-time availability for a single item.

**Authentication:** Required

**Response (200 OK):**

```json
{
  "isbn": "9781234567890",
  "library_id": "lib_123",
  "availability": {
    "physical": {
      "status": "available",
      "copies_available": 3,
      "copies_total": 5
    },
    "ebook": {
      "status": "waitlist",
      "wait_time": "2 weeks",
      "holds": 12
    },
    "audiobook": {
      "status": "available"
    }
  },
  "cached": true,
  "cache_age_seconds": 120
}
```

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow

```
1. Patron Login (POST /api/auth/login)
   ├─> Frontend sends: {library_id, card_number, pin}
   ├─> Backend validates with ILS API
   ├─> ILS returns: {patron_id, session_token}
   ├─> Backend creates anonymous session:
   │   ├─> session_id = uuid4()
   │   ├─> Store in PostgreSQL: {session_id, library_id, expires_at}
   │   └─> Store in Redis: session:{session_id} → {library_id}
   ├─> Backend generates JWT:
   │   ├─> Payload: {sub: session_id, library_id, exp: 24h}
   │   ├─> Sign with HS256
   │   └─> NOT encrypted (JWT is for integrity, not confidentiality)
   └─> Backend sets cookie:
       └─> Set-Cookie: session={JWT}; HttpOnly; Secure; SameSite=Strict

2. Subsequent Requests
   ├─> Browser sends: Cookie: session={JWT}
   ├─> Backend validates JWT:
   │   ├─> Decode with public key
   │   ├─> Check expiration
   │   └─> Extract library_id
   └─> Proceed with request

3. Logout (POST /api/auth/logout)
   ├─> Backend blacklists JWT (Redis)
   └─> Set-Cookie: session=; Max-Age=0
```

### 7.2 Security Considerations

**JWT vs. Session Tokens:**

| Aspect | JWT | Session Token |
|--------|-----|---------------|
| **Stateless** | Yes | No (requires DB lookup) |
| **Revocation** | Requires blacklist | Easy (delete from DB) |
| **Size** | ~200 bytes | ~16 bytes |
| **Performance** | Faster (no DB) | Slower (DB lookup) |

**Decision:** Use JWT with Redis blacklist for revoked tokens.

**JWT Payload (No PII):**

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",  // Anonymous UUID
  "library_id": "lib_123",
  "iat": 1696723200,
  "exp": 1696809600,
  "jti": "unique_token_id"  // For revocation
}
```

**Security Headers:**

```python
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

---

## 8. Caching Strategy

### 8.1 Cache Hierarchy

```
Request Flow:
1. Browser Cache (Service Worker)
   └─> Static assets: CSS, JS, images (1 year)

2. CloudFront CDN
   └─> HTML (1 hour), API responses (none)

3. Redis (Application Cache)
   └─> Search results (1 hour)
   └─> Catalog metadata (24 hours)
   └─> Embeddings (permanent)

4. Pinecone (Vector Search)
   └─> No caching (always fresh)

5. PostgreSQL (Source of Truth)
   └─> No caching (write-through)
```

### 8.2 Cache Invalidation

**Strategies:**

1. **Time-based (TTL):** Most common
   ```python
   redis.setex(key, 3600, value)  # 1 hour
   ```

2. **Event-based:** When catalog updates
   ```python
   # When ILS sync job runs
   for isbn in updated_books:
       redis.delete(f"catalog:*:{isbn}")
   ```

3. **Cache warming:** Pre-populate common queries
   ```python
   # Nightly job
   popular_queries = ["mystery books", "new arrivals", "audiobooks"]
   for query in popular_queries:
       await search_service.search(query, library_id)
   ```

### 8.3 Cache Eviction Policy

**Redis maxmemory-policy:** `allkeys-lru`

- When memory limit reached, evict least recently used keys
- Protects critical data (sessions, rate limits) by accessing them frequently

---

## 9. Error Handling & Resilience

### 9.1 Fallback Strategy

**Graceful Degradation Hierarchy:**

```python
async def search_with_fallbacks(query, library_id):
    try:
        # Primary: Claude + RAG
        return await rag_search(query, library_id)

    except ClaudeAPIError as e:
        if e.is_rate_limit:
            # Fallback 1: Cached similar query
            return await cache_search_similar(query, library_id)
        elif e.is_overloaded:
            # Fallback 2: Keyword search (PostgreSQL FTS)
            return await keyword_search(query, library_id)
        else:
            raise  # 500 error

    except PineconeTimeout:
        # Fallback 3: PostgreSQL full-text search
        return await keyword_search(query, library_id)

    except ILSAPIError:
        # Fallback 4: Return recommendations without availability
        return await rag_search_no_availability(query, library_id)
```

### 9.2 Circuit Breaker Pattern

**Purpose:** Stop cascading failures when external API is down.

```python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=60)
async def call_ils_api(library_id, isbn):
    """
    If ILS API fails 5 times in a row, circuit opens.
    For 60 seconds, return cached data or error immediately.
    After 60s, allow one request through (half-open).
    If succeeds, close circuit. If fails, reopen.
    """
    return await ils_client.check_availability(library_id, isbn)
```

### 9.3 Retry Logic

**Exponential Backoff with Jitter:**

```python
import asyncio
import random

async def retry_with_backoff(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return await func()
        except TransientError as e:
            if attempt == max_retries - 1:
                raise  # Final attempt failed

            # Exponential backoff: 2^attempt seconds + jitter
            wait = (2 ** attempt) + random.uniform(0, 1)
            await asyncio.sleep(wait)
```

**Idempotency:**
- Use `Idempotency-Key` header for non-GET requests
- Store recent request IDs in Redis (5-minute TTL)
- If duplicate detected, return cached response

---

## 10. Performance Requirements

### 10.1 Latency Targets

| Metric | Target (P50) | Target (P95) | Target (P99) |
|--------|--------------|--------------|--------------|
| **API Response Time** | <1500ms | <3000ms | <5000ms |
| **Time to First Byte (TTFB)** | <200ms | <500ms | <1000ms |
| **Time to Interactive (TTI)** | <2000ms | <3500ms | <5000ms |
| **Cache Hit Latency** | <50ms | <100ms | <200ms |
| **Database Query** | <20ms | <50ms | <100ms |
| **Claude API Call** | <1000ms | <2000ms | <3000ms |

### 10.2 Throughput Targets

| Metric | Phase 1 (MVP) | Phase 2 (Growth) | Phase 3 (Scale) |
|--------|---------------|------------------|-----------------|
| **Concurrent Users** | 500 | 2,000 | 10,000 |
| **Requests per Second** | 100 | 400 | 2,000 |
| **Daily Active Users** | 2,500 | 10,000 | 50,000 |
| **Monthly Queries** | 100K | 500K | 3M |

### 10.3 Optimization Strategies

**1. Request Coalescing:**
```python
# Batch multiple availability checks into one ILS API call
isbns = ["9781234567890", "9780987654321", ...]
results = await ils_client.batch_check_availability(library_id, isbns)
```

**2. Parallel Fetching:**
```python
# Fetch from multiple sources concurrently
catalog_data, ils_data, overdrive_data = await asyncio.gather(
    pinecone.query(vector),
    ils_client.get_availability(isbn),
    overdrive_client.search(query)
)
```

**3. Connection Pooling:**
```python
# Reuse HTTP connections
client = httpx.AsyncClient(
    limits=httpx.Limits(max_keepalive_connections=20, max_connections=50)
)
```

**4. Database Query Optimization:**
```sql
-- Use indexes for common queries
CREATE INDEX idx_catalog_library_subjects ON catalog_items(library_id, subjects);

-- Avoid SELECT *
SELECT isbn, title, author FROM catalog_items WHERE library_id = 'lib_123';
```

---

## 11. Security Architecture

### 11.1 Threat Model

| Threat | Mitigation |
|--------|------------|
| **SQL Injection** | Parameterized queries (SQLAlchemy ORM) |
| **XSS (Cross-Site Scripting)** | React auto-escapes; CSP headers |
| **CSRF (Cross-Site Request Forgery)** | SameSite=Strict cookies |
| **Man-in-the-Middle** | TLS 1.3 enforced everywhere |
| **Credential Stuffing** | Rate limiting (10 login attempts/hour) |
| **API Key Exposure** | Secrets Manager; rotate every 90 days |
| **DDoS** | CloudFront WAF; rate limiting |

### 11.2 Data Encryption

**In Transit:**
- TLS 1.3 (reject TLS 1.2 and below)
- Certificate from AWS Certificate Manager (ACM)
- Perfect Forward Secrecy (PFS)

**At Rest:**
- RDS Postgres: AES-256 encryption enabled
- ElastiCache Redis: Encryption at rest
- Secrets Manager: AES-256-GCM

**API Keys:**
```python
from cryptography.fernet import Fernet

# Encrypt ILS API key before storing in database
def encrypt_api_key(plaintext: str) -> str:
    cipher = Fernet(os.getenv("ENCRYPTION_KEY"))
    return cipher.encrypt(plaintext.encode()).decode()

def decrypt_api_key(ciphertext: str) -> str:
    cipher = Fernet(os.getenv("ENCRYPTION_KEY"))
    return cipher.decrypt(ciphertext.encode()).decode()
```

### 11.3 Secrets Management

**AWS Secrets Manager:**

```python
import boto3

def get_secret(secret_name: str) -> dict:
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return json.loads(response['SecretString'])

# Usage
claude_api_key = get_secret("prod/librarian-llm/claude-api-key")
```

**Rotation Policy:**
- Claude API key: Rotate every 90 days
- ILS API keys: Rotate per library policy (usually 1 year)
- JWT signing key: Rotate every 6 months

---

## 12. Deployment Architecture

### 12.1 AWS Infrastructure (Terraform)

```hcl
# terraform/main.tf

provider "aws" {
  region = "us-east-1"
}

# VPC
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "librarian-llm-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "librarian-llm-cluster"
}

# ECS Task Definition
resource "aws_ecs_task_definition" "api" {
  family                   = "librarian-llm-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"   # 0.5 vCPU
  memory                   = "1024"  # 1 GB

  container_definitions = jsonencode([{
    name      = "api"
    image     = "${aws_ecr_repository.api.repository_url}:latest"
    cpu       = 512
    memory    = 1024
    essential = true

    portMappings = [{
      containerPort = 8000
      protocol      = "tcp"
    }]

    environment = [
      {name = "ENV", value = "production"},
      {name = "DATABASE_URL", value = "postgresql://..."}
    ]

    secrets = [
      {
        name      = "CLAUDE_API_KEY"
        valueFrom = aws_secretsmanager_secret.claude_api_key.arn
      }
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "/ecs/librarian-llm"
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "api"
      }
    }
  }])
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "librarian-llm-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "librarian-llm-db"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t4g.micro"
  allocated_storage    = 20
  storage_encrypted    = true
  db_name              = "librarian_llm"
  username             = "admin"
  password             = random_password.db.result
  multi_az             = false  # Enable in production
  backup_retention_period = 7
  skip_final_snapshot  = false
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "librarian-llm-cache"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t4g.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled = true

  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.3"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "alb"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.main.arn
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.3_2021"
  }
}
```

### 12.2 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run unit tests
        run: pytest tests/ --cov=app --cov-report=xml

      - name: Run integration tests
        run: pytest tests/integration/ --cov-append

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: librarian-llm-api
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition.json
          service: librarian-llm-service
          cluster: librarian-llm-cluster
          wait-for-service-stability: true
```

### 12.3 Dockerfile

```dockerfile
# Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

---

## 13. Monitoring & Observability

### 13.1 Logging Strategy

**Structured JSON Logging:**

```python
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "service": "librarian-llm-api",
            "request_id": getattr(record, "request_id", None),
            "library_id": getattr(record, "library_id", None),
            "duration_ms": getattr(record, "duration_ms", None)
        }
        return json.dumps(log_data)

# Usage
logger = logging.getLogger(__name__)
logger.info("Search completed", extra={
    "request_id": "uuid",
    "library_id": "lib_123",
    "duration_ms": 1847
})
```

**Log Levels:**
- **ERROR:** Claude API failures, ILS timeouts, database errors
- **WARNING:** Rate limit approaching, cache misses, slow queries
- **INFO:** Request start/end, cache hits, handoffs
- **DEBUG:** Detailed request/response bodies (dev only)

### 13.2 Metrics (CloudWatch Custom Metrics)

```python
import boto3

cloudwatch = boto3.client('cloudwatch')

def publish_metric(name, value, unit, dimensions=None):
    cloudwatch.put_metric_data(
        Namespace='LibrarianLLM',
        MetricData=[{
            'MetricName': name,
            'Value': value,
            'Unit': unit,
            'Dimensions': dimensions or []
        }]
    )

# Example metrics
publish_metric('SearchLatency', 1847, 'Milliseconds')
publish_metric('ClaudeAPITokens', 1500, 'Count')
publish_metric('CacheHitRate', 0.65, 'Percent')
```

**Key Metrics:**

| Metric | Alert Threshold |
|--------|-----------------|
| **API Response Time (P95)** | >3000ms |
| **Error Rate** | >5% |
| **Cache Hit Rate** | <50% |
| **Claude API Token Usage** | >80% of quota |
| **Database Connection Pool** | >90% utilized |
| **ECS CPU Utilization** | >80% |

### 13.3 Distributed Tracing (AWS X-Ray)

```python
from aws_xray_sdk.core import xray_recorder

@xray_recorder.capture('search_service')
async def search(query, library_id):
    # Automatically traces subsegments
    with xray_recorder.capture('embed_query'):
        vector = await embed_query(query)

    with xray_recorder.capture('pinecone_query'):
        results = await pinecone.query(vector)

    with xray_recorder.capture('claude_api'):
        response = await claude.messages.create(...)

    return response
```

**Trace Visualization:**
```
Request → [API Gateway 15ms] → [Search Service 1847ms]
              ├─ [Embed Query 50ms]
              ├─ [Pinecone Query 80ms]
              ├─ [ILS API 200ms]
              └─ [Claude API 1500ms]
```

---

## 14. Cost Analysis

### 14.1 Infrastructure Costs (Per Library, Monthly)

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| **ECS Fargate** | 0.5 vCPU, 1GB RAM, 2 tasks | $35 |
| **RDS Postgres** | db.t4g.micro, 20GB storage | $15 |
| **ElastiCache Redis** | cache.t4g.micro, 1 node | $12 |
| **CloudFront** | 100GB data transfer | $10 |
| **ALB** | 1 load balancer | $20 |
| **Secrets Manager** | 5 secrets | $2 |
| **CloudWatch Logs** | 10GB logs/month | $5 |
| **Pinecone** | 100K vectors (shared) | $70 ÷ 10 libraries = $7 |
| **Total Infrastructure** | | **$106/library/month** |

### 14.2 API Usage Costs (Per Library, Monthly)

**Assumptions:**
- 10,000 queries/month per library
- 60% cache hit rate → 4,000 Claude API calls
- Average 1,000 input tokens + 500 output tokens per call

| Service | Usage | Cost per Unit | Monthly Cost |
|---------|-------|---------------|--------------|
| **Claude API (Input)** | 4,000 calls × 1,000 tokens | $0.003/1K tokens | $12 |
| **Claude API (Output)** | 4,000 calls × 500 tokens | $0.015/1K tokens | $30 |
| **Anthropic Embeddings** | 4,000 embeds × 512 tokens | $0.0001/1K tokens | $0.20 |
| **Pinecone Queries** | 10,000 queries | Included in $70/mo | $0 |
| **ILS API** | 10,000 calls | $0 (free) | $0 |
| **OverDrive API** | 5,000 calls | $0 (free) | $0 |
| **Total API Costs** | | | **$42.20/library/month** |

### 14.3 Total Cost of Ownership (TCO)

**Per Library:**
- Infrastructure: $106/month
- API usage: $42/month
- **Total: $148/month**

**With Caching Optimization (70% hit rate):**
- Claude API calls: 3,000 (vs. 4,000)
- API cost: $31.50 (vs. $42)
- **Total: $137.50/month** (7% savings)

**At Scale (100 libraries):**
- Infrastructure: $10,600/month
- API usage: $3,150/month
- **Total: $13,750/month** ($165K/year)

**Revenue Model:**
- Tier 1 (Small libraries): $300/month
- Tier 2 (Medium libraries): $600/month
- Tier 3 (Large libraries): $1,200/month

**Gross Margin:**
- Small library: $300 revenue - $137 cost = $163 profit (54% margin)
- Medium library: $600 revenue - $137 cost = $463 profit (77% margin)
- Large library: $1,200 revenue - $200 cost = $1,000 profit (83% margin)

---

## 15. Migration Path: Prototype to Production

### 15.1 Current Prototype Architecture (As-Is)

```
React Frontend (Vite)
    ↓ (Direct API call)
Netlify Serverless Function
    ↓
Anthropic Claude API
    ↑
Mock JSON Catalog (public/data/catalog.json)
```

**What's Missing from Prototype:**
1. ❌ No caching (every query hits Claude)
2. ❌ No vector search (relying on Claude to parse entire catalog in prompt)
3. ❌ No real ILS integration
4. ❌ No authentication
5. ❌ No rate limiting
6. ❌ No error resilience (fallbacks)
7. ❌ No monitoring/logging

### 15.2 Production Architecture (To-Be)

```
React Frontend (PWA)
    ↓ (HTTPS via CloudFront)
FastAPI Backend (ECS Fargate)
    ├──→ Redis Cache (ElastiCache)
    ├──→ Pinecone Vector DB
    ├──→ PostgreSQL (RDS)
    ├──→ Anthropic Claude API
    ├──→ ILS APIs (Polaris/Koha)
    └──→ OverDrive API
```

### 15.3 Migration Steps

**Phase 1: Backend Scaffold (Week 1-2)**
1. Set up FastAPI project structure
2. Implement PostgreSQL schema
3. Deploy Redis (local for dev, ElastiCache for prod)
4. Create Docker container
5. Set up CI/CD pipeline (GitHub Actions)

**Phase 2: Core Services (Week 3-5)**
1. Implement search service with caching
2. Integrate Pinecone for vector search
3. Build ILS abstraction layer (Polaris + Koha clients)
4. Implement JWT authentication
5. Add rate limiting middleware

**Phase 3: Integration (Week 6-8)**
1. Migrate frontend to call new FastAPI backend
2. Replace mock data with PostgreSQL + Pinecone
3. Connect to ILS sandbox environments
4. Integrate OverDrive API (sandbox)
5. End-to-end testing

**Phase 4: Production Hardening (Week 9-12)**
1. Implement error handling & fallbacks
2. Add circuit breakers for external APIs
3. Set up monitoring (CloudWatch, X-Ray)
4. Security hardening (penetration test)
5. Load testing (500 concurrent users)

**Phase 5: Pilot Launch (Week 13-16)**
1. Deploy to AWS production
2. Onboard 5-7 pilot libraries
3. Train library staff
4. Monitor & iterate based on feedback

### 15.4 Data Migration

**Catalog Ingestion Pipeline:**

```python
# scripts/ingest_catalog.py

import asyncio
from app.integrations.ils.polaris_client import PolarisClient
from app.integrations.pinecone_client import PineconeClient
from app.integrations.claude_client import ClaudeClient

async def ingest_library_catalog(library_id: str):
    """
    ETL pipeline to sync ILS catalog to Pinecone + Postgres.
    Runs daily as cron job.
    """

    # 1. Fetch full catalog from ILS
    ils = PolarisClient(library_config)
    catalog = await ils.get_full_catalog(library_id)

    print(f"Fetched {len(catalog)} items from ILS")

    # 2. For each book, generate embedding
    claude = ClaudeClient()
    pinecone = PineconeClient()

    batch_size = 100
    for i in range(0, len(catalog), batch_size):
        batch = catalog[i:i+batch_size]

        # Generate embeddings in batch
        texts = [f"{book['title']} {book['description']}" for book in batch]
        embeddings = await claude.batch_embed(texts)

        # Upsert to Pinecone
        vectors = [
            {
                "id": f"{library_id}:{book['isbn']}",
                "values": embedding,
                "metadata": {
                    "library_id": library_id,
                    "isbn": book["isbn"],
                    "title": book["title"],
                    "author": book["author"],
                    "subjects": book["subjects"]
                }
            }
            for book, embedding in zip(batch, embeddings)
        ]

        await pinecone.upsert(vectors)

        # 3. Store full metadata in Postgres
        await db.bulk_insert_books(batch)

        print(f"Processed {i+len(batch)}/{len(catalog)} items")

    print(f"✅ Catalog ingestion complete for {library_id}")

# Run daily via cron
if __name__ == "__main__":
    asyncio.run(ingest_library_catalog("lib_123"))
```

### 15.5 Rollout Strategy

**Phased Rollout:**

1. **Week 1-4:** Internal testing with 2-3 friendly libraries
2. **Week 5-8:** Expand to 5-7 pilot libraries
3. **Week 9-12:** Monitor, fix issues, optimize performance
4. **Week 13+:** Open to all interested libraries (waitlist)

**Success Criteria Before General Availability:**
- [ ] P95 latency < 3 seconds
- [ ] 99.5% uptime over 4 weeks
- [ ] 80%+ satisfaction in pilot surveys
- [ ] <5% error rate
- [ ] Cache hit rate >60%

---

## 16. Conflicts with Prototype

### 16.1 Identified Conflicts

| Component | Prototype | Production (TRD) | Migration Strategy |
|-----------|-----------|------------------|-------------------|
| **Backend** | Netlify Functions | FastAPI on ECS Fargate | Rewrite backend; keep frontend API interface similar |
| **Authentication** | None (anonymous) | JWT with ILS validation | Add auth middleware; prototype can run without auth initially |
| **Catalog Data** | Mock JSON (69 books) | PostgreSQL + Pinecone (100K+ books) | Run daily ETL job to sync ILS → Pinecone → Postgres |
| **Caching** | None | Redis (multi-tier) | Add Redis layer between FastAPI and external APIs |
| **Vector Search** | Claude parses catalog in prompt | Pinecone semantic search | Migrate from "catalog in prompt" to RAG with Pinecone top-k |
| **Error Handling** | Retry logic only | Circuit breakers + fallbacks | Wrap external API calls with circuit breaker pattern |
| **Monitoring** | Console.log only | CloudWatch + X-Ray | Add structured logging and distributed tracing |
| **Deployment** | Netlify (serverless) | AWS ECS Fargate (containers) | Containerize with Docker; deploy to ECS |

### 16.2 What Stays the Same

✅ **Frontend (React + TypeScript):**
- Component structure can be reused
- UI/UX remains identical
- Only API endpoint URLs change (Netlify Functions → FastAPI)

✅ **Claude Integration:**
- Same model (claude-sonnet-4-5)
- Same prompt structure (system prompt + messages)
- Same streaming approach (with improvements)

✅ **Conversation Flow:**
- Multi-turn conversation logic preserved
- Message history management reusable
- User-facing experience unchanged

### 16.3 Backward Compatibility

**During Migration:**
- Keep Netlify Functions running for 2 weeks
- Frontend can toggle between old and new backend via feature flag
- Gradual traffic shift: 10% → 50% → 100%

```typescript
// Frontend: Feature flag for backend switch
const API_BASE_URL = import.meta.env.VITE_USE_NEW_BACKEND === 'true'
  ? 'https://api.librarian-llm.com'
  : '/.netlify/functions';
```

---

## 17. Conclusion

This Technical Requirements Document provides a complete blueprint for building Librarian LLM from prototype to production. Key takeaways:

### 17.1 Critical Success Factors

1. **Speed to Market:** 6-month timeline is achievable with focused scope
2. **Cost Efficiency:** $137/library/month with 54-83% gross margins
3. **Privacy by Design:** Zero-logging architecture from day one
4. **Graceful Degradation:** Multiple fallback layers ensure uptime
5. **Scalability:** Auto-scaling ECS + managed services (Pinecone, RDS)

### 17.2 Recommended Next Steps

1. **Week 1:** Finalize pilot library commitments (5-7 libraries)
2. **Week 1-2:** Set up AWS infrastructure (Terraform)
3. **Week 3-8:** Build FastAPI backend + ILS integrations
4. **Week 9-12:** Migrate frontend + end-to-end testing
5. **Week 13-16:** Pilot launch with real libraries

### 17.3 Open Questions for Stakeholders

1. **Budget approval:** $435K-$600K for 6-month MVP?
2. **Pilot commitments:** Which 5-7 libraries are confirmed?
3. **Pricing model:** Flat rate or usage-based?
4. **Phase 2 features:** Voice input/output vs. mobile app priority?

### 17.4 Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **ILS API quirks** | Medium | High | Sandbox testing + abstraction layer |
| **Claude API costs** | Low | Medium | Aggressive caching (60-70% hit rate) |
| **Pilot attrition** | Medium | High | Over-recruit (8-10 pilots for 5-7 needed) |
| **Scope creep** | High | High | Strict P0 feature list; defer all else |
| **Accessibility gaps** | Low | Medium | Third-party audit before launch |

---

**Document Status:** ✅ Ready for Engineering Review
**Next Review:** After pilot commitments secured
**Owner:** Senior Backend Engineering Team
**Last Updated:** October 8, 2025
