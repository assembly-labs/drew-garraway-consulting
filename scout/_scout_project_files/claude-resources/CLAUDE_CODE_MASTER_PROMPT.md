# COPY THIS ENTIRE PROMPT AND PASTE INTO CLAUDE CODE

---

# Mission: Analyze Librarian LLM Codebase & Optimize RAG Architecture

## Context
I'm building Librarian LLM, an AI-powered library discovery assistant for public libraries. The prototype uses Claude API to recommend books from a catalog.json file containing 200+ mock book records. I need to optimize the RAG (Retrieval-Augmented Generation) architecture to:

1. **Minimize token usage** (currently sending entire catalog to Claude = 100K+ tokens)
2. **Maximize search relevance** (semantic search, not keyword matching)
3. **Prepare for beta deployment** with 5-7 pilot libraries

## Your Task
Analyze my codebase (or PRD if code doesn't exist), understand how catalog data flows to Claude API, calculate current token usage, and provide 3-5 concrete optimization strategies with working code examples.

## Key Documents to Reference
- `/mnt/project/prototype_prd-librarian-llm.md` - Technical architecture specs
- `/mnt/project/Conversation_Design_Best_Practices_` - Grice's maxims, context management
- `/mnt/project/catalog.json` (or similar) - Mock library data

## Execute These Steps in Order

---

## STEP 1: DISCOVER PROJECT STATE (15 min)

### 1.1 Find and Map the Codebase

```bash
# Navigate to project root
cd /mnt/project

# Show complete structure
echo "=== PROJECT STRUCTURE ===" 
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) | grep -v node_modules | sort

# Check for key files
echo -e "\n=== KEY FILES ===" 
ls -lh package.json tsconfig.json vite.config.ts src/ public/ 2>/dev/null || echo "No React project found"

# Find catalog data
echo -e "\n=== CATALOG DATA ===" 
find . -name "*catalog*.json" -o -name "data.json" | head -5
```

**Document in `/mnt/user-data/outputs/01_project_discovery.md`:**
```markdown
# Project Discovery Report

## Status: [EXISTS | PRD-ONLY | PARTIAL]

### Found:
- React project: [YES/NO]
- catalog.json location: [path]
- Claude API integration: [path or NONE]
- Search/RAG logic: [path or NONE]

### Project Type:
[Describe what stage: prototype with code, PRD-only, somewhere in between]
```

---

### 1.2 Analyze catalog.json Structure

```bash
# Find catalog file
CATALOG=$(find /mnt/project -name "*catalog*.json" -type f | head -1)

if [ -f "$CATALOG" ]; then
    echo "=== CATALOG ANALYSIS ==="
    echo "Location: $CATALOG"
    
    echo -e "\n--- Record Count ---"
    jq 'length' "$CATALOG"
    
    echo -e "\n--- First Book (Full Record) ---"
    jq '.[0]' "$CATALOG"
    
    echo -e "\n--- Field Analysis ---"
    jq '.[0] | to_entries | map({field: .key, chars: (.value | tostring | length), est_tokens: ((.value | tostring | length) / 4 | ceil)}) | sort_by(.est_tokens) | reverse' "$CATALOG"
    
    echo -e "\n--- File Size ---"
    ls -lh "$CATALOG"
    du -h "$CATALOG"
else
    echo "No catalog.json found - will recommend structure"
fi
```

**Create `/mnt/user-data/outputs/02_catalog_analysis.md`:**
```markdown
# Catalog Data Analysis

## File: [path]
## Books: [N]
## Total Size: [X] KB

### Schema:
[Paste jq output showing fields and token estimates]

### Token Estimates:
- Average tokens per book (full): ~[X]
- Total tokens if all sent to Claude: [N × X] = [Y] tokens
- Cost per query at current rate: $[Z]

### Heaviest Fields (optimization targets):
1. description: ~[X] tokens
2. formats: ~[Y] tokens  
3. [other large fields]

### Optimization Opportunities:
- [Specific fields that could be truncated]
- [Fields only needed for UI, not Claude]
- [Redundant data]
```

---

### 1.3 Review Current RAG Implementation

```bash
# Search for Claude API usage
echo "=== CLAUDE API INTEGRATION ==="
rg -i "anthropic|claude" /mnt/project/src --type ts -A 5 -B 2 2>/dev/null || echo "No Claude integration found"

# Search for system prompts
echo -e "\n=== SYSTEM PROMPTS ==="
rg -i "system.*prompt|SYSTEM_PROMPT" /mnt/project/src --type ts -A 10 2>/dev/null || echo "No system prompts found"

# Search for catalog loading
echo -e "\n=== CATALOG LOADING ==="
rg -i "catalog|useCatalog|loadCatalog" /mnt/project/src --type ts -A 5 2>/dev/null || echo "No catalog loading found"

# Search for conversation/message handling
echo -e "\n=== CONVERSATION MANAGEMENT ==="
rg -i "messages|conversation|useChat" /mnt/project/src --type ts -A 5 2>/dev/null || echo "No conversation management found"
```

**Create `/mnt/user-data/outputs/03_current_implementation.md`:**
```markdown
# Current Implementation Analysis

## RAG Pattern: [NONE | BASIC | OPTIMIZED]

### Claude API Integration:
- Location: [file path or NONE]
- Model: [claude-sonnet-4-5-20250929 or UNKNOWN]
- Current approach: [describe]

### Catalog → Claude Flow:
[Describe how catalog data currently reaches Claude, or recommend architecture if none exists]

### Token Usage Pattern:
**Current:**
```typescript
// [Paste actual code or describe intended approach]
```

**Estimated tokens per request:**
- System prompt: ~[X] tokens
- Catalog data: ~[Y] tokens  
- Conversation history: ~[Z] tokens
- **TOTAL: ~[X+Y+Z] tokens/query**
- **Cost: $[calculate based on claude-sonnet pricing]**

### Problems Identified:
1. [Issue 1]
2. [Issue 2]
3. [Issue 3]
```

---

## STEP 2: CALCULATE TOKEN BASELINE (10 min)

Create and run this analysis script:

```bash
# Create token analysis script
cat > /mnt/user-data/outputs/token_analysis.ts << 'EOF'
import { readFileSync } from 'fs';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  subjects?: string[];
  formats?: any[];
  [key: string]: any;
}

function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English
  return Math.ceil(text.length / 4);
}

function analyzeTokenUsage(catalogPath: string) {
  const catalog: Book[] = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     TOKEN USAGE ANALYSIS REPORT            ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  // Per-book analysis
  const bookTokens = catalog.map(book => {
    const fullText = JSON.stringify(book);
    const minimalText = `${book.id}:${book.title}:${book.author}:${book.description?.slice(0, 100) || ''}`;
    
    return {
      id: book.id,
      title: book.title,
      fullTokens: estimateTokens(fullText),
      minimalTokens: estimateTokens(minimalText),
    };
  });
  
  const avgFull = bookTokens.reduce((sum, b) => sum + b.fullTokens, 0) / bookTokens.length;
  const avgMinimal = bookTokens.reduce((sum, b) => sum + b.minimalTokens, 0) / bookTokens.length;
  const totalFull = catalog.length * avgFull;
  const totalMinimal = 10 * avgMinimal;
  
  console.log('📊 BASELINE METRICS');
  console.log('─────────────────────────────────────────────');
  console.log(`Total books in catalog: ${catalog.length}`);
  console.log(`Avg tokens/book (full record): ${avgFull.toFixed(0)}`);
  console.log(`Avg tokens/book (minimal): ${avgMinimal.toFixed(0)}`);
  console.log('');
  
  console.log('💰 CURRENT APPROACH (All Books, Full Data)');
  console.log('─────────────────────────────────────────────');
  console.log(`${catalog.length} books × ${avgFull.toFixed(0)} tokens = ${totalFull.toFixed(0)} tokens`);
  console.log(`Cost per query: $${(totalFull * 0.000003).toFixed(4)} (input tokens only)`);
  console.log('');
  
  console.log('✨ OPTIMIZED APPROACH (Top 10, Minimal Data)');
  console.log('─────────────────────────────────────────────');
  console.log(`10 books × ${avgMinimal.toFixed(0)} tokens = ${totalMinimal.toFixed(0)} tokens`);
  console.log(`Cost per query: $${(totalMinimal * 0.000003).toFixed(4)} (input tokens only)`);
  console.log('');
  
  console.log('📈 POTENTIAL SAVINGS');
  console.log('─────────────────────────────────────────────');
  const savings = ((totalFull - totalMinimal) / totalFull * 100).toFixed(1);
  console.log(`Token reduction: ${savings}%`);
  console.log(`Cost reduction: ${savings}%`);
  console.log('');
  
  // Field analysis
  console.log('🔍 FIELD-LEVEL BREAKDOWN (First Book)');
  console.log('─────────────────────────────────────────────');
  const firstBook = catalog[0];
  const entries = Object.entries(firstBook)
    .map(([key, value]) => ({
      field: key,
      tokens: estimateTokens(JSON.stringify(value)),
      percent: (estimateTokens(JSON.stringify(value)) / estimateTokens(JSON.stringify(firstBook)) * 100).toFixed(1)
    }))
    .sort((a, b) => b.tokens - a.tokens);
  
  entries.forEach(e => {
    console.log(`  ${e.field.padEnd(20)} ${e.tokens.toString().padStart(5)} tokens (${e.percent}%)`);
  });
  
  console.log('\n');
  console.log('💡 RECOMMENDATIONS');
  console.log('─────────────────────────────────────────────');
  console.log('1. Implement semantic search to filter 200 → 10 books');
  console.log('2. Create lightweight schema for Claude context');
  console.log('3. Truncate descriptions to 120 chars');
  console.log('4. Remove fields not needed for reasoning (cover URLs, ISBNs)');
  console.log('');
}

// Run analysis
const catalogPath = process.argv[2] || '/mnt/project/public/data/catalog.json';
try {
  analyzeTokenUsage(catalogPath);
} catch (err) {
  console.error('Error analyzing catalog:', err.message);
  console.log('\nExpected catalog path:', catalogPath);
  console.log('Usage: npx tsx token_analysis.ts /path/to/catalog.json');
}
EOF

# Make it executable and run it
chmod +x /mnt/user-data/outputs/token_analysis.ts
cd /mnt/user-data/outputs

# Find catalog and run analysis
CATALOG=$(find /mnt/project -name "*catalog*.json" -type f | head -1)
if [ -f "$CATALOG" ]; then
    echo "Running token analysis on: $CATALOG"
    npx tsx token_analysis.ts "$CATALOG" 2>/dev/null || node --loader ts-node/esm token_analysis.ts "$CATALOG"
else
    echo "No catalog found - skipping token analysis"
    echo "Expected location: /mnt/project/public/data/catalog.json"
fi
```

---

## STEP 3: GENERATE OPTIMIZATION STRATEGIES (30 min)

Now create detailed recommendations. For each strategy, provide:
- Problem being solved
- Technical approach
- Working code implementation
- Expected savings
- Implementation effort/timeline

**Create `/mnt/user-data/outputs/04_optimization_strategies.md`:**

```markdown
# RAG Optimization Strategies for Librarian LLM

## Executive Summary
Based on analysis of [your specific findings], we can reduce token usage by [X]% through [Y] strategies.

**Current baseline:** [N] tokens/query, $[Z]/query
**Optimized target:** [M] tokens/query, $[W]/query
**Improvement:** [%] reduction

---

## 🎯 STRATEGY #1: Two-Tier Data Architecture

### Problem
Sending full book records (500+ tokens each) to Claude when it only needs title, author, brief description for reasoning.

### Solution
Create two representations:
1. **Full record** (for UI display only)
2. **Claude record** (lightweight, 80 tokens)

### Implementation

**File: `src/utils/catalogOptimizer.ts`**
```typescript
export interface BookFull {
  id: string;
  isbn: string;
  title: string;
  author: string;
  cover: string;
  formats: Array<{
    type: 'physical' | 'ebook' | 'audiobook';
    status: 'available' | 'waitlist' | 'checked_out';
    copies_available?: number;
    wait_time?: string;
  }>;
  subjects: string[];
  description: string;
  publication_year: number;
  pages: number;
  rating: number;
  popular?: boolean;
}

export interface BookClaude {
  id: string;
  t: string;  // title
  a: string;  // author
  s: string[];  // subjects (max 4)
  f: Record<string, string>;  // formats: {physical: "avail"}
  d: string;  // description (truncated 120 chars)
  y: number;  // year
}

export function toClaudeFormat(book: BookFull): BookClaude {
  return {
    id: book.id,
    t: book.title,
    a: book.author,
    s: book.subjects.slice(0, 4),
    f: book.formats.reduce((acc, fmt) => {
      acc[fmt.type] = fmt.status === 'available' ? 'avail' : 
                      fmt.status === 'waitlist' ? `wait` : 'out';
      return acc;
    }, {} as Record<string, string>),
    d: book.description.slice(0, 120).trim() + '...',
    y: book.publication_year
  };
}

export function buildClaudeContext(books: BookFull[]): string {
  return JSON.stringify(books.map(toClaudeFormat), null, 0);
}
```

### Integration

Update your `useClaudeChat` hook:
```typescript
import { toClaudeFormat } from '../utils/catalogOptimizer';

// Before Claude API call:
const claudeBooks = relevantBooks.map(toClaudeFormat);
const systemPrompt = `You are a library assistant.

Books to recommend:
${JSON.stringify(claudeBooks, null, 0)}

Rules: Brief explanations, mention availability, 2-3 books max.`;
```

### Expected Results
- **Per-book savings:** 500 tokens → 80 tokens (84%)
- **Implementation time:** 2-3 hours
- **Risk:** LOW (just data transformation)
- **Quality impact:** NONE (Claude gets same essential info)

---

## 🎯 STRATEGY #2: Client-Side Semantic Search

### Problem
Sending all 200 books to Claude wastes tokens on irrelevant books.

### Solution
Pre-filter using embeddings: 200 books → 10 relevant → Claude

### Architecture Flow
```
User: "cozy mysteries set in bookstores"
  ↓
[Embedding Model in Browser] (~100ms)
  ↓
Query Vector: [0.23, -0.45, 0.12, ...]
  ↓
[Cosine Similarity vs Pre-computed Book Vectors]
  ↓
Top 10 matches: [book_089, book_156, ...]
  ↓
[Claude API] (receives only 10 books × 80 tokens = 800 tokens)
  ↓
Response: "I found 3 cozy mysteries in bookstores..."
```

### Implementation

**Install dependency:**
```bash
npm install @xenova/transformers
```

**File: `src/hooks/useSemanticSearch.ts`**
```typescript
import { pipeline, env } from '@xenova/transformers';
import { useEffect, useState } from 'react';
import type { BookFull } from '../types';

env.allowLocalModels = false;

interface SearchIndex {
  bookId: string;
  embedding: number[];
}

export function useSemanticSearch(catalog: BookFull[]) {
  const [embedder, setEmbedder] = useState<any>(null);
  const [index, setIndex] = useState<SearchIndex[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      console.log('🔄 Loading embedding model...');
      const startTime = Date.now();
      
      // Small, fast model that runs in browser
      const model = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
      
      console.log(`✅ Model loaded in ${Date.now() - startTime}ms`);
      console.log('🔄 Building search index...');
      
      const searchIndex: SearchIndex[] = [];
      
      for (const book of catalog) {
        const text = [
          book.title,
          book.author,
          ...(book.subjects || []),
          book.description || ''
        ].join(' ');
        
        const output = await model(text, { 
          pooling: 'mean', 
          normalize: true 
        });
        
        searchIndex.push({
          bookId: book.id,
          embedding: Array.from(output.data)
        });
      }
      
      setEmbedder(model);
      setIndex(searchIndex);
      setIsReady(true);
      
      console.log(`✅ Index ready: ${searchIndex.length} books`);
    }
    
    if (catalog.length > 0) {
      initialize();
    }
  }, [catalog]);

  async function search(query: string, topK: number = 10): Promise<string[]> {
    if (!isReady || !embedder) {
      console.warn('⚠️ Search not ready, returning first N books');
      return catalog.slice(0, topK).map(b => b.id);
    }
    
    const queryOutput = await embedder(query, { 
      pooling: 'mean', 
      normalize: true 
    });
    const queryVec: number[] = Array.from(queryOutput.data);
    
    const scores = index.map(item => ({
      bookId: item.bookId,
      score: cosineSimilarity(queryVec, item.embedding)
    }));
    
    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.bookId);
  }

  return { search, isReady };
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

