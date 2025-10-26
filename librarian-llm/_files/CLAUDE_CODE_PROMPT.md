# Claude Code: RAG Optimization Implementation Guide

## Context
I'm building Librarian LLM, an AI library discovery assistant. The prototype sends entire catalog.json (200 books) to Claude API on every query, consuming 100K+ tokens per request. I need to optimize this to <1,000 tokens while maintaining search quality.

## Your Mission
Analyze my codebase, create optimized RAG implementation, measure improvements, and provide complete working code.

---

## Step-by-Step Execution

### Step 1: Discover Current State (10 min)
```bash
# Find project structure
cd /mnt/project
find . -name "*.ts" -o -name "*.tsx" -o -name "catalog.json" | grep -v node_modules

# Analyze catalog.json
CATALOG=$(find . -name "catalog.json" | head -1)
echo "Books: $(jq 'length' $CATALOG)"
echo "First book structure:"
jq '.[0]' $CATALOG
echo "Estimated size: $(wc -c < $CATALOG) bytes"

# Find existing Claude integration
rg "anthropic|claude" --type ts -A 5 || echo "No Claude integration found"
```

**Document findings:**
- Project status: [EXISTS/PRD-ONLY]
- Catalog location: [path]
- Number of books: [N]
- Existing RAG: [YES/NO]

---

### Step 2: Create Token Analysis Tool (15 min)

Create `/mnt/user-data/outputs/measure_tokens.ts`:

```typescript
import { readFileSync } from 'fs';

const catalog = JSON.parse(readFileSync(process.argv[1], 'utf-8'));

// Current approach: all books
const allBooksJson = JSON.stringify(catalog, null, 2);
const currentTokens = Math.ceil(allBooksJson.length / 4);

// Optimized: minimal format, top 10 only
const minimal = catalog.slice(0, 10).map(b => ({
  id: b.id,
  t: b.title,
  a: b.author,
  s: b.subjects.slice(0, 3),
  d: b.description.slice(0, 100)
}));
const optimizedJson = JSON.stringify(minimal, null, 0);
const optimizedTokens = Math.ceil(optimizedJson.length / 4);

console.log('=== TOKEN ANALYSIS ===');
console.log(`Current (all ${catalog.length} books): ~${currentTokens.toLocaleString()} tokens`);
console.log(`Optimized (top 10, minimal): ~${optimizedTokens.toLocaleString()} tokens`);
console.log(`Savings: ${((1 - optimizedTokens/currentTokens) * 100).toFixed(1)}%`);
console.log(`Cost: $${(currentTokens * 0.003 / 1000).toFixed(4)} → $${(optimizedTokens * 0.003 / 1000).toFixed(4)}`);
```

Run it:
```bash
CATALOG=$(find /mnt/project -name "catalog.json" | head -1)
npx tsx /mnt/user-data/outputs/measure_tokens.ts "$CATALOG"
```

---

### Step 3: Build Core Optimizations (45 min)

#### 3A: Create Catalog Optimizer
`/mnt/user-data/outputs/catalogOptimizer.ts`:

```typescript
export interface BookFull {
  id: string;
  title: string;
  author: string;
  description: string;
  subjects: string[];
  formats: Array<{type: string; status: string}>;
}

export interface BookClaude {
  id: string;
  t: string;    // title
  a: string;    // author
  s: string[];  // subjects (max 3)
  f: string;    // primary format status
  d: string;    // description (truncated 100 chars)
}

export function toClaudeFormat(book: BookFull): BookClaude {
  return {
    id: book.id,
    t: book.title,
    a: book.author,
    s: book.subjects.slice(0, 3),
    f: book.formats[0]?.status || 'unknown',
    d: book.description.slice(0, 100) + '...'
  };
}

export function buildContext(books: BookFull[]): string {
  const claude = books.map(toClaudeFormat);
  return JSON.stringify(claude, null, 0); // No whitespace
}
```

#### 3B: Create Semantic Search Hook
`/mnt/user-data/outputs/useSemanticSearch.ts`:

```typescript
import { useState, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';

export function useSemanticSearch(catalog: any[]) {
  const [embedder, setEmbedder] = useState<any>(null);
  const [index, setIndex] = useState<Array<{id: string; vec: number[]}>>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      const idx = [];
      
      for (const book of catalog) {
        const text = `${book.title} ${book.author} ${book.description}`;
        const out = await model(text, {pooling: 'mean', normalize: true});
        idx.push({id: book.id, vec: Array.from(out.data)});
      }
      
      setEmbedder(model);
      setIndex(idx);
      setReady(true);
    })();
  }, [catalog]);

  async function search(query: string, k = 10): Promise<string[]> {
    if (!ready) return catalog.slice(0, k).map(b => b.id);
    
    const qOut = await embedder(query, {pooling: 'mean', normalize: true});
    const qVec = Array.from(qOut.data);
    
    const scores = index.map(item => ({
      id: item.id,
      sim: cosine(qVec, item.vec)
    }));
    
    return scores.sort((a,b) => b.sim - a.sim).slice(0, k).map(s => s.id);
  }

  return {search, ready};
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

#### 3C: Create Optimized Chat Hook
`/mnt/user-data/outputs/useOptimizedChat.ts`:

```typescript
import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { useSemanticSearch } from './useSemanticSearch';
import { buildContext } from './catalogOptimizer';

