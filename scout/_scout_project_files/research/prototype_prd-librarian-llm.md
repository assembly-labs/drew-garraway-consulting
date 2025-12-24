# Librarian LLM - Prototype PRD

**Version:** 1.0  
**Last Updated:** October 6, 2025  
**Status:** Prototype Definition - Proof of Concept

---

## 1. Executive Summary

### Purpose
Build a **functional prototype** of Librarian LLM in 2-4 weeks to:
- Validate conversational search UX with real users
- Demo to pilot libraries for commitment/funding
- Test core conversation design patterns
- Prove concept to stakeholders/investors

### Scope
This is a **demonstration prototype** (proof of concept), not production software. It will:
- ✅ Look and feel like the real product
- ✅ Use real Claude API for conversational AI
- ✅ Work on mobile and desktop
- ✅ Include basic accessibility features
- ❌ NOT connect to real library systems
- ❌ NOT scale beyond demo usage (~50 concurrent users)
- ❌ NOT include authentication/security features
- ❌ NOT have production-grade infrastructure

### Success Criteria
- 5+ pilot libraries express interest after demo
- 10+ user testing sessions completed
- Positive feedback on conversation flow (80%+ satisfaction)
- Stakeholder approval to proceed to production build

---

## 2. Prototype vs Production Comparison

| Feature | Production (Phase 1) | Prototype |
|---------|---------------------|-----------|
| **Timeline** | 6 months | 2-4 weeks |
| **Cost** | $435K-$600K | ~$2K |
| **Catalog Data** | Real ILS/OverDrive APIs | Mock JSON (69 books) |
| **Search** | Vector DB + semantic search | Claude API on mock data |
| **Authentication** | Library card + PIN | Fake cards for demo (optional) |
| **Backend** | FastAPI + PostgreSQL + Redis | Minimal API or frontend-only |
| **Hosting** | AWS (ECS, RDS, ElastiCache) | Vercel/Netlify (free tier) |
| **Accessibility** | Full WCAG 2.1 AA + audit | Basic a11y features |
| **Privacy** | Zero-logging architecture | Basic (demo data only) |
| **Scalability** | 500+ concurrent users | ~50 concurrent users |

**What Stays the Same:**
- React frontend (same UI/UX)
- Claude API integration (same conversational AI)
- Conversation design principles (same patterns)

---

## 3. User Stories (Prototype Scope)

### US-P1: Conversational Search Demo
**As a** library patron  
**I want to** search for books using natural language  
**So that** I can see how AI-powered discovery works

**Acceptance Criteria:**
- [ ] User types query like "I want something funny for the beach"
- [ ] Claude API processes query and returns 3-5 book recommendations
- [ ] Results display: cover, title, author, format badges, fake availability
- [ ] Works on mobile and desktop
- [ ] Response time: <5 seconds (acceptable for demo)

**Mock Data Required:**
- 69 diverse book records (fiction/non-fiction, genres, formats)
- Cover images (placeholder or public domain)
- Fake availability statuses

**Priority:** P0 (Must Have)  
**Effort:** 1 week

---

### US-P2: Multi-Turn Conversation
**As a** library patron  
**I want to** refine my search through conversation  
**So that** I can find exactly what I'm looking for

**Acceptance Criteria:**
- [ ] User can ask follow-up questions: "What about audiobooks?" 
- [ ] Claude maintains context across 3-5 turns
- [ ] Conversation history visible in UI
- [ ] Can switch topics mid-conversation

**Implementation:**
- Store conversation history in component state (React)
- Pass full history to Claude API with each message
- Simple context window management (last 10 messages)

**Priority:** P0 (Must Have)  
**Effort:** 3 days

---

### US-P3: Basic Accessibility Features
**As a** patron with disabilities  
**I want to** use basic features with keyboard and assistive technology  
**So that** the demo is usable