**Update `src/hooks/useClaudeChat.ts`:**
```typescript
import { useSemanticSearch } from './useSemanticSearch';
import { toClaudeFormat } from '../utils/catalogOptimizer';

export function useClaudeChat(catalog: BookFull[]) {
  const { search, isReady: searchReady } = useSemanticSearch(catalog);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(userMessage: string) {
    setIsLoading(true);
    
    // STEP 1: Semantic search (200 → 10 books)
    console.log('🔍 Searching for relevant books...');
    const relevantIds = await search(userMessage, 10);
    const relevantBooks = catalog.filter(b => relevantIds.includes(b.id));
    console.log(`✅ Found ${relevantBooks.length} relevant books`);
    
    // STEP 2: Lightweight format (500 → 80 tokens each)
    const claudeBooks = relevantBooks.map(toClaudeFormat);
    
    // STEP 3: Build minimal system prompt
    const systemPrompt = `Library assistant. Books to recommend:
${JSON.stringify(claudeBooks, null, 0)}

Brief explanations, mention availability, 2-3 max.`;
    
    console.log(`📊 System prompt: ~${Math.ceil(systemPrompt.length/4)} tokens`);
    
    // STEP 4: Call Claude
    const client = new Anthropic({
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
      dangerouslyAllowBrowser: true
    });

    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage }
        ]
      });

      console.log(`💰 Tokens used: ${response.usage.input_tokens + response.usage.output_tokens}`);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content[0].text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, 
        { role: 'user', content: userMessage, timestamp: new Date() },
        assistantMessage
      ]);
      
    } catch (err) {
      console.error('❌ Claude API error:', err);
      // Handle error...
    } finally {
      setIsLoading(false);
    }
  }

  return { 
    messages, 
    sendMessage, 
    isLoading, 
    isReady: searchReady 
  };
}
```

