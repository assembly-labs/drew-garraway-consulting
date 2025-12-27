# Product Requirements Document (PRD)
## CAP - Championship Athletic Prospects
### Youth Sports Trading Card Platform

**Version:** 1.0 MVP Release  
**Date:** October 2025  
**Status:** Ready for Development  

---

## 1. Executive Summary

### 1.1 Product Vision
CAP is an AI-powered platform that enables parents, coaches, and professional photographers to create custom youth sports trading cards in under 5 minutes, addressing a $600M-$1.5B market opportunity with no dominant integrated player.

### 1.2 MVP Objectives
- Launch dual-tier platform supporting both DIY parents and professional photographers
- Achieve 100 teams served within 6 months
- Validate unit economics: $139 profit per team average
- Establish Greater Philadelphia beachhead market
- 5-7 day delivery with 65% net margin

### 1.3 Success Criteria
- 35-40% parent conversion rate
- <10 minute time to first card creation
- NPS score >50
- 5-7 day order fulfillment
- 65% net margin
- <3% defect rate

---

## 2. User Stories & Requirements

### 2.1 Core User Types

#### Parent/Coach (DIY Tier)
**Primary Journey:** Upload phone photos → AI enhancement → Template selection → Order cards
- Mobile-first experience
- Social media integration
- Instant digital downloads

#### Photographer (Semi-Pro Tier) 
**Primary Journey:** Batch upload → Auto-tagging → Gallery creation → Parent ordering
- Professional workflow tools
- Automated payments via Stripe Connect
- Session management dashboard

### 2.2 Epic 1: User Management

**US-1.1: Account Creation**
```
As a parent
I want to sign up with email or social auth
So that I can start creating cards immediately

Acceptance Criteria:
- Email/password registration with validation
- Google OAuth integration
- Facebook OAuth integration  
- Role selection (Parent/Coach/Photographer)
- Email verification flow
- Password reset capability
- Mobile-optimized forms
```

**US-1.2: Profile Management**
```
As a user
I want to manage my profile and preferences
So that I can maintain multiple teams and settings

Acceptance Criteria:
- Edit name, email, phone
- Manage multiple teams
- Set notification preferences
- View order history
- Manage saved payment methods
- Download past designs
```

### 2.3 Epic 2: Team Management

**US-2.1: Team Creation**
```
As a coach
I want to create a team with roster
So that I can organize card creation

Acceptance Criteria:
- Team name, sport type, age group
- Team colors (primary/secondary)
- Logo upload (optional, max 5MB)
- Season/year tracking
- Team sharing via invite link
- Privacy settings (public/private)
```

**US-2.2: Roster Management**
```
As a team admin
I want to manage player information
So that cards have accurate data

Acceptance Criteria:
- Add/edit/remove players
- Player fields: first name, number, position
- Bulk import via CSV
- Photo assignment to players
- Stats tracking (goals, assists, etc.)
- Player status (active/inactive)
- Drag-to-reorder functionality
```

### 2.4 Epic 3: Photo Management

**US-3.1: Photo Upload (DIY)**
```
As a parent
I want to upload photos from my phone
So that I can create cards quickly

Acceptance Criteria:
- Bulk upload (up to 100 photos)
- Drag-drop on desktop
- Mobile camera roll integration
- Progress indicators with cancel
- Automatic photo quality scoring
- File types: JPG, PNG, HEIC
- Max 10MB per photo
```

**US-3.2: AI Enhancement**
```
As a user
I want my photos automatically enhanced
So that cards look professional

Acceptance Criteria:
- Automatic background removal
- Face detection and smart cropping
- Color/exposure correction
- Sharpness enhancement
- Before/after preview toggle
- Manual override options
- Batch processing status
```

**US-3.3: Photographer Batch Upload**
```
As a photographer
I want to upload entire sessions
So that I can process teams efficiently

Acceptance Criteria:
- Upload 500+ photos per session
- RAW file support (CR2, NEF, ARW)
- Auto-detect jersey numbers
- Batch processing queue
- Session organization by date/team
- Gallery preview before publishing
- Lightroom plugin (future)
```

