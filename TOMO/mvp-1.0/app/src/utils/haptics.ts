/**
 * TOMO — Haptic Feedback Utility
 *
 * Wraps expo-haptics for consistent tactile feedback across the app.
 * All haptic calls are fire-and-forget (no await needed).
 *
 * USAGE:
 *   import { haptics } from '@/utils/haptics';
 *   haptics.light();     // chip selection, toggle
 *   haptics.medium();    // record start, save
 *   haptics.success();   // session saved
 *   haptics.warning();   // delete confirmation
 *   haptics.error();     // save failed
 */

import * as Haptics from 'expo-haptics';

export const haptics = {
  /** Light tap — chip selection, filter toggle */
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** Medium tap — record start/stop, save button */
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  /** Success — session saved, profile updated */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  /** Warning — delete confirmation shown */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  /** Error — save failed, network error */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