### Expected Results
- **Token savings:** 100,000 → 800 (99.2%)
- **Cost savings:** $0.02 → $0.0002 per query
- **Implementation time:** 1 day
- **Initial load time:** 3-5 seconds (one-time, model download)
- **Search latency:** 50-100ms
- **Risk:** LOW (well-tested library)

---

## 🎯 STRATEGY #3: Smart Context Management

### Problem
Conversation history grows unbounded, wasting tokens on old exchanges.

### Solution
Progressive summarization following Conversation Design best practices:
- Turns 1-10: Full history
- Turns 11-20: Summarize old, keep recent 10
- Turns 20+: Rolling summarization

### Implementation

**File: `src/hooks/useConversationManager.ts`**
```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '../types';

interface ConversationContext {
  messages: Message[];
  summary?: string;
  preferences: {
    mentionedGenres: Set<string>;
    formatPreference?: 'physical' | 'ebook' | 'audiobook';
    rejectedBooks: Set<string>;
  };
}

export function useConversationManager() {
  const MAX_MESSAGES = 20;
  const KEEP_RECENT = 10;

  async function prepareContext(messages: Message[]): Promise<Message[]> {
    if (messages.length <= MAX_MESSAGES) {
      return messages;
    }
    
    // Summarize old messages
    const oldMessages = messages.slice(0, -KEEP_RECENT);
    const recentMessages = messages.slice(-KEEP_RECENT);
    
    const summary = await summarizeConversation(oldMessages);
    
    const contextMessage: Message = {
      role: 'assistant',
      content: `[Earlier context: ${summary}]`,
      timestamp: new Date()
    };
    
    return [contextMessage, ...recentMessages];
  }

  async function summarizeConversation(messages: Message[]): Promise<string> {
    const client = new Anthropic({
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    const text = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 250,
      messages: [{
        role: 'user',
        content: `Summarize this library conversation in 2 sentences:
