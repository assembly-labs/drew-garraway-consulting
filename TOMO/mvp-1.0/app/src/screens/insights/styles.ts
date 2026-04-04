/**
 * Insights Screen — Shared StyleSheet.
 *
 * All insights sub-components import from this single shared stylesheet.
 * Extracted verbatim from the bottom of InsightsScreen.tsx.
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../../config/design-tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
  },

  // -------------------------------------------
  // SKELETON
  // -------------------------------------------
  skeletonContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  skeletonBar: {
    backgroundColor: colors.gray700,
    borderRadius: radius.md,
    opacity: 0.5,
  },

  // -------------------------------------------
  // PRE-INSIGHT (Mode A)
  // -------------------------------------------
  preInsightContainer: {
    paddingTop: spacing.lg,
  },
  preInsightText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  quoteContainer: {
    marginTop: spacing.lg,
  },
  quoteText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    color: colors.gray400,
    lineHeight: 22,
  },
  quoteAttribution: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: spacing.xs,
  },

  // -------------------------------------------
  // WEEKLY MESSAGE VIEW (Mode B — latest)
  // -------------------------------------------
  weeklyMessageContainer: {
    paddingTop: spacing.md,
  },
  weekRangeLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray600,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  paragraphText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  paragraphSpacing: {
    marginBottom: 16,
  },
  paragraphBold: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  watchParagraph: {
    borderLeftWidth: 2,
    borderLeftColor: colors.negative,
    paddingLeft: 12,
    marginBottom: 16,
  },
  watchParagraphText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  watchDefer: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 6,
    lineHeight: 20,
  },
  focusSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  focusSectionHidden: {
    opacity: 0,
  },
  focusLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  focusBody: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  signoff: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
    marginTop: 24,
    lineHeight: 20,
  },

  // -------------------------------------------
  // COLLAPSED OLDER WEEKS
  // -------------------------------------------
  olderSection: {
    marginTop: spacing.xl,
  },
  olderSectionLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  collapsedWeekCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  collapsedWeekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 44,
  },
  collapsedWeekLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
  },
  collapsedWeekContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: colors.gray700,
    paddingTop: 12,
  },

  // -------------------------------------------
  // QUARTERLY CARD
  // -------------------------------------------
  quarterlyCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  cardPressed: {
    backgroundColor: '#242424',
  },
  quarterlyLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  quarterlyPeriod: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  quarterlyPreview: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  readMoreLink: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gold,
  },

  // -------------------------------------------
  // MONTHLY CARD
  // -------------------------------------------
  monthlyCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderLeftWidth: 2,
    borderLeftColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 44,
  },
  monthlyLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  monthlyPeriod: {
    fontFamily: 'Inter',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
  },
  monthlyPreview: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },
  readMoreLinkWhite: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray300,
  },

  // -------------------------------------------
  // EXPANDED CONTENT (shared by quarterly/monthly)
  // -------------------------------------------
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray700,
    paddingTop: 12,
  },
  expandedSection: {
    marginBottom: 12,
  },
  expandedSectionLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  expandedSectionBody: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
  },

  // -------------------------------------------
  // NEW BADGE
  // -------------------------------------------
  newBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.goldDim,
    marginBottom: 8,
  },
  newBadgeText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // -------------------------------------------
  // EMPTY STATES
  // -------------------------------------------
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray800,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyWeekly: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyWeeklyText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
});
