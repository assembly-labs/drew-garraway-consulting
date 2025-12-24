# Claude Code Implementation Brief: RAG Optimization for Librarian LLM

## Mission
Analyze the Librarian LLM prototype codebase, understand the current (or planned) RAG architecture, evaluate how catalog.json is utilized, and recommend 3-5 concrete optimization strategies for the beta system that minimize token usage while maximizing search relevance.

---

## Phase 1: Codebase Discovery & Analysis (30-45 minutes)

### 1.1 Locate and Map the Project Structure

**Task:** Find and document the current state of the prototype implementation.

**Commands to run:**
```bash
# Navigate to project root
cd /mnt/project

# Show full directory structure
find . -type f -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | grep -v node_modules | sort

# Check for React/Vite setup
ls -la package.json tsconfig.json vite.config.ts 2>/dev/null

# Find catalog data
find . -name "catalog.json" -o -name "*catalog*"
```

**Expected findings:**
- [ ] Project exists and has React + TypeScript setup
- [ ] OR project doesn't exist yet (PRD-only stage)
- [ ] catalog.json location
- [ ] Any existing API integration code
- [ ] Current conversation/chat components

**Output required:**
```markdown
## Project Status: [EXISTS | PRD-ONLY | PARTIAL]

### File Structure:
- Frontend: [path/to/src]
- Catalog data: [path/to/catalog.json]
- API integration: [path/to/api or hooks]
- Types: [path/to/types]

### Current Implementation Status:
- [ ] Claude API integration exists
- [ ] Conversation state management exists  
- [ ] Catalog search/filter logic exists
- [ ] RAG pattern implemented
- [ ] None of the above (PRD stage)
```

---

### 1.2 Analyze catalog.json Structure

**Task:** Examine the mock catalog data to understand schema, size, and token implications.

**Commands to run:**
```bash
# Find catalog file
CATALOG_PATH=$(find /mnt/project -name "catalog.json" -type f | head -1)

# If found, analyze it
if [ -f "$CATALOG_PATH" ]; then
    echo "Found catalog at: $CATALOG_PATH"
    
    # Count books
    jq 'length' "$CATALOG_PATH"
    
    # Show first 2 records
    jq '.[0:2]' "$CATALOG_PATH"
    
    # Analyze field sizes
    jq '.[0] | to_entries | map({key: .key, length: (.value | tostring | length)})' "$CATALOG_PATH"
    
    # Estimate total size
    wc -c "$CATALOG_PATH"
else
    echo "No catalog.json found - will need to create mock data structure"
fi
```

**Analysis required:**
```markdown
## Catalog Analysis

### Schema:
- Number of books: [N]
- Fields per book: [list fields]
- Average tokens per book: [estimate]
- Total tokens if all sent to Claude: [N × avg_tokens]

### Problematic fields (token-heavy):
1. [field_name]: ~[X] tokens average
2. [field_name]: ~[Y] tokens average

### Optimization opportunities:
1. [specific field] could be truncated from [X] to [Y] chars
2. [specific field] only needed for display, not Claude context
3. [specific field] could be pre-summarized
```

---

### 1.3 Review Current RAG Implementation (if exists)

**Task:** Understand how catalog data currently flows to Claude API.

**Search for key patterns:**
```bash
# Look for Claude API usage
rg "anthropic|claude" /mnt/project --type ts --type tsx -A 3 -B 3

# Look for catalog loading
rg "catalog\.json|useCatalog|loadCatalog" /mnt/project --type ts --type tsx -A 5

# Look for system prompts
rg "system.*prompt|SYSTEM_PROMPT|systemPrompt" /mnt/project --type ts --type tsx -A 10

# Look for conversation/message handling
rg "messages|conversation|chat" /mnt/project --type ts --type tsx -A 3
```

**Document findings:**
```markdown
## Current RAG Pattern: [NONE | BASIC | OPTIMIZED]

### If implemented, describe:

**1. Catalog Loading:**
- Where: [file path]
- Method: [JSON.parse, fetch, static import]
- Entire catalog or filtered? [ALL | FILTERED]

**2. Search/Filter Logic:**
- Exists: [YES | NO]
- Location: [file path]
- Method: [semantic search, keyword filter, none]

**3. Claude API Integration:**
- Location: [file path]
- How catalog is sent: 
  ```typescript
  // Copy actual code here
  ```

**4. Token Usage Pattern:**
- Sends entire catalog: [YES | NO]
- Sends filtered subset: [YES | NO]
- Uses embeddings: [YES | NO]
- Current estimated tokens per request: [X]

**5. Context Window Management:**
- Conversation history kept: [ALL | LAST_N | SUMMARIZED]
- Method: [describe]
```