- Genres/topics mentioned
- Books liked/rejected
- Format preferences

${text}

Summary:`
      }]
    });
    
    return response.content[0].text;
  }

  function extractPreferences(messages: Message[]) {
    const genres = new Set<string>();
    const rejected = new Set<string>();
    let format: 'physical' | 'ebook' | 'audiobook' | undefined;
    
    const genreWords = ['mystery', 'romance', 'thriller', 'sci-fi', 'fantasy', 'memoir', 'biography'];
    
    messages.forEach(msg => {
      const lower = msg.content.toLowerCase();
      
      genreWords.forEach(genre => {
        if (lower.includes(genre)) genres.add(genre);
      });
      
      if (lower.includes('audiobook')) format = 'audiobook';
      else if (lower.includes('ebook') || lower.includes('digital')) format = 'ebook';
      else if (lower.includes('physical') || lower.includes('print')) format = 'physical';
    });
    
    return { mentionedGenres: genres, formatPreference: format, rejectedBooks: rejected };
  }

  return { prepareContext, extractPreferences };
}
```

### Expected Results
- **Turn 1-10:** Normal growth
- **Turn 11+:** Stabilized at 8K tokens
- **30-turn conversation:** 30K → 8K tokens (73% savings)
- **Implementation time:** 1 day
- **Risk:** MEDIUM (need to test quality)

