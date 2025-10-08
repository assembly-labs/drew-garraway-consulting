# MVP Implementation Plan
## 12-Week Development Roadmap for AI Content Research & Publishing Platform

**Target:** Functional MVP you can use to create and publish research-backed content in <15 minutes

**Technology Stack:**
- Frontend: React 18 + TypeScript + TailwindCSS + TipTap
- Backend: Node.js 20 + Express + TypeScript
- Database: PostgreSQL 15 + Redis
- Queue: BullMQ
- AI: Claude API (Sonnet 4.5)
- Hosting: Vercel (frontend) + Railway (backend + DB)

---

## WEEK 1-2: PROJECT SETUP & FOUNDATION

### Week 1: Development Environment

**Day 1-2: Project Initialization**

```bash
# Backend setup
mkdir content-platform-mvp
cd content-platform-mvp
mkdir backend frontend

# Backend structure
cd backend
npm init -y
npm install express typescript ts-node @types/express @types/node
npm install dotenv cors helmet express-rate-limit
npm install pg redis bullmq
npm install @anthropic-ai/sdk axios
npm install zod # for validation
npm install -D nodemon @types/pg @types/redis

# Initialize TypeScript
npx tsc --init

# Frontend setup
cd ../frontend
npx create-react-app . --template typescript
npm install @tailwindcss/forms @tailwindcss/typography
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install zustand react-router-dom axios
npm install react-markdown lucide-react
```

**Project Structure:**
```
content-platform-mvp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── env.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── content.routes.ts
│   │   │   └── platform.routes.ts
│   │   ├── services/
│   │   │   ├── research.service.ts
│   │   │   ├── content.service.ts
│   │   │   ├── claude.service.ts
│   │   │   └── platform.service.ts
│   │   ├── jobs/
│   │   │   ├── research.job.ts
│   │   │   └── publish.job.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── content.model.ts
│   │   │   └── source.model.ts
│   │   ├── utils/
│   │   │   ├── credibility.ts
│   │   │   └── formatting.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IdeaInput/
│   │   │   ├── ResearchPanel/
│   │   │   ├── Editor/
│   │   │   ├── PlatformPreview/
│   │   │   └── common/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreateContent.tsx
│   │   │   └── History.tsx
│   │   ├── store/
│   │   │   └── contentStore.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

**Day 3-4: Database Setup**

**SQL Schema (database/schema.sql):**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  subscription_tier VARCHAR(50) DEFAULT 'creator'
);

-- Content drafts table
CREATE TABLE content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_idea TEXT NOT NULL,
  draft_content TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, researching, review, approved, published
  revision_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Research sources table
CREATE TABLE research_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  excerpt TEXT,
  publication_date DATE,
  domain_authority INT,
  credibility_score FLOAT,
  source_type VARCHAR(50), -- academic, news, industry, blog
  created_at TIMESTAMP DEFAULT NOW()
);

-- Platform content table
CREATE TABLE platform_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- linkedin, twitter, tiktok
  formatted_content TEXT NOT NULL,
  published_url TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User edits table (for future voice learning)
CREATE TABLE user_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES content_drafts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_text TEXT,
  edited_text TEXT,
  edit_type VARCHAR(50), -- word_swap, structure, tone, deletion
  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendar events table (Phase 1 prep)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_title TEXT,
  event_date TIMESTAMP,
  suggested_content TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, dismissed, created
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_content_drafts_user_id ON content_drafts(user_id);
CREATE INDEX idx_content_drafts_status ON content_drafts(status);
CREATE INDEX idx_research_sources_draft_id ON research_sources(draft_id);
CREATE INDEX idx_platform_content_draft_id ON platform_content(draft_id);
CREATE INDEX idx_user_edits_draft_id ON user_edits(draft_id);
```

**Day 5: Environment Configuration**

**backend/.env.example:**
```env
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/content_platform

# Redis
REDIS_URL=redis://localhost:6379

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_key

# Search API (choose one)
BRAVE_SEARCH_API_KEY=your_brave_key
# OR
SERP_API_KEY=your_serp_key

# Domain Authority API
MOZ_ACCESS_ID=your_moz_id
MOZ_SECRET_KEY=your_moz_secret

# Social Platform APIs
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_jwt_secret_here
```

