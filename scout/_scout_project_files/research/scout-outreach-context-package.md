# Scout & Finch: Cold Outreach Strategy - Context Package

**Version:** 1.0  
**Purpose:** Comprehensive context for Claude Code to develop complete cold outreach strategy  
**Owner:** Drew, Product Manager  
**Date:** December 2024

---

## Executive Summary

### Our Products

**Scout (Patron Discovery Assistant)**
- AI-powered conversational discovery assistant for US public libraries
- Unifies search across library ILS + OverDrive digital collections + databases
- Natural language interface: patrons describe what they want, Scout finds it
- Privacy-first architecture: zero-logging, no patron data retention
- WCAG 2.2 AA accessibility compliant from day one
- Increases patron engagement with library materials by 20-40%
- Reduces "I can't find it" reference desk questions

**Finch (Librarian Assistant Tool)**
- Unified interface for librarians to search catalogs and assist patrons
- Books materials on behalf of patrons across systems
- AI-powered onboarding assistant for new librarians
- Knowledge base for policies, procedures, tech troubleshooting
- Assists with ESL patrons, tech support, event information
- Reduces routine reference workload by 15+ hours/week
- Helps librarians focus on complex research questions vs. repetitive tasks

### Our Mission

Democratize library access for underserved communities by:
- Making discovery easier for patrons facing technology barriers
- Preserving library values: privacy, intellectual freedom, equity
- Augmenting (not replacing) librarian expertise
- Meeting accessibility needs ahead of mandates
- Building WITH librarians, not FOR them

### Our Differentiation

**vs. OverDrive Inspire Me (launched Aug 2025):**
- They: Ebook-only discovery, bundled with OverDrive subscription
- We: Unified discovery across ILS + OverDrive + databases

**vs. Ex Libris/EBSCO AI features:**
- They: Database-only, bundled with platform subscriptions
- We: Standalone, works with any ILS system

**vs. BiblioCommons ($30K-$100K discovery layers):**
- They: Discovery layer only, no librarian tools
- We: Patron + librarian dual tools, lower price point

**Our unique positioning:**
1. **Privacy-first architecture** - zero-logging, independently auditable
2. **Accessibility leadership** - WCAG 2.2 AA certified, voice interface for seniors
3. **Unified discovery** - only solution searching ILS + digital platforms together
4. **Built WITH librarians** - co-development, not Silicon Valley imposing solutions

---

## Product Capabilities Deep Dive

### Scout: Patron Discovery Assistant

**Core Capabilities:**
1. **Conversational search** - "I want something funny for the beach" returns results
2. **Unified catalog search** - searches physical ILS + OverDrive simultaneously in <3 seconds
3. **Format awareness** - shows availability: physical book, ebook, audiobook
4. **Smart recommendations** - "Books like Educated" with explanations
5. **Multi-turn conversations** - maintains context across 5-10 exchanges
6. **Error handling** - graceful degradation, librarian handoff when uncertain
7. **Voice interface** - speech-to-text for seniors, accessibility users
8. **Progressive disclosure** - simple by default, power features discoverable

**Technical Integration:**
- ILS systems supported (Phase 1): Polaris, Koha, Sierra
- OverDrive API integration for digital collections
- 2-3 day integration timeline for standard implementations
- API-based, no patron data stored on Scout servers
- Mobile-responsive (works on phones, tablets, desktops)

**Measurable Outcomes:**
- 20-40% increase in patron engagement with underutilized collections
- 35% reduction in "I can't find it" reference desk queries
- 40% reduction in patron search time (10 min → 6 min average)
- Staff time savings: 10-15 hours/week on routine discovery questions

**Accessibility Features:**
- WCAG 2.2 AA compliant (ahead of ADA Title II mandate)
- Screen reader compatible (JAWS, NVDA, VoiceOver tested)
- Keyboard-only navigation
- Voice interface for users with mobility/visual impairments
- High contrast mode, adjustable text size