---

## Phase 2: Optimization Strategy Development (45-60 minutes)

Based on Phase 1 findings, develop 3-5 concrete optimization recommendations.

### 2.1 Calculate Current Token Baseline

**Task:** Establish current (or projected) token usage to measure improvements against.

**Create analysis script:**
```typescript
// /mnt/user-data/outputs/token_analysis.ts

import { readFileSync } from 'fs';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  subjects: string[];
  formats: any[];
  // ... other fields
}

function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters for English
  return Math.ceil(text.length / 4);
}

function analyzeTokenUsage(catalogPath: string) {
  const catalog: Book[] = JSON.parse(readFileSync(catalogPath, 'utf-8'));
  
  console.log('=== TOKEN USAGE ANALYSIS ===\n');
  
  // Per-book analysis
  const bookTokens = catalog.map(book => {
    const fullText = JSON.stringify(book);
    const minimalText = `${book.title} by ${book.author}: ${book.description.slice(0, 100)}`;
    
    return {
      id: book.id,
      title: book.title,
      fullTokens: estimateTokens(fullText),
      minimalTokens: estimateTokens(minimalText),
      savingsPotential: estimateTokens(fullText) - estimateTokens(minimalText)
    };
  });
  
  const avgFullTokens = bookTokens.reduce((sum, b) => sum + b.fullTokens, 0) / bookTokens.length;
  const avgMinimalTokens = bookTokens.reduce((sum, b) => sum + b.minimalTokens, 0) / bookTokens.length;
  
  console.log(`Total books: ${catalog.length}`);
  console.log(`Average tokens per book (full): ${avgFullTokens.toFixed(0)}`);
  console.log(`Average tokens per book (minimal): ${avgMinimalTokens.toFixed(0)}`);
  console.log(`\nCurrent approach (all books, full data):`);
  console.log(`  ${catalog.length} × ${avgFullTokens.toFixed(0)} = ${(catalog.length * avgFullTokens).toFixed(0)} tokens`);
  console.log(`\nOptimized approach (top 10 books, minimal data):`);
  console.log(`  10 × ${avgMinimalTokens.toFixed(0)} = ${(10 * avgMinimalTokens).toFixed(0)} tokens`);
  console.log(`\nPotential savings: ${(100 - (10 * avgMinimalTokens) / (catalog.length * avgFullTokens) * 100).toFixed(1)}%`);
  
  // Field-by-field analysis
  console.log('\n=== FIELD-LEVEL ANALYSIS ===\n');
  const firstBook = catalog[0];
  Object.entries(firstBook).forEach(([key, value]) => {
    const tokens = estimateTokens(JSON.stringify(value));
    const percentage = (tokens / estimateTokens(JSON.stringify(firstBook)) * 100).toFixed(1);
    console.log(`${key}: ${tokens} tokens (${percentage}%)`);
  });
}

// Run analysis
const catalogPath = process.argv[2] || '/mnt/project/public/data/catalog.json';
analyzeTokenUsage(catalogPath);
```

**Run it:**
```bash
# Find catalog path
CATALOG_PATH=$(find /mnt/project -name "catalog.json" -type f | head -1)

# Run analysis
npx tsx /mnt/user-data/outputs/token_analysis.ts "$CATALOG_PATH"
```

---

### 2.2 Recommend Optimization Strategy #1: Two-Tier Data Architecture

**Task:** Design a lightweight schema for Claude vs. full schema for display.