**backend/src/config/env.ts:**
```typescript
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001'),
  
  database: {
    url: process.env.DATABASE_URL!,
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  apis: {
    anthropic: process.env.ANTHROPIC_API_KEY!,
    braveSearch: process.env.BRAVE_SEARCH_API_KEY,
    moz: {
      accessId: process.env.MOZ_ACCESS_ID,
      secretKey: process.env.MOZ_SECRET_KEY,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    },
    twitter: {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      bearerToken: process.env.TWITTER_BEARER_TOKEN,
    },
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  },
};
```

---

## WEEK 3-4: CORE RESEARCH ENGINE

### Week 3: Web Search Integration

**backend/src/services/research.service.ts:**
```typescript
import axios from 'axios';
import { config } from '../config/env';

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export class ResearchService {
  async conductResearch(query: string, numResults: number = 10): Promise<SearchResult[]> {
    try {
      // Using Brave Search API (or substitute with SerpAPI)
      const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
        headers: {
          'X-Subscription-Token': config.apis.braveSearch,
          'Accept': 'application/json',
        },
        params: {
          q: query,
          count: numResults,
          search_lang: 'en',
          country: 'us',
        },
      });

      return response.data.web.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.description,
        publishedDate: result.age,
      }));
    } catch (error) {
      console.error('Research error:', error);
      throw new Error('Failed to conduct research');
    }
  }

  async extractSourceDetails(url: string): Promise<any> {
    // Fetch full page content for better excerpts
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ContentPlatformBot/1.0)',
        },
      });
      
      // Basic extraction (you can enhance with Cheerio for HTML parsing)
      return {
        content: response.data,
        contentType: response.headers['content-type'],
      };
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error);
      return null;
    }
  }

  async categorizeSource(url: string): Promise<string> {
    const domain = new URL(url).hostname;
    
    // Academic sources
    if (domain.endsWith('.edu') || domain.includes('scholar') || domain.includes('arxiv')) {
      return 'academic';
    }
    
    // News sources
    const newsDomains = ['reuters.com', 'apnews.com', 'bbc.com', 'nytimes.com', 'wsj.com'];
    if (newsDomains.some(d => domain.includes(d))) {
      return 'news';
    }
    
    // Industry research
    const industryDomains = ['gartner.com', 'forrester.com', 'mckinsey.com', 'bcg.com'];
    if (industryDomains.some(d => domain.includes(d))) {
      return 'industry';
    }
    
    return 'blog';
  }
}
```

**backend/src/utils/credibility.ts:**
```typescript
interface CredibilityScore {
  overall: number; // 1-10
  domainAuthority: number;
  recencyScore: number;
  sourceTypeBonus: number;
  explanation: string;
}

export class CredibilityScorer {
  async scoreDomainAuthority(url: string): Promise<number> {
    // Simplified version - in production, call Moz API or similar
    const domain = new URL(url).hostname;
    
    // High-authority domains (hardcoded for MVP)
    const highAuthority = [
      '.edu', '.gov', 'nature.com', 'science.org', 'ieee.org',
      'nytimes.com', 'wsj.com', 'economist.com', 'reuters.com',
      'mckinsey.com', 'bcg.com', 'gartner.com', 'forrester.com'
    ];
    
    if (highAuthority.some(d => domain.includes(d))) {
      return 9;
    }
    
    // Medium authority
    const mediumAuthority = [
      'techcrunch.com', 'wired.com', 'theverge.com', 'arstechnica.com',
      'medium.com', 'substack.com'
    ];
    
    if (mediumAuthority.some(d => domain.includes(d))) {
      return 6;
    }
    
    // Default for unknown domains
    return 4;
  }

  calculateRecencyScore(publicationDate?: string): number {
    if (!publicationDate) return 5; // Unknown date = medium score
    
    const pubDate = new Date(publicationDate);
    const now = new Date();
    const monthsOld = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (monthsOld < 6) return 10;
    if (monthsOld < 12) return 8;
    if (monthsOld < 24) return 6;
    if (monthsOld < 36) return 4;
    return 2;
  }

  getSourceTypeBonus(sourceType: string): number {
    const bonuses: Record<string, number> = {
      academic: 2,
      industry: 1.5,
      news: 1,
      blog: 0,
    };
    return bonuses[sourceType] || 0;
  }

  async calculateOverallScore(
    url: string,
    publicationDate?: string,
    sourceType: string = 'blog'
  ): Promise<CredibilityScore> {
    const domainAuthority = await this.scoreDomainAuthority(url);
    const recencyScore = this.calculateRecencyScore(publicationDate);
    const sourceTypeBonus = this.getSourceTypeBonus(sourceType);
    
    // Weighted calculation
    const overall = Math.min(10, 
      (domainAuthority * 0.5) + 
      (recencyScore * 0.3) + 
      sourceTypeBonus
    );
    
    let explanation = `Domain authority: ${domainAuthority}/10, `;
    explanation += `Recency: ${recencyScore}/10, `;
    explanation += `Source type: ${sourceType}`;
    
    return {
      overall: Math.round(overall * 10) / 10,
      domainAuthority,
      recencyScore,
      sourceTypeBonus,
      explanation,
    };
  }
}
```

