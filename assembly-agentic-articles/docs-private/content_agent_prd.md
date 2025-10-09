# Product Requirements Document (PRD) v2.0
## Autonomous Content Research & Publishing Platform with Defensive Moats

**Version:** 2.0  
**Date:** October 8, 2025  
**Status:** Strategic Planning  
**Owner:** AI Product Team

---

## Executive Summary

An AI-powered content intelligence platform that transforms executive ideas into research-backed, multi-platform thought leadership. **Unlike commodity AI writing tools, this platform builds defensible moats through proprietary research intelligence, voice learning systems, and deep workflow integrations.**

**Strategic Differentiation:**
- **Proprietary Research Intelligence Layer:** Credibility-scored sources with verification systems
- **Voice Learning Engine:** Gets smarter with every published piece
- **Workflow Intelligence:** Deep integration with calendar, CRM, and communication tools
- **Performance Analytics:** Network effects from tracking what content drives results
- **Enterprise Compliance:** Legal review, brand safety, and audit trails

**Problem Statement:**
- Content creators spend 3-5 hours researching, writing, and distributing a single piece
- 62% of users don't trust AI-generated content and always fact-check
- Executives pay $100K+ for ghostwriters because they need credibility and compliance
- Current tools are fragmented (8-12 tools per content piece) and don't learn from user behavior

**Product Vision:**
Build the operating system for executive thought leadership—a platform that becomes smarter over time, creating switching costs through proprietary data and deep workflow integration.

---

## Success Metrics

**Primary KPIs:**
- Time from idea to publication: < 15 minutes
- User approval rate on first draft: > 60% (increases to 80%+ after 10 posts via voice learning)
- Source credibility score: Average > 8/10
- Content published per active user: 8+ pieces/month
- Platform stickiness: Users publish 10+ pieces = 90% retention

**Secondary KPIs:**
- Voice learning accuracy: 80%+ match after 10 posts
- Engagement improvement: 30%+ lift after 3 months of performance insights
- Workflow adoption: 60%+ of users connect calendar or CRM
- NPS among C-suite: > 50

---

## PRODUCT ROADMAP

### **MVP (Months 1-3): Immediate Usability + Foundation**
*Goal: Ship working product for early users while building data foundation*

**Core Features:**
1. Single-sentence idea input
2. Basic web search (5-10 sources)
3. **Research source validation & selection** (user selects which sources to use)
4. Claude-powered content generation (800-1000 words, inline citations)
5. Simple editorial interface with revision system (max 2 revisions)
6. Multi-platform formatting (LinkedIn, X, TikTok)
7. **Basic source credibility scoring** (domain authority + recency)
8. **Calendar integration foundation** (read-only: upcoming events)
9. Manual publishing with approval workflow

**Deliverables:**
- Functional product you can use today
- Initial data collection starts (sources used, edits made, approval patterns)
- 5 design partners publishing content weekly

**Technology Stack:**
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL (with schema designed for future intelligence layers)
- AI: Claude API (Sonnet 4.5)
- Integrations: Google Calendar API, LinkedIn API, X API

---

### **Phase 1 (Months 4-6): Research Intelligence + Workflow Intelligence**
*Goal: Build first two defensible moats*

#### **1. Research Intelligence Layer (Priority #1)**

**FR-1.1: Advanced Source Credibility Engine**
- Multi-factor scoring algorithm:
  - Domain authority (weighted by topic vertical)
  - Recency scoring with decay curves
  - Cross-reference verification (claims in multiple sources)
  - Citation network analysis (academic papers citing each other)
- Credibility scores displayed: 1-10 scale with explanation
- User can filter sources by minimum credibility threshold

**FR-1.2: Source Type Prioritization**
- Academic papers: .edu domains, peer-reviewed journals
- Industry research: Gartner, Forrester, McKinsey reports
- News sources: Major publications with editorial standards
- Primary sources: Company blogs, press releases, government data
- Configurable weights per content vertical (executive vs. technical)

**FR-1.3: Citation Verification System**
- Extract claims from draft content
- Trace claims back to source material
- Flag potential misrepresentations: "Source says X, but draft says Y"
- Suggest better citations if claim doesn't match source
- Real-time verification during drafting

**FR-1.4: Curated Research Databases** (Partnership Track)
- Initiate partnerships with academic databases (explore: JSTOR, IEEE, PubMed APIs)
- Phase 1: Manual curation of top 500 sources by vertical
- Build proprietary "credible source library" by industry