**Acceptance Criteria:**
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter)
- [ ] Screen reader can announce main content
- [ ] ARIA labels on key inputs and buttons
- [ ] Focus indicators visible
- [ ] Reasonable color contrast

**Why Include (Even for Prototype):**
- Demonstrates commitment to accessibility
- Allows testing with diverse users
- Easier to build in from start than retrofit

**Priority:** P1 (Should Have)  
**Effort:** 2-3 days

---

### US-P4: Mobile-Responsive Demo
**As a** library patron on my phone  
**I want to** search for books easily  
**So that** I can use this anywhere

**Acceptance Criteria:**
- [ ] Works on iOS Safari and Android Chrome
- [ ] Touch-friendly UI (44px minimum tap targets)
- [ ] Responsive layout (320px to 1920px)
- [ ] Fast on 4G networks

**Priority:** P1 (Should Have)  
**Effort:** 2 days

---

### US-P5: Error Handling Demo
**As a** library patron  
**I want to** see how the system handles mistakes  
**So that** I can evaluate error recovery

**Acceptance Criteria:**
- [ ] No results: Shows helpful suggestions
- [ ] Claude API error: Graceful fallback message
- [ ] Unclear query: Asks for clarification
- [ ] Demonstrates librarian handoff trigger

**Mock Scenarios:**
- Searches that intentionally return 0 results
- Button to simulate API failure
- Example of low-confidence response

**Priority:** P1 (Should Have)  
**Effort:** 2 days

---

## 4. Technical Architecture (Simplified)

### 4.1 System Diagram

```
┌─────────────────────────────────────┐
│     React Frontend (Vite)           │
│  - Tailwind CSS for styling         │
│  - React Query for API calls        │
│  - localStorage for session         │
└─────────────┬───────────────────────┘
              │ HTTPS
              ▼
┌─────────────────────────────────────┐
│   Minimal Backend (Optional)        │
│   OR Direct Claude API Calls        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│         Claude API                  │
│    (Anthropic Sonnet 4.5)           │
└─────────────────────────────────────┘

Mock Data: JSON files in /public folder
```

### 4.2 Architecture Decision: Frontend-Only (Recommended)

**Frontend-Only Approach:**

Pros:
- Fastest to build (no backend code)
- Easy to deploy (Vercel/Netlify)
- No server costs
- Simple to iterate

Cons:
- Claude API key exposed in browser (acceptable for prototype)
- Rate limiting harder to control
- Can't implement complex caching

Solution: Use API key restrictions on Anthropic dashboard + rate limit on their side

**Alternative: Minimal Backend**

Only if API key security is critical for demo:

Pros:
- API key secure on server
- Better rate limiting

Cons:
- Extra deployment complexity
- Costs ~$20/month (Render/Railway)
- More code to maintain

Stack: Express.js or Hono (lightweight)

**Decision for Prototype:** Frontend-only unless stakeholders require API key security

---

### 4.3 Technology Stack

#### Frontend: React + Vite + TypeScript

**Setup:**
```bash
npm create vite@latest librarian-prototype -- --template react-ts
cd librarian-prototype
npm install
```

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@anthropic-ai/sdk": "^0.27.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "react-aria": "^3.33.0"
  }
}
```

**Why This Stack:**
- Vite: Instant hot reload, fast builds
- React: Component reusability, easy to port to production
- TypeScript: Catch bugs early, better developer experience
- Tailwind: Rapid prototyping, mobile-first by default
- React Query: Simple API state management

---

#### AI: Claude API (Direct Integration)

**Configuration:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true // OK for prototype
});

const CLAUDE_CONFIG = {
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1500,
  temperature: 0.3,
  stream: true
};
```

**System Prompt Template:**
```typescript
const SYSTEM_PROMPT = `You are a friendly library assistant helping patrons discover books.

AVAILABLE BOOKS (catalog data):
${JSON.stringify(mockCatalog, null, 2)}