**Create recommendation document:**
```markdown
## Optimization #1: Two-Tier Data Architecture

### Current Problem:
- Sending full book records with all metadata to Claude
- Many fields (cover URLs, ISBNs, detailed formats) not needed for reasoning
- Estimated waste: [X]% of tokens on non-reasoning data

### Proposed Solution:
Create two representations of each book:

**1. Full Record (for UI display only):**
```json
{
  "id": "book_001",
  "isbn": "9780735219090",
  "title": "Where the Crawdads Sing",
  "author": "Delia Owens",
  "cover": "/covers/crawdads.jpg",
  "formats": [/* detailed format data */],
  "subjects": ["fiction", "coming-of-age", "nature", "mystery"],
  "description": "A woman who raised herself in the marshes...",
  "publication_year": 2018,
  "pages": 384,
  "rating": 4.5,
  "popular": true
}
```

**2. Claude Context Record (reasoning only):**
```json
{
  "id": "book_001",
  "t": "Where the Crawdads Sing",
  "a": "Delia Owens",
  "s": ["fiction", "mystery", "nature"],
  "f": {"physical": "available", "ebook": "wait_2w", "audio": "available"},
  "d": "Woman in NC marshes, murder mystery, coming-of-age. Bestseller.",
  "y": 2018
}
```

### Implementation:

**File: `src/utils/catalogOptimizer.ts`**
```typescript
export interface BookFull {
  id: string;
  isbn: string;
  title: string;
  author: string;
  cover: string;
  formats: BookFormat[];
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
  s: string[];  // subjects
  f: Record<string, string>;  // formats: {physical: "available"}
  d: string;  // description (truncated to 120 chars)
  y: number;  // year
}

export function toClaudeFormat(book: BookFull): BookClaude {
  return {
    id: book.id,
    t: book.title,
    a: book.author,
    s: book.subjects.slice(0, 4), // Max 4 subjects
    f: book.formats.reduce((acc, fmt) => {
      acc[fmt.type] = fmt.status === 'available' ? 'available' : 
                      fmt.status === 'waitlist' ? `wait_${fmt.wait_time}` : 
                      'out';
      return acc;
    }, {} as Record<string, string>),
    d: book.description.slice(0, 120) + (book.description.length > 120 ? '...' : ''),
    y: book.publication_year
  };
}

export function buildClaudeContext(books: BookFull[]): string {
  const claudeBooks = books.map(toClaudeFormat);
  return JSON.stringify(claudeBooks, null, 0); // No whitespace
}
```

### Expected Savings:
- Per-book: ~500 tokens → ~80 tokens (84% reduction)
- 200-book catalog: 100,000 tokens → 16,000 tokens
- **With top-10 filtering: 100,000 tokens → 800 tokens (99.2% reduction)**

### Migration Path:
1. Create `catalogOptimizer.ts` utility
2. Update `useClaudeChat` hook to use `toClaudeFormat`
3. Keep full catalog for UI rendering
4. Test that recommendations still work with abbreviated data
```

---

### 2.3 Recommend Optimization Strategy #2: Client-Side Semantic Search

**Task:** Implement lightweight semantic filtering before Claude API calls.

```markdown
## Optimization #2: Client-Side Pre-Filtering with Embeddings

### Current Problem:
- Sending all 200 books (or even abbreviated versions) to Claude
- User asks about "cozy mysteries" → Claude processes 200 books to find 5 relevant ones
- Wasting tokens on irrelevant books

### Proposed Solution:
Add semantic search layer that narrows 200 books → 10 relevant books BEFORE Claude.

### Architecture:

```
User Query: "cozy mysteries set in bookstores"
     ↓
[Embedding Model] ← runs in browser, ~100ms
     ↓
Query Vector: [0.23, -0.45, 0.12, ...]
     ↓
[Cosine Similarity] ← compare to pre-computed book vectors
     ↓
Top 10 matches: [book_089, book_156, book_023, ...]
     ↓
[Claude API] ← receives only 10 books (800 tokens)
     ↓
Recommendations: "I found 3 cozy mysteries in bookstores..."
```

### Implementation:

**Install dependency:**
```bash
npm install @xenova/transformers
```

**File: `src/hooks/useSemanticSearch.ts`**
```typescript
import { pipeline, env } from '@xenova/transformers';
import { useEffect, useState } from 'react';
import type { BookFull } from '../types';