---

## 🎯 STRATEGY #4: IndexedDB Caching

### Problem
Re-computing embeddings on every page load wastes 3-5 seconds and CPU.

### Solution
Persist embeddings in browser IndexedDB.

### Implementation

**File: `src/utils/embeddingCache.ts`**
```typescript
const DB_NAME = 'librarian_llm';
const DB_VERSION = 1;
const STORE_NAME = 'embeddings';

interface CachedEmbedding {
  bookId: string;
  embedding: number[];
  timestamp: number;
}

export class EmbeddingCache {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'bookId' });
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async get(bookId: string): Promise<number[] | null> {
    if (!this.db) return null;
    
    return new Promise((resolve) => {
      const tx = this.db!.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(bookId);
      
      req.onsuccess = () => {
        const cached = req.result as CachedEmbedding | undefined;
        // Fresh within 7 days
        if (cached && Date.now() - cached.timestamp < 7 * 24 * 3600000) {
          resolve(cached.embedding);
        } else {
          resolve(null);
        }
      };
      
      req.onerror = () => resolve(null);
    });
  }

  async set(bookId: string, embedding: number[]): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve) => {
      const tx = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      store.put({
        bookId,
        embedding,
        timestamp: Date.now()
      });
      
      tx.oncomplete = () => resolve();
    });
  }
}
```

**Update `useSemanticSearch.ts`:**
```typescript
export function useSemanticSearch(catalog: BookFull[]) {
  const [cache] = useState(() => new EmbeddingCache());
  
  useEffect(() => {
    async function initialize() {
      await cache.init();
      
      const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      const searchIndex: SearchIndex[] = [];
      let cacheHits = 0;
      
      for (const book of catalog) {
        const text = /* ... build text ... */;
        
        // Try cache first
        let embedding = await cache.get(book.id);
        
        if (!embedding) {
          const output = await model(text, { pooling: 'mean', normalize: true });
          embedding = Array.from(output.data);
          await cache.set(book.id, embedding);
        } else {
          cacheHits++;
        }
        
        searchIndex.push({ bookId: book.id, embedding });
      }
      
      console.log(`✅ Cache hits: ${cacheHits}/${catalog.length}`);
      
      setIndex(searchIndex);
      setEmbedder(model);
      setIsReady(true);
    }
    
    initialize();
  }, [catalog]);
  
  // ... rest
}
```

### Expected Results
- **First load:** 3-5 seconds
- **Subsequent loads:** 100-200ms (95% faster)
- **Storage:** ~300KB for 200 books
- **Implementation time:** 3-4 hours
- **Risk:** LOW

---

## 📊 COMBINED IMPACT

### Scenario: Patron has 15-turn conversation

**BEFORE optimizations:**
```
Turn 1:  200 books × 500 tokens = 100,000 tokens
Turn 5:  200 books × 500 tokens + 5K history = 105,000 tokens
Turn 10: 200 books × 500 tokens + 10K history = 110,000 tokens
Turn 15: 200 books × 500 tokens + 15K history = 115,000 tokens

Total: ~1,650,000 tokens
Cost: ~$4.95
```