### 2.5 Epic 4: Card Design

**US-4.1: Template Selection**
```
As a user
I want to choose from professional templates
So that cards match my team's style

Acceptance Criteria:
- 30+ sport-specific templates at launch
- Filter by: sport, style, age group, colors
- Animated preview on hover
- Favorite templates feature
- Recently used section
- Template categories: Classic, Modern, Premium
```

**US-4.2: Design Customization**
```
As a user
I want to customize card designs
So that they're unique to my team

Acceptance Criteria:
- Edit text (fonts, sizes, colors)
- Adjust photo crop/position
- Change background colors/gradients
- Add/remove design elements
- Team logo placement options
- Front and back card editing
- Real-time preview updates
- Undo/redo functionality
```

**US-4.3: AI Content Generation**
```
As a user
I want AI to generate player content
So that I don't have to write bios

Acceptance Criteria:
- Generate 2-sentence player bios
- Create team slogans/mottos
- Format statistics appropriately
- Suggest hashtags for social
- Age-appropriate language
- Edit AI-generated content
- Regenerate options
```

### 2.6 Epic 5: Ordering & Payment

**US-5.1: Cart Management**
```
As a customer
I want to review my order
So that I can ensure accuracy

Acceptance Criteria:
- Preview all cards (3D flip animation)
- Select quantities: 8/16/24/48 packs
- Card stock options: Standard/Premium
- Apply promo codes
- Price breakdown with taxes
- Save cart for later (7 days)
- Share cart with spouse/co-parent
```

**US-5.2: Checkout Process**
```
As a customer
I want to complete purchase easily
So that I can receive cards quickly

Acceptance Criteria:
- Stripe Elements integration
- Apple Pay/Google Pay
- Saved payment methods
- Billing/shipping addresses
- Delivery: Standard (5-7 days) / Rush (2-3 days)
- Order confirmation email
- SMS tracking updates (optional)
```

**US-5.3: Photographer Payouts**
```
As a photographer
I want to receive earnings automatically
So that I'm compensated promptly

Acceptance Criteria:
- Stripe Connect onboarding
- Earnings dashboard with charts
- Weekly automatic payouts
- Transaction history export
- Tax document generation (1099)
- Instant payout option (1% fee)
```

### 2.7 Epic 6: Gallery & Sharing

**US-6.1: Parent Gallery Access**
```
As a parent
I want to view photographer galleries
So that I can select photos for cards

Acceptance Criteria:
- Access via email link (no login required)
- Browse session photos in grid
- Lightbox view with zoom
- Mark favorites for cards
- Purchase digital downloads
- Auto-expire after 30 days
```

**US-6.2: Social Sharing**
```
As a user
I want to share cards digitally
So that family can see them

Acceptance Criteria:
- Generate Instagram/Facebook graphics
- TikTok video export (future)
- Create shareable gallery link
- Download high-res versions
- Watermark options
- QR code generation (links to stats)
```

---

## 3. Technical Architecture

### 3.1 Technology Stack

**Frontend:**
```javascript
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- React Hook Form + Zod
- Netlify hosting
- PWA with offline support
```

**Backend:**
```javascript
- Supabase (PostgreSQL)
- Supabase Auth (JWT)
- Supabase Storage (3GB per team)
- Supabase Realtime (order updates)
- Netlify Functions (serverless)
- Edge Functions (image optimization)
```

**Third-Party APIs:**
```javascript
- Stripe (payments + connect)
- Claude API (content generation)
- Replicate API (background removal)
- SendGrid (transactional email)
- GotPrint API (fulfillment)
- Twilio (SMS notifications)
```

### 3.2 Database Schema

```sql
-- Core Tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('parent', 'coach', 'photographer', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  season VARCHAR(50),
  colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#FFFFFF"}',
  logo_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  number VARCHAR(10),
  position VARCHAR(50),
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id),
  original_url TEXT NOT NULL,
  enhanced_url TEXT,
  thumbnail_url TEXT,
  quality_score DECIMAL(3,2),
  ai_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE card_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  template_id VARCHAR(50) NOT NULL,
  design_data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  design_id UUID REFERENCES card_designs(id),
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE photo_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photographer_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  gallery_url VARCHAR(255) UNIQUE,
  photo_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'uploading',
  earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_teams_owner ON teams(owner_id);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_photos_player ON photos(player_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_sessions_photographer ON photo_sessions(photographer_id);
```