// Disable local model loading in browser
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
    async function initializeSearch() {
      console.log('Loading embedding model...');
      
      // Load small, fast model (runs in browser)
      const model = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
      );
      
      console.log('Building search index...');
      
      // Pre-compute embeddings for all books
      const searchIndex: SearchIndex[] = [];
      for (const book of catalog) {
        // Create searchable text
        const text = [
          book.title,
          book.author,
          ...book.subjects,
          book.description
        ].join(' ');
        
        // Generate embedding
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
      
      console.log(`Search index ready with ${searchIndex.length} books`);
    }
    
    if (catalog.length > 0) {
      initializeSearch();
    }
  }, [catalog]);

  async function search(query: string, topK: number = 10): Promise<string[]> {
    if (!isReady || !embedder) {
      console.warn('Search not ready, returning first N books');
      return catalog.slice(0, topK).map(b => b.id);
    }
    
    // Embed query
    const queryOutput = await embedder(query, { 
      pooling: 'mean', 
      normalize: true 
    });
    const queryVector: number[] = Array.from(queryOutput.data);
    
    // Calculate similarities
    const scores = index.map(item => ({
      bookId: item.bookId,
      similarity: cosineSimilarity(queryVector, item.embedding)
    }));
    
    // Sort and return top K
    return scores
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(s => s.bookId);
  }

  return { search, isReady };
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

**File: `src/hooks/useClaudeChat.ts` (updated)**
```typescript
import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { useSemanticSearch } from './useSemanticSearch';
import { toClaudeFormat } from '../utils/catalogOptimizer';
import type { Message, BookFull } from '../types';

export function useClaudeChat(catalog: BookFull[]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { search, isReady } = useSemanticSearch(catalog);

  async function sendMessage(userMessage: string) {
    setIsLoading(true);
    
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // STEP 1: Semantic search (200 books → 10 relevant)
      console.log('Searching for relevant books...');
      const relevantIds = await search(userMessage, 10);
      const relevantBooks = catalog.filter(b => relevantIds.includes(b.id));
      
      console.log(`Found ${relevantBooks.length} relevant books`);
      
      // STEP 2: Convert to lightweight format (500 tokens → 80 tokens each)
      const claudeContext = relevantBooks.map(toClaudeFormat);
      
      // STEP 3: Build system prompt
      const systemPrompt = `You are a library assistant. Recommend books from this list:

${JSON.stringify(claudeContext, null, 0)}

Rules: Explain briefly (1-2 sentences), mention availability, recommend 2-3 books max.`;

      console.log(`System prompt: ${systemPrompt.length} chars (~${Math.ceil(systemPrompt.length/4)} tokens)`);
      
      // STEP 4: Call Claude with minimal context
      const client = new Anthropic({
        apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          ...messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          { role: 'user', content: userMessage }
        ]
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content[0].text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      console.log(`Total tokens used: ${response.usage.input_tokens + response.usage.output_tokens}`);
      
    } catch (err) {
      console.error('Claude API error:', err);
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  }

  return { messages, sendMessage, isLoading, isSearchReady: isReady };
}
```

### Expected Performance:
- Initial load: 3-5 seconds (embedding model download + index building)
- Search time: 50-100ms per query
- Claude API call: 1-2 seconds
- **Total: 1.5-2.5 seconds** (acceptable for beta)

### Expected Savings:
- Before: 200 books × 500 tokens = 100,000 tokens
- After: 10 books × 80 tokens = 800 tokens
- **Savings: 99.2%**
- **Cost per query: $0.02 → $0.0002 (100x cheaper)**

### Trade-offs:
- ✅ Massive token savings
- ✅ Faster responses (less for Claude to process)
- ✅ Better relevance (pre-filtered)
- ⚠️ Initial 3-5 second load (one-time)
- ⚠️ 2-3MB model download (acceptable for web)
- ⚠️ Search quality depends on embedding model
```

---

### 2.4 Recommend Optimization Strategy #3: Conversation Context Management

**Task:** Design smart context window management following Conversation Design best practices.

```markdown
## Optimization #3: Smart Conversation Context Management

### Current Problem:
- Full conversation history sent to Claude on every turn
- After 10+ exchanges, context window fills with redundant info
- Token costs grow linearly with conversation length

### Proposed Solution:
Implement progressive context summarization following the Conversation Design doc's guidance.

### Strategy:

**Turns 1-10:** Keep full history
- User needs: "Earlier you mentioned mysteries..."
- Response quality: High (full context available)
- Token usage: Manageable (~5-10K tokens)

**Turns 11-20:** Summarize older turns, keep recent 10
- Compress turns 1-10 into brief summary
- Preserve recent context for coherence
- Token usage: Stable (~6-8K tokens)

