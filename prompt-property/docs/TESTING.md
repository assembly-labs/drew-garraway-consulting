# Prompt Property Manager Testing Strategy

**Version:** 1.0
**Last Updated:** December 16, 2024
**Purpose:** Comprehensive testing guide to ensure code quality and minimize bugs

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Testing Pyramid](#2-testing-pyramid)
3. [Unit Testing Guide](#3-unit-testing-guide)
4. [Integration Testing Guide](#4-integration-testing-guide)
5. [E2E Testing Guide](#5-e2e-testing-guide)
6. [Accessibility Testing](#6-accessibility-testing)
7. [Manual QA Process](#7-manual-qa-process)
8. [Test Data Management](#8-test-data-management)
9. [CI/CD Test Integration](#9-cicd-test-integration)
10. [Debugging Failed Tests](#10-debugging-failed-tests)

---

## 1. Testing Philosophy

### Core Beliefs

1. **Tests are not optional** - They are part of the definition of "done"
2. **Test behavior, not implementation** - Tests should survive refactors
3. **Fast feedback loops** - Unit tests run in <5 seconds
4. **Confidence over coverage** - 80% meaningful coverage > 100% superficial coverage
5. **Tests document intent** - Reading tests should explain what code does

### What to Test

| Always Test | Sometimes Test | Rarely Test |
|-------------|----------------|-------------|
| Business logic | UI rendering | Third-party libraries |
| API integrations | Complex components | Framework code |
| User interactions | Edge cases | Simple getters/setters |
| Error handling | Performance | Static components |
| Accessibility | Animations | CSS styling |

### Test Naming Convention

```typescript
// Pattern: describe what, test behavior
describe('useChat', () => {
  describe('sendMessage', () => {
    it('should add user message to messages array', () => {});
    it('should call Claude API with conversation history', () => {});
    it('should handle API errors gracefully', () => {});
    it('should set loading state while waiting for response', () => {});
  });
});
```

---

## 2. Testing Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  10%  (5-10 tests)
                    │ (Playwright) │  Critical user flows only
                    └─────────────┘
                   ┌───────────────┐
                   │  Integration  │  20%  (20-30 tests)
                   │   (Vitest)    │  Component interactions
                   └───────────────┘
                  ┌─────────────────┐
                  │      Unit       │  70%  (100+ tests)
                  │    (Vitest)     │  Functions, hooks, utils
                  └─────────────────┘
```

### Coverage Targets

| Category | Target | Minimum |
|----------|--------|---------|
| Hooks | 90% | 80% |
| Utils | 95% | 90% |
| Components | 70% | 60% |
| Overall | 80% | 70% |

---

## 3. Unit Testing Guide

### 3.1 Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 3.2 Testing Hooks

```typescript
// src/hooks/useChat.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useChat } from './useChat';
import * as claudeApi from '@/lib/claude';

// Mock the Claude API module
vi.mock('@/lib/claude');

const mockCommunityData = {
  community: {
    name: 'Oakwood Commons HOA',
    community_manager: {
      name: 'Sandra Chen',
      email: 'schen@test.com',
    },
  },
  documents: [],
  forms: [],
  contacts: {},
};

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty messages array', () => {
      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      expect(result.current.messages).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('sendMessage', () => {
    it('should add user message to messages array immediately', async () => {
      vi.mocked(claudeApi.sendMessage).mockResolvedValue({
        content: 'Mock response',
      });

      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      await act(async () => {
        result.current.sendMessage('Can I have a dog?');
      });

      expect(result.current.messages[0]).toMatchObject({
        role: 'user',
        content: 'Can I have a dog?',
      });
    });

    it('should set isLoading to true while waiting for response', async () => {
      // Create a promise we can control
      let resolvePromise: (value: any) => void;
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      vi.mocked(claudeApi.sendMessage).mockReturnValue(pendingPromise);

      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      act(() => {
        result.current.sendMessage('Test message');
      });

      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ content: 'Response' });
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should add assistant response to messages array', async () => {
      vi.mocked(claudeApi.sendMessage).mockResolvedValue({
        content: 'Yes, dogs are permitted with restrictions.',
      });

      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      await act(async () => {
        await result.current.sendMessage('Can I have a dog?');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1]).toMatchObject({
          role: 'assistant',
          content: 'Yes, dogs are permitted with restrictions.',
        });
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      vi.mocked(claudeApi.sendMessage).mockRejectedValue(mockError);

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData, onError })
      );

      await act(async () => {
        await result.current.sendMessage('Test');
      });

      expect(result.current.error).toBeTruthy();
      expect(onError).toHaveBeenCalledWith(mockError);
      expect(result.current.isLoading).toBe(false);
    });

    it('should include conversation history in API calls', async () => {
      vi.mocked(claudeApi.sendMessage)
        .mockResolvedValueOnce({ content: 'First response' })
        .mockResolvedValueOnce({ content: 'Second response' });

      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      await act(async () => {
        await result.current.sendMessage('First message');
      });

      await act(async () => {
        await result.current.sendMessage('Second message');
      });

      // Verify second call includes history
      expect(claudeApi.sendMessage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ content: 'First message' }),
            expect.objectContaining({ content: 'First response' }),
            expect.objectContaining({ content: 'Second message' }),
          ]),
        })
      );
    });
  });

  describe('clearMessages', () => {
    it('should reset messages to empty array', async () => {
      vi.mocked(claudeApi.sendMessage).mockResolvedValue({
        content: 'Response',
      });

      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      await act(async () => {
        await result.current.sendMessage('Test');
      });

      expect(result.current.messages.length).toBeGreaterThan(0);

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.messages).toEqual([]);
    });

    it('should clear error state', async () => {
      vi.mocked(claudeApi.sendMessage).mockRejectedValue(new Error('Error'));

      const { result } = renderHook(() =>
        useChat({ communityData: mockCommunityData })
      );

      await act(async () => {
        await result.current.sendMessage('Test');
      });

      expect(result.current.error).toBeTruthy();

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
```

### 3.3 Testing Utility Functions

```typescript
// src/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import {
  formatTimestamp,
  truncateText,
  extractSectionNumber,
} from './formatters';

describe('formatters', () => {
  describe('formatTimestamp', () => {
    it('should format date as readable string', () => {
      const date = new Date('2024-12-16T10:30:00');
      const result = formatTimestamp(date);

      expect(result).toMatch(/10:30/);
    });

    it('should handle invalid date', () => {
      const result = formatTimestamp(new Date('invalid'));

      expect(result).toBe('Invalid date');
    });
  });

  describe('truncateText', () => {
    it('should not truncate text shorter than limit', () => {
      const text = 'Short text';
      const result = truncateText(text, 50);

      expect(result).toBe('Short text');
    });

    it('should truncate text longer than limit with ellipsis', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);

      expect(result).toBe('This is a very long...');
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it('should handle empty string', () => {
      const result = truncateText('', 10);

      expect(result).toBe('');
    });
  });

  describe('extractSectionNumber', () => {
    it('should extract section number from citation', () => {
      const citation = 'CC&Rs Section 4.2 - Pet Policy';
      const result = extractSectionNumber(citation);

      expect(result).toBe('4.2');
    });

    it('should return null for invalid citation', () => {
      const result = extractSectionNumber('No section here');

      expect(result).toBeNull();
    });
  });
});
```

### 3.4 Testing Components

```typescript
// src/components/chat/MessageBubble.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageBubble } from './MessageBubble';

const mockUserMessage = {
  id: '1',
  role: 'user' as const,
  content: 'Can I have a dog?',
  timestamp: new Date('2024-12-16T10:00:00'),
};

const mockAssistantMessage = {
  id: '2',
  role: 'assistant' as const,
  content: 'Yes, dogs are permitted.',
  timestamp: new Date('2024-12-16T10:00:05'),
  sources: [
    {
      document_id: 'ccr_main',
      section_number: '8.4',
      section_title: 'Pet Policy',
    },
  ],
};

describe('MessageBubble', () => {
  describe('rendering', () => {
    it('should render user message content', () => {
      render(<MessageBubble message={mockUserMessage} />);

      expect(screen.getByText('Can I have a dog?')).toBeInTheDocument();
    });

    it('should render assistant message content', () => {
      render(<MessageBubble message={mockAssistantMessage} />);

      expect(screen.getByText('Yes, dogs are permitted.')).toBeInTheDocument();
    });

    it('should display timestamp', () => {
      render(<MessageBubble message={mockUserMessage} />);

      expect(screen.getByRole('time')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have article role', () => {
      render(<MessageBubble message={mockUserMessage} />);

      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should have aria-label indicating message sender', () => {
      render(<MessageBubble message={mockUserMessage} />);

      expect(screen.getByLabelText(/message from you/i)).toBeInTheDocument();
    });

    it('should have datetime attribute on timestamp', () => {
      render(<MessageBubble message={mockUserMessage} />);

      const time = screen.getByRole('time');
      expect(time).toHaveAttribute('datetime');
    });
  });

  describe('sources', () => {
    it('should display sources for assistant messages', () => {
      render(<MessageBubble message={mockAssistantMessage} />);

      expect(screen.getByText(/Section 8.4/)).toBeInTheDocument();
    });

    it('should not display sources section for user messages', () => {
      render(<MessageBubble message={mockUserMessage} />);

      expect(screen.queryByText(/Source/)).not.toBeInTheDocument();
    });
  });
});
```

---

## 4. Integration Testing Guide

### 4.1 What to Integration Test

- Component + Hook combinations
- Form submission flows
- State management interactions
- Context provider consumers

### 4.2 Example Integration Test

```typescript
// src/components/chat/ChatContainer.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ChatContainer } from './ChatContainer';
import { CommunityDataProvider } from '@/context/CommunityDataContext';
import * as claudeApi from '@/lib/claude';

vi.mock('@/lib/claude');

const mockCommunityData = {
  community: {
    name: 'Oakwood Commons',
    community_manager: { name: 'Sandra Chen', email: 'test@test.com' },
  },
  documents: [],
  forms: [],
  contacts: {},
};

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <CommunityDataProvider value={mockCommunityData}>
      {component}
    </CommunityDataProvider>
  );
};

describe('ChatContainer Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should complete a full conversation flow', async () => {
    const user = userEvent.setup();

    vi.mocked(claudeApi.sendMessage).mockResolvedValue({
      content: 'Yes, dogs are permitted with a 50lb weight limit.',
    });

    renderWithProviders(<ChatContainer />);

    // Find and type in input
    const input = screen.getByPlaceholderText(/ask me about/i);
    await user.type(input, 'Can I have a dog?');

    // Submit
    const submitButton = screen.getByRole('button', { name: /send/i });
    await user.click(submitButton);

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText(/50lb weight limit/)).toBeInTheDocument();
    });

    // Verify both messages are displayed
    expect(screen.getByText('Can I have a dog?')).toBeInTheDocument();
  });

  it('should handle multi-turn conversation', async () => {
    const user = userEvent.setup();

    vi.mocked(claudeApi.sendMessage)
      .mockResolvedValueOnce({ content: 'Dogs are allowed.' })
      .mockResolvedValueOnce({ content: 'Cats are also allowed.' });

    renderWithProviders(<ChatContainer />);

    const input = screen.getByPlaceholderText(/ask me about/i);

    // First message
    await user.type(input, 'Can I have a dog?');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Dogs are allowed.')).toBeInTheDocument();
    });

    // Follow-up message
    await user.clear(input);
    await user.type(input, 'What about cats?');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Cats are also allowed.')).toBeInTheDocument();
    });

    // All messages should be visible
    expect(screen.getByText('Can I have a dog?')).toBeInTheDocument();
    expect(screen.getByText('What about cats?')).toBeInTheDocument();
  });

  it('should display error message on API failure', async () => {
    const user = userEvent.setup();

    vi.mocked(claudeApi.sendMessage).mockRejectedValue(new Error('API Error'));

    renderWithProviders(<ChatContainer />);

    const input = screen.getByPlaceholderText(/ask me about/i);
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/trouble connecting/i)).toBeInTheDocument();
    });
  });

  it('should clear conversation when clear button is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(claudeApi.sendMessage).mockResolvedValue({
      content: 'Response',
    });

    renderWithProviders(<ChatContainer />);

    // Send a message
    const input = screen.getByPlaceholderText(/ask me about/i);
    await user.type(input, 'Test');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Response')).toBeInTheDocument();
    });

    // Clear chat
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(screen.queryByText('Test')).not.toBeInTheDocument();
    expect(screen.queryByText('Response')).not.toBeInTheDocument();
  });
});
```

---

## 5. E2E Testing Guide

### 5.1 Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.2 Critical User Flow Tests

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome screen with community name', async ({ page }) => {
    await expect(page.getByText('Oakwood Commons')).toBeVisible();
    await expect(page.getByPlaceholder(/ask me about/i)).toBeVisible();
  });

  test('should complete basic policy question flow', async ({ page }) => {
    // Type question
    const input = page.getByPlaceholder(/ask me about/i);
    await input.fill('Can I have a dog?');

    // Submit
    await page.getByRole('button', { name: /send/i }).click();

    // Wait for response (increase timeout for API call)
    const response = page.locator('[data-testid="assistant-message"]').first();
    await expect(response).toBeVisible({ timeout: 15000 });

    // Verify response contains relevant content
    const responseText = await response.textContent();
    expect(responseText?.toLowerCase()).toContain('pet');
  });

  test('should maintain conversation context across turns', async ({ page }) => {
    const input = page.getByPlaceholder(/ask me about/i);

    // First question
    await input.fill('Can I have a dog?');
    await page.getByRole('button', { name: /send/i }).click();

    await expect(page.locator('[data-testid="assistant-message"]').first())
      .toBeVisible({ timeout: 15000 });

    // Follow-up question
    await input.fill('What breeds are restricted?');
    await page.getByRole('button', { name: /send/i }).click();

    // Should have 2 assistant responses
    await expect(page.locator('[data-testid="assistant-message"]'))
      .toHaveCount(2, { timeout: 15000 });
  });

  test('should display source citations', async ({ page }) => {
    const input = page.getByPlaceholder(/ask me about/i);
    await input.fill('What are the pool hours?');
    await page.getByRole('button', { name: /send/i }).click();

    // Wait for response
    await expect(page.locator('[data-testid="assistant-message"]').first())
      .toBeVisible({ timeout: 15000 });

    // Check for citation
    await expect(page.getByText(/Section/)).toBeVisible();
  });

  test('should clear chat when clear button clicked', async ({ page }) => {
    const input = page.getByPlaceholder(/ask me about/i);

    // Send message
    await input.fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();

    await expect(page.locator('[data-testid="assistant-message"]').first())
      .toBeVisible({ timeout: 15000 });

    // Clear
    await page.getByRole('button', { name: /clear/i }).click();

    // Messages should be gone
    await expect(page.locator('[data-testid="user-message"]')).toHaveCount(0);
  });
});

test.describe('Quick Questions', () => {
  test('should populate input when quick question clicked', async ({ page }) => {
    await page.goto('/');

    // Click a quick question category
    await page.getByRole('button', { name: /pets/i }).click();

    // Input should have text
    const input = page.getByPlaceholder(/ask me about/i);
    await expect(input).not.toBeEmpty();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display correctly on mobile', async ({ page }) => {
    await page.goto('/');

    // Main elements should be visible
    await expect(page.getByPlaceholder(/ask me about/i)).toBeVisible();

    // Quick questions should wrap properly
    const quickQuestions = page.locator('[data-testid="quick-questions"]');
    await expect(quickQuestions).toBeVisible();
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder(/ask me about/i);

    // Tap to focus
    await input.tap();
    await expect(input).toBeFocused();

    // Type message
    await input.fill('Test from mobile');

    // Tap send button
    await page.getByRole('button', { name: /send/i }).tap();

    // Should show loading or response
    await expect(
      page.locator('[data-testid="loading-indicator"], [data-testid="assistant-message"]').first()
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Accessibility', () => {
  test('should be navigable by keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab to input
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder(/ask me about/i)).toBeFocused();

    // Type message
    await page.keyboard.type('Test message');

    // Tab to send button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Should submit
    await expect(page.locator('[data-testid="user-message"]')).toBeVisible();
  });

  test('should have no accessibility violations on load', async ({ page }) => {
    await page.goto('/');

    // Basic a11y check - all interactive elements should be reachable
    const interactiveElements = await page.locator(
      'button, input, a, [role="button"]'
    ).all();

    for (const element of interactiveElements) {
      // Each should be visible and have accessible name
      await expect(element).toBeVisible();
    }
  });
});

test.describe('Error Handling', () => {
  test('should display error message when API fails', async ({ page }) => {
    // Intercept API calls and return error
    await page.route('**/api.anthropic.com/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/');

    const input = page.getByPlaceholder(/ask me about/i);
    await input.fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();

    // Should show error message
    await expect(page.getByText(/trouble|error/i)).toBeVisible({ timeout: 10000 });
  });
});
```

