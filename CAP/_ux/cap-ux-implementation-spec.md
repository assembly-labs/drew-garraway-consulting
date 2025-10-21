# CAP Platform - UX Implementation Specification
## Championship Athletic Prospects

## Project Overview

**Product**: CAP - AI-powered youth sports trading card creation platform
**Brand**: Championship Athletic Prospects
**MVP Focus**: DIY parent flow (phone photo upload → AI enhancement → card design → print fulfillment)
**Target Launch**: 8 weeks for MVP
**Primary User**: Parents creating cards for their children's sports teams

## Technical Stack Requirements

```yaml
Frontend:
  - Framework: Next.js 14 with App Router
  - Styling: TailwindCSS
  - UI Components: shadcn/ui
  - State Management: Zustand
  - Forms: React Hook Form + Zod validation

Backend:
  - Database: Supabase (PostgreSQL)
  - Authentication: Supabase Auth
  - File Storage: Supabase Storage
  - Real-time: Supabase Realtime

APIs:
  - Payment: Stripe Checkout
  - AI Background Removal: Replicate (rembg model)
  - AI Bio Generation: Anthropic Claude API
  - Print Fulfillment: GotPrint API

Deployment:
  - Hosting: Netlify
  - Environment: Node.js 18+
  - Build: Netlify Build
  - Functions: Netlify Functions (serverless)
```

## Database Schema

```sql
-- Users table (parents/coaches only, 18+)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) CHECK (role IN ('parent', 'coach', 'photographer', 'admin')),
  date_of_birth DATE NOT NULL,
  verified_adult BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sport VARCHAR(50) NOT NULL,
  season VARCHAR(50),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_colors JSONB DEFAULT '[]',
  logo_url TEXT,
  privacy_settings JSONB DEFAULT '{
    "public": false,
    "auto_delete_days": 30,
    "use_facial_recognition": false,
    "require_consent": true
  }',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Children table (minimal data for COPPA compliance)
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(50),
  jersey_number INTEGER,
  position VARCHAR(50),
  privacy_mode BOOLEAN DEFAULT FALSE,
  consent_status VARCHAR(50) DEFAULT 'pending',
  consent_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Photos table with auto-deletion
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES users(id),
  original_url TEXT NOT NULL,
  enhanced_url TEXT,
  thumbnail_url TEXT,
  quality_score DECIMAL(3,2),
  ai_processed BOOLEAN DEFAULT FALSE,
  auto_delete_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Card designs table
CREATE TABLE card_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  template_id VARCHAR(100) NOT NULL,
  design_data JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  design_id UUID REFERENCES card_designs(id),
  stripe_payment_intent_id VARCHAR(255),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  print_partner VARCHAR(50) DEFAULT 'gotprint',
  tracking_number VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Consent log (immutable audit trail)
CREATE TABLE consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES users(id),
  child_id UUID REFERENCES children(id),
  consent_type VARCHAR(50) NOT NULL,
  consent_given BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## Netlify Functions API Specification

```typescript
// Netlify Functions structure
// All functions in /netlify/functions/ directory

// Authentication Functions
// netlify/functions/auth-signup.ts
export async function handler(event: NetlifyEvent) {
  const { email, password, dateOfBirth, role } = JSON.parse(event.body);
  // Implementation
  return {
    statusCode: 200,
    body: JSON.stringify({ user, session })
  };
}

// netlify/functions/auth-verify-age.ts
export async function handler(event: NetlifyEvent) {
  const { dateOfBirth } = JSON.parse(event.body);
  // Age verification logic
  return {
    statusCode: 200,
    body: JSON.stringify({ isAdult: boolean })
  };
}

// Team Management Functions
// netlify/functions/teams-create.ts
// netlify/functions/teams-get.ts
// netlify/functions/teams-update.ts

// Child Management Functions (COPPA Compliant)
// netlify/functions/children-add.ts
// netlify/functions/children-consent.ts

// Photo Management Functions
// netlify/functions/photos-upload.ts
// netlify/functions/photos-enhance.ts
// netlify/functions/photos-status.ts

// Card Design Functions
// netlify/functions/templates-list.ts
// netlify/functions/designs-save.ts
// netlify/functions/designs-generate-bio.ts