### 3.3 API Specification

#### Authentication Endpoints
```typescript
POST   /api/auth/signup
POST   /api/auth/login  
POST   /api/auth/logout
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/session
```

#### Team Management
```typescript
GET    /api/teams                    // List user's teams
POST   /api/teams                    // Create team
GET    /api/teams/:id                // Get team details
PUT    /api/teams/:id                // Update team
DELETE /api/teams/:id                // Delete team
POST   /api/teams/:id/invite         // Generate invite link
```

#### Player Management  
```typescript
GET    /api/teams/:teamId/players    // List players
POST   /api/teams/:teamId/players    // Add player
PUT    /api/players/:id              // Update player
DELETE /api/players/:id              // Remove player
POST   /api/teams/:teamId/import     // CSV import
```

#### Photo Operations
```typescript
POST   /api/photos/upload             // Upload photos
POST   /api/photos/enhance            // AI enhancement
GET    /api/photos/:id                // Get photo
DELETE /api/photos/:id                // Delete photo
POST   /api/photos/batch-assign       // Assign to players
```

#### Card Design
```typescript
GET    /api/templates                 // List templates
GET    /api/templates/:id             // Get template
POST   /api/cards                     // Create design
PUT    /api/cards/:id                 // Update design
GET    /api/cards/:id/preview         // Generate preview
POST   /api/cards/:id/generate-bio    // AI bio generation
```

#### Orders & Payments
```typescript
POST   /api/orders                    // Create order
GET    /api/orders/:id                // Get order
GET    /api/orders                    // List orders
POST   /api/orders/:id/checkout       // Process payment
GET    /api/orders/:id/status         // Check status
```

#### Photographer Features
```typescript
POST   /api/sessions                  // Create session
POST   /api/sessions/:id/upload       // Upload photos
PUT    /api/sessions/:id/publish      // Publish gallery
GET    /api/sessions/:id/analytics    // View analytics
GET    /api/photographer/earnings     // Earnings report
POST   /api/photographer/payout       // Request payout
```

### 3.4 AI Integration Details

#### Background Removal Pipeline
```javascript
// Using Replicate API
const removeBackground = async (imageUrl: string) => {
  const output = await replicate.run(
    "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
    {
      input: {
        image: imageUrl,
        model: "u2net",
        return_mask: false,
        alpha_matting: true,
        alpha_matting_foreground_threshold: 240,
        alpha_matting_background_threshold: 50,
        alpha_matting_erode_size: 10
      }
    }
  );
  return output;
};
```

#### Content Generation
```javascript
// Using Claude API
const generatePlayerBio = async (player: Player) => {
  const prompt = `
    Generate a 2-sentence trading card bio for a youth athlete:
    Name: ${player.name}
    Age Group: ${player.ageGroup}
    Position: ${player.position}
    Key Stats: ${JSON.stringify(player.stats)}
    
    Guidelines:
    - Make it inspiring and confidence-building
    - Age-appropriate language
    - Focus on potential and team contribution
    - Avoid comparisons to professional players
  `;
  
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 150,
    messages: [{ role: "user", content: prompt }]
  });
  
  return response.content[0].text;
};
```

---

## 4. User Interface Specifications

### 4.1 Design System

**Brand Colors:**
```css
--primary: #FFD700;      /* Gold */
--secondary: #1E40AF;    /* Blue */
--accent: #DC2626;       /* Red */
--success: #059669;      /* Green */
--background: #FFFFFF;
--text: #111827;
```

**Typography:**
```css
--font-ui: 'Inter', system-ui, sans-serif;
--font-display: 'Bebas Neue', sans-serif;
--font-card: 'Graduate', serif;
```