RULES:
1. Only recommend books from the catalog above
2. Explain why you're recommending each book (2-3 sentences)
3. If you're unsure, say so and suggest asking a librarian
4. Be warm, helpful, and concise
5. Format responses as conversational, not robotic

EXAMPLE:
Patron: "I want something funny for the beach"
You: "Great choice for beach reading! I'd recommend 'Good Omens' by Terry Pratchett and Neil Gaiman—it's a hilarious apocalyptic comedy that's light and fun. It's available as both a paperback and audiobook."
`;
```

---

### 4.4 Mock Data Structure

#### Book Catalog JSON Schema

**File:** `public/data/catalog.json`

```json
[
  {
    "id": "book_001",
    "isbn": "9780735219090",
    "title": "Where the Crawdads Sing",
    "author": "Delia Owens",
    "cover": "/covers/crawdads.jpg",
    "formats": [
      {
        "type": "physical",
        "status": "available",
        "copies_available": 3,
        "copies_total": 5
      },
      {
        "type": "ebook",
        "status": "waitlist",
        "wait_time": "2 weeks",
        "holds": 12
      },
      {
        "type": "audiobook",
        "status": "available"
      }
    ],
    "subjects": ["fiction", "coming-of-age", "nature", "mystery"],
    "description": "A woman who raised herself in the marshes of North Carolina becomes a suspect in the murder of a man she was once involved with.",
    "publication_year": 2018,
    "pages": 384,
    "rating": 4.5,
    "popular": true
  },
  {
    "id": "book_002",
    "isbn": "9780316769174",
    "title": "The Catcher in the Rye",
    "author": "J.D. Salinger",
    "cover": "/covers/catcher.jpg",
    "formats": [
      {
        "type": "physical",
        "status": "checked_out",
        "due_date": "2025-10-20"
      },
      {
        "type": "ebook",
        "status": "available"
      }
    ],
    "subjects": ["fiction", "coming-of-age", "classics"],
    "description": "The story of teenage rebellion and alienation told through the eyes of Holden Caulfield.",
    "publication_year": 1951,
    "pages": 277,
    "rating": 3.8
  }
]
```

#### TypeScript Types

```typescript
// src/types/index.ts

export interface Book {
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

export interface BookFormat {
  type: 'physical' | 'ebook' | 'audiobook';
  status: 'available' | 'waitlist' | 'checked_out';
  copies_available?: number;
  copies_total?: number;
  wait_time?: string;
  holds?: number;
  due_date?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  messages: Message[];
  catalogContext: Book[];
}
```

---

#### Data Generation Strategy

**Curate 69 Diverse Books:**