**Privacy Architecture:**
- Zero query logging - searches never persisted
- Anonymous session IDs (24-hour expiration)
- No tracking cookies beyond essential session management
- ALA Library Bill of Rights aligned
- FERPA compliant (for academic libraries)
- Third-party privacy audit completed

### Finch: Librarian Assistant

**Core Capabilities:**
1. **Unified catalog interface** - search patron's ILS + OverDrive + databases from one screen
2. **Quick booking** - place holds, check out materials across systems with 1-2 clicks
3. **Onboarding assistant** - AI answers new librarian questions 24/7
   - "How do I process an interlibrary loan?"
   - "What's our policy on late fees?"
   - "Where's the form for [X]?"
4. **Tech support aid** - troubleshooting guides for common patron issues
   - Printing problems, Wi-Fi connection, device setup
5. **ESL patron support** - translation assistance, simplified explanations
6. **Event information** - quick access to library program details for patron questions
7. **Policy lookup** - instant answers to circulation, patron account, facility questions

**Staff Benefits:**
- Reduces routine reference questions by 40%
- Saves 15+ hours/week on repetitive patron assistance
- Cuts new librarian onboarding from 6-8 weeks to 2-3 weeks
- Increases staff satisfaction by reducing burnout from repetitive tasks
- Frees librarians for complex research assistance (their actual expertise)

**Integration with Scout:**
- Librarians see what patrons searched via Scout (with permission)
- Can pick up conversations where patrons left off
- Unified data on collection usage, popular searches, gaps

---

## Target Market Intelligence

### Market Overview

**Total addressable market:**
- 9,194 US public library systems
- 171 million patrons served
- Average technology budget: $408,100/year per library
- 33% of tech budget for software beyond core ILS (~$135,000)

**Initial target segment (Phase 1):**
- 2,357 libraries using Polaris or Koha ILS (easiest integrations)
- Focus: Mid-sized libraries (25K-100K patrons) with $15K-$35K software budgets
- Geographic: 5-8 states with strong LSTA funding (California, Texas, Massachusetts, Colorado, North Carolina)

**Market timing:**
- Major vendors (OverDrive, Ex Libris, EBSCO) rushing AI features in 2024-2025
- Librarians skeptical of AI due to privacy concerns, job replacement fears
- 2-3 year window before market consolidates
- Operating budgets grew 7.9% in 2024 while staff capacity declined = need + budget

### Library Decision-Makers

**Primary personas:**

**1. Library Directors (Budget approvers)**
- Demographics: 48 years old average, 82-89% female, 84% white
- Pain points: Board accountability, community impact proof, peer competition
- Values: Measurable outcomes, ROI documentation, patron satisfaction
- Decision criteria: Cost-benefit, peer validation, mission alignment
- Messaging angle: "15 peer libraries using this, 40% more patrons finding resources"

**2. Technology Librarians (Technical evaluators)**
- Demographics: More likely to be male (21.9% in academic settings), tech-forward
- Pain points: Integration complexity, staff training burden, security/privacy
- Values: API compatibility, vendor transparency, accessibility compliance
- Decision criteria: Technical documentation, ILS compatibility, pilot success
- Messaging angle: "2-3 day integration, zero patron data logging, WCAG 2.2 AA certified"

**3. Reference Librarians (End users, influencers)**
- Demographics: Frontline staff, often part-time, experiencing burnout
- Pain points: Time pressure, repetitive questions, lack of respect
- Values: Ease of use, augmentation (not replacement), patron service quality
- Decision criteria: Workflow improvement, accuracy, colleague testimonials
- Messaging angle: "Frees you for complex research by automating 'where's the bathroom' questions"

**4. Consortium Managers (High-value targets)**
- Represent 10-100+ libraries with single decision
- Balance diverse member needs (urban/rural, large/small)
- Negotiate volume pricing, standardized implementations
- Messaging angle: "30-40% consortium discounts, flexible tiers for varied members"

