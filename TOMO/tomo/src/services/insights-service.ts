/**
 * TOMO Insights Service — Supabase Operations
 *
 * Handles all database and edge function interactions for the insights system.
 * Follows the same patterns as supabase.ts (sessionService, profileService).
 *
 * See docs/insights/SCHEMA.md for database schema.
 */

import { supabase, parseEdgeFnError } from './supabase';
import type {
  Insight,
  InsightTier,
  InsightConversation,
  UserContext,
  UserContextDocument,
  WeeklyInsightInput,
  WeeklyInsightOutput,
  MonthlyInsightInput,
  MonthlyInsightOutput,
  QuarterlyInsightInput,
  QuarterlyInsightOutput,
  ChatRequest,
  ChatResponse,
  LowerTierContext,
  UCDChangeEntry,
} from '../types/insights-types';

// ===========================================
// INSIGHT CRUD
// ===========================================

export const insightService = {
  /** Get all insights for the current user, ordered by most recent */
  async list(limit = 50): Promise<Insight[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to list insights:', error.message);
      return [];
    }
    return (data ?? []) as Insight[];
  },

  /** Get insights by tier */
  async listByTier(tier: InsightTier, limit = 20): Promise<Insight[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('tier', tier)
      .order('period_start', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to list insights by tier:', error.message);
      return [];
    }
    return (data ?? []) as Insight[];
  },

  /** Get the most recent insight for a specific tier */
  async getLatest(tier: InsightTier): Promise<Insight | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('tier', tier)
      .order('period_start', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // PGRST116 = no rows found — not a real error
      if (error.code === 'PGRST116') return null;
      console.error('Failed to get latest insight:', error.message);
      return null;
    }
    return data as Insight;
  },

  /** Get context_for_lower_tiers from the most recent monthly/quarterly insight */
  async getLowerTierContext(): Promise<{
    monthlyContext: LowerTierContext | null;
    quarterlyPriorities: string[] | null;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { monthlyContext: null, quarterlyPriorities: null };

    // Fetch the latest monthly and quarterly insights in parallel
    const [monthlyResult, quarterlyResult] = await Promise.all([
      supabase
        .from('insights')
        .select('context_for_lower_tiers')
        .eq('user_id', user.id)
        .eq('tier', 'monthly')
        .order('period_start', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('insights')
        .select('context_for_lower_tiers')
        .eq('user_id', user.id)
        .eq('tier', 'quarterly')
        .order('period_start', { ascending: false })
        .limit(1)
        .single(),
    ]);

    const monthlyContext = monthlyResult.data?.context_for_lower_tiers as LowerTierContext | null ?? null;
    const quarterlyContext = quarterlyResult.data?.context_for_lower_tiers as LowerTierContext | null ?? null;

    return {
      monthlyContext,
      quarterlyPriorities: quarterlyContext?.priorities ?? null,
    };
  },

  /** Submit feedback (helpful / not_helpful) on an insight */
  async submitFeedback(insightId: string, feedback: 'helpful' | 'not_helpful'): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('insights')
      .update({ feedback })
      .eq('id', insightId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to submit feedback:', error.message);
      throw new Error(`Failed to submit feedback: ${error.message}`);
    }
  },

  /**
   * Mark an insight as viewed. Typewriter animation plays only on first view.
   * Sets has_been_viewed = true and first_viewed_at = now (if not already set).
   * Safe to call multiple times — only the first call writes.
   */
  async markAsViewed(insightId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('insights')
      .update({
        has_been_viewed: true,
        first_viewed_at: new Date().toISOString(),
      })
      .eq('id', insightId)
      .eq('user_id', user.id)
      .eq('has_been_viewed', false); // Only update if not already viewed

    if (error) {
      // Non-critical — don't throw, just log
      console.error('Failed to mark insight as viewed:', error.message);
    }
  },

  /** Check if an insight exists for a given tier and period */
  async existsForPeriod(tier: InsightTier, periodStart: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { count, error } = await supabase
      .from('insights')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('tier', tier)
      .eq('period_start', periodStart);

    if (error) {
      console.error('Failed to check insight existence:', error.message);
      return false;
    }
    return (count ?? 0) > 0;
  },
};

// ===========================================
// EDGE FUNCTION CALLS
// ===========================================

