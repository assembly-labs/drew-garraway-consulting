# Application Implementation Guide

> **Status:** Template — Build during 04-Development phase

This guide covers building the application that consumes the component library.

---

## Purpose

The application:
- Implements the product using the component library
- Consumes `@your-org/ui` and `@your-org/tokens`
- Follows wireframes from `02-ux/wireframes/`
- Uses content from `02-ux/content-strategy.md`

---

## Project Structure

```
apps/web/
├── src/
│   ├── app/                  # App router pages (Next.js) or routes
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── [feature]/        # Feature pages
│   │
│   ├── components/           # App-specific components
│   │   ├── layouts/          # Page layouts
│   │   │   ├── AppShell.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── navigation/       # Navigation components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── features/         # Feature-specific components
│   │
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API client
│   │   └── utils.ts          # Helpers
│   │
│   ├── hooks/                # App-specific hooks
│   │
│   └── styles/               # Global app styles
│       └── globals.css
│
├── public/                   # Static assets
├── package.json
└── README.md
```

---

## Setup

### 1. Initialize Application

```bash
# Next.js example
pnpm create next-app@latest apps/web --typescript --tailwind --eslint --app

# Or Vite
pnpm create vite apps/web -- --template react-ts
```

### 2. Add Dependencies

```json
{
  "dependencies": {
    "@your-org/ui": "workspace:*",
    "@your-org/tokens": "workspace:*"
  }
}
```

### 3. Configure Styles

```css
/* src/styles/globals.css */
@import '@your-org/tokens/css';
@import '@your-org/ui/styles';

/* App-specific global styles (minimal) */
body {
  font-family: var(--typography-fontFamily-sans);
  background: var(--color-surface-base);
  color: var(--color-text-primary);
}
```

---

## Layout Components

### AppShell

The main application wrapper:

```typescript
// src/components/layouts/AppShell.tsx
import { Header } from '../navigation/Header';
import { Footer } from '../navigation/Footer';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
```

### PageLayout

Standard page container:

```typescript
// src/components/layouts/PageLayout.tsx
import { Container, Stack, Heading } from '@your-org/ui';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <Container size="lg">
      <Stack gap={6}>
        <header>
          <Heading level={1}>{title}</Heading>
          {description && <Text color="secondary">{description}</Text>}
        </header>
        {children}
      </Stack>
    </Container>
  );
}
```

---

## Navigation

### Header

```typescript
// src/components/navigation/Header.tsx
import { Container, Flex, Button, Link } from '@your-org/ui';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="header">
      <Container>
        <Flex justify="between" align="center">
          <Logo />

          <nav aria-label="Main navigation">
            <Flex as="ul" gap={4}>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/about">About</Link></li>
            </Flex>
          </nav>

          <Flex gap={2}>
            <Button variant="ghost">Sign In</Button>
            <Button variant="primary">Get Started</Button>
          </Flex>
        </Flex>
      </Container>
    </header>
  );
}
```

### Skip Link

Always include for accessibility:

```typescript
// Include in root layout
<a
  href="#main-content"
  className="skip-link"
>
  Skip to main content
</a>

// With CSS
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-accent-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-2) var(--spacing-4);
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## Page Patterns

### Standard Page

```typescript
// src/app/about/page.tsx
import { PageLayout } from '@/components/layouts/PageLayout';
import { Card, Stack, Text } from '@your-org/ui';

export default function AboutPage() {
  return (
    <PageLayout
      title="About Us"
      description="Learn more about our mission and team."
    >
      <Stack gap={8}>
        <Card>
          <Text>Content here...</Text>
        </Card>
      </Stack>
    </PageLayout>
  );
}
```

### Page with Loading State

```typescript
'use client';

import { Suspense } from 'react';
import { PageLayout } from '@/components/layouts/PageLayout';
import { Skeleton } from '@your-org/ui';

function DataContent() {
  // Fetch data
  return <div>Content</div>;
}

function LoadingState() {
  return (
    <Stack gap={4}>
      <Skeleton height={200} />
      <Skeleton height={100} />
      <Skeleton height={100} />
    </Stack>
  );
}

export default function DataPage() {
  return (
    <PageLayout title="Data">
      <Suspense fallback={<LoadingState />}>
        <DataContent />
      </Suspense>
    </PageLayout>
  );
}
```

### Page with Error State

```typescript
'use client';

