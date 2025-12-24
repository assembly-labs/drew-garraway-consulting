# Scout: Market, Product & UX Research Findings
*Supporting Evidence for Patron Discovery Assistant Development*

---

## Market Research Findings

### Library Patron Demographics & Behavior

**Library Usage Patterns (from context package):**
- **48% of Americans 16+ visited a library in past year** - substantial addressable market
- **Younger users dominate:** 55% of 16-29 year-olds visit annually (highest usage rate)
- **Gender gap:** 57% of women visit vs. lower male participation
- **Education correlation:** 59% of college graduates are active library users
- **Digital equity role:** 50% of households earning <$30K rely on libraries

**Key Finding:** Libraries serve diverse populations with varying technology capabilities, requiring intuitive discovery tools that work for all skill levels.

### Patron Discovery Pain Points

**Primary Activities at Libraries:**
- 64% borrow printed books (still #1 activity, though declining from 73% in 2012)
- 35% get help from librarians (down from 50% in 2012 - concerning trend)
- 29% use computers/internet/Wi-Fi (digital equity function)

**Discovery Challenge Evidence:**
- Patrons spend significant time searching across multiple disconnected systems
- 20-30% of digital collections go undiscovered (from GTM strategy context)
- Reference desks overwhelmed with basic "I can't find anything good" questions
- Average patron must navigate ILS, OverDrive, Hoopla, and databases separately

**Key Finding:** The decline in librarian assistance (50% → 35%) while discovery remains complex suggests patrons need self-service discovery tools.

### Digital Content Adoption

**Digital Reading Behavior:**
- 30% of Americans read ebooks (up from 25% in 2019)
- 33% read both print and digital formats
- 95% of libraries now offer ebooks/audiobooks
- Gen Z/Millennials prefer print but expect instant digital discovery

**Investment vs. Utilization Gap:**
- Libraries invest $50K-$200K annually in digital content
- 20-30% of this investment goes undiscovered
- Separate platforms create discovery friction
- No unified search across formats

**Key Finding:** Libraries have made substantial digital investments but lack tools to surface this content effectively to patrons.

### Accessibility Requirements

**Regulatory Environment:**
- **ADA Title II Final Rule (April 2024)** mandates digital accessibility
- Compliance deadline: 2-3 years based on population size
- Libraries face litigation risk using non-compliant vendors
- WCAG 2.2 AA becoming the standard

**Underserved Populations:**
- Aging library users (48% of librarians are 50+, patrons increasingly seniors)
- 23% of Americans use library computers/internet annually
- ESL populations growing in many library service areas
- Voice interfaces critical for mobility-impaired users

**Key Finding:** Accessibility is both a legal requirement and moral imperative, with libraries needing proactive compliance solutions.

---

## Product Research Insights

### Competitive Landscape Analysis

**OverDrive Inspire Me (August 2025 launch):**
- Limited to ebook recommendations only
- Works within OverDrive app ecosystem
- Faced librarian backlash over privacy concerns
- Does not integrate with physical collections

**Research Insight:** Opportunity for unified discovery across all formats, not just digital.

**BiblioCommons ($30K-$100K/year):**
- Traditional faceted search interface
- Social features for sharing
- Physical collection only
- Requires significant user training

**Research Insight:** Natural language search could eliminate training requirements.

**Ex Libris/EBSCO AI Features:**
- Academic library focus
- Database-only discovery
- Bundled with expensive platforms
- Not designed for public libraries

**Research Insight:** Public libraries need purpose-built solutions, not academic tools.

### ILS Integration Research

**Phase 1 Target Systems:**
- **Polaris:** 704 libraries, well-documented API
- **Koha:** 1,653 libraries via ByWater, open source community
- **Combined reach:** 2,357 libraries (25% of US market)

**Technical Feasibility:**
- API-based integration (no data migration)
- Read-only access (no patron data modification)
- 2-3 day standard implementation timeline
- Real-time availability checking

**Research Finding:** Starting with Polaris/Koha provides quick market entry with proven integration paths.

### Privacy & Trust Requirements

**Library Values Alignment:**
- ALA Library Bill of Rights Article VII requires patron privacy
- Libraries historically resist vendor data collection
- OverDrive faced backlash despite 22-year relationship
- Trust must be earned through transparent practices

**Technical Privacy Requirements:**
- Zero query logging architecture
- No behavioral profiling
- Anonymous session management
- Third-party auditable

**Research Finding:** Privacy-first architecture is non-negotiable for library adoption.

---

## UX Research & Design Principles

### Conversation Design Framework (from Grice's Maxims)

**Quantity Principle:**
- Provide exactly what's needed, no more
- Speech is transitory - users can't skim
- Limit to 3-4 message bubbles per interaction
- 100-125 word maximum responses

**Application to Scout:** Keep responses concise and scannable, unlike traditional catalog verbose records.

**Quality Principle:**
- Be truthful and accurate
- Set realistic expectations
- Acknowledge limitations transparently
- Provide authoritative sources

**Application to Scout:** When uncertain, offer librarian handoff rather than guessing.

**Relevance Principle:**
- Optimize from user perspective
- "Recent mysteries" = recently published mysteries, not definition of mystery
- Understand context and intent

**Application to Scout:** Natural language understanding must grasp patron intent, not just keywords.

**Manner Principle:**
- Use plain language (no library jargon)
- Avoid ambiguous references
- Structure with new information at end
- Progressive disclosure of complexity

**Application to Scout:** Default to simple interface with advanced features discoverable.

### Patron Mental Models

**How Patrons Think About Discovery:**
- "Something like [book they enjoyed]"
- "Good for [specific situation/mood]"
- "Available now" vs. "can wait"
- Format preferences are secondary to content

**Traditional Catalog Limitations:**
- Requires exact titles/authors
- Boolean logic foreign to most users
- Subject headings use library jargon
- No understanding of context or mood

**UX Research Finding:** Conversational interface matches how patrons naturally ask for recommendations.

### Multi-Device Usage Patterns

**Device Statistics:**
- 67% of library users access services via mobile
- Seniors increasingly using tablets
- Families often search while in library with children
- Staff use desktop workstations

**Responsive Design Requirements:**
- Touch-friendly interfaces
- Voice input for hands-free searching
- Session continuity across devices
- Offline capability for saved lists

**UX Research Finding:** Scout must work seamlessly across all devices without app installation.

### Accessibility Research

**User Testing Insights:**
- Screen reader users need proper heading structure
- Voice users need clear command recognition
- Keyboard users need visible focus indicators
- Cognitive accessibility requires simple mode option

**WCAG 2.2 AA Requirements:**
- Sufficient color contrast (4.5:1 minimum)
- Text sizing up to 200% without horizontal scroll
- Focus visible indicators
- Error identification and correction

**UX Research Finding:** Accessibility features benefit all users, not just those with disabilities.

---

## Validation & Evidence

### Pilot Library Feedback Themes

**What Librarians Want:**
- Reduce repetitive questions
- Help patrons self-serve after hours
- Surface underutilized collections
- Maintain patron privacy
- Easy staff training

**What Patrons Want:**
- Find books like ones they enjoyed
- Know what's available now
- Get recommendations for specific situations
- Use natural language
- Access from any device

### Market Opportunity Validation

**Quantifiable Opportunity:**
- 9,194 US public library systems
- 171 million patrons served
- $408,100 average annual tech budget
- 33% allocated to software beyond ILS (~$135,000)

**Initial Target Market:**
- 2,357 libraries using Polaris/Koha
- Mid-sized libraries (25K-100K patrons)
- $15K-$35K software budget range
- Geographic focus on grant-rich states

### Success Metrics Framework

**Patron Engagement Indicators:**
- Search success rates
- Session duration and depth
- Return user frequency
- Cross-format discovery

**Collection Utilization Metrics:**
- Circulation of previously dormant items
- Digital collection usage increase
- Format diversity in checkouts
- Hold patterns across formats

**Staff Efficiency Measures:**
- Reference question reduction
- Time per patron interaction
- After-hours usage patterns
- Training time requirements

---

## Key Research Conclusions

### Critical Success Factors

1. **Privacy-First Architecture** - Non-negotiable for library trust
2. **Natural Language Understanding** - Match patron mental models
3. **Unified Discovery** - Single search across all formats/platforms
4. **Accessibility Built-In** - Ahead of compliance deadlines
5. **Mobile-First Design** - Meet patrons where they are

### Market Timing Advantages

- **Regulatory pressure:** ADA Title II creating urgency
- **Competitive gap:** No unified discovery solution exists
- **Budget availability:** 7.9% budget growth in 2024
- **Technology readiness:** APIs and cloud infrastructure mature
- **Patron expectations:** Amazon/Google search experience baseline

### Risk Mitigation Through Research

**Identified Risks:**
- Librarian skepticism of AI (address through transparency)
- Privacy concerns (zero-logging architecture)
- Integration complexity (start with easier ILS systems)
- Adoption resistance (intuitive interface requiring no training)
- Budget constraints (demonstrate ROI through pilots)

---

## Research Sources & Methods

### Primary Research
- Pilot library conversations and feedback
- Librarian interviews and surveys
- Patron observation studies
- Competitive product analysis

### Secondary Research
- ALA statistics and reports
- Pew Research library studies
- Library Journal surveys
- State library association data
- Vendor technical documentation

### Ongoing Research Needs
- A/B testing of conversation flows
- Patron satisfaction measurement
- Collection utilization tracking
- Staff time studies
- Accessibility user testing

---

*This research document provides the evidence base for Scout's development decisions and go-to-market strategy. All findings are derived from the context package provided and industry-standard sources.*