### 4.2 Responsive Breakpoints
```css
/* Mobile First */
sm: 640px   /* Tablet */
md: 768px   /* Small Desktop */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

### 4.3 Key Screen Specifications

#### Dashboard (Mobile)
```
┌─────────────────────────┐
│  CAP    👤 Profile      │ Header
├─────────────────────────┤
│                         │
│  [Create New Cards]     │ Hero CTA
│                         │
├─────────────────────────┤
│  My Teams               │
│  ┌──────┐ ┌──────┐      │ Carousel
│  │Team 1│ │Team 2│ →    │
│  └──────┘ └──────┘      │
├─────────────────────────┤
│  Recent Orders          │
│  ┌─────────────────┐    │
│  │ Order #1234     │    │
│  │ Status: Shipped │    │
│  └─────────────────┘    │
├─────────────────────────┤
│  Quick Actions          │
│  [📸] [🎨] [📦] [👥]    │ Grid
└─────────────────────────┘
```

#### Photo Upload Flow
```
Step 1: Upload
┌─────────────────────────┐
│  ← Back   Upload Photos │
├─────────────────────────┤
│                         │
│    📷                   │
│    Tap to upload        │
│    or take photo        │
│                         │
│  [Camera] [Gallery]     │
└─────────────────────────┘

Step 2: Enhancement
┌─────────────────────────┐
│  AI Enhancing...        │
├─────────────────────────┤
│  ▓▓▓▓▓░░░░░ 50%        │
│                         │
│  • Removing background  │
│  • Enhancing colors     │
│  • Detecting faces      │
└─────────────────────────┘

Step 3: Assignment
┌─────────────────────────┐
│  Assign to Players      │
├─────────────────────────┤
│  ┌───┐ → Jake #10      │
│  │📷 │                  │
│  └───┘                  │
│  ┌───┐ → Sarah #7      │
│  │📷 │                  │
│  └───┘                  │
│         [Continue]      │
└─────────────────────────┘
```

#### Card Designer
```
┌─────────────────────────┐
│  ← Design Your Cards    │
├─────────────────────────┤
│  ┌─────────────────┐    │
│  │                 │    │ Canvas
│  │   Card Preview  │    │
│  │                 │    │
│  └─────────────────┘    │
│     [Flip Card]         │
├─────────────────────────┤
│  Templates              │
│  [T1] [T2] [T3] →      │ Swipeable
├─────────────────────────┤
│  Customize              │
│  • Colors              │
│  • Text                │
│  • Layout              │
│         [Order Cards]   │
└─────────────────────────┘
```

### 4.4 Mobile Interactions
- Swipe gestures for template browsing
- Pinch-to-zoom on card previews  
- Pull-to-refresh on dashboard
- Bottom sheet for editing tools
- Haptic feedback on actions
- Native share sheets

---

## 5. Business Rules & Workflows

### 5.1 Order Processing

```mermaid
graph LR
    A[Order Placed] --> B[Payment Captured]
    B --> C[Design Validation]
    C --> D[Print Files Generated]
    D --> E[Quality Check]
    E --> F[Send to GotPrint]
    F --> G[Production 2-4 days]
    G --> H[Shipping 1-3 days]
    H --> I[Delivered]
    I --> J[Follow-up Email]
```

### 5.2 Pricing Structure

| Tier | Session Fee | Per Pack | Cards | Margin |
|------|------------|----------|-------|--------|
| DIY | $0 | $28 | 8 | 72% |
| Semi-Pro | $75 | $28 | 8 | 58% |
| Premium | $150 | $48 | 12 | 49% |

**Discounts:**
- Team bulk (10+ orders): 15% off
- Multi-sport: 20% off 2nd sport
- Referral: 20% off for both parties
- Early bird (within 48hr): 10% off

### 5.3 Photographer Economics
```
Session Revenue Breakdown:
- Session Fee: $75
  - Photographer: $50 (67%)
  - Platform: $25 (33%)
  
- Card Sales: $28 per pack
  - Platform: 100%
  