// Order & Fulfillment Functions
// netlify/functions/orders-calculate.ts
// netlify/functions/orders-create.ts
// netlify/functions/orders-confirm.ts

// Print Partner Functions
// netlify/functions/print-submit.ts
// netlify/functions/print-status.ts
```

## Screen Components Specification

### 1. Landing Page (/)

```jsx
// Components needed:
- HeroSection
  - Logo: "CAP" with tagline "Championship Athletic Prospects"
  - Headline: "Youth Sports Trading Cards in Minutes"
  - Subheadline: "Turn your champions into collectible cards. AI-powered, parent-friendly."
  - CTAButton: "Create Your Champion's Card →"
  - SampleCardsCarousel: Animated CAP card previews

- FeaturesGrid
  - Feature cards with icons
  - "Phone photos welcome"
  - "AI enhancement included"  
  - "5-day delivery"
  - "Championship quality"

- PricingSection
  - Three tiers: 
    - Rookie ($28): DIY with templates
    - Pro ($75+): With photographer
    - Championship ($150+): Premium package

- TrustBadges
  - COPPA compliant badge
  - Secure checkout badge
  - CAP satisfaction guarantee
```

### 2. Sign Up Flow (/signup)

```jsx
// Multi-step form with CAP branding
Step1_AccountType:
  - Header: "Welcome to CAP"
  - Subheader: "Championship Athletic Prospects"
  - RadioGroup: ['parent', 'coach', 'photographer']
  - ContinueButton: "Join CAP →"

Step2_AgeVerification:
  - Header: "Age Verification"
  - DatePicker: Birth date (must be 18+)
  - CheckboxGroup:
    - "I am 18 or older"
    - "I accept CAP Terms & Privacy Policy"
  - CreateAccountButton: "Create CAP Account"

Step3_EmailPassword:
  - EmailInput: With validation
  - PasswordInput: Min 8 chars, strength indicator
  - SubmitButton: "Start Creating Cards"
```

### 3. Parent Dashboard (/dashboard)

```jsx
// CAP Dashboard Layout:
- DashboardHeader
  - CAPLogo
  - UserMenu (dropdown)
  - CartIcon (with count badge)
  - NotificationBell

- WelcomeSection
  - "Welcome to CAP, [Name]"
  - "Create championship moments"

- QuickActionCards
  - CreateNewCardsCard → /team/new
    Icon: Trophy
    Text: "New Champion Cards"
  - ViewTeamsCard → /teams
    Icon: Users
    Text: "My Teams"
  - RecentOrdersCard → /orders
    Icon: Package
    Text: "Card Orders"

- MyTeamsGrid
  - TeamCard (for each team):
    - TeamName
    - Sport badge
    - PlayerCount: "12 Champions"
    - LastActivity
    - ActionButtons: [Upload Photos, Design Cards]

- RecentOrdersList
  - OrderRow:
    - OrderNumber: "CAP-2024-XXX"
    - Status (processing/shipped/delivered)
    - TrackingLink
    - ViewDetailsButton
```

### 4. Team Setup (/team/new)

```jsx
// CAP Team Creation Form:
- PageHeader: "Register Your Champions"

- TeamInfoSection:
  - TeamNameInput: "Team Name"
  - SportSelect: Dropdown with sports
  - SeasonSelect: "Season"
  - TeamColorsSelector: "Team Colors" (2 colors)
  - LogoUploader: "Team Logo (optional)"

// Privacy settings with CAP branding:
- PrivacySection:
  - Header: "CAP Privacy Protection"
  - PrivateTeamToggle: "Keep team private"
  - AutoDeleteToggle: "Auto-delete after 30 days"
  - FacialRecognitionToggle: "Disable facial recognition"
  
- CreateTeamButton: "Register Champions →"
```

### 5. Roster Management (/team/:id/roster)

```jsx
// CAP Roster Components:
- PageHeader: "Your Championship Roster"