**FR-1.5: Research Source Validation (MVP Enhancement)**

**Purpose:** Allow users to validate research quality before content generation

**Functional Requirements:**
- Display all research sources in selection interface immediately after research completes
- Default state: ZERO sources selected (user must actively choose)
- Minimum validation: At least 3 sources must be selected to proceed
- Selection UI:
  - Checkbox on each source card
  - Visual distinction: Selected sources have blue accent border + background tint
  - Selection counter updates in real-time: "X of Y selected (minimum 3 required)"

**Quick Action Buttons:**
1. "Select High Credibility (8+)"
   - Auto-selects all sources with credibilityScore >= 8.0
   - If < 3 sources meet criteria, shows warning: "Only X high-credibility sources found. Select more or run 'Find More Sources'"

2. "Select Academic Only"
   - Auto-selects all sources where sourceType = 'academic'
   - If < 3 academic sources, shows same warning

3. "Select All"
   - Selects all available sources
   - Always enables "Generate Article" button

4. "Deselect All"
   - Clears all selections

**Alternative Actions:**
1. "Skip Selection (Use All Sources)"
   - Immediately proceeds to content generation with all sources
   - Bypasses validation requirement
   - Analytics: Track usage rate to measure friction

2. "Find More Sources"
   - Re-triggers research phase with same idea
   - Appends new sources to existing list (deduplicates by URL)
   - Max 2 retries per draft (prevent infinite loops)
   - Button disabled after 2 retries: "Maximum research attempts reached"

**Generate Article Button:**
- Disabled state (gray):
  - selectedSources.length < 3
  - Tooltip: "Select at least 3 sources to continue"
- Enabled state (blue):
  - selectedSources.length >= 3
  - Click triggers content generation with ONLY selected sources

**Side Panel Analytics:**
- Display source quality metrics:
  - Average credibility: (sum of selected credibilityScores) / count
  - Source type breakdown: Academic (3), Industry (2), News (1)
  - Recency: "6 sources from 2024, 0 older than 2023"
- Provide guidance:
  - "💡 Tip: Mix academic and industry sources for balanced perspectives"
  - "⚠️ Warning: Low average credibility (6.2/10). Consider selecting higher-quality sources."

**Database Changes:**
```sql
ALTER TABLE research_sources
ADD COLUMN user_selected BOOLEAN DEFAULT false;

ALTER TABLE content_drafts
ADD COLUMN research_retry_count INT DEFAULT 0;
```

**Success Metrics:**
- 70%+ users modify default selection (shows engagement with validation)
- <10% use "Skip Selection" (shows feature provides value)
- Average credibility of selected sources > average of all sources (users selecting quality)
- 20%+ use quick action buttons (shows utility of filters)

**Data Model Additions:**
```json
{
  "source_credibility": {
    "url": "string",
    "domain_authority": "float",
    "recency_score": "float",
    "cross_reference_count": "int",
    "citation_network_score": "float",
    "overall_score": "float (1-10)",
    "explanation": "string",
    "topic_vertical": "string"
  },
  "claim_verification": {
    "claim_text": "string",
    "source_quote": "string",
    "match_confidence": "float",
    "verification_status": "verified|flagged|unverified"
  }
}
```

#### **2. Workflow Intelligence (Priority #5)**

**FR-2.1: Calendar Integration (Proactive)**
- Read/write access to Google Calendar, Outlook Calendar
- Scan upcoming events (next 30 days)
- Auto-suggest content topics:
  - "Speaking at TechCrunch Disrupt in 2 weeks—draft preview post?"
  - "Board meeting tomorrow on Q4 results—prepare thought leadership?"