### Week 4: Research Job Queue

**backend/src/jobs/research.job.ts:**
```typescript
import { Queue, Worker, Job } from 'bullmq';
import { config } from '../config/env';
import { ResearchService } from '../services/research.service';
import { CredibilityScorer } from '../utils/credibility';
import { Pool } from 'pg';

const researchQueue = new Queue('research', {
  connection: {
    url: config.redis.url,
  },
});

interface ResearchJobData {
  draftId: string;
  userId: string;
  query: string;
  numSources: number;
}

export const startResearchWorker = (dbPool: Pool) => {
  const worker = new Worker<ResearchJobData>(
    'research',
    async (job: Job<ResearchJobData>) => {
      const { draftId, query, numSources } = job.data;
      
      const researchService = new ResearchService();
      const credibilityScorer = new CredibilityScorer();
      
      // Update draft status
      await dbPool.query(
        'UPDATE content_drafts SET status = $1, updated_at = NOW() WHERE id = $2',
        ['researching', draftId]
      );
      
      // Conduct research
      const results = await researchService.conductResearch(query, numSources);
      
      // Score and save each source
      for (const result of results) {
        const sourceType = await researchService.categorizeSource(result.url);
        const credibility = await credibilityScorer.calculateOverallScore(
          result.url,
          result.publishedDate,
          sourceType
        );
        
        await dbPool.query(
          `INSERT INTO research_sources 
           (draft_id, url, title, excerpt, publication_date, domain_authority, credibility_score, source_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            draftId,
            result.url,
            result.title,
            result.snippet,
            result.publishedDate || null,
            credibility.domainAuthority,
            credibility.overall,
            sourceType,
          ]
        );
      }
      
      // Mark research complete, ready for drafting
      await dbPool.query(
        'UPDATE content_drafts SET status = $1, updated_at = NOW() WHERE id = $2',
        ['drafting', draftId]
      );
      
      return { success: true, sourcesFound: results.length };
    },
    {
      connection: {
        url: config.redis.url,
      },
    }
  );
  
  worker.on('completed', (job) => {
    console.log(`Research job ${job.id} completed`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`Research job ${job?.id} failed:`, err);
  });
  
  return worker;
};

export const addResearchJob = async (data: ResearchJobData) => {
  return await researchQueue.add('research', data);
};
```

---

## WEEK 5-6: CONTENT GENERATION (CLAUDE INTEGRATION)

**backend/src/services/claude.service.ts:**
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env';

interface Source {
  title: string;
  url: string;
  excerpt: string;
  credibilityScore: number;
}

interface GenerateContentParams {
  idea: string;
  sources: Source[];
  feedback?: string;
}

export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.apis.anthropic,
    });
  }

  async generateContent(params: GenerateContentParams): Promise<string> {
    const { idea, sources, feedback } = params;

    // Build source context
    const sourceContext = sources
      .map((source, idx) => 
        `[${idx + 1}] ${source.title} (Credibility: ${source.credibilityScore}/10)\n` +
        `URL: ${source.url}\n` +
        `Excerpt: ${source.excerpt}\n`
      )
      .join('\n');

    // Build prompt
    const systemPrompt = `You are an expert content writer creating research-backed thought leadership content for executives and professionals. 