Breakdown:
- 50% fiction (romance, mystery, sci-fi, literary, thriller)
- 30% non-fiction (memoir, history, science, self-help, biography)
- 20% other (YA, graphic novels, poetry, children's)

Characteristics:
- Mix of classics and bestsellers (2018-2025)
- Variety of authors (diverse representation)
- Mix of formats (physical, ebook, audiobook)
- Varied availability (available, waitlist, checked out)

**Tools for Data Collection:**
- Google Books API (free, public domain covers)
- Open Library API (book metadata)
- Manual curation for realism

**Cover Images:**
- Use placeholder service: `https://via.placeholder.com/300x450/4F46E5/FFFFFF?text=Book+Cover`
- OR public domain covers from Open Library
- OR fair use thumbnails (< 300px) from Google Books

**Example Data Sources:**
```bash
# Google Books API
https://www.googleapis.com/books/v1/volumes?q=isbn:9780735219090

# Open Library API
https://openlibrary.org/api/books?bibkeys=ISBN:9780735219090&format=json&jscmd=data
```

---

### 4.5 Conversation Implementation

#### Context Management

```typescript
// src/hooks/useConversation.ts

import { useState } from 'react';
import { Message, ConversationState } from '../types';

export const useConversation = (catalog: Book[]) => {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    catalogContext: catalog
  });

  const addMessage = (message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  };

  const clearConversation = () => {
    setState({
      messages: [],
      catalogContext: catalog
    });
  };

  return {
    messages: state.messages,
    catalog: state.catalogContext,
    addMessage,
    clearConversation
  };
};
```

---

#### Claude API Integration

```typescript
// src/hooks/useClaudeChat.ts

import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { Message, Book } from '../types';
import { buildSystemPrompt } from '../utils/promptBuilder';

export const useClaudeChat = (catalog: Book[]) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (userMessage: string) => {
    setIsLoading(true);
    setError(null);
    
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const client = new Anthropic({
        apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1500,
        temperature: 0.3,
        system: buildSystemPrompt(catalog),
        messages: [
          ...messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content[0].text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Claude API error:', err);
      setError('Sorry, I encountered an error. Please try again.');
      
      // Add error message to conversation
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I'm having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return { 
    messages, 
    sendMessage, 
    isLoading, 
    error,
    clearChat 
  };
};
```

---

#### Prompt Builder Utility

```typescript
// src/utils/promptBuilder.ts

import { Book } from '../types';

export const buildSystemPrompt = (catalog: Book[]): string => {
  const catalogSummary = catalog.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    subjects: book.subjects,
    description: book.description,
    formats: book.formats.map(f => ({
      type: f.type,
      status: f.status
    }))
  }));

  return `You are a friendly library assistant helping patrons discover books.

AVAILABLE BOOKS (catalog):
${JSON.stringify(catalogSummary, null, 2)}

RULES:
1. Only recommend books from the catalog above (never invent titles)
2. Explain why you're recommending each book (2-3 sentences)
3. If you're unsure or the catalog doesn't have what they want, say so honestly and suggest asking a librarian
4. Be warm, helpful, and concise
5. Keep responses conversational and natural
6. When suggesting books, mention availability and formats
7. If someone asks follow-up questions, maintain context from the conversation

RESPONSE FORMAT:
- For recommendations, describe 2-4 books briefly
- Mention why each book fits their request
- Note availability ("available now as audiobook" or "2-week wait for ebook")
- Ask follow-up questions if their request is unclear

EXAMPLE CONVERSATION:
Patron: "I want something funny for the beach"
You: "Perfect! Here are some light, fun reads:

📚 Good Omens by Terry Pratchett & Neil Gaiman - A hilarious apocalyptic comedy about an angel and demon trying to prevent the end of the world. Available now as a paperback and audiobook.

📚 The Hitchhiker's Guide to the Galaxy by Douglas Adams - Classic sci-fi comedy that's absurd and witty. Available as ebook and audiobook.

Would you like more comedy recommendations, or are you interested in a specific type of humor?"`;
};
```

---

### 4.6 Project Structure

```
librarian-prototype/
├── public/
│   ├── data/
│   │   └── catalog.json          # 69 mock books
│   └── covers/                   # Book cover images
│       ├── placeholder.jpg
│       └── ...
├── src/
│   ├── components/
│   │   ├── SearchInput.tsx       # Main search bar
│   │   ├── ConversationHistory.tsx
│   │   ├── BookCard.tsx          # Individual book result
│   │   ├── ResultsList.tsx       # Grid of books
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── hooks/
│   │   ├── useClaudeChat.ts      # Claude API integration
│   │   ├── useConversation.ts    # Conversation state
│   │   └── useCatalog.ts         # Load mock catalog
│   ├── utils/
│   │   ├── promptBuilder.ts      # Build system prompts
│   │   └── formatters.ts         # Format dates, etc.
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind imports
├── .env.example                  # API key template
├── .env                          # API key (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

### 4.7 Deployment

**Recommended: Vercel (Free Tier)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel --prod

# Set environment variable
vercel env add VITE_CLAUDE_API_KEY
```

**Environment Variables:**
```bash
# .env.example
VITE_CLAUDE_API_KEY=your_api_key_here
```

**Alternative: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set env var via UI or CLI
```