- RosterTable
  - Headers: [Jersey #, Champion Name, Position, Actions]
  - PlayerRow:
    - JerseyNumberDisplay
    - ChampionName (first name only)
    - PositionDisplay
    - EditButton
    - RemoveButton

- AddChampionModal
  - Title: "Add New Champion"
  - FirstNameInput: "Champion's First Name"
  - JerseyNumberInput: "Jersey Number"
  - PositionSelect: "Position (optional)"
  - PrivacyModeCheckbox: "Privacy Mode"
  - SaveButton: "Add to Roster"

- BulkActionsBar
  - ImportCSVButton: "Import Roster"
  - ExportRosterButton: "Export"
  - ContinueButton: "Continue to Photos →"
```

### 6. Photo Upload (/team/:id/photos)

```jsx
// CAP Photo Upload Interface:
- PageHeader: "Capture Your Champions"

- UploadDropZone
  - MainText: "Drop champion photos here"
  - SubText: "or click to select"
  - CameraButton: "Take Photo"
  - GalleryButton: "Choose from Gallery"
  - MaxSizeIndicator: "10MB per photo"

- ProcessingQueue
  - SectionTitle: "AI Enhancement Magic"
  - PhotoProcessingCard:
    - Thumbnail
    - ProcessingSpinner
    - QualityBadge: "CAP Quality Score"
    - PlayerAssignment: "Assign to Champion"
    - RetryButton (if failed)

- AIEnhancementPanel
  - Title: "CAP AI Enhancements"
  - RemoveBackgroundToggle: "Pro Background Removal"
  - AutoCropToggle: "Smart Champion Focus"
  - ColorCorrectionToggle: "Championship Colors"
  - BlurOtherFacesToggle: "Privacy Blur"

- NavigationButtons
  - SaveDraftButton: "Save Progress"
  - ContinueButton: "Design Cards →"
```

### 7. Card Designer (/team/:id/design)

```jsx
// CAP Card Designer:
- PageHeader: "Design Championship Cards"

LeftPanel_Templates:
  - Title: "CAP Templates"
  - SportFilter: "Filter by Sport"
  - StyleFilter: "Championship/Classic/Rookie"
  - TemplateGrid:
    - TemplateCard: 
      - Preview image
      - TemplateName: "Championship Gold"
      - SelectButton: "Use This Design"

CenterPanel_Canvas:
  - CardPreview:
    - CAPLogo (watermark)
    - FrontSide: 
      - "CHAMPIONSHIP ATHLETIC PROSPECTS" header
      - Photo, name, number
      - Team name footer
    - BackSide: 
      - CAP logo
      - Stats, bio
      - Season year
  - FlipButton: "Flip Card"
  - PlayerTabs: "Switch Champion"

RightPanel_Customization:
  - Title: "Customize Your Cards"
  - TeamColorPickers
  - FontSelector: "Card Font"
  - TextSizeSlider
  - ApplyToAllButton: "Apply to All Champions"
  - GenerateBioButton: "AI Champion Bio"

BottomBar_Actions:
  - PreviousButton: "← Previous"
  - NextButton: "Next →"
  - PreviewAllButton: "Preview All Cards"
  - AddToCartButton: "Order Cards →"
```

### 8. Checkout (/checkout)

```jsx
// CAP Checkout Flow:
- PageHeader: "Complete Your CAP Order"

- OrderSummary
  - Title: "Championship Card Package"
  - ItemsList:
    - PackageRow: "15 Champions × 8 cards each"
    - QualityBadge: "CAP Premium Quality"
  - PromoCodeInput: "CAP Promo Code"
  - TotalsDisplay:
    - Subtotal
    - TeamDiscount: "Champion Discount"
    - Shipping
    - Total

- ShippingOptions
  - Title: "Delivery Speed"
  - StandardOption: "Standard (5-7 days) - $5.99"
  - ChampionshipRush: "Championship Rush (2-3 days) - $15.99"

- PaymentForm
  - SecureBadge: "CAP Secure Checkout"
  - StripeCardElement
  - BillingAddressFields
  - SaveCardCheckbox: "Save for future CAP orders"

- PrivacyNotice
  - CAPPrivacyBadge
  - Text: "CAP protects your champions' privacy"
  - DataNote: "Photos auto-deleted after 30 days"
  - PolicyLink: "CAP Privacy Policy"

- PlaceOrderButton: "Complete CAP Order"
```

### 9. Order Confirmation (/order/:id/success)

```jsx
// CAP Success Page:
- SuccessHeader: "🏆 Champions Created!"
- SubHeader: "Your CAP order is confirmed"

- OrderDetails:
  - OrderNumber: "CAP-2024-XXXX"
  - EstimatedDelivery
  - ShippingAddress

- DigitalPreview:
  - Title: "Preview Your Champions"
  - CardGallery: All cards preview
  - DownloadButton: "Download Digital CAP Cards"

- NextSteps:
  - TrackingInfo: "Track your CAP order"
  - ShareSection:
    - Title: "Share Your Champions"
    - SocialButtons: FB, Instagram, Twitter
  - CreateAnotherButton: "Create More CAP Cards"
```

## Netlify Deployment Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_CAP_VERSION = "1.0.0"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[functions]
  node_bundler = "esbuild"
  
[[edge_functions]]
  path = "/api/photos/enhance"
  function = "photo-enhance"
```

## Component Implementation Priority

### Week 1-2: Foundation
1. Set up Next.js project with CAP branding
2. Configure Netlify deployment pipeline
3. Configure Supabase (auth, database, storage)
4. Implement CAP authentication flow
5. Create age verification with CAP terms

### Week 3-4: Core Features
1. CAP roster management (add champions)
2. Photo upload with CAP quality scoring
3. Integrate Replicate for CAP AI enhancement
4. CAP template selection (5 championship templates)
5. Simple CAP card preview

### Week 5-6: Design & Commerce  
1. CAP card customization tools
2. Apply CAP design to all champions
3. Stripe Checkout with CAP branding
4. CAP order management system
5. CAP email notifications

### Week 7-8: Polish & Launch
1. Mobile responsive CAP experience
2. Performance optimization
3. CAP privacy compliance audit
4. Error handling with CAP support
5. Production deployment on Netlify

## Code Examples

### Netlify Function for Photo Upload

```typescript
// netlify/functions/photos-upload.ts
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { files, teamId } = JSON.parse(event.body!);
    
    const uploadPromises = files.map(async (file: any) => {
      // Upload to Supabase Storage with CAP prefix
      const { data: uploadData, error } = await supabase.storage
        .from('cap-photos')
        .upload(`${teamId}/${file.name}`, file);
      
      if (error) throw error;
      
      // Create database record
      const { data: photo } = await supabase
        .from('photos')
        .insert({
          team_id: teamId,
          original_url: uploadData.path,
          auto_delete_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })
        .select()
        .single();
      
      // Queue for CAP AI processing
      await processPhotoWithAI(photo.id);
      
      return photo;
    });
    
    const photos = await Promise.all(uploadPromises);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        photos,
        message: 'CAP photos uploaded successfully'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'CAP upload failed' })
    };
  }
};
```

### CAP Branding Configuration

```typescript
// lib/cap-config.ts
export const CAP_CONFIG = {
  brand: {
    name: 'CAP',
    fullName: 'Championship Athletic Prospects',
    tagline: 'Create Your Champions',
    logo: '/cap-logo.svg',
    colors: {
      primary: '#FFD700',    // Gold
      secondary: '#1E40AF',  // Blue
      accent: '#DC2626',     // Red
      success: '#059669',    // Green
      background: '#FFFFFF',
      text: '#111827'
    }
  },
  
  tiers: {
    rookie: {
      name: 'Rookie',
      price: 28,
      description: 'DIY champion cards'
    },
    pro: {
      name: 'Pro',
      price: 75,
      description: 'With CAP photographer'
    },
    championship: {
      name: 'Championship',
      price: 150,
      description: 'Premium CAP experience'
    }
  },
  
  templates: {
    championship_gold: 'Championship Gold Edition',
    classic_cap: 'Classic CAP Design',
    modern_champion: 'Modern Champion',
    rookie_star: 'Rising Rookie Star',
    elite_athlete: 'Elite Athlete Series'
  }
};
```

### Privacy-Compliant Data Handling

```typescript
// CAP minimal data collection for children
interface CAPChildData {
  first_name: string;     // Only first name
  jersey_number: number;  // Jersey number
  position?: string;      // Optional position
  // NO: last_name, DOB, address, school, social media, etc.
}

// CAP auto-deletion job
const deleteCAPExpiredPhotos = async () => {
  const { error } = await supabase
    .from('photos')
    .delete()
    .lte('auto_delete_at', new Date().toISOString());
    
  console.log('CAP privacy: Expired photos deleted');
};
```

## Mobile PWA Configuration

```json
// public/manifest.json
{
  "name": "CAP - Championship Athletic Prospects",
  "short_name": "CAP",
  "description": "Create championship trading cards for youth athletes",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#FFD700",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/cap-icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/cap-icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["sports", "photography", "lifestyle"],
  "features": ["camera", "storage", "push"]
}
```

## Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_CAP_BRAND="Championship Athletic Prospects"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key

STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

REPLICATE_API_TOKEN=your_replicate_token
ANTHROPIC_API_KEY=your_claude_api_key

GOTPRINT_API_KEY=your_gotprint_key
GOTPRINT_FTP_HOST=ftp.gotprint.com
GOTPRINT_FTP_USER=your_ftp_user
GOTPRINT_FTP_PASSWORD=your_ftp_password

RESEND_API_KEY=your_email_api_key

# Netlify-specific
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

## Testing Requirements

```typescript
// Critical CAP test coverage:
describe('CAP Privacy Compliance', () => {
  test('Age verification blocks users under 18');
  test('CAP consent required before photo upload');
  test('Champion data deletion after 30 days');
  test('Minimal champion data collection');
});

describe('CAP Core User Flow', () => {
  test('Complete CAP card creation flow');
  test('Champion photo upload and AI processing');
  test('CAP template selection and customization');
  test('CAP checkout and payment');
});

describe('CAP Mobile Experience', () => {
  test('Touch targets minimum 44px');
  test('CAP camera integration works');
  test('Offline CAP design mode');
  test('CAP PWA installation prompt');
});
```

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s  
- **Lighthouse Score**: > 90
- **CAP Photo Upload**: < 5s for 10 photos
- **AI Processing**: < 10s per champion photo
- **CAP Card Generation**: < 2s per card

## Success Metrics to Track

```typescript
// CAP Analytics events
const capAnalytics = {
  // CAP Conversion funnel
  'cap_landing_view': {},
  'cap_signup_start': {},
  'cap_signup_complete': { role: string },
  'cap_team_created': { sport: string },
  'cap_photos_uploaded': { count: number },
  'cap_design_started': { template: string },
  'cap_checkout_started': { value: number },
  'cap_order_completed': { value: number, champions: number },
  
  // CAP Quality metrics
  'cap_photo_quality': { score: number },
  'cap_ai_enhancement': { type: string },
  'cap_design_time': { seconds: number },
  'cap_support_ticket': { category: string }
};
```

## Deployment Checklist for CAP on Netlify

- [ ] Netlify account created and site linked
- [ ] Environment variables configured in Netlify UI
- [ ] Supabase project created with CAP schema
- [ ] Stripe webhook endpoints configured for CAP
- [ ] GotPrint API credentials tested
- [ ] Replicate API token valid for CAP AI
- [ ] CAP Privacy policy and terms updated
- [ ] COPPA compliance verified for CAP
- [ ] SSL certificate active (automatic on Netlify)
- [ ] Error monitoring configured (Sentry)
- [ ] CAP Analytics configured (Posthog/Mixpanel)
- [ ] Netlify Functions tested
- [ ] Edge Functions deployed
- [ ] Mobile CAP experience tested
- [ ] Accessibility audit passed

---

## Notes for Development Bot - CAP Platform

1. Always use CAP branding throughout the application
2. Netlify Functions go in `/netlify/functions/` directory
3. Use Netlify environment variables for all secrets
4. Implement CAP privacy features from the beginning
5. All references should be to "champions" not just "players"
6. CAP color scheme: Gold primary, Blue secondary
7. Test on real mobile devices for CAP mobile experience
8. Use CAP- prefix for order numbers and reference IDs
9. Implement proper error boundaries with CAP branding
10. Cache CAP templates and frequently accessed data in Netlify Edge

This specification provides complete implementation guidance for building the CAP (Championship Athletic Prospects) platform on Netlify with privacy-first design and mobile optimization.