### 5.3 Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run specific test file
npx playwright test chat.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run on specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

---

## 6. Accessibility Testing

### 6.1 Automated Testing

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no automatic a11y violations on home page', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have no a11y violations during conversation', async ({ page }) => {
    await page.goto('/');

    // Interact with the page
    const input = page.getByPlaceholder(/ask me about/i);
    await input.fill('Can I have a pet?');
    await page.getByRole('button', { name: /send/i }).click();

    // Wait for response
    await expect(page.locator('[data-testid="assistant-message"]').first())
      .toBeVisible({ timeout: 15000 });

    // Check a11y after interaction
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

### 6.2 Manual Accessibility Checklist

Run through this checklist before each release:

**Keyboard Navigation:**
- [ ] Can reach all interactive elements with Tab
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Can activate buttons with Enter/Space
- [ ] Can close modals with Escape
- [ ] No keyboard traps
- [ ] Focus visible at all times

**Screen Reader:**
- [ ] Page has proper heading structure (h1, h2, etc.)
- [ ] Images have alt text (or are decorative)
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Dynamic content updates are announced

**Visual:**
- [ ] Text has 4.5:1 contrast ratio (normal text)
- [ ] Large text has 3:1 contrast ratio
- [ ] UI works at 200% zoom
- [ ] No content requires horizontal scrolling at 320px width
- [ ] Focus indicators are visible

**Motion:**
- [ ] Animations can be disabled (prefers-reduced-motion)
- [ ] No flashing content

---

## 7. Manual QA Process

### 7.1 Pre-PR QA Checklist

Before creating a PR, run through:

```markdown
## Quick QA Checklist

### Functionality
- [ ] Feature works as described in user story
- [ ] Edge cases handled (empty states, long text, etc.)
- [ ] Error states display correctly
- [ ] Loading states display correctly

### Cross-Browser (pick 2)
- [ ] Chrome
- [ ] Safari
- [ ] Firefox

### Responsive
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Color contrast acceptable
```

### 7.2 Pre-Release QA Checklist

Full QA before deployment:

```markdown
## Full QA Checklist

### Critical Paths
- [ ] Can ask a basic policy question
- [ ] Multi-turn conversation works
- [ ] Citations display correctly
- [ ] Escalation flow works
- [ ] Clear chat works
- [ ] Quick questions work

### Error Scenarios
- [ ] API timeout handled
- [ ] Invalid input handled
- [ ] Network offline handled

### Performance
- [ ] Initial load < 3 seconds
- [ ] Response appears < 10 seconds
- [ ] No jank/stuttering during typing
- [ ] Memory stable during long session

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] iOS Safari
- [ ] Android Chrome

### Devices
- [ ] iPhone SE (small)
- [ ] iPhone 14 (medium)
- [ ] iPad (tablet)
- [ ] Desktop 1920px
- [ ] Desktop 2560px (large)

### Accessibility
- [ ] Keyboard-only navigation
- [ ] VoiceOver (Mac) or NVDA (Windows)
- [ ] 200% zoom
- [ ] High contrast mode
```

---

## 8. Test Data Management

### 8.1 Mock Data Principles

- Mock data should be realistic
- Cover edge cases (long text, special characters, empty values)
- Separate fixtures for different scenarios
- Never use production data in tests

### 8.2 Test Fixtures Structure

```
tests/
├── fixtures/
│   ├── community-data.ts       # Standard test community
│   ├── messages.ts             # Sample messages
│   ├── error-scenarios.ts      # Error states
│   └── edge-cases.ts           # Edge case data
```

```typescript
// tests/fixtures/community-data.ts
export const mockCommunityData = {
  community: {
    name: 'Test Community HOA',
    type: 'planned_community',
    units: 100,
    property_type: 'townhomes',
    management_company: 'Test Management',
    community_manager: {
      name: 'Test Manager',
      email: 'manager@test.com',
      phone: '555-0100',
      office_hours: 'Mon-Fri 9am-5pm',
    },
  },
  documents: [
    {
      id: 'test_ccr',
      type: 'ccr',
      title: 'Test CC&Rs',
      effective_date: '2024-01-01',
      sections: [
        {
          number: '1.1',
          title: 'Test Section',
          content: 'Test content for unit tests.',
          plain_language: 'Simple test content.',
          common_questions: ['test', 'example'],
        },
      ],
    },
  ],
  forms: [],
  contacts: {
    general: 'test@test.com',
  },
};

export const mockEmptyCommunityData = {
  community: {
    name: '',
    community_manager: { name: '', email: '' },
  },
  documents: [],
  forms: [],
  contacts: {},
};
```

---

## 9. CI/CD Test Integration

### 9.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
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

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          VITE_ANTHROPIC_API_KEY: ${{ secrets.VITE_ANTHROPIC_API_KEY }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    needs: [lint-and-type-check, unit-tests]
    runs-on: ubuntu-latest
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

### 9.2 Required Status Checks

Configure these as required before merging:

- `lint-and-type-check`
- `unit-tests`
- `e2e-tests` (optional for draft PRs)
- `build`

---

## 10. Debugging Failed Tests

### 10.1 Unit Test Failures

```bash
# Run single test file
npm run test -- src/hooks/useChat.test.ts

# Run with verbose output
npm run test -- --reporter=verbose

# Run in watch mode for debugging
npm run test:watch

# Run with coverage to find untested code
npm run test:coverage
```

### 10.2 E2E Test Failures

```bash
# Run with trace for debugging
npx playwright test --trace on

# Run in debug mode (pauses on failure)
npx playwright test --debug

# Run in headed mode to see what's happening
npx playwright test --headed

# View the HTML report
npx playwright show-report

# View trace file
npx playwright show-trace trace.zip
```

### 10.3 Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Test timeout | Slow API/network | Increase timeout, mock API |
| Element not found | Wrong selector | Check data-testid, use getByRole |
| Flaky test | Race condition | Use waitFor, proper async handling |
| Works locally, fails in CI | Environment difference | Check env vars, use consistent Node version |
| Coverage low | Untested branches | Add edge case tests |

---

## Quick Reference

```bash
# All test commands
npm run test              # Unit tests once
npm run test:watch        # Unit tests watch mode
npm run test:coverage     # Unit tests with coverage
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E with interactive UI
npm run test:all          # All tests

# Debugging
npm run test -- --reporter=verbose
npx playwright test --debug
npx playwright show-report
```