**Cost:** $0 (free tier sufficient for prototype)

---

## 5. User Experience Flow

### 5.1 Welcome Screen

```
┌─────────────────────────────────────────────┐
│  📚 Library Book Discovery (Demo)           │
│                                             │
│  AI-powered assistant prototype             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Ask me anything about books...        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Try asking:                                │
│  • "I want something funny for the beach"   │
│  • "Books like Educated by Tara Westover"  │
│  • "Mystery novels set in Paris"           │
│                                             │
│  [Start Searching] →                        │
└─────────────────────────────────────────────┘
```

---

### 5.2 Search Results Display

```
┌─────────────────────────────────────────────┐
│  You: "I want something funny for the beach"│
│                                             │
│  📚 Assistant:                              │
│  Great! Here are some light, funny reads:   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ [Cover] Good Omens                  │   │
│  │ by Terry Pratchett & Neil Gaiman    │   │
│  │ 📕 Print | 📱 eBook | 🎧 Audiobook  │   │
│  │ ✅ Available now                    │   │
│  │                                     │   │
│  │ "A hilarious apocalyptic comedy     │   │
│  │  that's perfect for beach reading"  │   │
│  │                                     │   │
│  │ [View Details]                      │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [2-3 more book cards...]                   │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Refine your search...                 │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

### 5.3 Demo Scenarios (Pre-scripted for Testing)

**Scenario 1: First-time user**
- Query: "I just finished Educated and loved it"
- Expected: 3-5 memoir recommendations with explanations

**Scenario 2: Format preference**
- Query: "Do you have that in audiobook?"
- Expected: Filter to audiobook format, maintain context

**Scenario 3: No results**
- Query: "Books about underwater basket weaving"
- Expected: "I couldn't find that exact topic, but here are books about crafts/hobbies"

**Scenario 4: Unclear query**
- Query: "Something good"
- Expected: "Can you tell me more? What genres do you enjoy?"

**Scenario 5: Complex request**
- Query: "I need a gift for my 12-year-old who likes science and funny books"
- Expected: YA science fiction/non-fiction recommendations

---

### 5.4 Basic Accessibility Features

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter to submit search
- Escape to close modals/clear
- Arrow keys for result navigation (optional)

**Screen Reader Support:**
```html
<!-- Search input -->
<label htmlFor="search" className="sr-only">
  Search for books
</label>
<input
  id="search"
  aria-label="Search for books using natural language"
  aria-describedby="search-help"
/>
<div id="search-help" className="sr-only">
  Type questions like "I want mystery books" or "Books like Harry Potter"
</div>

<!-- Results -->
<div
  role="region"
  aria-live="polite"
  aria-label="Search results"
>
  <h2>Search Results</h2>
  {results.map(book => (
    <article
      key={book.id}
      aria-label={`${book.title} by ${book.author}`}
    >
      {/* Book details */}
    </article>
  ))}
</div>
```

**Focus Management:**
```typescript
// Auto-focus on search results after query
const resultsRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (results.length > 0 && resultsRef.current) {
    resultsRef.current.focus();
  }
}, [results]);
```

**Tailwind Accessibility Utilities:**
```html
<!-- Focus indicators -->
<button className="focus:ring-2 focus:ring-blue-500 focus:outline-none">

<!-- Screen reader only text -->
<span className="sr-only">Search books</span>