**AFTER optimizations:**
```
Turn 1:  10 books × 80 tokens = 800 tokens
Turn 5:  10 books × 80 tokens + 2K history = 2,800 tokens
Turn 10: 10 books × 80 tokens + 4K history = 4,800 tokens
Turn 15: 10 books × 80 tokens + 6K history (summarized) = 6,800 tokens

Total: ~60,000 tokens
Cost: ~$0.18

SAVINGS: 96.4% reduction, $4.77 saved per 15-turn conversation
```

---

## 🗓️ IMPLEMENTATION ROADMAP

### Week 1: Data Architecture (Days 1-2)
- [ ] Create `catalogOptimizer.ts` with `toClaudeFormat()`
- [ ] Update Claude API calls to use lightweight format
- [ ] Test: Verify recommendations still work
- [ ] Measure: Confirm 84% per-book token reduction

### Week 2: Semantic Search (Days 3-7)
- [ ] Install `@xenova/transformers`
- [ ] Create `useSemanticSearch.ts` hook
- [ ] Integrate with `useClaudeChat`
- [ ] Test: "cozy mysteries" returns relevant books
- [ ] Measure: Confirm 99% total token reduction

### Week 3: Context Management (Days 8-12)
- [ ] Create `useConversationManager.ts`
- [ ] Implement summarization logic
- [ ] Add preference extraction
- [ ] Test: 20-turn conversation
- [ ] Measure: Context stable at 8K tokens

### Week 4: Caching & Polish (Days 13-15)
- [ ] Implement `EmbeddingCache` with IndexedDB
- [ ] Add response caching for common queries
- [ ] Performance testing with 100 queries
- [ ] Final measurements and report

### Timeline: 15 working days (3 weeks)
### Expected final metrics:
- Token usage: 100,000 → 800 per query (99.2%)
- Response time: Maintained at <3 seconds
- Cost: $0.02 → $0.0002 per query (99%)
- Quality: No degradation (tested with diverse queries)
```

---

## STEP 4: CREATE IMPLEMENTATION FILES (20 min)

Generate ready-to-use code templates:

```bash
# Create template directory
mkdir -p /mnt/user-data/outputs/code_templates/src/{hooks,utils,types}

# Create each template file with complete, working code
# (Use the implementations from Strategy sections above)
```

**Files to create:**

1. `/mnt/user-data/outputs/code_templates/src/types/index.ts`
```typescript
// Complete type definitions for BookFull, BookClaude, Message, etc.
```

2. `/mnt/user-data/outputs/code_templates/src/utils/catalogOptimizer.ts`
```typescript
// Complete implementation of toClaudeFormat()
```

3. `/mnt/user-data/outputs/code_templates/src/hooks/useSemanticSearch.ts`
```typescript
// Complete semantic search implementation
```

4. `/mnt/user-data/outputs/code_templates/src/hooks/useConversationManager.ts`
```typescript
// Complete context management implementation
```

5. `/mnt/user-data/outputs/code_templates/src/utils/embeddingCache.ts`
```typescript
// Complete IndexedDB caching implementation
```

6. `/mnt/user-data/outputs/code_templates/src/hooks/useClaudeChat.ts`
```typescript
// Updated chat hook integrating all optimizations
```

---

## STEP 5: CREATE IMPLEMENTATION CHECKLIST (5 min)

**File: `/mnt/user-data/outputs/05_implementation_checklist.md`**

```markdown
# RAG Optimization Implementation Checklist

## ✅ Prerequisites
- [ ] React + Vite + TypeScript project exists
- [ ] Claude API key configured in `.env`
- [ ] catalog.json exists with [N] books
- [ ] npm/package manager available

## 📦 Week 1: Two-Tier Data Architecture (2 days)

### Day 1 Morning (2-3 hours)
- [ ] Copy `catalogOptimizer.ts` to `src/utils/`
- [ ] Copy type definitions to `src/types/index.ts`
- [ ] Run `npm install` to ensure dependencies
- [ ] Run token_analysis.ts to get baseline metrics

### Day 1 Afternoon (2-3 hours)
- [ ] Update `useClaudeChat.ts` to import `toClaudeFormat`
- [ ] Replace `JSON.stringify(catalog)` with `buildClaudeContext()`
- [ ] Test with 3-5 diverse queries:
  - [ ] "mystery books"
  - [ ] "books for beach reading"
  - [ ] "science fiction audiobooks"
- [ ] Verify recommendations still accurate

### Day 2 (2-3 hours)
- [ ] Run token_analysis.ts again to measure improvement
- [ ] Document before/after metrics
- [ ] Git commit: "feat: implement two-tier data architecture"

**Expected outcome:** 84% per-book token reduction, ~1 hour total saved

---

## 🔍 Week 2: Semantic Search (5 days)