import { Alert, Button, Stack } from '@your-org/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Stack gap={4} align="center" style={{ padding: 'var(--spacing-8)' }}>
      <Alert variant="error">
        Something went wrong. Please try again.
      </Alert>
      <Button onClick={reset}>Try Again</Button>
    </Stack>
  );
}
```

### Empty State

```typescript
import { Stack, Text, Button } from '@your-org/ui';
import { EmptyIcon } from '@your-org/icons';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Stack gap={4} align="center" style={{ padding: 'var(--spacing-12)' }}>
      <EmptyIcon size={48} color="muted" />
      <Text size="lg" weight="medium">{title}</Text>
      <Text color="secondary">{description}</Text>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </Stack>
  );
}
```

---

## Data Fetching Patterns

### With Loading and Error States

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Spinner, Alert } from '@your-org/ui';

function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

function DataList() {
  const { data, loading, error } = useData('/api/items');

  if (loading) return <Spinner />;
  if (error) return <Alert variant="error">Failed to load data</Alert>;
  if (!data?.length) return <EmptyState title="No items" description="..." />;

  return <List items={data} />;
}
```

---

## Responsive Patterns

### Using Component Library

```typescript
import { Stack, Grid } from '@your-org/ui';

// Stack changes direction at breakpoint
<Stack direction={{ base: 'column', md: 'row' }} gap={4}>
  <Sidebar />
  <Content />
</Stack>

// Grid adjusts columns
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
  {items.map(item => <Card key={item.id} {...item} />)}
</Grid>
```

### Using CSS

```css
/* Use token breakpoints */
.responsive-container {
  padding: var(--spacing-4);
}

@media (min-width: 768px) {
  .responsive-container {
    padding: var(--spacing-8);
  }
}
```

---

## Component Composition Rules

### DO: Use Library Components

```typescript
// ✅ Good - uses library components
import { Button, Card, Stack } from '@your-org/ui';

function Feature() {
  return (
    <Card>
      <Stack gap={4}>
        <Text>Description</Text>
        <Button>Action</Button>
      </Stack>
    </Card>
  );
}
```

### DON'T: Create One-Off Styles

```typescript
// ❌ Bad - custom styling outside the system
function Feature() {
  return (
    <div style={{ padding: '24px', borderRadius: '8px', background: '#f5f5f5' }}>
      <p style={{ fontSize: '14px' }}>Description</p>
      <button style={{ background: 'blue', color: 'white' }}>Action</button>
    </div>
  );
}
```

### When App-Specific Components Are OK

- Layout compositions specific to this app
- Feature-specific containers
- Page sections that compose library components
- Business logic wrappers

```typescript
// ✅ OK - app-specific composition of library components
function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <Stack gap={3}>
        <ProductImage src={product.image} />
        <Heading level={3}>{product.name}</Heading>
        <Text color="secondary">{product.description}</Text>
        <Flex justify="between">
          <Text weight="bold">${product.price}</Text>
          <Button size="sm">Add to Cart</Button>
        </Flex>
      </Stack>
    </Card>
  );
}
```

---

## Accessibility Requirements

### Page Level

```
□ Page has descriptive <title>
□ One <h1> per page
□ Heading hierarchy is logical (h1 → h2 → h3)
□ Skip link to main content
□ Focus is managed on route changes
□ Landmarks are present (header, main, footer, nav)
```

### Interactive Elements

```
□ All clickable elements are focusable
□ Focus is visible
□ Keyboard shortcuts documented
□ Escape closes modals/overlays
□ Focus returns to trigger on close
```

### Content

```
□ Images have alt text
□ Links have descriptive text (not "click here")
□ Form inputs have labels
□ Error messages are announced
□ Loading states are announced
```

---

## Performance Considerations

### Code Splitting

```typescript
// Lazy load features
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton height={400} />,
});
```

### Image Optimization

```typescript
// Use Next.js Image or similar
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero description"
  width={1200}
  height={600}
  priority // for above-the-fold
/>
```

### Font Loading

```typescript
// In layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
```

---

## Checklist

### Setup

```
□ Application initialized
□ Component library installed
□ Token package installed
□ Global styles configured
□ Font loaded
```

### Layout

```
□ AppShell created
□ Header with navigation
□ Footer
□ Page layouts
□ Skip link
```

### Pages

```
□ Home page
□ Key feature pages (from wireframes)
□ Error page (error.tsx)
□ Not found page (not-found.tsx)
□ Loading states
```

### Patterns

```
□ Loading states for data
□ Error states
□ Empty states
□ Responsive behavior
□ Skeleton placeholders
```

### Accessibility

```
□ Page titles descriptive
□ Heading hierarchy correct
□ Keyboard navigation works
□ Focus management on route changes
□ Screen reader tested
```

### Performance

```
□ Code splitting implemented
□ Images optimized
□ Fonts optimized
□ Core Web Vitals acceptable
```

---

*The app brings it all together. Build on the foundation.*