<!-- High contrast text -->
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
```

---

## 6. Testing & Validation

### 6.1 User Testing Plan

**Goal:** Validate conversation UX

**Participants (10-15 total):**
- 3-4 casual readers (Sarah persona)
- 2-3 users with accessibility needs (Marcus persona)
- 2-3 librarians (Linda persona)
- 2-3 library administrators (James persona)

**Test Protocol (30 min sessions):**

1. **Introduction (5 min):** Explain prototype purpose, no right/wrong answers
2. **Task 1 (5 min):** "Find a book for vacation reading"
3. **Task 2 (5 min):** "Find a book similar to one you loved"
4. **Task 3 (5 min):** "What happens if you search for something we don't have?"
5. **Task 4 (5 min):** Mobile test or accessibility test (if applicable)
6. **Interview (5 min):** Feedback questions

**Questions to Ask:**
- What did you like about this experience?
- What was confusing or frustrating?
- How does this compare to your current library search?
- Would you use this if your library had it?
- What would make it better?

**Key Metrics:**
- Task completion rate (target: 80%+)
- Time to complete tasks (target: <3 min per task)
- Satisfaction score (1-5 scale, target: 4+)
- Number of critical issues found

---

### 6.2 Basic Accessibility Testing

**Automated Tools:**
- axe DevTools (browser extension - free)
- WAVE (web accessibility evaluation tool - free)
- Lighthouse (Chrome DevTools - built-in)

**Manual Testing:**
- **Keyboard only:** Unplug mouse, navigate entire app
- **Screen reader:** Test with VoiceOver (Mac) or NVDA (Windows - free)
- **Zoom:** Test at 200% zoom level
- **Color contrast:** Use browser tools to verify

**Testing Checklist:**
- [ ] Can navigate all features with keyboard
- [ ] Screen reader announces search input
- [ ] Screen reader announces results
- [ ] Focus indicators are visible
- [ ] Text has sufficient contrast
- [ ] No keyboard traps

---

### 6.3 Demo Preparation

**Before Showing to Pilot Libraries:**

**Technical Checklist:**
- [ ] Deployed to public URL (not localhost)
- [ ] Works on iOS Safari, Android Chrome, desktop browsers
- [ ] No console errors
- [ ] Fast loading (<3 seconds)
- [ ] Mobile responsive (test on real devices)
- [ ] Claude API calls working reliably
- [ ] Has at least 100 books in mock catalog

**Content Checklist:**
- [ ] Generic library branding (not specific to one library)
- [ ] 69 diverse books in catalog
- [ ] Cover images loading
- [ ] Realistic availability statuses
- [ ] No "Lorem ipsum" placeholder text
- [ ] Clear "This is a prototype" disclaimer

**Demo Script:**
- Practice 3-5 scripted queries
- Have backup scenarios if Claude acts unpredictably
- Prepare answers to "How does this work?" questions
- Be ready to explain what's real vs mocked
- Have production timeline/cost ready

---

## 7. Timeline & Milestones

### Week 1: Foundation

**Days 1-2: Project Setup**
- [ ] Create React + Vite + TypeScript project
- [ ] Install dependencies (Anthropic SDK, Tailwind, React Query)
- [ ] Configure Tailwind CSS
- [ ] Set up basic file structure
- [ ] Get Claude API key and test connection

**Days 3-5: Mock Data**
- [ ] Research and compile 69-book list
- [ ] Create catalog.json with proper schema
- [ ] Generate/source cover images
- [ ] Create varied availability statuses
- [ ] Test data structure loads correctly

**Deliverable:** Basic app displaying mock book data

---

### Week 2: Core Features

**Days 1-3: Search & Conversation**
- [ ] Build SearchInput component
- [ ] Implement Claude API integration with streaming
- [ ] Build ConversationHistory component
- [ ] Create BookCard component
- [ ] Build ResultsList component
- [ ] Test multi-turn conversations

**Days 4-5: Basic UI Polish**
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement basic accessibility features
- [ ] Add keyboard navigation
- [ ] Test on mobile devices

**Deliverable:** Working conversational search with results display

---

### Week 3: Polish & Testing

**Days 1-2: Mobile & Responsive**
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Fix responsive layout issues
- [ ] Optimize for touch
- [ ] Test on slow networks

**Days 3-4: Error Handling & Edge Cases**
- [ ] No results messaging
- [ ] API error fallbacks
- [ ] Loading states
- [ ] Empty states
- [ ] Form validation

**Day 5: User Testing Prep**
- [ ] Create test protocol document
- [ ] Recruit participants
- [ ] Deploy to public URL
- [ ] Create demo script

**Deliverable:** Demo-ready prototype

---

### Week 4: Validation & Iteration

**Days 1-3: User Testing**
- [ ] Conduct 10-15 user test sessions
- [ ] Document feedback systematically
- [ ] Identify critical issues
- [ ] Prioritize fixes

**Days 4-5: Iteration**
- [ ] Fix top 3-5 issues from testing
- [ ] Run basic accessibility tests
- [ ] Final polish
- [ ] Prepare demo presentation

**Deliverable:** Validated prototype ready for pilot library demos

---

## 8. Budget & Resources

### 8.1 Estimated Costs

| Item | Cost | Notes |
|------|------|-------|
| Claude API | $100-$200 | ~5K-10K API calls during development + testing |
| Hosting | $0 | Vercel/Netlify free tier |
| Cover Images | $0 | Use placeholders or public domain |
| Domain (optional) | $15/year | demo.librarian-llm.com |
| **Total** | **~$100-$215** | |

### 8.2 Team

**Minimum Viable Team:**
- 1 Full-Stack Developer (React + Claude API): 80-100 hours
- Focus areas: Frontend UI, Claude integration, basic a11y

**Can Also Be Done By:**
- 1 experienced developer (solo): 4 weeks part-time (20 hrs/week)
- 2 developers (pair): 2 weeks full-time
- 1 developer + 1 designer: 3 weeks

---

## 9. Success Metrics

### Prototype Goals
- [ ] 5+ pilot libraries express interest after demo
- [ ] 80%+ task completion rate in user testing
- [ ] 4+ average satisfaction score (1-5 scale)
- [ ] 10+ user testing sessions completed
- [ ] Positive feedback on conversation quality
- [ ] Stakeholder approval to proceed

### Red Flags (When to Pivot)
- Users can't complete basic tasks
- Conversation feels robotic or unhelpful
- Critical accessibility barriers
- Pilot libraries show no interest
- Claude API costs exceed $500 for prototype phase
- Takes >5 seconds per response consistently

---

## 10. What This Prototype Validates

### ✅ What We Learn
- Conversational search is valuable to patrons
- AI can recommend books effectively
- UI/UX is intuitive and usable
- Basic accessibility is achievable
- Libraries are willing to adopt
- Conversation design patterns work

### ❌ What We Don't Validate
- Real API integrations (ILS, OverDrive)
- Scale/performance at 500+ users
- Production privacy architecture
- Long-term operational costs
- Complex security requirements
- Multi-library configuration

### Next Steps After Successful Prototype
1. Secure pilot library commitments (contracts/MOUs)
2. Hire production engineering team
3. Begin full 6-month production build
4. Incorporate prototype feedback
5. Plan Phase 2 features

---

## 11. Component Implementation Examples

### 11.1 Main App Component

```typescript
// src/App.tsx