### Library Workforce Context (Pain Points)

**Demographics:**
- 186,500 librarians employed in US
- 75% are age 40+, average 47 years old
- 82-89% female, 84% white (diversity challenge)
- 54% hold master's degrees or higher
- 52% are career changers (often from teaching)

**Job satisfaction declining:**
- From 70% satisfied (2012) to 56% satisfied (2022)
- Top dissatisfactions: Low salary (73% feel underpaid vs. comparable professions)
- Insufficient staffing (most common challenge: "lack of time to do everything")
- Lack of respect/recognition (especially school librarians)
- 77% would choose career again (mission-driven despite conditions)

**Technology expectations:**
- Expected to be "more fluent in technology and social media" (19%)
- Assigned functions they're not trained for (16%)
- 88% offer digital literacy training despite gaps in their own skills
- High confidence with basics, low competence in data management, e-resources

**Work environment challenges:**
- School librarians: 42.9 hrs/week average, pulled from library duties
- Book challenges/censorship battles intensifying
- 38% voluntarily took on more responsibilities in past year
- 44% rate advancement opportunities as "poor"

**Key insight:** Librarians are overwhelmed, underpaid, and underappreciated, yet deeply committed to mission. Tools that save time and demonstrate respect for their expertise will resonate.

### Library Patron Context (Who We're Helping)

**Demographics:**
- 48% of Americans 16+ visited library in past year
- **Younger users dominate:** 55% of 16-29 year-olds visit annually (highest rate)
- Gender: 57% of women visit vs. lower male participation (72% of working mothers)
- Education: 59% of college graduates visit (libraries serve educated populations)
- Income: 50% of households earning <$30K visit (critical digital equity role)