export const insightGenerationService = {
  /** Generate a weekly insight via the Haiku edge function */
  async generateWeekly(input: WeeklyInsightInput): Promise<{
    success: boolean;
    data: WeeklyInsightOutput | null;
    insightId: string | null;
    error: string | null;
  }> {
    const { data, error } = await supabase.functions.invoke('generate-weekly', {
      body: input,
    });

    if (error) {
      const { detail } = await parseEdgeFnError(error);
      console.error('[Insights] Weekly generation failed:', detail);
      return { success: false, data: null, insightId: null, error: detail };
    }

    return {
      success: true,
      data: data?.insight_data as WeeklyInsightOutput ?? null,
      insightId: data?.insight_id ?? null,
      error: null,
    };
  },

  /** Generate a monthly insight via the Sonnet edge function */
  async generateMonthly(input: MonthlyInsightInput): Promise<{
    success: boolean;
    data: MonthlyInsightOutput | null;
    insightId: string | null;
    error: string | null;
  }> {
    const { data, error } = await supabase.functions.invoke('generate-monthly', {
      body: input,
    });

    if (error) {
      const { detail } = await parseEdgeFnError(error);
      console.error('[Insights] Monthly generation failed:', detail);
      return { success: false, data: null, insightId: null, error: detail };
    }

    return {
      success: true,
      data: data?.insight_data as MonthlyInsightOutput ?? null,
      insightId: data?.insight_id ?? null,
      error: null,
    };
  },

  /** Generate a quarterly insight via the Opus edge function */
  async generateQuarterly(input: QuarterlyInsightInput): Promise<{
    success: boolean;
    data: QuarterlyInsightOutput | null;
    insightId: string | null;
    error: string | null;
  }> {
    const { data, error } = await supabase.functions.invoke('generate-quarterly', {
      body: input,
    });

    if (error) {
      const { detail } = await parseEdgeFnError(error);
      console.error('[Insights] Quarterly generation failed:', detail);
      return { success: false, data: null, insightId: null, error: detail };
    }

    return {
      success: true,
      data: data?.insight_data as QuarterlyInsightOutput ?? null,
      insightId: data?.insight_id ?? null,
      error: null,
    };
  },
};

// ===========================================
// CHAT
// ===========================================

export const insightChatService = {
  /** Send a message in an insight conversation */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data, error } = await supabase.functions.invoke('chat-with-insight', {
      body: request,
    });

    if (error) {
      const { detail } = await parseEdgeFnError(error);
      console.error('[Insights] Chat failed:', detail);
      throw new Error(`Chat failed: ${detail}`);
    }

    return data as ChatResponse;
  },

  /** Get existing conversation for an insight */
  async getConversation(insightId: string): Promise<InsightConversation | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('insight_conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('insight_id', insightId)
      .single();

    if (error) {
      // PGRST116 = no rows found — conversation doesn't exist yet
      if (error.code === 'PGRST116') return null;
      console.error('Failed to get conversation:', error.message);
      return null;
    }
    return data as InsightConversation;
  },
};

// ===========================================
// USER CONTEXT
// ===========================================

export const userContextService = {
  /** Get the current user's UCD */
  async get(): Promise<UserContext | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_context')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Failed to get user context:', error.message);
      return null;
    }
    return data as UserContext;
  },

  /** Get just the serialized text (for prompt injection) */
  async getSerializedText(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_context')
      .select('serialized_text')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Failed to get serialized text:', error.message);
      return null;
    }
    return data?.serialized_text ?? null;
  },

  /** Upsert the UCD (called after pattern engine rebuilds it) */
  async upsert(
    contextDocument: UserContextDocument,
    serializedText: string,
    sessionsAnalyzed: number,
    changelog: UCDChangeEntry[]
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_context')
      .upsert(
        {
          user_id: user.id,
          context_document: contextDocument as unknown as Record<string, unknown>,
          serialized_text: serializedText,
          version: contextDocument.version,
          sessions_analyzed: sessionsAnalyzed,
          last_rebuilt: new Date().toISOString(),
          changelog: changelog as unknown as Record<string, unknown>[],
        },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Failed to upsert user context:', error.message);
      throw new Error(`Failed to upsert user context: ${error.message}`);
    }
  },
};