import { useState, useEffect } from 'react';
import { SearchInput } from './components/SearchInput';
import { ConversationHistory } from './components/ConversationHistory';
import { ResultsList } from './components/ResultsList';
import { useClaudeChat } from './hooks/useClaudeChat';
import { useCatalog } from './hooks/useCatalog';
import { Book } from './types';

function App() {
  const { catalog, isLoading: catalogLoading } = useCatalog();
  const { messages, sendMessage, isLoading, error } = useClaudeChat(catalog);
  const [results, setResults] = useState<Book[]>([]);

  const handleSearch = async (query: string) => {
    await sendMessage(query);
    // Claude will recommend books from catalog
    // You could parse the response to extract book IDs
    // For prototype, just show most recent assistant message
  };

  if (catalogLoading) {
    return <div>Loading catalog...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            📚 Library Book Discovery
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered assistant (prototype)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <SearchInput 
          onSearch={handleSearch} 
          isLoading={isLoading}
        />
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <ConversationHistory messages={messages} />
        
        {results.length > 0 && (
          <ResultsList books={results} />
        )}
      </main>
    </div>
  );
}

export default App;
```

---

### 11.2 Search Input Component

```typescript
// src/components/SearchInput.tsx

import { useState, FormEvent } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchInput = ({ onSearch, isLoading }: SearchInputProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search for books
        </label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything about books..."
          aria-label="Search for books using natural language"
          aria-describedby="search-help"
          disabled={isLoading}
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2
                   bg-blue-600 text-white rounded-md hover:bg-blue-700
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div id="search-help" className="mt-2 text-sm text-gray-600">
        Try: "I want something funny for the beach" or "Books like Educated"
      </div>
    </form>
  );
};
```

---

### 11.3 Book Card Component

```typescript
// src/components/BookCard.tsx