- Content scheduling based on calendar availability
- Conflict detection (don't publish during vacation/busy periods)

**FR-2.2: Email Intelligence** (Phase 1B - Month 6)
- Gmail/Outlook integration (read-only, user permission required)
- Analyze sent emails for emerging themes
- Identify topics mentioned 5+ times in last 30 days
- Suggest: "You've discussed AI regulation in 8 emails this month. Turn this into content?"
- Privacy-first: All analysis happens locally, no email content stored

**FR-2.3: CRM Integration Foundation** (Phase 1B)
- Salesforce, HubSpot read-only integration
- Pull closed-won deal insights: "3 customers cited thought leadership in sales calls"
- Identify common questions from prospects
- Suggest content addressing sales objections

**FR-2.4: Workflow Automation**
- Zapier/Make.com integrations
- Trigger content creation from:
  - New calendar event added
  - Email keyword threshold reached
  - CRM deal stage change
- Automated content suggestions sent to Slack/email

**Data Model Additions:**
```json
{
  "workflow_context": {
    "calendar_events": [
      {
        "event_id": "string",
        "title": "string",
        "date": "datetime",
        "suggested_content": "string",
        "status": "pending|dismissed|created"
      }
    ],
    "email_themes": [
      {
        "topic": "string",
        "mention_count": "int",
        "last_mentioned": "datetime",
        "suggested_angle": "string"
      }
    ],
    "crm_insights": [
      {
        "insight_type": "deal_won|common_question|objection",
        "description": "string",
        "frequency": "int",
        "content_opportunity": "string"
      }
    ]
  }
}
```

**Deliverables by End of Phase 1:**
- Source credibility visible on every citation
- Claim verification catches misrepresentations
- Calendar suggests 2-3 content ideas per week automatically
- Users connect at least one workflow integration (60% adoption target)
- Data foundation built for voice learning (capturing all edits)

---

### **Phase 2 (Months 7-12): Voice Learning + Performance Intelligence**
*Goal: Create switching costs and network effects*

#### **3. Voice Learning Engine**

**FR-3.1: Initial Voice Fingerprinting**
- User onboarding: Import past LinkedIn posts, articles (minimum 5 pieces)
- Extract linguistic patterns:
  - Sentence structure complexity (average words per sentence)
  - Vocabulary sophistication (Flesch-Kincaid score)
  - Tone markers (data-driven vs. narrative, formal vs. casual)
  - Signature phrases and metaphors
  - Industry jargon density
- Create baseline "voice profile"

**FR-3.2: Continuous Learning Loop**
- Track every edit user makes before publishing:
  - Word substitutions (system used "utilize" → user changed to "use")
  - Structural changes (user added paragraph breaks, reordered sections)
  - Tone adjustments (user softened claims, added qualifiers)
  - Deletions (what content user always removes)
- Store edit patterns in voice profile
- Next draft incorporates learned preferences

**FR-3.3: Voice Accuracy Metrics**
- After each post, calculate "voice match score" (0-100%)
- Show user: "This draft matched your style 73% (+8% from last time)"
- Target: 80%+ match by post #10
- Dashboard shows voice learning progress over time

**FR-3.4: Multi-Voice Management** (Enterprise)
- Support multiple voice profiles per account
- Use cases: CEO vs. CMO, different personal brands
- Quick-switch between voices

**Data Model:**
```json
{
  "voice_profile": {
    "user_id": "string",
    "profile_name": "string",
    "linguistic_fingerprint": {
      "avg_sentence_length": "float",
      "vocabulary_sophistication": "float",
      "tone_markers": ["data_driven", "storytelling"],
      "signature_phrases": ["string"],
      "jargon_density": "float"
    },
    "edit_patterns": [
      {
        "pattern_type": "word_swap|structure|tone",
        "original": "string",
        "preferred": "string",
        "frequency": "int"
      }
    ],
    "voice_accuracy_history": [
      {"post_id": "string", "match_score": "float", "date": "datetime"}
    ]
  }
}
```

#### **4. Performance Intelligence**

**FR-4.1: Engagement Tracking**
- Automatically track metrics post-publication:
  - LinkedIn: comments, shares, profile views, connection requests
  - X: retweets, replies, likes, follows
  - TikTok: views, comments, shares
- API integrations with each platform
- Dashboard: engagement trends over time

**FR-4.2: Content-Performance Correlation**
- Analyze what works:
  - Which topics drive most engagement?
  - Do data visualizations increase shares?
  - Optimal post length by platform
  - Best time-of-day for this user
  - Impact of citations on credibility signals
- Machine learning models identify patterns

**FR-4.3: AI-Driven Recommendations**
- Proactive suggestions based on data:
  - "Your posts with data visualizations get 3x more shares—suggest chart for this draft?"
  - "Thursday 8am posts outperform by 40%—schedule for then?"
  - "Topics about AI regulation generate most inbound leads"
- A/B testing suggestions: "Try two versions of this hook?"

**FR-4.4: Cross-User Intelligence** (Privacy-Preserving)
- Aggregate learnings across user base:
  - "C-suite users in fintech see 2.5x engagement with contrarian takes"
  - "Technical deep-dives perform best on Sunday evenings"
- Opt-in data sharing for access to benchmarks
- No individual content shared, only statistical patterns

**FR-4.5: Lead Attribution**
- Track inbound opportunities from content:
  - LinkedIn: "This post led to 5 connection requests from target accounts"
  - X: "12 executives from Fortune 500 engaged with this thread"
- CRM integration: Link content to pipeline (when prospect mentions post in sales call)
- ROI calculation: "Your thought leadership generated $500K pipeline this quarter"

---

### **Phase 3 (Months 13-18): Enterprise Features + Platform Expansion**
*Goal: Enterprise hardening and ecosystem*

#### **5. Vertical-Specific Research Modes**

**FR-5.1: Executive Thought Leadership Mode**
- Source weights: Academic 40%, Industry reports 30%, News 20%, Blogs 10%
- Required recency: Last 24 months
- Citation density: High (3-5 citations per key claim)
- Tone: Authoritative, data-driven, nuanced
- Avoid: Unverified claims, opinion pieces without data

**FR-5.2: Technical Deep-Dive Mode**
- Source weights: Academic CS papers 40%, GitHub/docs 30%, Technical blogs 20%, News 10%
- Include: Code examples, architecture diagrams, benchmarks
- Tone: Technical precision, jargon-appropriate
- Citation format: Academic-style with arxiv links

**FR-5.3: Industry Commentary Mode** (VC/Analyst)
- Source weights: Financial filings 30%, Market research 30%, Founder interviews 25%, News 15%
- Include: Funding data, market sizing, competitive positioning
- Tone: Investment thesis, contrarian takes
- Data visualization: Charts, market maps

**FR-5.4: Mode Selection UI**
- User selects mode at content creation
- System auto-tunes research parameters
- Example outputs shown for each mode

#### **6. Compliance & Legal Features**

**FR-6.1: Claim Verification**
- Flag unverified statistics before publishing
- Require source for all numerical claims
- Highlight: "This claim needs citation"

**FR-6.2: Competitive Mention Warnings**
- Detect competitor company names
- Alert: "You mentioned [Competitor]—legal review recommended?"
- Track for enterprise compliance audits

**FR-6.3: Forward-Looking Statement Detection** (Public Companies)
- Identify predictive language ("we will," "expected to")
- Flag for public company executives (SEC compliance)
- Suggest alternative phrasing

**FR-6.4: Regulatory Compliance Rules** (Financial Services)
- Industry-specific content restrictions
- FINRA/SEC compliance checks for financial services
- Healthcare compliance (HIPAA considerations)
- Configurable rule sets by industry

**FR-6.5: Audit Trail**
- Complete history for every published piece:
  - Source verification status
  - Human approval timestamps
  - Edit history with user IDs
  - Compliance checks performed
- Exportable for legal/compliance review
- Retention: 7 years (regulatory requirement)

#### **7. Collaborative Workflows**

**FR-7.1: Multi-User Approval Chains**
```yaml
Workflow example:
  Stage 1: Executive review
  Stage 2: Communications team review
  Stage 3: Legal review (conditional)
  Stage 4: Publication
```

**FR-7.2: Role-Based Permissions**
- Creator: Can draft and submit
- Reviewer: Can comment and approve
- Publisher: Can publish to platforms
- Admin: Can configure workflows

**FR-7.3: Review Tools**
- Inline commenting
- Suggested edits (track changes mode)
- Approval/rejection with notes
- SLA tracking (24-hour review periods)

**FR-7.4: Notification System**
- Slack notifications: "New draft ready for review"
- Email digests: "3 posts awaiting your approval"
- Mobile push notifications (Phase 3B)

#### **8. Citation Network & Source Library**

**FR-8.1: Personal Research Library**
- Auto-save every source researched
- Categorization: Topic, date, credibility, content type
- Full-text search across saved sources
- Tags and folders for organization

**FR-8.2: Source Reuse**
- "Pull sources from previous posts on AI ethics"
- Smart suggestions: "You cited this source 3 times—add to favorites?"
- Version tracking (source updated since last use)

**FR-8.3: Source Relationship Mapping**
- Visualize citation networks
- "This paper cites these 5 papers"
- Identify seminal vs. derivative research
- Find consensus vs. contrarian sources

**FR-8.4: Team Source Sharing** (Enterprise)
- Shared team library of vetted sources
- Quality control: Admin approves sources for team use
- Commenting: "Great source on AI regulation—used in Q3 earnings content"

---

### **Phase 4 (Months 19-24): Platform & Ecosystem**
*Goal: Network effects and revenue expansion*

#### **9. Template Marketplace**

**FR-9.1: Smart Templates**
- Pre-built structures for common use cases:
  - "Quarterly results reflection"
  - "Conference takeaways"  
  - "Product launch announcement"
  - "Contrarian take" format
- Templates include placeholder prompts and structure

**FR-9.2: Performance-Ranked Templates**
- Analytics: "This template drives 3.2x engagement on average"
- Best use cases: "Works best for B2B tech, fintech executives"
- Success patterns documented

**FR-9.3: Community Templates** (Opt-In)
- Users can publish templates to marketplace
- Attribution: "Template by Sarah Chen, CEO @ TechCorp"
- Follower system: Follow top template creators
- Gamification: Template usage leaderboard

**FR-9.4: Template Customization**
- User can edit any template
- Save customized version to personal library
- Share with team (Enterprise)

#### **10. API & Developer Platform**

**FR-10.1: Public API**
- RESTful API for content creation
- Webhooks for publication events
- OAuth 2.0 authentication
- Rate limiting: Based on subscription tier

**FR-10.2: White-Label Options** (Agency Tier)
- Rebrand platform with agency logo/colors
- Custom domain (content.agency.com)
- Client management dashboard
- Revenue share on upsells

**FR-10.3: Integration Marketplace**
- Third-party integrations built by partners
- Examples: Notion sync, Airtable export, Slack bot
- Revenue share model (70/30 split)

#### **11. Advanced Analytics & Reporting**

**FR-11.1: Executive Dashboard**
- 30/60/90-day performance summaries
- Engagement trends, follower growth
- ROI metrics: Pipeline influenced, inbound leads
- Competitor benchmarking (opt-in)

**FR-11.2: Content Calendar View**
- Visual calendar of published/scheduled content
- Gap analysis: "No content published in 2 weeks"
- Theme tracking: "AI regulation" mentioned 5x this quarter

**FR-11.3: Export & Reporting**
- PDF reports for leadership
- CSV exports of all analytics
- Custom report builder

---

## MVP DETAILED SPECIFICATION

### What You Can Use Immediately (Month 1-3 Delivery)

**User Flow:**

1. **Idea Input**
   - Single text field: 5-200 characters
   - Example prompts shown: "The future of AI regulation" or "Why remote work is reshaping cities"
   - Optional: Select category (Tech, Business, Health, Finance)

2. **Automated Research** (2-3 minutes)
   - System conducts 5-10 web searches based on idea
   - Prioritizes: News sites, .edu domains, industry publications
   - **Basic credibility scoring:**
     - Domain authority check (using Moz/Ahrefs API)
     - Recency scoring (2024 sources = 10/10, 2020 sources = 6/10)
     - Simple display: 🟢 High credibility, 🟡 Medium, 🔴 Low
   - Extracts key findings and statistics
   - Generates citations list with URLs

3. **Research Source Validation & Selection** (30-60 seconds)
   - User reviews all research sources (none selected by default)
   - Interactive selection interface:
     - Checkbox per source card
     - Selection counter: "0 of 8 selected (minimum 3 required)"
     - Visual distinction: Selected sources have blue border + background tint
   - **Quick action buttons:**
     - "Select High Credibility (8+)" - Auto-selects sources with score ≥8.0
     - "Select Academic Only" - Auto-selects academic sources only
     - "Select All" - Selects all sources
     - "Deselect All" - Clears selection
   - **Alternative actions:**
     - "Skip Selection (Use All Sources)" - Proceeds with all sources, no validation
     - "Find More Sources" - Re-runs research (max 2 retries per draft)
   - **Generate Article button:**
     - Disabled (grayed out) until ≥3 sources selected
     - Enabled (blue) when validation passes
     - Tooltip shows requirement: "Select at least 3 sources to continue"
   - **Side panel analytics:**
     - Average credibility score of selected sources
     - Source type breakdown (academic, industry, news, blog)
     - Recency analysis (2024 sources, 2023, older)
     - Selection tips and quality warnings

4. **Content Generation** (1-2 minutes)
   - Claude generates 800-1000 word draft using ONLY selected sources
   - Progress indicator: "Drafting article with 6 selected sources..."
   - Inline citations: [1], [2] format (renumbered based on selected sources)
   - Structure: Hook → Context → 3 Key Points → Conclusion
   - Compelling title auto-generated

5. **Editorial Interface**
   - Rich text editor (TipTap)
   - Side panel: Research sources with credibility scores
   - Actions:
     - ✅ Approve (move to formatting)
     - 📝 Request Revision (natural language feedback)
     - 🔄 Start Over
   - Revision counter: "Revision 1/2" displayed

6. **Revision Loop** (if requested)
   - User provides feedback: "Make it more technical" or "Add more data"
   - System regenerates in <90 seconds
   - Maximum 2 revisions, then force approve or start over

7. **Multi-Platform Formatting** (automatic)
   - **LinkedIn:**
     - Professional formatting, paragraph breaks
     - 3-5 hashtags added
     - First 2 lines optimized for "see more" preview
   - **X (Twitter):**
     - Split into thread (280 char per tweet)
     - Smart sentence boundaries
     - Numbered: 1/n format
     - Max 3 hashtags in final tweet
   - **TikTok:**
     - Video script format (60-90 seconds)
     - Hook in first 3 seconds
     - Visual cues: [Show graphic], [Text overlay]
     - Call-to-action at end

8. **Preview & Approval**
   - Side-by-side view of all platform versions
   - Individual approve/reject per platform
   - Schedule or publish immediately

9. **Publication**
   - APIs publish to selected platforms
   - Confirmation with live links
   - Error handling with retry

**Technology Stack (MVP):**

**Frontend:**
- React 18 + TypeScript
- TailwindCSS
- TipTap (rich text editor)
- Zustand (state management)

**Backend:**
- Node.js 20 + Express
- PostgreSQL 15 (with JSONB for flexible schema)
- BullMQ (job queue for async tasks)
- Redis (caching, session management)

**AI & Integrations:**
- Claude API (Sonnet 4.5): Content generation
- Brave Search API or SerpAPI: Web research
- Moz API: Domain authority scoring
- LinkedIn API v2: Publishing
- X API v2: Thread publishing
- TikTok API: Script creation (manual posting for MVP)

**Infrastructure:**
- Hosting: Vercel (frontend) + Railway (backend)
- Database: Supabase or Railway PostgreSQL
- Storage: S3 for any media assets
- Monitoring: Sentry (errors), PostHog (analytics)

**Database Schema (MVP):**

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP,
  subscription_tier VARCHAR(50)
);