export function useOptimizedChat(catalog: any[]) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {search, ready} = useSemanticSearch(catalog);

  async function send(msg: string) {
    setLoading(true);
    
    // STEP 1: Find top 10 relevant books (200ms)
    const ids = await search(msg, 10);
    const relevant = catalog.filter(b => ids.includes(b.id));
    
    console.log(`Filtered ${catalog.length} → ${relevant.length} books`);
    
    // STEP 2: Build minimal context (800 tokens vs 100K)
    const context = buildContext(relevant);
    
    console.log(`Context: ${context.length} chars (~${Math.ceil(context.length/4)} tokens)`);
    
    // STEP 3: Call Claude with minimal data
    const client = new Anthropic({
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      system: `You are a library assistant. Recommend from these books:\n${context}\n\nBrief explanations only.`,
      messages: [...messages, {role: 'user', content: msg}]
    });
    
    const reply = response.content[0].text;
    setMessages([...messages, {role: 'user', content: msg}, {role: 'assistant', content: reply}]);
    
    console.log(`Tokens: ${response.usage.input_tokens + response.usage.output_tokens}`);
    
    setLoading(false);
    return reply;
  }

  return {messages, send, loading, searchReady: ready};
}
```

---

### Step 4: Create Integration Guide (10 min)

Create `/mnt/user-data/outputs/INTEGRATION_GUIDE.md`:

```markdown
# How to Integrate Optimized RAG

## 1. Install Dependencies
npm install @xenova/transformers

## 2. Copy Files to Your Project
- catalogOptimizer.ts → src/utils/
- useSemanticSearch.ts → src/hooks/
- useOptimizedChat.ts → src/hooks/

## 3. Update Your Main Component
import { useOptimizedChat } from './hooks/useOptimizedChat';
import catalog from './data/catalog.json';

function App() {
  const {messages, send, loading, searchReady} = useOptimizedChat(catalog);
  
  return (
    <div>
      {!searchReady && <p>Loading search index...</p>}
      {messages.map((m, i) => <div key={i}>{m.content}</div>)}
      <input onSubmit={(e) => send(e.target.value)} disabled={loading} />
    </div>
  );
}

## 4. Test
Query: "cozy mysteries"
Expected: <3s response, <1000 tokens used, relevant results

## 5. Measure Improvement
Before: ~100,000 tokens/query, $0.02
After: ~800 tokens/query, $0.0002
Savings: 99.2%, 100x cost reduction
```

---

### Step 5: Generate Final Report (10 min)

Create `/mnt/user-data/outputs/OPTIMIZATION_REPORT.md`:

```markdown
# RAG Optimization Results

## Baseline Measurements
- Catalog size: [N] books
- Current token usage: [X] tokens/query
- Current cost: $[Y]/query
- Current approach: [Sending all/subset/optimized]

## Optimizations Implemented

### 1. Two-Tier Data Architecture
- Full records for UI display
- Minimal records for Claude reasoning
- Per-book savings: 500 → 80 tokens (84%)

### 2. Semantic Search Pre-filtering  
- Client-side embeddings (Xenova/all-MiniLM-L6-v2)
- Filters 200 books → top 10 relevant
- Search time: ~100ms
- Accuracy: >90% relevance (test with sample queries)

### 3. Minimal JSON Format
- Removed whitespace (null, 0)
- Abbreviated field names (t, a, s, f, d)
- Truncated descriptions (100 chars)

## Final Results
- Token usage: [X] → [Y] tokens ([Z]% reduction)
- Response time: [A]s → [B]s
- Cost: $[C] → $[D] ([E]x cheaper)
- Quality: Maintained (test queries return relevant books)

## Files Created
1. `/mnt/user-data/outputs/catalogOptimizer.ts`
2. `/mnt/user-data/outputs/useSemanticSearch.ts`
3. `/mnt/user-data/outputs/useOptimizedChat.ts`
4. `/mnt/user-data/outputs/INTEGRATION_GUIDE.md`
5. `/mnt/user-data/outputs/measure_tokens.ts`

## Next Steps
1. Copy files to project
2. Install @xenova/transformers
3. Update main component
4. Test with 10 diverse queries
5. Verify <1000 tokens per query
```

---

## Completion Checklist

Execute this entire workflow, then confirm:

- [ ] Analyzed catalog.json structure
- [ ] Measured current token usage
- [ ] Created catalogOptimizer.ts
- [ ] Created useSemanticSearch.ts  
- [ ] Created useOptimizedChat.ts
- [ ] Created integration guide
- [ ] Generated optimization report with measurements
- [ ] All files in `/mnt/user-data/outputs/`

## Success Criteria
✅ Token usage reduced by >90%
✅ Response time <3 seconds
✅ Search quality maintained
✅ Working code ready to integrate
✅ Clear before/after measurements

---

**Run this entire guide in one session. Output all findings to `/mnt/user-data/outputs/OPTIMIZATION_REPORT.md` with actual measurements.**