import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      waitlist: 'bg-yellow-100 text-yellow-800',
      checked_out: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      available: '✅ Available now',
      waitlist: '⏳ Waitlist',
      checked_out: '📅 Checked out'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatIcons = {
    physical: '📕',
    ebook: '📱',
    audiobook: '🎧'
  };

  return (
    <article 
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
      aria-label={`${book.title} by ${book.author}`}
    >
      <div className="flex gap-4">
        <img 
          src={book.cover} 
          alt={`Cover of ${book.title}`}
          className="w-24 h-32 object-cover rounded"
        />
        
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            by {book.author}
          </p>
          
          <div className="flex gap-2 mt-2 flex-wrap">
            {book.formats.map((format, idx) => (
              <span key={idx} className="text-lg" title={format.type}>
                {formatIcons[format.type]}
              </span>
            ))}
          </div>
          
          <div className="mt-2">
            {getStatusBadge(book.formats[0].status)}
          </div>
          
          <p className="text-gray-700 text-sm mt-3 line-clamp-2">
            {book.description}
          </p>
          
          <button 
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-blue-500"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};
```

---

## 12. Environment Setup

### Required Environment Variables

```bash
# .env
VITE_CLAUDE_API_KEY=sk-ant-xxxxx
```

### Getting Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy key to `.env` file
6. **For prototype:** Enable browser usage (set dangerouslyAllowBrowser: true)
7. Set rate limits in Anthropic dashboard

### API Key Security Note

For this prototype, exposing the API key in the browser is acceptable because:
- It's a demo, not production
- You can set rate limits on Anthropic's side
- You can restrict the key to specific domains
- You can rotate the key after demos

For production, this key must be server-side only.

---

## 13. Deployment Checklist

### Pre-Deployment
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify all cover images load
- [ ] Check console for errors
- [ ] Test with Claude API (not mock)
- [ ] Add loading states
- [ ] Add error boundaries

### Deployment Steps
```bash
# 1. Build the app
npm run build

# 2. Test the build locally
npm run preview

# 3. Deploy to Vercel
vercel --prod

# 4. Add environment variables
vercel env add VITE_CLAUDE_API_KEY

# 5. Verify deployment works
# Visit the URL and test key features
```

### Post-Deployment
- [ ] Test live URL on mobile
- [ ] Test live URL on desktop
- [ ] Share URL with 2-3 people for feedback
- [ ] Monitor Claude API usage
- [ ] Check for any runtime errors

---

## 14. Conclusion

This prototype PRD defines a **fast, focused, and feasible** proof of concept that can be built in 2-4 weeks for ~$200.

### What Makes This Work
- Real AI (Claude) for authentic experience
- Mock everything else (catalog, APIs, backend)
- Focus on UX validation, not scale
- Deploy fast, iterate based on feedback

### Expected Outcomes
- Validate conversational search UX
- Secure pilot library commitments
- Prove AI can recommend books well
- Get user feedback before investing in production
- De-risk the $500K production build

**The prototype is not the product—it's the proof that the product is worth building.**

Once validated with positive user testing and pilot interest, proceed to the full 6-month production build with confidence.