- Weekly payout via Stripe Connect
- 1099 tax forms generated annually
```

### 5.4 Quality Control Rules
- Photos <300 DPI: Warning shown
- Blurry photos (score <60): Auto-reject
- Missing player photos: Block checkout
- Profanity in text: Auto-flag for review
- Copyright images: AI detection + manual review

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal:** Core infrastructure and auth

- [ ] Netlify deployment pipeline
- [ ] Supabase project setup
- [ ] Database schema creation
- [ ] Authentication flow (email + OAuth)
- [ ] Basic team CRUD operations
- [ ] File upload to Supabase Storage

**Deliverable:** Users can sign up and create teams

### Phase 2: Photo Pipeline (Weeks 3-4)
**Goal:** Complete photo workflow

- [ ] Bulk photo upload interface
- [ ] Replicate API integration
- [ ] Background removal processing
- [ ] Photo quality scoring
- [ ] Player assignment UI
- [ ] Image CDN setup

**Deliverable:** Users can upload and enhance photos

### Phase 3: Card Creation (Weeks 5-6)
**Goal:** Design and customization

- [ ] Template system (10 templates)
- [ ] Canvas rendering engine
- [ ] Text editing tools
- [ ] Color customization
- [ ] AI bio generation (Claude API)
- [ ] Print file generation

**Deliverable:** Users can design complete cards

### Phase 4: Commerce (Weeks 7-8)
**Goal:** Payment and fulfillment

- [ ] Stripe Checkout integration
- [ ] Cart functionality
- [ ] Order management system
- [ ] GotPrint API integration
- [ ] Email notifications (SendGrid)
- [ ] Order tracking page

**Deliverable:** Users can purchase cards

### Phase 5: Photographer Features (Weeks 9-10)
**Goal:** Professional tier

- [ ] Photographer onboarding flow
- [ ] Session management dashboard
- [ ] Batch upload interface (500+ photos)
- [ ] Gallery generation
- [ ] Parent access portal
- [ ] Stripe Connect integration

**Deliverable:** Photographers can offer services

### Phase 6: Polish & Launch (Weeks 11-12)
**Goal:** Production ready

- [ ] 20 additional templates (30 total)
- [ ] Performance optimization
- [ ] Mobile PWA features
- [ ] Analytics implementation
- [ ] Load testing
- [ ] Security audit
- [ ] Launch marketing site

**Deliverable:** Public launch

---

## 7. Success Metrics

### 7.1 Funnel Metrics

| Stage | Target | Measurement |
|-------|--------|-------------|
| Landing → Signup | 15% | Google Analytics |
| Signup → Team Created | 60% | Supabase |
| Team → Photos Uploaded | 70% | Custom Events |
| Photos → Design Started | 80% | Amplitude |
| Design → Checkout | 50% | Stripe |
| Checkout → Order | 85% | Stripe |
| **Overall Conversion** | **3.2%** | Combined |

### 7.2 Operational KPIs

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Time to First Card | <10 min | >15 min |
| AI Processing Time | <30 sec | >60 sec |
| Order Fulfillment | 5-7 days | >10 days |
| Customer Tickets | <5% orders | >10% |
| Print Defects | <3% | >5% |
| NPS Score | 50+ | <40 |

### 7.3 Business Metrics

| Timeline | Teams | Revenue | Profit |
|----------|-------|---------|--------|
| Month 1 | 10 | $1,800 | $1,170 |
| Month 3 | 50 | $9,000 | $5,850 |
| Month 6 | 100 | $18,000 | $11,700 |
| Year 1 | 600 | $108,000 | $70,200 |

**Unit Economics:**
- Average Order Value: $150-180
- Customer Acquisition Cost: <$35
- Lifetime Value: $450+
- LTV/CAC Ratio: >8:1

---

## 8. Risks & Mitigations

### 8.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Photo quality issues | High | Medium | AI scoring + guidelines |
| Scaling bottlenecks | High | Medium | CDN + caching strategy |
| API rate limits | Medium | High | Queue system + fallbacks |
| Print vendor failure | High | Low | 3 vendor relationships |

### 8.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low conversion | High | Medium | A/B testing + iteration |
| Seasonal demand | Medium | High | Multi-sport support |
| Competition entry | Medium | Medium | Fast execution + moat |
| CAC too high | High | Medium | Referral program |

### 8.3 Operational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Support overload | Medium | Medium | FAQ + chatbot |
| Fulfillment delays | High | Low | Multiple vendors |
| Quality complaints | High | Medium | QC process |
| Photographer churn | Medium | Medium | Guaranteed minimums |

---

## 9. Security & Compliance

### 9.1 Requirements

**Data Protection:**
- PCI DSS compliance via Stripe
- SSL/TLS for all connections
- Encryption at rest (Supabase)
- GDPR-ready architecture
- CCPA compliance

**Youth Protection:**
- No personal info for minors
- Parental consent flows
- Auto-delete after 90 days
- No social features for kids
- Content moderation

**Image Rights:**
- Terms of service consent
- Photographer agreements
- Model releases (optional)
- DMCA process

### 9.2 Security Measures

```javascript
// Row Level Security (RLS) Example
CREATE POLICY "Users can only see own teams"
  ON teams FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can only edit own teams"  
  ON teams FOR UPDATE
  USING (auth.uid() = owner_id);

