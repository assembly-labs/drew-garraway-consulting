/**
 * TOMO — Shake-to-Report Bug Reporter
 *
 * Shake the device to open a feedback modal. Automatically captures
 * a screenshot on shake. Submits to Sentry with the screenshot,
 * user context, and device info auto-attached.
 *
 * USAGE: Wrap inside ToastProvider in App.tsx:
 *   <ToastProvider>
 *     <ShakeBugReporter />
 *     <RootNavigator />
 *   </ToastProvider>
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNShake from 'react-native-shake';
import { captureScreen } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sentry from '@sentry/react-native';
import { Icons } from './Icons';
import { useToast } from './Toast';
import { useAuth } from '../hooks/useAuth';
import { colors, spacing, radius, typography, shadows, fontSizes } from '../config/design-tokens';

type FeedbackType = 'bug' | 'idea';

const FEEDBACK_TYPES: { key: FeedbackType; label: string; placeholder: string }[] = [
  {
    key: 'bug',
    label: 'Bug',
    placeholder: 'What happened? What did you expect instead?',
  },
  {
    key: 'idea',
    label: 'Idea',
    placeholder: 'What would make TOMO better?',
  },
];

export function ShakeBugReporter() {
  const [visible, setVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  // Listen for shake gesture
  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      if (!visible) {
        captureAndOpen();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [visible]);

  const captureAndOpen = useCallback(async () => {
    // Capture screenshot before opening modal
    let uri: string | null = null;
    try {
      uri = await captureScreen({ format: 'jpg', quality: 0.7 });
    } catch {
      // Screenshot failed (e.g., permissions) — continue without it
    }

    setScreenshotUri(uri);
    setVisible(true);
    setMessage('');
    setFeedbackType('bug');
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      inputRef.current?.focus();
    });
  }, [fadeAnim]);

  const closeModal = useCallback(() => {
    Keyboard.dismiss();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setMessage('');
      setScreenshotUri(null);
    });
  }, [fadeAnim]);

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      // Read screenshot as base64 for Sentry attachment
      let screenshotBase64: string | null = null;
      if (screenshotUri) {
        try {
          screenshotBase64 = await FileSystem.readAsStringAsync(screenshotUri, {
            encoding: 'base64',
          });
        } catch {
          // Failed to read screenshot — submit without it
        }
      }

      // Create a Sentry event with the feedback + screenshot attachment
      const eventId = Sentry.captureMessage(`[${feedbackType}] ${trimmed}`, (scope) => {
        scope.setLevel('info');
        scope.setTags({
          feedback_type: feedbackType,
          source: 'shake_reporter',
        });
        scope.setUser({
          email: user?.email ?? undefined,
          id: user?.id ?? undefined,
          username: profile?.name ?? undefined,
        });
        scope.setExtras({
          belt: profile?.belt ?? 'unknown',
          feedback_message: trimmed,
        });
        if (screenshotBase64) {
          scope.addAttachment({
            filename: 'screenshot.jpg',
            contentType: 'image/jpeg',
            data: screenshotBase64,
          });
        }
        return scope;
      });

      // Also attach as user feedback for the Sentry dashboard
      if (eventId) {
        Sentry.captureFeedback({
          associatedEventId: eventId,
          name: profile?.name ?? user?.email ?? 'Beta Tester',
          email: user?.email ?? 'unknown',
          message: `[${feedbackType}] ${trimmed}`,
        });
      }

      closeModal();
      showToast('Feedback sent. Thanks!', 'success');
    } catch {
      showToast('Failed to send. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }, [message, feedbackType, submitting, user, profile, screenshotUri, closeModal, showToast]);

  if (!visible) return null;

  const selectedType = FEEDBACK_TYPES.find((t) => t.key === feedbackType) ?? FEEDBACK_TYPES[0];

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={closeModal}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Pressable style={styles.dismissArea} onPress={closeModal} />
          <Animated.View
            style={[
              styles.sheet,
              {
                paddingBottom: Math.max(insets.bottom, spacing.md),
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Report an Issue</Text>
              <Pressable
                onPress={closeModal}
                style={styles.closeButton}
                hitSlop={12}
              >
                <Icons.Close size={22} color={colors.gray500} />
              </Pressable>
            </View>

            {/* Screenshot Preview */}
            {screenshotUri && (
              <View style={styles.screenshotRow}>
                <Image
                  source={{ uri: screenshotUri }}
                  style={styles.screenshotThumb}
                  resizeMode="cover"
                />
                <Text style={styles.screenshotLabel}>Screenshot captured</Text>
                <Pressable
                  onPress={() => setScreenshotUri(null)}
                  hitSlop={8}
                  style={styles.removeScreenshot}
                >
                  <Icons.Close size={16} color={colors.gray500} />
                </Pressable>
              </View>
            )}

            {/* Type Selector */}
            <View style={styles.typeRow}>
              {FEEDBACK_TYPES.map((type) => (
                <Pressable
                  key={type.key}
                  style={[
                    styles.typeChip,
                    feedbackType === type.key && styles.typeChipActive,
                  ]}
                  onPress={() => setFeedbackType(type.key)}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      feedbackType === type.key && styles.typeChipTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Text Input */}
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder={selectedType.placeholder}
              placeholderTextColor={colors.gray600}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
              textAlignVertical="top"
              returnKeyType="default"
              autoFocus={false}
            />

            {/* Character count */}
            <Text style={styles.charCount}>{message.length}/1000</Text>

            {/* Submit Button */}
            <Pressable
              style={[
                styles.submitButton,
                (!message.trim() || submitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!message.trim() || submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'Sending...' : 'Send Feedback'}
              </Text>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.gray800,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    ...shadows.elevated,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: 'Unbounded-Bold',
    fontSize: fontSizes.lg,
    color: colors.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.gray700,
  },
  screenshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  screenshotThumb: {
    width: 48,
    height: 80,
    borderRadius: radius.md,
  },
  screenshotLabel: {
    fontFamily: 'Inter',
    fontSize: fontSizes.sm,
    color: colors.gray400,
    flex: 1,
  },
  removeScreenshot: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.gray700,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.gray700,
    backgroundColor: 'transparent',
  },
  typeChipActive: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDim,
  },
  typeChipText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSizes.sm,
    color: colors.gray500,
  },
  typeChipTextActive: {
    color: colors.gold,
  },
  input: {
    ...typography.body,
    color: colors.white,
    backgroundColor: colors.black,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    minHeight: 120,
    maxHeight: 200,
    fontSize: fontSizes.base,
  },
  charCount: {
    fontFamily: 'JetBrains Mono',
    fontSize: fontSizes.xs,
    color: colors.gray600,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.gold,
    borderRadius: radius.xl,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: fontSizes.base,
    color: colors.black,
  },
});