Your content should be:
- Well-researched with inline citations [1], [2], etc.
- Authoritative yet accessible
- Data-driven with specific statistics and findings
- Structured for readability (clear sections, short paragraphs)
- 800-1000 words in length

Always cite sources using inline citations. Every major claim should reference a source number.`;

    const userPrompt = feedback
      ? `I want you to revise the content based on this feedback: "${feedback}"\n\n` +
        `Original idea: "${idea}"\n\n` +
        `Available sources:\n${sourceContext}\n\n` +
        `Please revise the content incorporating this feedback while maintaining citations.`
      : `Create a comprehensive, research-backed article on the following topic: "${idea}"\n\n` +
        `Available sources:\n${sourceContext}\n\n` +
        `Structure your article with:\n` +
        `1. A compelling headline\n` +
        `2. An engaging hook (2-3 sentences)\n` +
        `3. Context setting (1 paragraph)\n` +
        `4. 3-4 key points with evidence and citations\n` +
        `5. A strong conclusion with takeaways\n\n` +
        `Format the output as:\n` +
        `# [Your headline]\n\n[Content with inline citations]`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format from Claude');
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate content');
    }
  }

  async generateTitle(content: string): Promise<string> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        temperature: 0.5,
        messages: [
          {
            role: 'user',
            content: `Generate a compelling, professional headline for this article (max 100 characters):\n\n${content.slice(0, 500)}...`,
          },
        ],
      });

      const titleContent = message.content[0];
      if (titleContent.type === 'text') {
        return titleContent.text.replace(/^["']|["']$/g, '').trim();
      }

      return 'Untitled Article';
    } catch (error) {
      console.error('Title generation error:', error);
      return 'Untitled Article';
    }
  }
}
```

**backend/src/services/content.service.ts:**
```typescript
import { Pool } from 'pg';
import { ClaudeService } from './claude.service';

export class ContentService {
  constructor(
    private dbPool: Pool,
    private claudeService: ClaudeService
  ) {}

  async createDraft(userId: string, idea: string) {
    const result = await this.dbPool.query(
      `INSERT INTO content_drafts (user_id, original_idea, status)
       VALUES ($1, $2, 'draft')
       RETURNING id, original_idea, status, created_at`,
      [userId, idea]
    );

    return result.rows[0];
  }

  async generateDraftContent(draftId: string, feedback?: string) {
    // Get sources
    const sourcesResult = await this.dbPool.query(
      `SELECT url, title, excerpt, credibility_score
       FROM research_sources
       WHERE draft_id = $1
       ORDER BY credibility_score DESC
       LIMIT 10`,
      [draftId]
    );

    // Get original idea
    const draftResult = await this.dbPool.query(
      'SELECT original_idea FROM content_drafts WHERE id = $1',
      [draftId]
    );

    const idea = draftResult.rows[0].original_idea;
    const sources = sourcesResult.rows.map(row => ({
      title: row.title,
      url: row.url,
      excerpt: row.excerpt,
      credibilityScore: row.credibility_score,
    }));

    // Generate content with Claude
    const content = await this.claudeService.generateContent({
      idea,
      sources,
      feedback,
    });

    // Update draft
    await this.dbPool.query(
      `UPDATE content_drafts 
       SET draft_content = $1, status = 'review', updated_at = NOW()
       WHERE id = $2`,
      [content, draftId]
    );

    return content;
  }

  async requestRevision(draftId: string, userId: string, feedback: string) {
    // Increment revision count
    const result = await this.dbPool.query(
      `UPDATE content_drafts
       SET revision_count = revision_count + 1, status = 'revising', updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING revision_count`,
      [draftId, userId]
    );

    const revisionCount = result.rows[0]?.revision_count || 0;

    if (revisionCount >= 2) {
      throw new Error('Maximum revision limit reached');
    }

    // Generate revised content
    return await this.generateDraftContent(draftId, feedback);
  }