### Day 3 (4-6 hours)
- [ ] Run: `npm install @xenova/transformers`
- [ ] Copy `useSemanticSearch.ts` to `src/hooks/`
- [ ] Test import: verify no TypeScript errors
- [ ] Initialize in App.tsx to test model loading

### Day 4 (3-4 hours)
- [ ] Update `useClaudeChat.ts` to use `useSemanticSearch`
- [ ] Add search call before Claude API
- [ ] Add console logging for debugging:
  ```typescript
  console.log('Query:', userMessage);
  console.log('Relevant books:', relevantIds);
  ```
- [ ] Test search functionality works

### Day 5 (3-4 hours)
- [ ] Test search quality with 10+ queries:
  - [ ] "cozy mysteries set in bookstores"
  - [ ] "memoirs by women of color"
  - [ ] "funny books for teenagers"
  - [ ] "historical fiction World War II"
  - [ ] "self-help books about anxiety"
- [ ] Verify relevant books returned
- [ ] Measure search latency (target: <200ms)

### Day 6-7 (2-3 hours)
- [ ] Add loading state: "Initializing search index..."
- [ ] Handle edge case: catalog not loaded
- [ ] Handle edge case: search not ready yet
- [ ] Polish UI feedback
- [ ] Git commit: "feat: add client-side semantic search"

**Expected outcome:** 99% token reduction, <3 second total response time

---

## 💬 Week 3: Context Management (5 days)

### Day 8-9 (6-8 hours)
- [ ] Copy `useConversationManager.ts` to `src/hooks/`
- [ ] Implement `prepareContext()` function
- [ ] Implement `summarizeConversation()` function
- [ ] Implement `extractPreferences()` function
- [ ] Add unit tests for preference extraction

### Day 10-11 (6-8 hours)
- [ ] Update `useClaudeChat.ts` to use conversation manager
- [ ] Test with multi-turn conversation (15+ turns)
- [ ] Verify context stays under 10K tokens
- [ ] Verify Claude remembers earlier context
- [ ] Test preference extraction:
  - [ ] Mention "mystery" → Claude remembers genre
  - [ ] Say "audiobook" → Claude prioritizes format
  - [ ] Reject book → Claude doesn't suggest again

### Day 12 (2-3 hours)
- [ ] Measure context window size over 20 turns
- [ ] Document summarization quality
- [ ] Git commit: "feat: smart context management"

**Expected outcome:** 73% savings for long conversations, maintained quality

---

## 💾 Week 4: Caching & Finalization (3 days)

### Day 13 (4-5 hours)
- [ ] Copy `embeddingCache.ts` to `src/utils/`
- [ ] Update `useSemanticSearch.ts` to use cache
- [ ] Test: First load computes embeddings
- [ ] Test: Second load retrieves from cache
- [ ] Verify 95% speedup on subsequent loads

### Day 14 (3-4 hours)
- [ ] Add response caching for common queries
- [ ] Test cache hit rate after 50 queries
- [ ] Add cache stats to console
- [ ] Document cache behavior in README

### Day 15 (4-6 hours)
- [ ] Run comprehensive testing:
  - [ ] 100 diverse queries
  - [ ] 10 multi-turn conversations
  - [ ] Test on slow connection (3G throttling)
  - [ ] Test with empty cache
- [ ] Run final token_analysis.ts
- [ ] Document final metrics
- [ ] Create comparison report
- [ ] Git commit: "feat: add embedding and response caching"

---

## 📊 Final Validation

### Performance Testing
- [ ] Measure average response time across 100 queries
- [ ] Measure token usage for 10 conversations
- [ ] Measure cache hit rate
- [ ] Target: <3s response, <1K tokens/query, >60% cache hits

### Quality Testing
- [ ] Run user acceptance testing with 5+ people
- [ ] Collect feedback on recommendation relevance
- [ ] Verify no degradation from baseline
- [ ] Target: >80% satisfaction with relevance

### Documentation
- [ ] Update README.md with new architecture
- [ ] Document environment variables needed
- [ ] Add troubleshooting guide
- [ ] Create deployment checklist

---

## Success Criteria

### Must-Have (Blocking Beta Launch):
- [x] 90%+ token reduction achieved
- [x] <3 second response time maintained
- [x] Zero critical bugs
- [x] Search relevance >80% (user testing)

### Nice-to-Have (Post-Beta):
- [ ] Query caching >70% hit rate
- [ ] <2 second response time
- [ ] Multi-language support
- [ ] Advanced filters (publication year, reading level)

---

## Rollback Plan

If issues arise:
1. **Strategy #1 issues:** Revert `catalogOptimizer.ts`, send full records
2. **Strategy #2 issues:** Bypass semantic search, send all books
3. **Strategy #3 issues:** Disable summarization, keep full history
4. **Strategy #4 issues:** Disable caching, compute fresh each time

All strategies are independent and can be rolled back individually.
```

---

## STEP 6: CREATE FINAL SUMMARY REPORT (10 min)

**File: `/mnt/user-data/outputs/00_EXECUTIVE_SUMMARY.md`**

```markdown
# RAG Optimization Report: Executive Summary