-- Content drafts
CREATE TABLE content_drafts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  original_idea TEXT,
  draft_content TEXT,
  status VARCHAR(50), -- researching, drafting, review, approved, published
  revision_count INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Research sources
CREATE TABLE research_sources (
  id UUID PRIMARY KEY,
  draft_id UUID REFERENCES content_drafts(id),
  url TEXT,
  title TEXT,
  excerpt TEXT,
  publication_date DATE,
  domain_authority INT,
  credibility_score FLOAT,
  source_type VARCHAR(50) -- academic, news, industry, blog
);

-- Platform versions
CREATE TABLE platform_content (
  id UUID PRIMARY KEY,
  draft_id UUID REFERENCES content_drafts(id),
  platform VARCHAR(50), -- linkedin, twitter, tiktok
  formatted_content TEXT,
  published_url TEXT,
  published_at TIMESTAMP
);

-- User edits (for future voice learning)
CREATE TABLE user_edits (
  id UUID PRIMARY KEY,
  draft_id UUID REFERENCES content_drafts(id),
  user_id UUID REFERENCES users(id),
  original_text TEXT,
  edited_text TEXT,
  edit_type VARCHAR(50), -- word_swap, structure, tone, deletion
  created_at TIMESTAMP
);

-- Calendar events (Phase 1 prep)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_title TEXT,
  event_date TIMESTAMP,
  suggested_content TEXT,
  status VARCHAR(50) -- pending, dismissed, created
);
```

---

## MVP Success Criteria (3 Months)

**User Metrics:**
- 5 design partners actively using (publishing 2+ times per week)
- 80%+ of drafts approved within 2 revisions
- <15 minute average time from idea to published content
- 3.5/5 average user satisfaction (will improve with Phase 1 features)

**Technical Metrics:**
- 99% uptime
- Research phase: <3 minutes
- Draft generation: <2 minutes
- Revision: <90 seconds

**Data Collection (for Phase 1):**
- 100+ published pieces with edit histories
- Source credibility scores on 500+ sources
- 200+ user edits captured for voice learning
- Calendar data for 5 users (if they connect)

**Go/No-Go Decision Point:**
- If 3+ of 5 design partners say "very disappointed" if product went away = proceed to Phase 1
- If not, pivot or iterate MVP

---

## Pricing Strategy (Full Roadmap)

### MVP/Phase 1: Simple Pricing

**Free Beta:** 5 design partners (3 months)

**Creator: $49/month**
- 1 user
- 100 posts/month
- Basic research + credibility scores
- All platforms
- Email support

### Phase 2: Tiered Model

**Professional: $129/month**
- 5 users
- Unlimited posts
- Voice learning + performance analytics
- Calendar/email integrations
- Priority support

**Enterprise: $499/month**
- 10+ users
- Everything in Professional
- Multi-user workflows
- Compliance features
- Dedicated support
- SSO, audit logs

### Phase 4: Platform Play

**Agency: $999/month**
- White-label platform
- 50 client seats
- API access
- Revenue share on client upsells
- Custom domain

**API: Custom Pricing**
- Pay-per-generation model
- Volume discounts
- SLA guarantees

---

## Non-Functional Requirements

### Performance
- Research: <3 min (95th percentile)
- Draft generation: <2 min (95th percentile)
- Revision: <90 sec (95th percentile)
- UI response: <200ms for user actions
- Voice learning inference: <500ms

### Reliability
- 99.5% uptime
- Auto-save every 30 seconds
- Graceful degradation if one platform API fails
- 3 retry attempts for failed API calls
- Backup/restore for all user data

### Security
- OAuth 2.0 for all platform integrations
- Encrypted storage (at rest and in transit)
- API tokens in secure vault (HashiCorp Vault or AWS Secrets Manager)
- Rate limiting: 10 requests/min per user (MVP), scales with tier
- Input sanitization (XSS prevention)
- GDPR compliance (data deletion on request)

### Scalability
- MVP: 100 concurrent users
- Phase 1: 1,000 concurrent users
- Phase 2: 10,000 concurrent users
- Horizontal scaling via containerization (Docker + Kubernetes)
- Database read replicas for performance
- CDN for static assets

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Responsive design (mobile, tablet, desktop)

---

## Risk Mitigation

### Technical Risks

**Risk:** Claude API rate limits or outages
**Mitigation:** 
- Implement request queuing
- Fallback to GPT-4 if Claude unavailable
- User communication: "High demand, generation may take 5 min"

**Risk:** Platform API changes (LinkedIn, X)
**Mitigation:**
- Abstraction layer for all integrations
- Weekly automated tests of API endpoints
- Fallback: Generate content, provide copy-paste option

**Risk:** Source credibility algorithm inaccuracy
**Mitigation:**
- Human validation on first 1,000 sources
- User feedback: "Report incorrect score"
- Continuous improvement via ML retraining

### Business Risks

**Risk:** Competitors copy features
**Mitigation:**
- Build proprietary data moats (voice profiles, source library, performance data)
- Deep workflow integrations create switching costs
- Speed of execution (ship Phase 1 in 6 months)

**Risk:** Users don't trust AI-generated content
**Mitigation:**
- Emphasize "AI-assisted" not "AI-generated"
- Human approval required (not full automation)
- Prominent credibility scores and citations
- Transparency: "Here's how we verify sources"

**Risk:** Low engagement after initial interest
**Mitigation:**
- Voice learning improves quality over time (incentive to stay)
- Performance insights show ROI (metric-driven retention)
- Calendar integration creates habit (automatic suggestions)

---

## Success Metrics by Phase

### MVP (Months 1-3)
- ✅ 5 design partners publishing 2+/week
- ✅ <15 min idea-to-publish
- ✅ 80% approval within 2 revisions
- ✅ 3.5/5 user satisfaction

### Phase 1 (Months 4-6)
- ✅ 20 paying customers
- ✅ Source credibility score avg 8/10
- ✅ 60% users connect calendar/email
- ✅ Claim verification catches 90%+ misrepresentations
- ✅ 4.0/5 user satisfaction

### Phase 2 (Months 7-12)
- ✅ 100 paying customers
- ✅ $174K ARR
- ✅ Voice accuracy 80%+ by post #10
- ✅ 30% engagement lift demonstrated
- ✅ NPS >40
- ✅ Product-market fit validated

### Phase 3 (Months 13-18)
- ✅ 500 customers
- ✅ $870K ARR
- ✅ 20 enterprise customers using workflows
- ✅ SOC 2 compliance achieved
- ✅ Series A raised

### Phase 4 (Months 19-24)
- ✅ 2,000 customers
- ✅ $3.48M ARR
- ✅ Template marketplace: 500+ templates
- ✅ 10 agency partners
- ✅ API generating $200K ARR

---

## Open Questions

1. **Academic Database Licensing:** What's the cost to access JSTOR/IEEE APIs? Can we negotiate startup pricing?

2. **Voice Learning Accuracy:** What's acceptable accuracy for users to perceive value? 70%? 80%?

3. **Calendar Permissions:** Will users grant calendar access? Test assumption in MVP with opt-in.

4. **Compliance Requirements:** Do we need legal review for every feature claim about compliance? Hire counsel?

5. **Performance Attribution:** How do we accurately track "this post led to 3 sales calls"? CRM integration depth?

6. **Data Privacy:** What's our policy on using aggregate user data for cross-user intelligence? Opt-in only?

7. **White-Label Economics:** What margin do we need on agency tier to make white-label profitable?

8. **International Expansion:** Phase 5? Or focus on USA domination first?

---

## Appendix A: Competitive Positioning Matrix

| Feature | Your Platform | Jasper | Copy.ai | Perplexity | Buffer |
|---------|--------------|--------|---------|------------|--------|
| Research automation | ✅ Advanced | ⚠️ Chat only | ❌ | ✅ Basic | ❌ |
| Source credibility scoring | ✅ Proprietary | ❌ | ❌ | ⚠️ Basic | ❌ |
| Inline citations | ✅ Verified | ❌ | ❌ | ✅ Search only | ❌ |
| Voice learning | ✅ Continuous | ⚠️ Static | ❌ | ❌ | ❌ |
| Performance analytics | ✅ Deep | ❌ | ❌ | ❌ | ⚠️ Basic |
| Calendar integration | ✅ Proactive | ❌ | ❌ | ❌ | ⚠️ Scheduling |
| Multi-platform publishing | ✅ | ❌ | ❌ | ❌ | ✅ |
| Workflow integrations | ✅ CRM/Email | ❌ | ⚠️ Zapier | ❌ | ❌ |
| Compliance features | ✅ Enterprise | ❌ | ❌ | ❌ | ❌ |
| Template marketplace | ✅ (Phase 4) | ⚠️ Library | ⚠️ Library | ❌ | ❌ |

---

## Appendix B: MVP Development Timeline

**Week 1-2: Architecture & Setup**
- Database schema design
- API integrations testing (Claude, Search, Social platforms)
- Frontend boilerplate (React + TypeScript)
- Backend scaffolding (Node.js + Express)

**Week 3-4: Core Research Engine**
- Web search integration
- Source extraction and parsing
- Basic credibility scoring (domain authority + recency)
- Research results UI

**Week 5-6: Content Generation**
- Claude API integration with prompt engineering
- Citation formatting
- Draft generation with structure
- Title generation

**Week 7-8: Editorial Interface**
- Rich text editor (TipTap)
- Revision system (feedback → regeneration)
- Side-by-side source display
- Approval workflow

**Week 9-10: Multi-Platform Formatting**
- LinkedIn formatting logic
- X thread splitting algorithm
- TikTok script structure
- Preview interface

**Week 11-12: Publishing & Polish**
- Platform API integrations (publish endpoints)
- Error handling and retry logic
- User onboarding flow
- Bug fixes and testing
- Deploy to production

**Week 13: Launch to Design Partners**
- Onboard 5 users
- Training sessions (1-hour each)
- Begin data collection
- Weekly feedback sessions

---

## Appendix C: Tech Stack Rationale

**Why React + TypeScript?**
- Type safety reduces bugs
- Large ecosystem for rich text editors (TipTap)
- Easy to find developers
- Can ship to web and later React Native for mobile

**Why Node.js?**
- JavaScript everywhere (frontend & backend)
- Great async/await for API orchestrations
- Excellent library support for integrations
- Fast iteration

**Why PostgreSQL?**
- Reliable, mature, open-source
- JSONB for flexible schema (future-proofing)
- Great for relational data (users, drafts, sources)
- Can scale to millions of rows

**Why BullMQ?**
- Reliable job queue (research can take 2-3 min)
- Built on Redis (already using for sessions)
- Retry logic out of the box
- Job monitoring and debugging

**Why Claude over GPT-4?**
- Better at nuanced, long-form content
- Stronger citation capabilities
- Less hallucination (important for credibility)
- Anthropic's focus on safety aligns with compliance needs

---

**Document End**