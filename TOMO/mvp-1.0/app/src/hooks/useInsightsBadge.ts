/**
 * TOMO — Insights Badge Context & Hook
 *
 * Provides a gold badge dot on the Insights tab when unread insights exist.
 * Follows the same context + provider + hook pattern as useAuth.ts.
 *
 * USAGE:
 *   // In App.tsx, wrap inside AuthProvider:
 *   <AuthProvider>
 *     <InsightsBadgeProvider>
 *       ...
 *     </InsightsBadgeProvider>
 *   </AuthProvider>
 *
 *   // In any component:
 *   const { hasUnreadInsight, checkForUnread, clearBadge } = useInsightsBadge();
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { insightService } from '../services/insights-service';

// ===========================================
// TYPES
// ===========================================

interface InsightsBadgeContextValue {
  /** True when at least one insight has not been viewed */
  hasUnreadInsight: boolean;
  /** Re-check Supabase for unread insights */
  checkForUnread: () => Promise<void>;
  /** Optimistically clear the badge dot (no network call) */
  clearBadge: () => void;
}

// ===========================================
// CONTEXT
// ===========================================

const InsightsBadgeContext = createContext<InsightsBadgeContextValue | undefined>(undefined);

// ===========================================
// PROVIDER
// ===========================================

export function InsightsBadgeProvider({ children }: { children: React.ReactNode }) {
  const [hasUnreadInsight, setHasUnreadInsight] = useState(false);

  const checkForUnread = useCallback(async () => {
    const unread = await insightService.hasUnread();
    setHasUnreadInsight(unread);
  }, []);

  const clearBadge = useCallback(() => {
    setHasUnreadInsight(false);
  }, []);

  // Check on mount
  useEffect(() => {
    checkForUnread();
  }, [checkForUnread]);

  const value: InsightsBadgeContextValue = {
    hasUnreadInsight,
    checkForUnread,
    clearBadge,
  };

  return React.createElement(InsightsBadgeContext.Provider, { value }, children);
}

// ===========================================
// HOOK
// ===========================================

export function useInsightsBadge(): InsightsBadgeContextValue {
  const context = useContext(InsightsBadgeContext);
  if (context === undefined) {
    throw new Error('useInsightsBadge must be used within an InsightsBadgeProvider');
  }
  return context;
}