  async approveDraft(draftId: string, userId: string) {
    await this.dbPool.query(
      `UPDATE content_drafts
       SET status = 'approved', updated_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [draftId, userId]
    );
  }
}
```

---

## WEEK 7-8: EDITORIAL INTERFACE & REVISION SYSTEM

**frontend/src/components/Editor/ContentEditor.tsx:**
```typescript
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ContentEditorProps {
  draftId: string;
  initialContent: string;
  onApprove: () => void;
  onRevise: (feedback: string) => void;
  revisionCount: number;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  draftId,
  initialContent,
  onApprove,
  onRevise,
  revisionCount,
}) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Your content will appear here...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const handleRevision = () => {
    if (feedback.trim()) {
      onRevise(feedback);
      setFeedback('');
      setShowFeedback(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Revision {revisionCount}/2
          </span>
          {revisionCount >= 2 && (
            <span className="text-xs text-orange-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Max revisions reached
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          {revisionCount < 2 && (
            <button
              onClick={() => setShowFeedback(!showFeedback)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Request Revision
            </button>
          )}
          <button
            onClick={onApprove}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve & Format
          </button>
        </div>
      </div>

      {/* Feedback Panel */}
      {showFeedback && (
        <div className="border-b border-gray-200 p-4 bg-blue-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to change?
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="E.g., 'Make it more technical' or 'Add more data about market trends'"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowFeedback(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleRevision}
              disabled={!feedback.trim()}
              className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};
```

**frontend/src/components/ResearchPanel/SourceList.tsx:**
```typescript
import React from 'react';
import { ExternalLink, Award } from 'lucide-react';

interface Source {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  credibilityScore: number;
  sourceType: string;
}

interface SourceListProps {
  sources: Source[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  const getCredibilityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCredibilityLabel = (score: number) => {
    if (score >= 8) return '🟢 High';
    if (score >= 6) return '🟡 Medium';
    return '🔴 Low';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Award className="w-5 h-5 mr-2" />
        Research Sources ({sources.length})
      </h3>

      {sources.map((source, idx) => (
        <div
          key={source.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
              {idx + 1}
            </span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${getCredibilityColor(
                source.credibilityScore
              )}`}
            >
              {getCredibilityLabel(source.credibilityScore)}
            </span>
          </div>

          <h4 className="font-medium text-gray-900 mb-1">{source.title}</h4>

          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {source.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase">
              {source.sourceType}
            </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View Source
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## WEEK 9-10: MULTI-PLATFORM FORMATTING

**backend/src/utils/formatting.ts:**
```typescript
export class PlatformFormatter {
  formatForLinkedIn(content: string, sources: any[]): string {
    // Remove markdown heading
    let formatted = content.replace(/^#\s+.*\n\n/, '');

    // Add professional spacing
    formatted = formatted
      .split('\n\n')
      .map(para => para.trim())
      .join('\n\n');

    // Extract hashtags from content or generate relevant ones
    const hashtags = this.extractHashtags(content);

    // Format citations as footer
    const citationFooter = '\n\n---\n📚 Sources:\n' +
      sources.slice(0, 5).map((s, idx) => `[${idx + 1}] ${s.title} - ${s.url}`).join('\n');

    return formatted + '\n\n' + hashtags.join(' ') + citationFooter;
  }

  formatForTwitter(content: string, sources: any[]): string[] {
    // Remove markdown heading and get title
    const titleMatch = content.match(/^#\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : 'Thread';

    let mainContent = content.replace(/^#\s+.*\n\n/, '');

    // Split into tweets (280 char limit, but leave room for numbering)
    const tweets: string[] = [];
    const maxLength = 260; // Leave room for " (1/n)"

    // First tweet: Title + hook
    const firstParagraph = mainContent.split('\n\n')[0];
    if (firstParagraph.length <= maxLength) {
      tweets.push(firstParagraph);
      mainContent = mainContent.slice(firstParagraph.length).trim();
    } else {
      tweets.push(title);
    }

    // Split remaining content into tweets
    const sentences = mainContent.split(/(?<=[.!?])\s+/);
    let currentTweet = '';

    for (const sentence of sentences) {
      if ((currentTweet + ' ' + sentence).length <= maxLength) {
        currentTweet += (currentTweet ? ' ' : '') + sentence;
      } else {
        if (currentTweet) {
          tweets.push(currentTweet);
        }
        currentTweet = sentence;
      }
    }

    if (currentTweet) {
      tweets.push(currentTweet);
    }

    // Add final tweet with top source
    if (sources.length > 0) {
      tweets.push(`📚 Key source: ${sources[0].title}\n${sources[0].url}`);
    }

    // Add numbering
    return tweets.map((tweet, idx) => `${tweet} (${idx + 1}/${tweets.length})`);
  }

  formatForTikTok(content: string, sources: any[]): string {
    // Remove markdown heading
    let script = content.replace(/^#\s+.*\n\n/, '');

    // Convert to script format with timing cues
    const paragraphs = script.split('\n\n');

    let tiktokScript = '🎬 TIKTOK SCRIPT (60-90 seconds)\n\n';
    tiktokScript += '[HOOK - First 3 seconds]\n';
    tiktokScript += paragraphs[0] + '\n\n';

    tiktokScript += '[MAIN CONTENT - Show key stats on screen]\n';
    tiktokScript += paragraphs.slice(1, 3).join('\n\n') + '\n\n';

    tiktokScript += '[CALL TO ACTION]\n';
    tiktokScript += '"Want to learn more? Check the link in bio for sources!"\n\n';

    tiktokScript += '[TEXT OVERLAYS]\n';
    const stats = this.extractStatistics(content);
    stats.forEach(stat => {
      tiktokScript += `- ${stat}\n`;
    });

    return tiktokScript;
  }

  private extractHashtags(content: string): string[] {
    // Simple keyword extraction for hashtags
    const keywords = content
      .toLowerCase()
      .match(/\b(ai|technology|innovation|business|leadership|strategy)\b/g) || [];

    const uniqueKeywords = [...new Set(keywords)].slice(0, 5);
    return uniqueKeywords.map(k => `#${k}`);
  }

  private extractStatistics(content: string): string[] {
    // Extract numbers with context
    const statPattern = /(\d+(?:\.\d+)?%?(?:\s*(?:billion|million|thousand))?[^.!?]*)/gi;
    const matches = content.match(statPattern) || [];
    return matches.slice(0, 5);
  }
}
```

**backend/src/routes/platform.routes.ts:**
```typescript
import { Router } from 'express';
import { Pool } from 'pg';
import { PlatformFormatter } from '../utils/formatting';

export const createPlatformRoutes = (dbPool: Pool) => {
  const router = Router();
  const formatter = new PlatformFormatter();

  router.post('/format/:draftId', async (req, res) => {
    try {
      const { draftId } = req.params;

      // Get draft content
      const draftResult = await dbPool.query(
        'SELECT draft_content FROM content_drafts WHERE id = $1',
        [draftId]
      );

      if (draftResult.rows.length === 0) {
        return res.status(404).json({ error: 'Draft not found' });
      }

      const content = draftResult.rows[0].draft_content;

      // Get sources
      const sourcesResult = await dbPool.query(
        'SELECT title, url FROM research_sources WHERE draft_id = $1 ORDER BY credibility_score DESC LIMIT 10',
        [draftId]
      );

      const sources = sourcesResult.rows;

      // Format for each platform
      const formatted = {
        linkedin: formatter.formatForLinkedIn(content, sources),
        twitter: formatter.formatForTwitter(content, sources),
        tiktok: formatter.formatForTikTok(content, sources),
      };

      // Save formatted versions
      for (const [platform, formattedContent] of Object.entries(formatted)) {
        const contentStr = Array.isArray(formattedContent)
          ? formattedContent.join('\n---\n')
          : formattedContent;

        await dbPool.query(
          `INSERT INTO platform_content (draft_id, platform, formatted_content)
           VALUES ($1, $2, $3)
           ON CONFLICT (draft_id, platform) DO UPDATE SET formatted_content = $3`,
          [draftId, platform, contentStr]
        );
      }

      res.json({ success: true, formatted });
    } catch (error) {
      console.error('Formatting error:', error);
      res.status(500).json({ error: 'Failed to format content' });
    }
  });

  return router;
};
```

---

## WEEK 11-12: PUBLISHING & POLISH

**backend/src/services/platform.service.ts:**
```typescript
import axios from 'axios';
import { config } from '../config/env';

export class PlatformPublisher {
  async publishToLinkedIn(userId: string, content: string, accessToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      );