**Usage patterns:**
- 64% borrow printed books (still #1 activity, down from 73% in 2012)
- 49% sit and read/study (libraries as "third spaces")
- 35% get help from librarians (down from 50% in 2012 - concerning trend)
- 29% use computers/internet/Wi-Fi (digital equity function)
- 27% attend classes/programs (up from 17% in 2015 - growing role)

**Digital behavior:**
- 30% of Americans read ebooks (up from 25% in 2019)
- 32% read only print books
- 33% read both print and digital
- 95% of libraries now offer ebooks/audiobooks
- Gen Z/Millennials prefer print but seek libraries as physical spaces

**Technology needs:**
- 95.3% of libraries offer digital literacy training
- 46.9% lend hotspot devices (up 14.4% from 2020)
- 29% operate digital navigator programs (one-on-one tech help)
- 23% of Americans use library computers/internet/Wi-Fi annually

**Key insight:** Libraries serve diverse populations (low-income + affluent, young + old) but younger users drive usage. They want physical spaces AND digital access. Discovery tools must serve both.

---

## Pricing Framework (Market-Validated)

### Competitive Pricing Context

**Market ranges:**
- Springshare LibGuides: $934-$2,209 annually (base product)
- Springshare full suite: $15K-$40K annually (multiple modules)
- Niche Academy: $48-$59 per staff member annually
- BiblioCommons: $30K-$100K annually (premium discovery layer)
- OverDrive Inspire Me: Bundled with subscription (~$8K-$35K estimated)

**Library software budget allocation:**
- Average tech budget: $408,100/year
- 33% for software beyond ILS = ~$135,000 available
- Libraries typically adopt 3-8 specialized SaaS products at $5K-$25K each

**Validated price ranges (from GTM strategy):**
- Starter: $5,995/year (small libraries, under 25K patrons)
- Professional: $14,995/year (mid-sized, 25K-75K patrons) - "sweet spot"
- Enterprise: $34,995/year (large, 75K-250K patrons)
- Strategic: $75K-$150K/year (multi-branch systems, 250K+ patrons)

### Product Bundle Decision (To Be Made)

**Option A: Bundle Pricing (Scout + Finch together)**
- Pros: Simpler messaging, higher perceived value, easier sales
- Cons: Higher price point may scare budget-conscious libraries
- Recommended tiers:
  - Starter: $7,995 (Scout + Finch Lite)
  - Professional: $18,995 (Scout + Finch Pro)
  - Enterprise: $39,995 (Scout + Finch Pro + Premium Support)
  - Strategic: $75K-$150K (Custom)

**Option B: Separate Pricing (Scout standalone, Finch add-on)**
- Pros: Lower entry point, phased adoption possible
- Cons: More complex sales, lower average contract value
- Scout standalone: $5,995 / $14,995 / $34,995
- Finch add-on: +$3,000 (Lite) / +$6,000 (Pro)

**Finch tier differentiation (if bundling):**
- **Finch Lite:** 2 librarian seats, basic onboarding content, email support
- **Finch Pro:** Unlimited seats, full knowledge base, priority support, custom training

### Beta/Pilot Pricing

**Free Beta Program (First 5-7 libraries):**
- 12-16 weeks free access to both products
- Intensive implementation support, direct product team access
- Conversion incentive: 25% off Year 1 OR 15% permanent discount for 3-year commit
- Target conversion: 60-70% (industry beta programs: 18-25%, ours should be higher)

**Paid Pilot (Next 15-20 libraries, post-beta):**
- 50% discount for 3-month trial
- Example: Professional tier $18,995/year → $4,749 for 3 months
- Full price after pilot or 30-day opt-out notice

**Founder's Pricing (First 50 customers):**
- 15% permanent discount for 3-year commitment
- Time-limited (available until June 2025 or first 50 customers)
- Creates urgency, rewards early adopters

### Payment Terms

**Standard:**
- Annual payment (10% discount vs. monthly)
- Net 60 (accommodates library procurement delays)
- PO acceptance required (government entities)

**Flexible options:**
- Quarterly billing (+5% vs. annual)
- Month-to-month for pilot conversions (transition to annual Year 2)
- Multi-year discounts: 5% for 2-year, 10% for 3-year

**Consortium discounts:**
- 30-40% discount for groups of 10+ libraries
- Shared implementation and training resources

### ROI Justification

**Value calculation for $18,995 Professional tier:**
- Staff time savings: 15 hrs/month × 12 months × $35/hr = $6,300
- Increased circulation: 5% lift on 100K checkouts × $3 per circ value = $15,000
- Program attendance: 200 additional attendees × $15 community value = $3,000
- **Total Year 1 value: $24,300** (exceeds cost)

**Community ROI studies:**
- Texas/Colorado: $4-6 community return per $1 of library funding
- Scout amplifies existing collection investments ($50K-$200K OverDrive/databases)
- 20-30% of digital content goes undiscovered - Scout surfaces hidden value

### Grant Funding Opportunities

**LSTA Grants ($160M+ distributed annually):**
- Libraries can include Scout subscription in LSTA applications
- Position as: Accessibility innovation, digital equity, collection optimization
- Many states: $5K-$30K grants available (California, Massachusetts, North Carolina)

**IMLS National Leadership Grants ($100K-$500K):**
- Pilot program as "research collaboration" demonstrating replicability
- September deadline for preliminary proposals
- Can fund free access during pilot, then convert to paid Year 2

**Strategy:**
- Target 8-10 states with strong library tech funding Year 1
- Help 3-5 libraries per state write applications including Scout
- Distributed approach builds national presence
- Libraries use grant dollars to pilot, transition to operational budgets for renewals

---

## Outreach Best Practices & Benchmarks

### Library Sales Funnel (Realistic Expectations)

**Conversion funnel from GTM strategy:**
- 1,000 cold emails → 250 opens (25% rate, education sector average 47%)
- 250 opens → 30 responses (3% reply rate, target 3-7%)
- 30 responses → 15 demo meetings (50% scheduling rate)
- 15 demos → 5 pilot programs (35% demo-to-pilot conversion)
- 5 pilots → 2-3 paying customers (50% pilot-to-paid, achievable with strong support)

**Key insight:** Acquiring one customer requires ~300-350 cold outreach touches. At $15K average contract value, CAC of $8K-$12K Year 1 is sustainable with 90-95% retention.

**Critical success factor:** Pilot-to-paid conversion at 60%+ (vs. 18-25% B2B SaaS average) through intensive support and documented metrics.

### Library Procurement Cycle

**Timeline: 6-18 months from awareness to signed contract**

**Fiscal year calendar (most US public libraries):**
- July 1-June 30 fiscal year (some follow federal Oct 1 or calendar year)
- **Prime selling season: January-March** (budget planning for next FY)
- RFPs release Q3 (Jan-Mar), proposals due Q4 (Apr-Jun)
- Board approvals: Apr-Jun for July 1 activations

**Outreach cadence aligned to budget cycle:**
- **Sept-Dec:** Relationship-building (webinars, conferences, thought leadership)
- **Jan-Mar:** Active selling (demo scheduling, pilot proposals, business case support)
- **Apr-Jun:** Closing (board presentations, contract negotiations, implementation planning)
- **Jul-Sept:** Onboarding (new FY implementations, quick-close budget availability)

**Critical:** Missing Jan-Mar window = waiting 12 months for next budget cycle.

### Effective Outreach Channels (Ranked by ROI)

**1. Email outreach (Highest ROI):**
- 36% B2B open rates, 7% response rates (personalized)
- Education sector: 47% open rates (above average)
- Best practices:
  - Subject lines: Reference peer library or specific pain point
  - Body: 100-125 words max
  - Lead with understanding their challenge, not product features
  - One peer proof point
  - Request 15-min call, not "demo" (lower commitment language)

**2. Library listservs (Credibility-building):**
- PUBLIB: 9,000+ public librarians worldwide
- State-level lists: Regional decision-makers
- Approach: Value-first (answer questions, share research, offer expertise)
- Ratio: 10 value-posts per 1 subtle self-reference
- Avoid explicit selling

**3. LinkedIn (Direct targeting):**
- Groups: ALA Think Tank, Library 2.0
- Sales Navigator: Filter by title (Technology Librarian, Library Director), library size
- Personalized connection requests mentioning conference/mutual contacts: 30% acceptance
- Generic requests: 10-15% acceptance
- Share case studies weekly, engage before connection requests

**4. Conferences (Concentrated networking):**
- ALA Annual (June): 7,000+ attendees, $30K-$50K investment
- PLA Conference (biennial, April 2026): 7,500 public library focus, $25K-$40K
- State associations: 500-1,500 regional decision-makers, $5K-$12K
- **Recommendation:** 2-3 state conferences Year 1, PLA Year 2 after building case studies

**5. Webinars (Virtual reach):**
- Partner with state library agencies for co-hosting (credibility + their channels)
- Topics: Educational, not sales ("WCAG 2.2 AA implementation", "Privacy-preserving AI")
- 50-200 attendees per session, $500-$2K cost
- Include 10-min product overview, majority content must provide standalone value
- Record and repurpose as gated lead gen content

### Messaging Best Practices (Conversation Design Principles)

**From Grice's Maxims (Conversation Design doc):**

**Quantity:** Provide exactly as much information as needed—no more, no less
- Keep emails to 100-125 words
- No more than 3-4 message bubbles per interaction
- Speech is transitory—users can't skim conversations

**Quality:** Be truthful and set accurate expectations
- Never invent capabilities or peer proof points
- Acknowledge limitations transparently
- Provide verified information from authoritative sources

**Relevance:** Optimize from user's perspective, not system's
- "Recent mysteries" means books published recently, not definition of mystery
- Understand context and intent, not just literal words
- Focus on their pain points, not our features

**Manner:** Communicate clearly in plain language
- No library jargon unless contextually appropriate
- Avoid ambiguous pronouns without clear referents
- Structure with new information at the end

**Application to cold emails:**
- Lead with their challenge, not our product
- Use peer library examples (social proof)
- Quantify outcomes (20-40% increase, 15 hours saved)
- Request low-commitment next step (15-min call)
- Make it easy to say yes (calendar link, one click)

---

## Decision Templates for Each Phase

### Task 1: Product Capabilities Document

**Decisions Drew needs to make:**

1. **Lead product positioning:**
   - [ ] Lead with Scout (patron-facing, easier to explain)?
   - [ ] Lead with Finch (staff-facing, addresses understaffing pain)?
   - [ ] Lead with bundle (comprehensive solution)?
   - **Recommendation:** Test all three in different campaigns, but default to Scout for cold outreach (patrons = universal pain point, staff tools = secondary sell)

2. **Strongest differentiators to emphasize:**
   - [ ] Privacy-first architecture (vs. OverDrive data concerns)
   - [ ] Accessibility leadership (WCAG 2.2 AA ahead of mandate)
   - [ ] Unified discovery (vs. fragmented search)
   - **Recommendation:** Rotate based on persona - Privacy for directors, Technical integration for tech librarians, Workflow for reference staff

3. **Proof points available:**
   - [ ] Can we name specific pilot libraries for social proof?
   - [ ] Or keep generic: "Working with 5 pilot libraries"?
   - [ ] Do we have quantified outcomes yet (35% circ increase)?
   - **Action:** Decide what's provable vs. aspirational

### Task 2: Target Library Lists

**Decisions Drew needs to make:**

1. **Geographic focus (choose 5-8 states for Tier 1):**
   - [ ] California (1,100+ libraries, strong LSTA funding $15.9M)
   - [ ] Texas (500+ libraries, large population)
   - [ ] Massachusetts (400+ via Mass Library System, $5K-$30K grants)
   - [ ] Colorado (strong digital equity focus)
   - [ ] North Carolina (mini-grants up to $2,500)
   - [ ] Pennsylvania (PALCI consortium, academic crossover)
   - [ ] New York (diverse urban/rural mix)
   - [ ] Illinois (Chicago Public + statewide reach)
   - **Recommendation:** Start with California, Massachusetts, Colorado, North Carolina, Texas (5 states, 2,000+ libraries, strong grant support)

2. **ILS system priority:**
   - [ ] Polaris only (704 libraries, best-documented API)
   - [ ] Koha only (1,653 libraries via ByWater, open source community)
   - [ ] Both Polaris + Koha (2,357 libraries, Phase 1 focus)
   - [ ] Add Sierra (thousands more, more complex)
   - **Recommendation:** Polaris + Koha for Phase 1 (proven integration, 2,357 addressable)

3. **List building budget:**
   - [ ] Approve $100-$180/month for email finding tools (Hunter.io, Apollo.io)?
   - [ ] Use free LinkedIn + manual research only?
   - [ ] Hire VA/intern for list building ($15-$25/hr)?
   - **Recommendation:** Invest in tools ($150/month) - saves 10+ hours/week of manual work

### Task 3: Pricing Strategy

**Decisions Drew needs to make:**

1. **Bundle vs. Separate pricing:**
   - [ ] Bundle Scout + Finch (simpler, higher perceived value)
   - [ ] Separate Scout standalone + Finch add-on (lower entry, phased adoption)
   - **Recommendation:** Bundle for launch simplicity, offer separate pricing only if requested

2. **Specific tier pricing (if bundling):**
   - [ ] Starter: $7,995? $8,995? $9,995?
   - [ ] Professional: $18,995? $19,995? $24,995?
   - [ ] Enterprise: $39,995? $44,995? $49,995?
   - **Recommendation:** $7,995 / $18,995 / $39,995 (clean numbers, Professional tier at $19K feels achievable)

3. **Beta incentive structure:**
   - [ ] 25% off Year 1 (Professional tier: $18,995 → $14,246)?
   - [ ] 15% permanent discount for 3-year lock ($16,146/year × 3)?
   - [ ] Free months instead of discount (e.g., 3 months free Year 1)?
   - **Recommendation:** Offer choice - appeals to different library budget preferences

4. **Founder's pricing cap:**
   - [ ] Time-limited: Available until June 2025?
   - [ ] Volume-limited: First 50 customers?
   - [ ] Both: Whichever comes first?
   - **Recommendation:** Both (creates urgency without arbitrary deadline)

### Task 4: Outreach Messaging

**Decisions Drew needs to make:**

1. **Campaign lead priority:**
   - [ ] Campaign A: Discovery pain point (Scout-led, fragmented search)
   - [ ] Campaign B: Staff capacity pain (Finch-led, understaffing)
   - [ ] Campaign C: Onboarding pain (Finch-led, training burden)
   - [ ] Campaign D: Bundle pitch (comprehensive solution)
   - **Recommendation:** Test all four, but lead with Campaign A (discovery = universal pain, 75% of patrons can't find materials)

2. **Demo format:**
   - [ ] Drew delivers all demos personally?
   - [ ] Record pre-recorded demo (scalable but impersonal)?
   - [ ] Hybrid: Pre-recorded for initial interest, live for qualified leads?
   - **Recommendation:** Hybrid - use 2-min video in emails, live demos for serious prospects

3. **Email tool selection:**
   - [ ] HubSpot free tier (up to 2,000 emails/month, good CRM)
   - [ ] Mailchimp (better for simple campaigns, familiar)
   - [ ] Lemlist/Woodpecker (better personalization, $50/month)
   - **Recommendation:** Start HubSpot free (CRM + email + scheduling in one tool)

4. **Outreach volume:**
   - [ ] Conservative: 50 emails/week (avoid spam flags, highly personalized)
   - [ ] Moderate: 100 emails/week (balance scale and personalization)
   - [ ] Aggressive: 200 emails/week (maximize reach, less personal)
   - **Recommendation:** Start 50/week for 4 weeks (200 Tier 1 targets), scale to 100/week if no spam issues

5. **Calendar tool:**
   - [ ] Calendly (free tier, easy setup, 1 event type)
   - [ ] Cal.com (open source, self-hosted, unlimited)
   - [ ] Google Calendar appointment slots (free, integrated)
   - **Recommendation:** Calendly free tier (professional appearance, easy for prospects)

---

## Success Metrics & Benchmarks

### Email Campaign Metrics (Track Weekly)

**Open rates:**
- Target: 36%+ (B2B average)
- Education sector: 47% (our market)
- Below 20%: Test subject lines

**Response rates:**
- Target: 3-7% (qualified responses, not auto-replies)
- Below 3%: Test body copy, shorten messages

**Demo booking rate:**
- Target: 15-20% of responses
- If low: Test demo length (15 min vs. 45 min), ease of scheduling

**Demo show rate:**
- Target: 80%+ (20% no-show acceptable)
- If high no-show: Send reminder emails, text reminders day-before

**Demo-to-pilot conversion:**
- Target: 30-40% (B2B SaaS standard)
- Our goal: 40%+ with strong qualification and follow-up

**Pilot-to-paid conversion:**
- Target: 60-70% (with intensive beta support)
- Industry average: 18-25% (we must beat this)

### Pipeline Velocity

**Lead-to-customer timeline:**
- Month 1: Initial outreach, demo bookings
- Month 2-3: Pilots begin, 12-16 week duration
- Month 4-6: Contract negotiations, board approvals
- **Total: 6-9 months** from first email to signed contract (shorter for budget-ready libraries)

**CAC targets:**
- Year 1: $8K-$12K per customer (includes sales salaries, tools, conferences)
- Year 2: $5K-$8K (referrals and organic inbound reduce cold outreach dependency)
- Year 3: $3K-$5K (mature sales process, consortium leverage)

**LTV calculation (3-year customer):**
- Professional tier: $18,995/year × 3 years × 90% retention = $51,286
- CAC: $8K-$12K
- **LTV:CAC ratio: 4-6x** (healthy SaaS benchmark is 3x+)

---

## Additional Context & Resources

### Competitive Intelligence Summary

**OverDrive Inspire Me (launched Aug 2025):**
- AI-powered ebook recommendations within OverDrive app
- Limited to OverDrive catalog only
- Faced librarian backlash on privacy despite 22-year trusted relationship
- Bundled with OverDrive subscription (pricing not disclosed, estimated $8K-$35K)
- **Our advantage:** Unified across ILS + OverDrive, privacy-first from day one

**Ex Libris Esploro/Leganto AI features:**
- Academic library focus, research management tools
- Database discovery, not catalog search
- Bundled with expensive enterprise platforms
- **Our advantage:** Public library focus, standalone pricing, catalog + digital unified

**EBSCO Discovery Service AI enhancements:**
- Database search optimization
- Limited to EBSCO content
- Academic/research library focus
- **Our advantage:** Public library materials, ILS integration, conversational UX

**BiblioCommons ($30K-$100K):**
- Premium discovery layer, catalog enhancement
- Proven circulation impact ("Where the Crawdads Sing" effect)
- No librarian-facing tools
- **Our advantage:** Patron + librarian dual tools, lower price point, AI-powered conversations

### Library Association Partnerships

**American Library Association (ALA):**
- Vendor membership: $750+ annually
- Access: Newsletter, member directory, partnership inquiries
- Conference: ALA Annual (June), PLA Conference (biennial, spring)
- Contact: www.ala.org/aboutala/contactus/partner

**Public Library Association (PLA):**
- Membership includes sponsorship opportunities
- Webinar proposal submissions (deadline October 31)
- Contact: plawebinars@ala.org

**State library associations:**
- Membership: $200-$500 each
- Benefits: Local credibility, conference access, member directories
- Priority states (based on Task 2 decision): CA, MA, CO, NC, TX

### Grant Application Resources

**IMLS National Leadership Grants:**
- Preliminary proposals due: September annually
- Phase II invitations: December
- Award amounts: $100K-$500K
- Focus: Implementation projects demonstrating replicability
- Contact: www.imls.gov/grants

**State LSTA Programs:**
- California: $15.9M annual budget, typically Jan-Apr deadlines
- Massachusetts: Impact Grants $5K-$30K, April deadline
- North Carolina: Mini-Grants up to $2,500, March deadline
- Strategy: Help 3-5 libraries per state write applications including Scout

### Privacy & Accessibility Compliance

**ALA Library Bill of Rights Article VII:**
- Patron privacy principles
- Zero-logging alignment
- Intellectual freedom protections

**FERPA (academic libraries):**
- 34 CFR Part 99
- Student educational records protection
- Scout positioned as "school official" with legitimate educational interest

**WCAG 2.2 AA Standards:**
- Web Content Accessibility Guidelines
- Reference: w3.org/WAI/WCAG22/quickref
- Scout compliance independently verified

**ADA Title II Final Rule (April 2024):**
- Federal Register Vol. 89, No. 74
- State/local government digital services must meet accessibility standards
- Timeline by population size: 2-3 years compliance deadline
- Libraries face litigation risk using non-compliant vendors

---

## Next Steps After Context Review

Once Claude Code reads this context package, it will:

1. **Extract and organize** product capabilities into sales-ready formats
2. **Build target lists** using the market intelligence and geographic priorities Drew selects
3. **Develop pricing strategy** following validated ranges and bundle/separate decision
4. **Write outreach messaging** using conversation design principles and persona-specific angles

**Each task will pause for Drew's review and decisions before proceeding to the next phase.**

---

**End of Context Package**