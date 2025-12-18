# Prompt Property Manager AI - Prototype PRD

**Version:** 1.1
**Last Updated:** December 16, 2024
**Status:** Prototype Definition - Proof of Concept
**Change Log:** See [Appendix A: Version History](#appendix-a-version-history)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 16, 2024 | Initial | Original PRD |
| 1.1 | Dec 16, 2024 | Updated | Cloudflare deployment, minimal styling approach, CI/CD process, living document structure |

**This is a living document.** It will be updated as the project evolves. All changes should be logged in the version history.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Prototype vs Production Comparison](#2-prototype-vs-production-comparison)
3. [User Personas](#3-user-personas)
4. [User Stories (Prototype Scope)](#4-user-stories-prototype-scope)
5. [Technical Architecture](#5-technical-architecture)
6. [Development Process & CI/CD](#6-development-process--cicd)
7. [Testing Strategy](#7-testing-strategy)
8. [Mock vs Functional Features](#8-mock-vs-functional-features)
9. [User Experience Flow](#9-user-experience-flow)
10. [User Testing & Validation](#10-user-testing--validation)
11. [Legal Considerations](#11-legal-considerations)
12. [Timeline & Milestones](#12-timeline--milestones)
13. [Success Metrics](#13-success-metrics)
14. [Open Questions](#14-open-questions)
15. [Appendices](#appendices)

---

## 1. Executive Summary

### Purpose
Build a **functional prototype** of Prompt Property Manager AI in 2-4 weeks to:
- Validate conversational policy search UX with real users
- Demo to property management companies for commitment/funding
- Test core conversation design patterns for complex legal documents
- Prove concept to stakeholders/investors

### The Problem
Property management companies and HOA management firms face three critical pain points:

1. **Document Fragmentation**: Residents must search through CC&Rs, bylaws, rules & regulations, lease addenda, and community policies scattered across PDFs, portals, and emails
2. **Legal Jargon Barriers**: CC&Rs and lease agreements are written in dense legal language that residents struggle to interpret
3. **Staff Capacity Crisis**: Property managers spend 30-50% of their time answering repetitive questions that are already documented somewhere

### The Opportunity
- **17,000+ property management companies** in the US
- **370,000+ HOAs** managing 75 million Americans
- **$100B+ property management industry** with growing tech adoption
- Major platforms (AppFolio, Buildium, Yardi) offer portals but **no conversational AI on documents**

### Prototype Scope

| In Scope | Out of Scope |
|----------|--------------|
| Look and feel like the real product | Real property management system integrations |
| Real Claude API for conversational AI | Production-grade scaling (>50 concurrent users) |
| Mobile and desktop responsive | Authentication/security features |
| Basic accessibility features | Legal advice functionality |
| Cloudflare Pages deployment | Real CC&R document ingestion |
| Comprehensive mock data | Payment processing |

### Success Criteria
- 5+ property management companies express interest after demo
- 10+ user testing sessions completed (mix of residents and property managers)
- Positive feedback on conversation flow (80%+ satisfaction)
- Stakeholder approval to proceed to production build

---

## 2. Prototype vs Production Comparison

| Feature | Production (Phase 1) | Prototype |
|---------|---------------------|-----------|
| **Timeline** | 6 months | 2-4 weeks |
| **Cost** | $400K-$600K | ~$2K |
| **Document Data** | Real CC&Rs, leases, APIs | Mock JSON (Oakwood Commons sample) |
| **Search** | Vector DB + semantic search | Claude API on mock data |
| **Authentication** | Resident portal integration | None (open demo) |
| **Backend** | Cloudflare Workers + D1 | Frontend-only |
| **Hosting** | Cloudflare Pages + Workers | Cloudflare Pages (free tier) |
| **Styling** | Full branded design system | Minimal/basic (ready for restyling) |
| **Accessibility** | Full WCAG 2.1 AA + audit | Basic a11y features |
| **Legal Review** | Attorney-reviewed disclaimers | Basic prototype disclaimers |
| **Scalability** | 500+ concurrent users | ~50 concurrent users |
| **CI/CD** | Full pipeline | GitHub Actions basic pipeline |

**What Stays the Same:**
- React frontend (same component patterns)
- Claude API integration (same conversational AI)
- Conversation design principles
- Cloudflare infrastructure (scales from prototype to production)

---

## 3. User Personas

### Primary Persona: Maria (HOA Homeowner)
**Demographics:** 42-year-old professional, bought townhome 2 years ago, first-time HOA member
**Behavior:** Checks community portal monthly, emails property manager 2-3x/month with questions
**Pain Points:**
- Can't find answers in 80-page CC&R document
- Doesn't understand legal terminology
- Feels like she's bothering the property manager with "dumb questions"
- Got conflicting answers from neighbors vs. official policy

**Goals:**
- Quick answers about what she can/can't do
- Understand the rules before making changes to her property
- Avoid fines and violations

**Quote:** "I just want to know if I can put up a fence without reading a legal document for an hour"

---

### Secondary Persona: James (Apartment Renter)
**Demographics:** 28-year-old, rents 1BR apartment, first year at property
**Behavior:** Uses mobile for everything, rarely logs into resident portal, texts questions to friends
**Pain Points:**
- Lease is 30+ pages of legal text
- Doesn't know guest policies, parking rules, or move-out procedures
- Worried about security deposit deductions
- Can't reach leasing office outside business hours

**Goals:**
- Instant answers on mobile
- Know his rights as a tenant
- Avoid surprise charges

**Quote:** "I shouldn't need a lawyer to understand my own lease"

---

### Tertiary Persona: Sandra (Community Manager)
**Demographics:** 35-year-old, manages 3 HOA communities (800 homes total), 5 years experience
**Behavior:** Answers 40-60 resident inquiries weekly, 70% are repetitive questions
**Pain Points:**
- Same questions over and over ("Can I have chickens?" "What color can I paint?")
- Residents interpret CC&Rs differently than intended
- No time for strategic community improvements
- Board members ask her to be "more responsive" but she's maxed out

**Goals:**
- Reduce routine inquiry volume by 50%+
- Consistent, accurate answers (no liability from inconsistent responses)
- More time for complex issues and community building
- Happy residents = easier job

**Quote:** "If I could just get residents to read the rules first, I'd have my life back"

---

### Quaternary Persona: Robert (Property Management Executive)
**Demographics:** 52-year-old, VP at regional PM company managing 50 communities
**Behavior:** Evaluates technology vendors, reports to board on efficiency metrics
**Pain Points:**
- Staff turnover means constant retraining
- Inconsistent service quality across communities
- Liability concerns from wrong information
- Competition from tech-forward competitors

**Goals:**
- Reduce cost-per-unit for management
- Standardize service delivery
- Prove ROI to board
- Differentiate in competitive market

**Quote:** "If it reduces calls and protects us from liability, I'm interested"

---

## 4. User Stories (Prototype Scope)

### US-P1: Conversational Policy Search (P0 - Must Have)

**As a** resident
**I want to** ask questions about community rules in plain language
**So that** I can get quick answers without reading legal documents

**Acceptance Criteria:**
- [ ] User types query like "Can I have a dog?"
- [ ] Claude API processes query and returns relevant policy information
- [ ] Response includes: direct answer, relevant policy excerpt, any conditions/exceptions
- [ ] Works on mobile and desktop
- [ ] Response time: <5 seconds (acceptable for demo)

**Mock Data Required:**
- Sample CC&Rs (30-50 policies covering common topics)
- Rules & Regulations document
- Pet policy, parking policy, architectural guidelines
- Sample lease terms

**Effort:** 1 week

---

### US-P2: Multi-Turn Conversation (P0 - Must Have)

**As a** resident
**I want to** ask follow-up questions to clarify policies
**So that** I fully understand the rules before taking action

**Acceptance Criteria:**
- [ ] User can ask follow-up questions: "What about cats?" after asking about dogs
- [ ] Claude maintains context across 3-5 turns
- [ ] Conversation history visible in UI
- [ ] Can switch topics mid-conversation

**Example Conversation:**
```
Resident: "Can I put up a fence?"
Prompt Property Manager: "Yes, fences are permitted with Architectural Review Committee
          approval. The fence must be no taller than 6 feet, made of wood
          or vinyl (no chain link), and painted in approved earth-tone colors.
          Would you like information on the approval process?"
Resident: "What colors are approved?"
Prompt Property Manager: "Approved fence colors include: Desert Sand, Adobe Brown, Sage Green,
          and Natural Cedar. The full color palette is available in the
          Architectural Guidelines. Do you want me to explain how to submit
          a fence application?"
```

**Effort:** 3 days

---

### US-P3: Source Citation and Transparency (P0 - Must Have)

**As a** resident
**I want to** see where the answer came from
**So that** I can trust the information and reference the official document if needed

**Acceptance Criteria:**
- [ ] Each answer includes citation: "Source: CC&Rs Section 4.2 - Pet Policy"
- [ ] User can expand to see exact policy language
- [ ] Clear disclaimer: "This is for informational purposes only and is not legal advice"
- [ ] Option to "View full policy" (links to relevant section in prototype)

**Why This Matters:**
Unlike general chatbots, policy answers have **legal implications**. Residents need to trust the source and have recourse to official documents.

**Effort:** 2 days

---

### US-P4: "I'm Not Sure" Escalation (P0 - Must Have)

**As a** resident
**I want to** connect with a human when the AI can't help
**So that** I don't get stuck or receive wrong information

**Acceptance Criteria:**
- [ ] If query is ambiguous or not in documents, AI says "I'm not certain about this"
- [ ] Offers to connect with property manager (mock action in prototype)
- [ ] Never invents policies or guesses
- [ ] Tracks escalation rate (target: <20% of queries)

**Critical Behavior:**
```
Resident: "Can I run a daycare out of my home?"
Prompt Property Manager: "I found information about home-based businesses in Section 7.3,
          but daycare specifically isn't addressed. This may require
          interpretation by your community manager or HOA board. Would you
          like me to forward this question to Sandra, your community manager?"

          [Send to Manager] [Not Now]  <- Mock buttons in prototype
```

**Effort:** 2 days

---

### US-P5: Basic Accessibility (P1 - Should Have)

**As a** resident with disabilities
**I want to** use basic features with keyboard and assistive technology
**So that** the demo is usable for all residents

**Acceptance Criteria:**
- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter)
- [ ] Screen reader can announce main content
- [ ] ARIA labels on key inputs and buttons
- [ ] Focus indicators visible
- [ ] Reasonable color contrast (basic styling)

**Effort:** 2-3 days

---

### US-P6: Mobile-Responsive Layout (P1 - Should Have)

**As a** resident on my phone
**I want to** search policies easily
**So that** I can get answers anywhere

**Acceptance Criteria:**
- [ ] Works on iOS Safari and Android Chrome
- [ ] Touch-friendly UI (44px minimum tap targets)
- [ ] Responsive layout (320px to 1920px)
- [ ] Functional on 4G networks

**Effort:** 2 days

---

### US-P7: Quick Questions Categories (P1 - Should Have)

**As a** resident
**I want to** see frequently asked questions
**So that** I can quickly find common topics without typing

**Acceptance Criteria:**
- [ ] Home screen shows 6-8 common question categories
- [ ] Categories: Pets, Parking, Modifications, Pool/Amenities, Payments, Noise, Guests, Move-in/Move-out
- [ ] Tapping category starts conversation with that topic
- [ ] Based on real common inquiries from property managers

**Effort:** 1 day

---

## 5. Technical Architecture

### 5.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     React Frontend (Vite + TypeScript)              │   │
│  │  - Minimal Tailwind CSS (basic structure only)      │   │
│  │  - React Query for API state                        │   │
│  │  - localStorage for session persistence             │   │
│  └─────────────────────┬───────────────────────────────┘   │
│                        │                                    │
│                        ▼                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Claude API (Anthropic)                 │   │
│  │           claude-sonnet-4-5-20250514                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Mock Data: JSON files in /public/data                      │
│  - community_documents.json                                 │
│  - faqs.json                                                │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Deploy via GitHub Actions
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE PAGES                          │
│  - Static site hosting                                      │
│  - Global CDN                                               │
│  - Free tier (100K requests/day)                            │
│  - Custom domain support                                    │
│  - Automatic HTTPS                                          │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Technology Stack

#### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | ^18.3.x |
| Vite | Build tool | ^5.x |
| TypeScript | Type safety | ^5.x |
| Tailwind CSS | Utility CSS (minimal use) | ^3.4.x |
| React Query | Server state | ^5.x |
| Lucide React | Icons | ^0.263.x |

#### AI Integration
| Technology | Purpose |
|------------|---------|
| Anthropic SDK | Claude API client |
| claude-sonnet-4-5-20250514 | Model for conversational AI |

#### Infrastructure
| Technology | Purpose |
|------------|---------|
| Cloudflare Pages | Static hosting |
| GitHub Actions | CI/CD pipeline |
| GitHub | Version control |

#### Development Tools
| Technology | Purpose |
|------------|---------|
| Vitest | Unit testing |
| Playwright | E2E testing |
| ESLint | Linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| lint-staged | Pre-commit checks |

---

### 5.3 Project Structure

```
propwise-prototype/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Continuous integration
│       └── deploy.yml                # Cloudflare Pages deployment
├── public/
│   └── data/
│       ├── community_documents.json  # Main mock data (30-50 policies)
│       └── faqs.json                 # Quick question categories
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatContainer.tsx     # Main chat wrapper
│   │   │   ├── MessageList.tsx       # Conversation history
│   │   │   ├── MessageBubble.tsx     # Individual message
│   │   │   ├── ChatInput.tsx         # User input field
│   │   │   └── TypingIndicator.tsx   # Loading state
│   │   ├── common/
│   │   │   ├── Button.tsx            # Basic button component
│   │   │   ├── Card.tsx              # Basic card component
│   │   │   └── LoadingSpinner.tsx    # Loading indicator
│   │   ├── layout/
│   │   │   ├── Header.tsx            # App header
│   │   │   ├── Footer.tsx            # App footer
│   │   │   └── Layout.tsx            # Page wrapper
│   │   ├── features/
│   │   │   ├── QuickQuestions.tsx    # FAQ category buttons
│   │   │   ├── SourceCitation.tsx    # Document source display
│   │   │   ├── Disclaimer.tsx        # Legal disclaimer
│   │   │   ├── EscalationPrompt.tsx  # Contact manager modal
│   │   │   └── ContactCard.tsx       # Manager contact info
│   │   └── index.ts                  # Barrel exports
│   ├── hooks/
│   │   ├── useChat.ts                # Claude API integration
│   │   ├── useCommunityData.ts       # Load mock data
│   │   └── useLocalStorage.ts        # Persist conversation
│   ├── lib/
│   │   ├── claude.ts                 # Claude API client setup
│   │   └── prompts.ts                # System prompt builder
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   ├── utils/
│   │   ├── formatters.ts             # Date, text formatters
│   │   └── constants.ts              # App constants
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Minimal global styles
├── tests/
│   ├── unit/                         # Vitest unit tests
│   │   ├── hooks/
│   │   └── utils/
│   ├── e2e/                          # Playwright E2E tests
│   │   ├── chat.spec.ts
│   │   └── navigation.spec.ts
│   └── setup.ts                      # Test configuration
├── docs/
│   ├── PRD.md                        # This document
│   ├── DEVELOPMENT.md                # Development guide
│   ├── TESTING.md                    # Testing guide
│   └── DEPLOYMENT.md                 # Deployment guide
├── .env.example                      # Environment template
├── .env.local                        # Local env (gitignored)
├── .eslintrc.cjs                     # ESLint config
├── .prettierrc                       # Prettier config
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── playwright.config.ts
└── vitest.config.ts
```

---

### 5.4 Styling Approach

**Philosophy:** Minimal styling for prototype. Structure components for easy future restyling.

```css
/* Current approach: Basic utility classes only */
/* NO custom colors, NO brand styling */
/* Focus on layout, spacing, and basic typography */

/* Example - minimal component styling */
.chat-container {
  @apply flex flex-col h-full;
}

.message-bubble {
  @apply p-4 rounded-lg mb-2;
}

/* Use CSS variables for future theming */
:root {
  --color-primary: #000000;      /* Placeholder - will be branded */
  --color-secondary: #666666;    /* Placeholder - will be branded */
  --color-background: #ffffff;   /* Placeholder - will be branded */
  --color-surface: #f5f5f5;      /* Placeholder - will be branded */
  --color-text: #000000;         /* Placeholder - will be branded */
  --color-text-muted: #666666;   /* Placeholder - will be branded */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --spacing-unit: 4px;
}
```

**Component Structure for Restyling:**
- All colors reference CSS variables
- Tailwind classes are minimal (layout/spacing only)
- No hardcoded colors in components
- Components accept className prop for overrides

---

### 5.5 Claude API Integration

#### Client Setup

```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk';

export const createClaudeClient = () => {
  return new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true // Acceptable for prototype
  });
};

export const CLAUDE_CONFIG = {
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1500,
  temperature: 0.2  // Lower for consistent, accurate policy answers
} as const;
```

#### System Prompt

```typescript
// src/lib/prompts.ts
import { CommunityData } from '../types';

export const buildSystemPrompt = (data: CommunityData): string => `
You are Prompt Property Manager, a helpful assistant for residents of ${data.community.name}.
You help residents understand their community rules, CC&Rs, and policies.

COMMUNITY INFORMATION:
- Name: ${data.community.name}
- Type: ${data.community.property_type}
- Units: ${data.community.units}
- Management: ${data.community.management_company}
- Community Manager: ${data.community.community_manager.name}
- Contact: ${data.community.community_manager.email}

COMMUNITY DOCUMENTS:
${JSON.stringify(data.documents, null, 2)}

AVAILABLE FORMS:
${JSON.stringify(data.forms, null, 2)}

CRITICAL RULES:
1. ONLY answer based on the documents provided above
2. NEVER invent or assume policies not explicitly stated
3. If something isn't covered, say "I don't see this specifically addressed
   in your community documents" and offer to escalate to the community manager
4. Always cite your source: "According to [Document] Section X.X..."
5. Be helpful and friendly, but accurate above all else
6. Include the standard disclaimer when giving policy information
7. If a question requires legal interpretation, recommend consulting with
   the HOA board or an attorney

RESPONSE FORMAT:
- Start with a direct answer when possible
- Use **bold** for key points
- Cite the specific source (document name and section)
- Mention any conditions, exceptions, or approval processes
- Include relevant forms and how to submit them
- End with disclaimer for policy questions

STANDARD DISCLAIMER:
"This information is provided for convenience and is not legal advice.
Please refer to your official community documents or contact
${data.community.community_manager.name} for definitive guidance."

TONE:
- Professional but warm and approachable
- Clear and jargon-free
- Helpful, not bureaucratic
`;
```

---

### 5.6 Mock Data Schema

See [Appendix B: Mock Data Schema](#appendix-b-mock-data-schema) for the complete JSON structure.

**Coverage Requirements (30-50 policies):**

| Category | Policies to Include |
|----------|---------------------|
| Pets | Dogs, cats, exotic pets, service animals, registration, deposits |
| Parking | Assigned spaces, guest parking, RVs/boats, street parking |
| Architectural | Fences, paint colors, landscaping, satellite dishes, solar panels |
| Pool/Amenities | Hours, guests, rules, reservations, fitness center |
| Noise | Quiet hours, parties, construction hours |
| Rentals | Lease requirements, subletting, Airbnb policy |
| Common Areas | Use restrictions, reservations, liability |
| Violations | Process, fines, appeals |
| Move-in/out | Procedures, deposits, elevator reservations |
| Maintenance | Owner vs. HOA responsibilities |

---

## 6. Development Process & CI/CD

### 6.1 Development Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Feature   │───▶│    Code     │───▶│   Review    │───▶│   Merge     │
│   Branch    │    │  + Tests    │    │   (PR)      │    │  to main    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                               │
                                                               ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Deploy    │◀───│   Build     │◀───│   Test      │◀───│    CI       │
│  (Cloudflare)│    │   (Vite)    │    │  (Vitest)   │    │  Pipeline   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 6.2 Branch Strategy

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | Protected, requires PR |
| `develop` | Integration branch | Protected, requires PR |
| `feature/*` | New features | None |
| `fix/*` | Bug fixes | None |
| `chore/*` | Maintenance | None |

### 6.3 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructure
- `test`: Add/update tests
- `chore`: Maintenance

**Examples:**
```
feat(chat): add multi-turn conversation support
fix(api): handle Claude API timeout gracefully
docs(prd): update deployment section for Cloudflare
test(hooks): add useChat unit tests
```

### 6.4 Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 6.5 GitHub Actions - CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

### 6.6 GitHub Actions - Deploy Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: propwise-prototype
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 6.7 Environment Variables

```bash
# .env.example

# Anthropic API Key (required)
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx

# App Configuration
VITE_APP_NAME=Prompt Property Manager
VITE_APP_ENV=development

# Feature Flags (for mocking)
VITE_MOCK_ESCALATION=true
VITE_MOCK_FORMS=true
```

---

## 7. Testing Strategy

### 7.1 Testing Pyramid

```
        ┌───────────────┐
        │     E2E       │  <- Few, critical user flows
        │   (Playwright) │
        └───────────────┘
       ┌─────────────────┐
       │   Integration   │  <- Component interactions
       │    (Vitest)     │
       └─────────────────┘
      ┌───────────────────┐
      │       Unit        │  <- Functions, hooks, utils
      │     (Vitest)      │
      └───────────────────┘
```

### 7.2 Unit Tests (Vitest)

**Coverage Targets:**
- Hooks: 80%+
- Utils: 90%+
- Overall: 70%+

**What to Test:**
- `useChat` hook - message handling, API calls
- `useCommunityData` hook - data loading
- Prompt builder functions
- Formatters and utilities

**Example:**
```typescript
// tests/unit/hooks/useChat.test.ts
import { renderHook, act } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';

describe('useChat', () => {
  it('should add user message to messages array', async () => {
    const { result } = renderHook(() => useChat(mockCommunityData));

    await act(async () => {
      await result.current.sendMessage('Can I have a dog?');
    });

    expect(result.current.messages).toHaveLength(2); // user + assistant
    expect(result.current.messages[0].role).toBe('user');
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failure
    const { result } = renderHook(() => useChat(mockCommunityData));

    await act(async () => {
      await result.current.sendMessage('trigger error');
    });

    expect(result.current.error).toBeTruthy();
  });
});
```

### 7.3 E2E Tests (Playwright)

**Critical User Flows:**
1. Basic policy question
2. Multi-turn conversation
3. Quick question categories
4. Escalation flow
5. Mobile responsiveness

**Example:**
```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chat functionality', () => {
  test('should answer a basic policy question', async ({ page }) => {
    await page.goto('/');

    // Type question
    await page.fill('[data-testid="chat-input"]', 'Can I have a dog?');
    await page.click('[data-testid="send-button"]');

    // Wait for response
    await expect(page.locator('[data-testid="assistant-message"]'))
      .toBeVisible({ timeout: 10000 });

    // Verify response contains key information
    const response = await page.textContent('[data-testid="assistant-message"]');
    expect(response).toContain('pet');
    expect(response).toContain('Section'); // Citation
  });

  test('should maintain context in multi-turn conversation', async ({ page }) => {
    await page.goto('/');

    // First question
    await page.fill('[data-testid="chat-input"]', 'Can I have a dog?');
    await page.click('[data-testid="send-button"]');
    await expect(page.locator('[data-testid="assistant-message"]')).toBeVisible();

    // Follow-up question
    await page.fill('[data-testid="chat-input"]', 'What about cats?');
    await page.click('[data-testid="send-button"]');

    // Should reference previous context
    const messages = await page.locator('[data-testid="assistant-message"]').all();
    expect(messages.length).toBe(2);
  });
});
```

### 7.4 Running Tests

```bash
# Unit tests
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report

# E2E tests
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # With UI mode
npm run test:e2e:debug    # Debug mode

# All tests
npm run test:all          # Unit + E2E
```

---

## 8. Mock vs Functional Features

### 8.1 Feature Status Matrix

| Feature | Status | Behavior |
|---------|--------|----------|
| **Chat Input** | Functional | Real text input |
| **Claude API Calls** | Functional | Real API responses |
| **Message Display** | Functional | Real conversation |
| **Source Citations** | Functional | Shows mock document sections |
| **Quick Questions** | Functional | Pre-fills chat input |
| **Multi-turn Context** | Functional | Claude maintains context |
| **Escalation Prompt** | Mock | Shows UI but doesn't send email |
| **"Send to Manager"** | Mock | Shows confirmation, no actual send |
| **View Full Policy** | Mock | Shows expanded text in modal |
| **Download Forms** | Mock | Shows "Feature coming soon" |
| **Clear Chat** | Functional | Clears localStorage |
| **Mobile Layout** | Functional | Responsive CSS |

### 8.2 Mock Indicators

For mock features, display subtle indicator:
```
[Send to Manager]
         ↓
"Message sent to Sandra Chen" (Demo mode - not actually sent)
```

### 8.3 Demo Mode Banner

Include optional banner for demo presentations:
```
┌─────────────────────────────────────────────────────────────┐
│ 🎭 DEMO MODE - Some features are simulated for demonstration │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. User Experience Flow

### 9.1 Welcome Screen (Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  Prompt Property Manager                                    [Demo Mode]    │
│  Your Community Assistant                                   │
│                                                             │
│  Oakwood Commons HOA                                        │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Ask me about community rules and policies...       [→]│ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Quick Questions:                                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Pets   │ │ Parking │ │  Pool   │ │  Mods   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Noise  │ │ Guests  │ │  Fees   │ │  Forms  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  Community Manager: Sandra Chen                             │
│  (555) 123-4567 | Mon-Fri 9am-5pm                          │
│  schen@premierprop.com                                      │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Conversation View (Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  Prompt Property Manager                           [Clear] [Contact]       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ You                                                 │   │
│  │ Can I put up a fence in my backyard?                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Prompt Property Manager                                            │   │
│  │                                                     │   │
│  │ Yes, fences are permitted at Oakwood Commons,       │   │
│  │ but you'll need approval first.                     │   │
│  │                                                     │   │
│  │ **Key Requirements:**                               │   │
│  │ - Maximum height: 6 feet                            │   │
│  │ - Materials: Wood or vinyl only                     │   │
│  │ - Colors: Must be from approved palette             │   │
│  │                                                     │   │
│  │ Source: CC&Rs Section 4.1, 4.2  [View Full Policy]  │   │
│  │                                                     │   │
│  │ ─────────────────────────────────────────────────── │   │
│  │ This information is provided for convenience and    │   │
│  │ is not legal advice.                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Ask a follow-up question...                       [→]│ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 Escalation Flow (Wireframe)

```
┌─────────────────────────────────────────────────────────────┐
│  You: Can I run an Airbnb out of my townhome?              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Prompt Property Manager                                                   │
│                                                             │
│  I found information about rentals in your CC&Rs, but       │
│  short-term rentals like Airbnb aren't specifically         │
│  addressed.                                                 │
│                                                             │
│  Section 6.2 states rentals must be for a minimum of        │
│  12 months. This question may need board clarification.     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Send this question to Sandra Chen?                  │   │
│  │                                                     │   │
│  │ Your question will be forwarded with context.       │   │
│  │                                                     │   │
│  │              [Send to Manager]  [Not Now]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Source: CC&Rs Section 6.2 - Leasing                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. User Testing & Validation

### 10.1 Testing Plan

**Goal:** Validate conversational policy search UX and trust signals

**Participants (10-15 total):**
- 4-5 HOA homeowners (Maria persona)
- 3-4 apartment renters (James persona)
- 2-3 property managers (Sandra persona)
- 1-2 property management executives (Robert persona)

### 10.2 Test Protocol (30 min sessions)

1. **Introduction (5 min):** Explain prototype purpose
2. **Task 1 (5 min):** "Find out if you can have a pet"
3. **Task 2 (5 min):** "You want to paint your front door - what do you need to do?"
4. **Task 3 (5 min):** "Ask something that might not be covered"
5. **Task 4 (5 min):** Mobile test
6. **Interview (5 min):** Feedback questions

### 10.3 Key Metrics

| Metric | Target |
|--------|--------|
| Task completion rate | 85%+ |
| Time per task | <2 min |
| Trust score (1-5) | 4+ |
| Satisfaction score (1-5) | 4+ |
| Escalation rate | <20% |

---

## 11. Legal Considerations

### 11.1 Required Disclaimer

Every policy response must include:
```
This information is provided for convenience and is not legal advice.
Please refer to your official community documents or consult with your
community manager for definitive guidance.
```

### 11.2 Bot Restrictions

**The bot should NOT:**
- Provide legal advice or interpretations
- Make promises about exception approvals
- Handle complaints about specific residents
- Process payments
- Access personal resident information
- Make statements about Fair Housing

---

## 12. Timeline & Milestones

### Week 1: Foundation

- [ ] Project setup (Vite + React + TypeScript)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Basic component structure
- [ ] Mock data creation (30-50 policies)
- [ ] Claude API integration

### Week 2: Core Features

- [ ] Chat interface (input, messages, history)
- [ ] Multi-turn conversation
- [ ] Source citations
- [ ] Escalation flow UI
- [ ] Unit tests for hooks

### Week 3: Polish & Testing

- [ ] Mobile responsiveness
- [ ] Quick questions
- [ ] Accessibility basics
- [ ] E2E tests
- [ ] Cloudflare deployment

### Week 4: Validation

- [ ] User testing sessions (10-15)
- [ ] Feedback collection
- [ ] Priority fixes
- [ ] Demo preparation

---

## 13. Success Metrics

### Prototype Goals

- [ ] 5+ property management companies express interest
- [ ] 85%+ task completion in user testing
- [ ] 4+ average trust score
- [ ] 4+ average satisfaction score
- [ ] <20% escalation rate
- [ ] Positive feedback on citations

### Red Flags

- Users don't trust AI for policy questions
- Escalation rate exceeds 40%
- Property managers express liability concerns
- Competitive products emerge

---

## 14. Open Questions

### Product
- [ ] HOAs vs. apartments vs. both?
- [ ] Minimum viable document set?
- [ ] Community-specific interpretations?

### Technical
- [ ] Real CC&R ingestion approach (PDF parsing)?
- [ ] Document update handling?
- [ ] PM software integrations?

### Business
- [ ] Pricing model?
- [ ] Target buyer?
- [ ] Build vs. partner?

---

## Appendices

### Appendix A: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 16, 2024 | Initial PRD |
| 1.1 | Dec 16, 2024 | Cloudflare deployment, minimal styling, CI/CD process |

---

### Appendix B: Mock Data Schema

```typescript
// src/types/index.ts

export interface CommunityData {
  community: Community;
  documents: Document[];
  forms: Form[];
  contacts: Contacts;
  violation_process: ViolationProcess;
}

export interface Community {
  name: string;
  type: string;
  units: number;
  property_type: string;
  management_company: string;
  community_manager: CommunityManager;
}

export interface CommunityManager {
  name: string;
  email: string;
  phone: string;
  office_hours: string;
}

export interface Document {
  id: string;
  type: 'ccr' | 'rules_and_regulations' | 'bylaws' | 'lease';
  title: string;
  effective_date: string;
  last_amended?: string;
  sections: Section[];
}

export interface Section {
  number: string;
  title: string;
  content: string;           // Original legal language
  plain_language: string;    // Simplified explanation
  related_forms?: string[];
  common_questions?: string[];
  restrictions?: Record<string, unknown>;
  schedule?: Record<string, unknown>;
}

export interface Form {
  id: string;
  name: string;
  description: string;
  processing_time: string;
  fee: number;
  deposit?: number;
  requirements?: string[];
  submission: string;
}

export interface Contacts {
  emergency_after_hours: string;
  maintenance_requests: string;
  arc_submissions: string;
  general_inquiries: string;
}

export interface ViolationProcess {
  first_offense: string;
  second_offense: string;
  third_offense: string;
  subsequent: string;
  appeal_process: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  document_id: string;
  section_number: string;
  section_title: string;
}
```

---

### Appendix C: Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Unit tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests

# Quality
npm run lint             # ESLint
npm run lint:fix         # Fix lint issues
npm run type-check       # TypeScript check
npm run format           # Prettier

# Deployment
npm run deploy           # Deploy to Cloudflare (if configured locally)
```