      return response.data.id;
    } catch (error: any) {
      console.error('LinkedIn publish error:', error.response?.data || error);
      throw new Error('Failed to publish to LinkedIn');
    }
  }

  async publishToTwitter(content: string[], accessToken: string): Promise<string[]> {
    // Twitter thread publishing (v2 API)
    const tweetIds: string[] = [];

    try {
      let previousTweetId: string | undefined;

      for (const tweet of content) {
        const response = await axios.post(
          'https://api.twitter.com/2/tweets',
          {
            text: tweet,
            ...(previousTweetId && {
              reply: {
                in_reply_to_tweet_id: previousTweetId,
              },
            }),
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const tweetId = response.data.data.id;
        tweetIds.push(tweetId);
        previousTweetId = tweetId;
      }

      return tweetIds;
    } catch (error: any) {
      console.error('Twitter publish error:', error.response?.data || error);
      throw new Error('Failed to publish to Twitter');
    }
  }

  // TikTok would require manual posting for MVP
  generateTikTokInstructions(script: string): string {
    return `📱 TikTok Script Ready\n\n` +
           `Copy this script and create your video:\n\n` +
           script +
           `\n\n✅ Tips:\n` +
           `- Record in vertical format (9:16)\n` +
           `- Use text overlays for statistics\n` +
           `- Add trending music\n` +
           `- Keep it under 90 seconds`;
  }
}
```

**frontend/src/components/PlatformPreview/PublishModal.tsx:**
```typescript
import React, { useState } from 'react';
import { Linkedin, Twitter, Video, Copy, Check } from 'lucide-react';

interface PublishModalProps {
  draftId: string;
  platforms: {
    linkedin: string;
    twitter: string[];
    tiktok: string;
  };
  onPublish: (platforms: string[]) => void;
  onClose: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  platforms,
  onPublish,
  onClose,
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopied(platform);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Publish to Platforms</h2>

        <div className="space-y-6">
          {/* LinkedIn */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('linkedin')}
                  onChange={() => togglePlatform('linkedin')}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <Linkedin className="w-6 h-6 text-blue-600" />
                <span className="font-medium">LinkedIn</span>
              </label>

              <button
                onClick={() => copyToClipboard(platforms.linkedin, 'linkedin')}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                {copied === 'linkedin' ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded p-3 max-h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {platforms.linkedin}
              </pre>
            </div>
          </div>

          {/* Twitter */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes('twitter')}
                  onChange={() => togglePlatform('twitter')}
                  className="w-5 h-5 text-blue-400 rounded"
                />
                <Twitter className="w-6 h-6 text-blue-400" />
                <span className="font-medium">X (Twitter) Thread</span>
              </label>

              <button
                onClick={() =>
                  copyToClipboard(platforms.twitter.join('\n\n'), 'twitter')
                }
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                {copied === 'twitter' ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Thread
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2">
              {platforms.twitter.map((tweet, idx) => (
                <div key={idx} className="bg-gray-50 rounded p-3">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {tweet}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* TikTok */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Video className="w-6 h-6 text-pink-500" />
                <span className="font-medium">TikTok Script</span>
                <span className="text-xs text-gray-500">(Manual posting)</span>
              </div>

              <button
                onClick={() => copyToClipboard(platforms.tiktok, 'tiktok')}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
              >
                {copied === 'tiktok' ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Script
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded p-3 max-h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans">
                {platforms.tiktok}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => onPublish(selectedPlatforms)}
            disabled={selectedPlatforms.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publish to Selected Platforms
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## DEPLOYMENT CHECKLIST

### Railway (Backend + Database)

1. **Create Railway Project:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and init
railway login
railway init
```

2. **Add PostgreSQL:**
- In Railway dashboard: New → Database → PostgreSQL
- Copy `DATABASE_URL` to environment variables

3. **Add Redis:**
- In Railway dashboard: New → Database → Redis
- Copy `REDIS_URL` to environment variables

4. **Deploy Backend:**
```bash
cd backend
railway up
```

5. **Run Migrations:**
```bash
railway run npm run migrate
```

### Vercel (Frontend)

1. **Deploy Frontend:**
```bash
cd frontend
vercel --prod
```

2. **Environment Variables:**
Add to Vercel dashboard:
- `REACT_APP_API_URL`: Your Railway backend URL

---

## TESTING STRATEGY

### Unit Tests (Backend)
```typescript
// backend/src/services/__tests__/credibility.test.ts
import { CredibilityScorer } from '../credibility';

describe('CredibilityScorer', () => {
  const scorer = new CredibilityScorer();

  test('scores .edu domains highly', async () => {
    const score = await scorer.scoreDomainAuthority('https://stanford.edu/research');
    expect(score).toBeGreaterThanOrEqual(8);
  });

  test('calculates recency score correctly', () => {
    const recentScore = scorer.calculateRecencyScore('2024-01-01');
    const oldScore = scorer.calculateRecencyScore('2020-01-01');
    expect(recentScore).toBeGreaterThan(oldScore);
  });
});
```

### Integration Tests
```typescript
// backend/src/__tests__/content-flow.test.ts
describe('Content Creation Flow', () => {
  test('complete flow: idea → research → draft → approve', async () => {
    // 1. Create draft
    const draft = await createDraft(userId, 'AI in healthcare');
    
    // 2. Trigger research
    await addResearchJob({ draftId: draft.id, ... });
    
    // Wait for research to complete
    await waitFor(() => draftStatus === 'drafting');
    
    // 3. Generate content
    const content = await generateDraftContent(draft.id);
    
    // 4. Approve
    await approveDraft(draft.id, userId);
    
    expect(draft.status).toBe('approved');
  });
});
```

---

## MVP LAUNCH CHECKLIST

### Week 13: Pre-Launch

**Day 1-2: Final Testing**
- [ ] Test complete user flow end-to-end
- [ ] Test with 5 different content ideas
- [ ] Verify all 3 platforms format correctly
- [ ] Check credibility scoring accuracy
- [ ] Test revision flow (max 2 revisions)

**Day 3-4: Performance Optimization**
- [ ] Add database indexes
- [ ] Optimize Claude API calls
- [ ] Add caching where appropriate
- [ ] Load test with 10 concurrent users

**Day 5-7: Design Partner Onboarding**
- [ ] Create onboarding documentation
- [ ] Record demo video
- [ ] Set up feedback collection (Google Form)
- [ ] Schedule 1-hour training sessions with each partner

### Success Metrics (First 30 Days)

**Usage Metrics:**
- [ ] 5 design partners activated
- [ ] 50+ pieces of content created
- [ ] 30+ pieces published
- [ ] Average time idea→publish: <20 minutes

**Quality Metrics:**
- [ ] 80%+ drafts approved within 2 revisions
- [ ] Average credibility score: >7/10
- [ ] 0 critical bugs reported
- [ ] User satisfaction: >3.5/5

**Data Collection:**
- [ ] 100+ sources scored for credibility
- [ ] 200+ user edits captured
- [ ] Engagement patterns identified
- [ ] User feedback documented

---

## NEXT STEPS AFTER MVP

Once MVP is validated (3+ design partners say "very disappointed" if product disappeared):

1. **Build Phase 1 Features (Months 4-6)**
   - Advanced credibility scoring
   - Calendar integration
   - Citation verification system

2. **Pricing & Monetization**
   - Launch Creator tier: $49/month
   - Convert 2-3 design partners to paying

3. **Expand Design Partner Program**
   - Recruit 15 more users
   - Target: 20 paying customers by Month 6

This implementation plan gives you everything needed to start building with Claude Code today. Begin with Week 1-2 setup, then work through each week sequentially. The MVP will be functional and usable by Week 12.