**Turns 20+:** Rolling summarization
- Compress old summaries further
- Maintain "memory" of key preferences
- Token usage: Capped (~8K tokens max)

### Implementation:

**File: `src/hooks/useConversationManager.ts`**
```typescript
import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '../types';

interface ConversationContext {
  messages: Message[];
  summary?: string;
  userPreferences: {
    mentionedGenres: Set<string>;
    formatPreference?: 'physical' | 'ebook' | 'audiobook';
    rejectedBooks: Set<string>;
  };
}

export function useConversationManager() {
  const MAX_FULL_MESSAGES = 20;
  const SUMMARY_THRESHOLD = 10;

  async function prepareContext(
    context: ConversationContext
  ): Promise<Message[]> {
    const { messages, summary } = context;
    
    // If under threshold, send everything
    if (messages.length <= MAX_FULL_MESSAGES) {
      return messages;
    }
    
    // Need to summarize older messages
    const oldMessages = messages.slice(0, -SUMMARY_THRESHOLD);
    const recentMessages = messages.slice(-SUMMARY_THRESHOLD);
    
    // Generate summary if we don't have one or it's stale
    if (!summary || oldMessages.length > 0) {
      const newSummary = await summarizeMessages(oldMessages);
      
      // Create synthetic "context" message
      const contextMessage: Message = {
        role: 'assistant',
        content: `[Context from earlier conversation: ${newSummary}]`,
        timestamp: new Date()
      };
      
      return [contextMessage, ...recentMessages];
    }
    
    return recentMessages;
  }

  async function summarizeMessages(messages: Message[]): Promise<string> {
    const client = new Anthropic({
      apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
      dangerouslyAllowBrowser: true
    });
    
    const conversationText = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Summarize this library conversation in 2-3 sentences. Include:
- Genres/topics the patron mentioned
- Books they liked or rejected
- Format preferences (physical/ebook/audiobook)

Conversation:
${conversationText}

Summary:`
      }]
    });
    
    return response.content[0].text;
  }

  function extractPreferences(messages: Message[]): ConversationContext['userPreferences'] {
    const genres = new Set<string>();
    const rejectedBooks = new Set<string>();
    let formatPreference: 'physical' | 'ebook' | 'audiobook' | undefined;
    
    messages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      // Extract genre mentions
      const genreKeywords = ['mystery', 'romance', 'sci-fi', 'fantasy', 'thriller', 'memoir'];
      genreKeywords.forEach(genre => {
        if (content.includes(genre)) genres.add(genre);
      });
      
      // Extract format preferences
      if (content.includes('audiobook') || content.includes('audio book')) {
        formatPreference = 'audiobook';
      } else if (content.includes('ebook') || content.includes('e-book') || content.includes('digital')) {
        formatPreference = 'ebook';
      } else if (content.includes('physical') || content.includes('print')) {
        formatPreference = 'physical';
      }
      
      // Extract rejections
      if (content.includes("don't like") || content.includes('not interested') || content.includes('something else')) {
        // Extract book IDs from assistant messages mentioning books
        // This would need more sophisticated parsing
      }
    });
    
    return { mentionedGenres: genres, formatPreference, rejectedBooks };
  }

  return { prepareContext, extractPreferences };
}
```

**Updated `useClaudeChat.ts`:**
```typescript
export function useClaudeChat(catalog: BookFull[]) {
  const { search, isReady } = useSemanticSearch(catalog);
  const { prepareContext, extractPreferences } = useConversationManager();
  
  async function sendMessage(userMessage: string) {
    // ... existing setup ...
    
    // STEP 0: Extract preferences from conversation history
    const preferences = extractPreferences(messages);
    
    // STEP 1: Enhanced semantic search using preferences
    const enhancedQuery = userMessage + ' ' + Array.from(preferences.mentionedGenres).join(' ');
    const relevantIds = await search(enhancedQuery, 10);
    let relevantBooks = catalog.filter(b => relevantIds.includes(b.id));
    
    // Filter out rejected books
    relevantBooks = relevantBooks.filter(b => !preferences.rejectedBooks.has(b.id));
    
    // Prioritize format preference
    if (preferences.formatPreference) {
      relevantBooks.sort((a, b) => {
        const aHasFormat = a.formats.some(f => f.type === preferences.formatPreference);
        const bHasFormat = b.formats.some(f => f.type === preferences.formatPreference);
        return (bHasFormat ? 1 : 0) - (aHasFormat ? 1 : 0);
      });
    }
    
    // STEP 2: Prepare context (with summarization if needed)
    const contextMessages = await prepareContext({
      messages,
      userPreferences: preferences
    });
    
    // STEP 3: Build system prompt with preferences
    const preferencesNote = preferences.mentionedGenres.size > 0
      ? `\nNote: User has shown interest in ${Array.from(preferences.mentionedGenres).join(', ')}.`
      : '';
    
    const systemPrompt = `You are a library assistant.${preferencesNote}

Books to recommend:
${JSON.stringify(relevantBooks.map(toClaudeFormat), null, 0)}

Rules: Brief explanations, mention availability, 2-3 books max.`;
    
    // STEP 4: Call Claude
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        ...contextMessages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ]
    });
    
    // ... rest of implementation
  }
}
```

### Expected Savings:
- Turn 1-10: Normal growth (1K → 10K tokens)
- Turn 11+: Stabilized at ~6-8K tokens
- **Conversation of 30 turns:**
  - Before: 30K+ tokens
  - After: 8K tokens
  - **Savings: 73%**

### Quality Improvements:
- ✅ Maintains user preferences across conversation
- ✅ Filters out previously rejected books
- ✅ Prioritizes preferred formats
- ✅ Claude gets "reminder" of past context
```