// API Rate Limiting
const rateLimiter = {
  upload: "100 requests per hour",
  design: "500 requests per hour",
  order: "20 requests per hour"
};
```

---

## 10. Launch Criteria

### 10.1 MVP Must-Haves

- [x] User authentication working
- [x] Team creation and roster management
- [x] Photo upload with AI enhancement
- [x] 10 functional templates minimum
- [x] Complete checkout flow
- [x] Order tracking system
- [x] Email notifications
- [x] Basic photographer upload
- [x] Mobile responsive design
- [x] Load testing passed (100 concurrent users)

### 10.2 Launch Readiness Checklist

**Technical:**
- [ ] All critical bugs resolved
- [ ] Performance metrics met
- [ ] Security audit passed
- [ ] Backup systems tested
- [ ] Monitoring configured

**Business:**
- [ ] Pricing validated
- [ ] Support documentation ready
- [ ] Legal terms updated
- [ ] Payment processing live
- [ ] Fulfillment partner confirmed

**Marketing:**
- [ ] Landing page live
- [ ] Social accounts created
- [ ] Launch email list ready
- [ ] Press kit prepared
- [ ] Referral program active

### 10.3 Post-Launch Priorities

**Week 1-2:**
- Monitor conversion funnel
- Gather user feedback
- Fix critical issues
- Optimize performance

**Week 3-4:**
- Add requested templates
- Improve AI accuracy
- Launch referral program
- Begin league outreach

**Month 2:**
- Advanced customization
- Social sharing features
- Photographer recruiting
- Geographic expansion prep

---

## 11. Appendices

### A. Template Categories

**Sports Coverage:**
- Baseball/Softball (5 templates)
- Basketball (5 templates)
- Soccer (5 templates)
- Football (5 templates)
- Hockey (3 templates)
- Lacrosse (2 templates)
- Volleyball (2 templates)
- Multi-sport (3 templates)

### B. API Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/photos/upload | 100 | 1 hour |
| /api/photos/enhance | 200 | 1 hour |
| /api/cards/generate-bio | 50 | 1 hour |
| /api/orders | 20 | 1 hour |

### C. Email Templates

1. Welcome email
2. Team invite
3. Order confirmation
4. Shipping notification
5. Delivery confirmation
6. Review request
7. Referral invitation
8. Season reminder

### D. Error Codes

| Code | Message | User Action |
|------|---------|-------------|
| CAP-001 | Upload failed | Retry upload |
| CAP-002 | Enhancement failed | Contact support |
| CAP-003 | Payment declined | Update payment |
| CAP-004 | Out of stock | Select different option |
| CAP-005 | Session expired | Login again |

---

**Document Control:**
- Author: Product Team
- Review: Engineering, Design, Business
- Approval: CEO/Founder
- Next Review: Post-MVP Launch

**For Development Team:**
This PRD provides comprehensive specifications for implementing the CAP MVP. Prioritize Phase 1-4 for initial launch, with photographer features as fast-follow. Use Netlify Functions for all API endpoints and maintain mobile-first development approach throughout.