## Project: Librarian LLM Prototype
## Analysis Date: [Today's date]
## Analyst: Claude Code

---

## 📊 Current State

### Discovered:
- **Project status:** [EXISTS with code | PRD-only | Partial implementation]
- **Catalog:** [N] books in [location]
- **Current RAG:** [Description of current approach]

### Baseline Metrics:
- **Tokens per query:** ~[X] tokens
- **Cost per query:** $[Y]
- **Response time:** ~[Z] seconds
- **Main bottleneck:** [Describe]

---

## 🎯 Recommended Optimizations

### Priority 1: Two-Tier Data Architecture ⭐⭐⭐
- **Savings:** 84% per book
- **Effort:** 2-3 hours
- **Risk:** LOW
- **Why first:** Easiest win, immediate impact

### Priority 2: Client-Side Semantic Search ⭐⭐⭐
- **Savings:** 99% total (200 books → 10)
- **Effort:** 1 day
- **Risk:** LOW  
- **Why second:** Biggest impact, well-tested library

### Priority 3: Smart Context Management ⭐⭐
- **Savings:** 73% for long conversations
- **Effort:** 1 day
- **Risk:** MEDIUM
- **Why third:** Important for UX, needs testing

### Priority 4: IndexedDB Caching ⭐
- **Savings:** 95% faster loads
- **Effort:** 3-4 hours
- **Risk:** LOW
- **Why fourth:** Polish, not critical for beta

---

## 📈 Expected Results

### After All Optimizations:

**Token Usage:**
- Before: 100,000 tokens/query
- After: 800 tokens/query
- **Improvement: 99.2% reduction**

**Cost:**
- Before: $0.02/query
- After: $0.0002/query
- **Improvement: 99% reduction**

**For 1,000 queries:**
- Before: $20
- After: $0.20
- **Savings: $19.80**

**For beta with 7 libraries × 500 queries/month:**
- Before: $70/month
- After: $0.70/month
- **Savings: $69.30/month**

**Response Time:**
- Maintained at <3 seconds
- Search: <100ms
- Claude: ~2 seconds

**Quality:**
- No degradation expected
- Better relevance (semantic search)
- Improved conversation coherence (context management)

---

## ⚡ Quick Start (Next 24 Hours)

### If you have 1 hour:
1. Implement two-tier data architecture
2. Measure 84% savings
3. Celebrate quick win 🎉

### If you have 1 day:
1. Two-tier data architecture (1 hour)
2. Semantic search (4-6 hours)
3. Measure 99% savings
4. Ready for beta testing

### If you have 1 week:
1. All four optimizations (15 days compressed to 5)
2. Full testing suite
3. Documentation complete
4. Production-ready

---

## 📁 Deliverables Created

All files in `/mnt/user-data/outputs/`:

1. **00_EXECUTIVE_SUMMARY.md** (this file)
2. **01_project_discovery.md** - What we found
3. **02_catalog_analysis.md** - Token breakdown
4. **03_current_implementation.md** - How RAG works now
5. **04_optimization_strategies.md** - Complete guide (10,000+ words)
6. **05_implementation_checklist.md** - Week-by-week plan
7. **token_analysis.ts** - Measurement script
8. **code_templates/** - Ready-to-use implementations

---

## 🚀 Immediate Next Steps

1. **Read** `04_optimization_strategies.md` (15 min)
2. **Run** `token_analysis.ts` to see baseline (5 min)
3. **Copy** `catalogOptimizer.ts` template into project (10 min)
4. **Test** with 3-5 queries (15 min)
5. **Measure** improvement (5 min)

**Total time to first optimization: ~50 minutes**

---

## ❓ Questions?

Common questions answered in deliverables:

- "Which optimization first?" → Priority 1 (two-tier data)
- "How long will this take?" → 15 days full implementation, 1 day for biggest wins
- "Will quality suffer?" → No, actually improves with semantic search
- "Can I do this incrementally?" → Yes, each strategy independent
- "What if something breaks?" → Rollback plan in checklist

---

## 📞 Support

For questions about this analysis:
- Review `04_optimization_strategies.md` for details
- Check `05_implementation_checklist.md` for steps
- Run `token_analysis.ts` for your specific metrics

**This analysis is complete and ready to use immediately.**
```

---

## Final Checklist for Claude Code

Before finishing, verify:

- [ ] All output files created in `/mnt/user-data/outputs/`
- [ ] Executive summary is clear and actionable
- [ ] Code templates are complete and working
- [ ] Token analysis script ran successfully
- [ ] Implementation checklist is detailed
- [ ] Baseline metrics documented
- [ ] Expected improvements quantified
- [ ] Timeline is realistic

Then provide the user with a conversational summary pointing them to the key files and next steps.

---

**END OF IMPLEMENTATION BRIEF**

Copy everything above this line and paste into Claude Code to begin.