---

### 2.5 Recommend Optimization Strategy #4: Lazy Loading & Caching

**Task:** Design efficient data loading and caching strategy.

```markdown
## Optimization #4: Lazy Loading & Response Caching

### Problems to Address:
1. Loading 200-book catalog on every page load (wasted bandwidth)
2. Re-computing embeddings on every session (wasted CPU)
3. Same queries getting re-processed (wasted API calls)

### Proposed Solutions:

#### 4a. IndexedDB for Persistent Embedding Cache

**File: `src/utils/embeddingCache.ts`**
```typescript
const DB_NAME = 'librarian_llm';
const DB_VERSION = 1;
const STORE_NAME = 'embeddings';

interface CachedEmbedding {
  bookId: string;
  embedding: number[];
  textHash: string;  // Hash of the text that was embedded
  timestamp: number;
}

export class EmbeddingCache {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
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
    });
  }

  async get(bookId: string): Promise<number[] | null> {
    if (!this.db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(bookId);
      
      request.onsuccess = () => {
        const cached = request.result as CachedEmbedding | undefined;
        // Check if cache is fresh (less than 7 days old)
        if (cached && Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
          resolve(cached.embedding);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async set(bookId: string, embedding: number[], textHash: string): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const cached: CachedEmbedding = {
        bookId,
        embedding,
        textHash,
        timestamp: Date.now()
      };
      
      const request = store.put(cached);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Hash function for cache validation
export function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}
```

**Updated `useSemanticSearch.ts`:**
```typescript
export function useSemanticSearch(catalog: BookFull[]) {
  const [cache] = useState(() => new EmbeddingCache());
  
  useEffect(() => {
    async function initializeSearch() {
      await cache.initialize();
      
      const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      const searchIndex: SearchIndex[] = [];
      let cacheHits = 0;
      
      for (const book of catalog) {
        const text = [book.title, book.author, ...book.subjects, book.description].join(' ');
        const textHash = hashText(text);
        
        // Try to get from cache first
        let embedding = await cache.get(book.id);
        
        if (!embedding) {
          // Cache miss - compute and store
          const output = await model(text, { pooling: 'mean', normalize: true });
          embedding = Array.from(output.data);
          await cache.set(book.id, embedding, textHash);
        } else {
          cacheHits++;
        }
        
        searchIndex.push({ bookId: book.id, embedding });
      }
      
      console.log(`Embeddings: ${cacheHits} from cache, ${catalog.length - cacheHits} computed`);
      
      setIndex(searchIndex);
      setEmbedder(model);
      setIsReady(true);
    }
    
    initializeSearch();
  }, [catalog]);
  
  // ... rest of implementation
}
```

#### 4b. Response Caching for Common Queries

**File: `src/utils/responseCache.ts`**
```typescript
interface CachedResponse {
  query: string;
  response: string;
  bookIds: string[];
  timestamp: number;
}

export class ResponseCache {
  private cache = new Map<string, CachedResponse>();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  normalize(query: string): string {
    return query.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  get(query: string): CachedResponse | null {
    const key = this.normalize(query);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached;
  }

  set(query: string, response: string, bookIds: string[]): void {
    const key = this.normalize(query);
    this.cache.set(key, {
      query,
      response,
      bookIds,
      timestamp: Date.now()
    });
    
    // Limit cache size to 100 entries
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

**Updated `useClaudeChat.ts`:**
```typescript
export function useClaudeChat(catalog: BookFull[]) {
  const [responseCache] = useState(() => new ResponseCache());
  
  async function sendMessage(userMessage: string) {
    setIsLoading(true);
    
    // Check cache first
    const cached = responseCache.get(userMessage);
    if (cached) {
      console.log('Cache hit! Returning cached response');
      const assistantMessage: Message = {
        role: 'assistant',
        content: cached.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newUserMessage, assistantMessage]);
      setIsLoading(false);
      return;
    }
    
    // Cache miss - proceed with normal flow
    const relevantIds = await search(userMessage, 10);
    // ... rest of implementation ...
    
    // Cache the response
    responseCache.set(userMessage, assistantMessage.content, relevantIds);
  }
}
```

### Expected Improvements:

**First Load:**
- Embeddings computed: 3-5 seconds
- Stored in IndexedDB: persistent

**Subsequent Loads:**
- Embeddings from cache: 100-200ms
- **95% faster startup**

**Common Queries:**
- "mystery books" → cached after first request
- "science fiction audiobooks" → cached after first request
- **50-70% cache hit rate** expected for popular queries
- **Zero API cost** for cached responses

### Storage Requirements:
- Embeddings: 200 books × 384 dimensions × 4 bytes = ~300KB
- IndexedDB limit: 50MB+ (plenty of headroom)
```

---

## Phase 3: Deliverables & Recommendations (15-30 minutes)

### 3.1 Create Comprehensive Report

**Task:** Synthesize findings into actionable recommendations.

**File: `/mnt/user-data/outputs/rag_optimization_report.md`**

Structure:
```markdown
# RAG Optimization Report: Librarian LLM Beta

## Executive Summary
- Current state: [describe]
- Token usage baseline: [X] tokens per query
- Optimization potential: [Y]% reduction
- Recommended approach: [which strategies]

## Detailed Findings

### 1. Current Architecture Analysis
[Document Phase 1 findings]

### 2. Token Usage Breakdown
[Include token_analysis.ts output]

### 3. Optimization Strategies (Ranked)

#### Priority 1: [Strategy Name]
- Expected savings: [X]%
- Implementation effort: [LOW | MEDIUM | HIGH]
- Risk: [LOW | MEDIUM | HIGH]
- Dependencies: [list]
- Timeline: [X] days

[Repeat for each strategy]

## Implementation Roadmap

### Week 1: Quick Wins
- [ ] Implement two-tier data architecture
- [ ] Create catalogOptimizer utility
- [ ] Test with current queries

### Week 2: Semantic Search
- [ ] Add @xenova/transformers
- [ ] Implement useSemanticSearch hook
- [ ] Build embedding cache

### Week 3: Context Management
- [ ] Add conversation summarization
- [ ] Implement preference extraction
- [ ] Test multi-turn conversations

### Week 4: Polish & Caching
- [ ] Add IndexedDB caching
- [ ] Implement response cache
- [ ] Performance testing

## Success Metrics
- Baseline: [X] tokens per query, [Y]ms latency, $[Z] per query
- Target: [A] tokens per query, [B]ms latency, $[C] per query
- Improvement: [%] reduction

## Next Steps
1. [Immediate action]
2. [Follow-up action]
3. [Long-term consideration]
```

---

### 3.2 Create Implementation Checklist

**File: `/mnt/user-data/outputs/implementation_checklist.md`**

```markdown
# RAG Optimization Implementation Checklist

## Prerequisites
- [ ] React + Vite + TypeScript project exists
- [ ] Claude API key configured
- [ ] catalog.json exists with [N] books
- [ ] Current implementation reviewed

## Phase 1: Two-Tier Data (Day 1-2)
- [ ] Create `src/utils/catalogOptimizer.ts`
- [ ] Define `BookClaude` interface
- [ ] Implement `toClaudeFormat()` function
- [ ] Update `useClaudeChat` to use new format
- [ ] Test: Verify recommendations still work
- [ ] Measure: Compare token usage before/after

## Phase 2: Semantic Search (Day 3-5)
- [ ] Install `@xenova/transformers`
- [ ] Create `src/hooks/useSemanticSearch.ts`
- [ ] Implement embedding generation
- [ ] Implement cosine similarity search
- [ ] Create `src/utils/embeddingCache.ts`
- [ ] Test: Query "cozy mysteries" returns relevant books
- [ ] Measure: Search latency <200ms

## Phase 3: Context Management (Day 6-8)
- [ ] Create `src/hooks/useConversationManager.ts`
- [ ] Implement `prepareContext()` with summarization
- [ ] Implement `extractPreferences()`
- [ ] Update `useClaudeChat` to use context manager
- [ ] Test: 15-turn conversation stays under 10K tokens
- [ ] Measure: Context window size over time

## Phase 4: Caching (Day 9-10)
- [ ] Implement IndexedDB embedding cache
- [ ] Implement response cache
- [ ] Add cache hit/miss logging
- [ ] Test: Second load uses cached embeddings
- [ ] Measure: Cache hit rate after 50 queries

## Testing & Validation
- [ ] Run token_analysis.ts before optimization
- [ ] Run token_analysis.ts after each phase
- [ ] Test 10 diverse queries
- [ ] Test conversation with 15+ turns
- [ ] Verify search quality maintained
- [ ] Performance test: 100 queries

## Documentation
- [ ] Update README with new architecture
- [ ] Document token usage improvements
- [ ] Create troubleshooting guide
- [ ] Add comments to key functions

## Success Criteria
- [ ] 90%+ token reduction achieved
- [ ] <3 second response time maintained
- [ ] Search relevance >80% (user testing)
- [ ] Zero degradation in recommendation quality
```

---

### 3.3 Provide Code Templates

**Create starter files with TODO comments:**

```bash
# Create directory structure
mkdir -p /mnt/user-data/outputs/optimization_templates/src/{hooks,utils,types}

# Create template files with TODO markers for Claude Code to fill in
```

---

## Phase 4: Final Summary & Recommendations

### Task: Provide clear, prioritized next steps

**Output to user (in conversation, not file):**

```markdown
## 🎯 Summary: RAG Optimization for Librarian LLM

Based on my analysis of your codebase and catalog.json:

### Current State:
- [Describe what exists or doesn't exist]
- Estimated token usage: [X] per query
- Estimated cost: $[Y] per query

### Top 3 Recommended Optimizations:

1. **Two-Tier Data Architecture** (Priority: HIGH, Effort: LOW)
   - Savings: 84% per book
   - Timeline: 1-2 days
   - Start here: Easiest win

2. **Client-Side Semantic Search** (Priority: HIGH, Effort: MEDIUM)
   - Savings: 99% total (200 books → 10)
   - Timeline: 3-5 days
   - Biggest impact

3. **Context Management** (Priority: MEDIUM, Effort: MEDIUM)
   - Savings: 73% for long conversations
   - Timeline: 3-4 days
   - Important for beta UX

### Quick Wins (This Week):
- Implement catalogOptimizer.ts (2 hours)
- Add semantic search (1 day)
- Test with real queries (2 hours)

### Expected Results:
- Token usage: [X] → [Y] (Z% reduction)
- Cost per query: $[A] → $[B]
- Response quality: Maintained or improved

### Files Created:
- `/mnt/user-data/outputs/rag_optimization_report.md`
- `/mnt/user-data/outputs/implementation_checklist.md`
- `/mnt/user-data/outputs/token_analysis.ts`
- `/mnt/user-data/outputs/optimization_templates/...`

### Next Steps:
1. Review the optimization report
2. Choose which strategies to implement
3. Follow the implementation checklist
4. Run before/after measurements

Questions? I can help implement any of these strategies in detail.
```

---

## Execution Instructions for Claude Code

**To use this brief:**

1. Read this entire document
2. Execute Phase 1 (Codebase Discovery)
3. Execute Phase 2 (Optimization Strategy Development)
4. Execute Phase 3 (Deliverables)
5. Execute Phase 4 (Summary)

**Output everything to `/mnt/user-data/outputs/`**

**Communicate findings clearly to the user in the conversation**

**Be specific, provide code examples, and measure everything**
