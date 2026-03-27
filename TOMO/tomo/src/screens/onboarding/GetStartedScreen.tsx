/**
 * Onboarding Screen 4: Get Started
 *
 * Logging preference (voice/text) → save profile → chat-style payoff moment.
 * The payoff introduces the AI companion in the chat interaction style
 * users will see throughout the app.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AudioModule } from 'expo-audio';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, radius } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import { MicPermissionPrimer } from '../../components/MicPermissionPrimer';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/Toast';
import { profileService } from '../../services/supabase';
import { userGymService } from '../../services/userGymService';
import { haptics } from '../../utils/haptics';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'GetStarted'>;

// ============================================
// CHAT PAYOFF MESSAGES
// ============================================

function buildPayoffMessages(name: string, belt: string, stripes: number, gymName: string): string[] {
  const stripeText = stripes > 0
    ? `, ${stripes} stripe${stripes !== 1 ? 's' : ''}`
    : '';
  const beltLabel = belt.charAt(0).toUpperCase() + belt.slice(1);

  return [
    `Hey ${name}. ${beltLabel} belt${stripeText}, training at ${gymName}. Got it.`,
    "After each session, just talk. I'll track your progress and spot the patterns.",
    "Let's get to work.",
  ];
}

// ============================================
// CHAT BUBBLE WITH TYPEWRITER
// ============================================

function ChatBubble({
  message,
  delay,
  onComplete,
}: {
  message: string;
  delay: number;
  onComplete?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const translateY = useRef(new Animated.Value(12)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Slide bubble in after delay
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(showTimer);
  }, [delay, opacity, translateY]);

  // Stable ref for onComplete to avoid re-triggering effect on parent re-renders
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Typewriter effect once visible
  useEffect(() => {
    if (!visible) return;

    // Small pause before typing starts
    const startTimer = setTimeout(() => {
      const typeTimer = setInterval(() => {
        setCharIndex((prev) => {
          const next = prev + 1;
          if (next >= message.length) {
            clearInterval(typeTimer);
            // Notify parent this bubble is done
            setTimeout(() => onCompleteRef.current?.(), 300);
            return message.length;
          }
          return next;
        });
      }, 25);

      timerRef.current = typeTimer as any;
    }, 150);

    return () => {
      clearTimeout(startTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.chatBubble,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.chatBubbleText}>
        {message.slice(0, charIndex)}
        {charIndex < message.length && (
          <Text style={styles.chatCursor}>|</Text>
        )}
      </Text>
    </Animated.View>
  );
}

// ============================================
// CHAT PAYOFF OVERLAY
// ============================================

function ChatPayoff({
  name,
  belt,
  stripes,
  gymName,
  onComplete,
}: {
  name: string;
  belt: string;
  stripes: number;
  gymName: string;
  onComplete: () => void;
}) {
  const messages = buildPayoffMessages(name, belt, stripes, gymName);
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  // Track which bubble is allowed to appear
  const [activeBubble, setActiveBubble] = useState(0);

  // Fade in the container
  useEffect(() => {
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [containerOpacity]);

  // When a bubble finishes typing, show the next one
  const handleBubbleComplete = (index: number) => {
    if (index < messages.length - 1) {
      setActiveBubble(index + 1);
    } else {
      // All bubbles done — show CTA
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={[styles.payoffContainer, { opacity: containerOpacity }]}>
      {/* TOMO label */}
      <View style={styles.chatHeader}>
        <View style={styles.chatAvatar}>
          <Text style={styles.chatAvatarText}>友</Text>
        </View>
        <Text style={styles.chatName}>TOMO</Text>
      </View>

      {/* Chat bubbles — each waits for the previous to finish typing */}
      <View style={styles.chatMessages}>
        {messages.map((msg, i) => (
          i <= activeBubble ? (
            <ChatBubble
              key={i}
              message={msg}
              delay={i === 0 ? 400 : 200}
              onComplete={() => handleBubbleComplete(i)}
            />
          ) : null
        ))}
      </View>

      {/* CTA */}
      <Animated.View style={[styles.payoffFooter, { opacity: ctaOpacity }]}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
          onPress={() => {
            haptics.medium();
            onComplete();
          }}
        >
          <Text style={styles.buttonText}>Start Training</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ============================================
// MAIN SCREEN
// ============================================

export function GetStartedScreen({ route }: Props) {
  const params = route.params;
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [preference, setPreference] = useState<'voice' | 'text'>('voice');
  const [saving, setSaving] = useState(false);
  const [showPayoff, setShowPayoff] = useState(false);
  const [showMicPrimer, setShowMicPrimer] = useState(false);

  // Fade out the main content when transitioning to payoff
  const mainOpacity = useRef(new Animated.Value(1)).current;

  // After profile is saved, transition to the chat payoff
  const transitionToPayoff = () => {
    Animated.timing(mainOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowPayoff(true);
    });
  };

  const handleStart = async () => {
    if (!user) return;
    haptics.medium();
    setSaving(true);

    try {
      await profileService.create({
        name: params.name,
        belt: params.belt as any,
        stripes: params.stripes,
        gym_id: params.gymId,
        gym_name: params.gymName,
        gym_is_custom: params.gymIsCustom,
        gym_city: params.gymCity,
        gym_state: params.gymState,
        gym_affiliation: params.gymAffiliation,
        gym_lat: params.gymLat,
        gym_lng: params.gymLng,
        location_permission: params.locationPermission,
        target_frequency: params.targetFrequency,
        logging_preference: preference,
        onboarding_complete: true,
        training_goals: params.trainingGoals,
        experience_level: params.experienceLevel as any,
      });

      // Create initial user_gyms row (best-effort, non-blocking for onboarding)
      if (params.gymName) {
        userGymService.add({
          gym_id: params.gymId,
          gym_name: params.gymName,
          gym_city: params.gymCity ?? null,
          gym_state: params.gymState ?? null,
          gym_affiliation: params.gymAffiliation ?? null,
          gym_lat: params.gymLat ?? null,
          gym_lng: params.gymLng ?? null,
          is_primary: true,
          relationship: 'home',
        }).catch(() => {}); // Non-critical — profile has the gym data as fallback
      }

      // If voice preference, check if we need mic permission
      if (preference === 'voice') {
        const status = await AudioModule.getRecordingPermissionsAsync();
        if (!status.granted) {
          // Show our branded primer before the system dialog
          setShowMicPrimer(true);
          return;
        }
      }

      // Text preference or mic already granted — go straight to payoff
      transitionToPayoff();
    } catch (error) {
      setSaving(false);
      showToast('Could not save your profile. Please try again.', 'error');
    }
  };

  const handleMicEnable = async () => {
    setShowMicPrimer(false);
    // Triggers the iOS system permission dialog
    await AudioModule.requestRecordingPermissionsAsync();
    // Regardless of grant/deny, proceed to the payoff
    transitionToPayoff();
  };

  const handleMicSkip = () => {
    setShowMicPrimer(false);
    // Permission will be requested on first recording attempt (existing fallback)
    transitionToPayoff();
  };

  const handlePayoffComplete = async () => {
    await refreshProfile();
  };

  // ---- Payoff mode ----
  if (showPayoff) {
    return (
      <SafeAreaView style={styles.container}>
        <OnboardingProgressBar screenName="GetStarted" />
        <ChatPayoff
          name={params.name}
          belt={params.belt}
          stripes={params.stripes}
          gymName={params.gymName}
          onComplete={handlePayoffComplete}
        />
      </SafeAreaView>
    );
  }

  // ---- Normal mode ----
  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgressBar screenName="GetStarted" />
      <Animated.View style={[styles.content, { opacity: mainOpacity }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How Do You Want to Log?</Text>
          <Text style={styles.subtitle}>
            You can always change this later in settings.
          </Text>
        </View>

        {/* Voice option */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            preference === 'voice' && styles.optionCardSelected,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => { haptics.light(); setPreference('voice'); }}
        >
          <View style={styles.optionIcon}>
            <Icons.Mic
              size={32}
              color={preference === 'voice' ? colors.gold : colors.gray500}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                preference === 'voice' && styles.optionTitleSelected,
              ]}
            >
              Voice
            </Text>
            <Text style={styles.optionDescription}>
              Talk about your session and AI extracts the details. Fastest way to log when
              you're exhausted after training.
            </Text>
          </View>
          {preference === 'voice' && (
            <View style={styles.checkmark}>
              <Icons.Check size={18} color={colors.gold} strokeWidth={3} />
            </View>
          )}
        </Pressable>

        {/* Text option */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            preference === 'text' && styles.optionCardSelected,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => { haptics.light(); setPreference('text'); }}
        >
          <View style={styles.optionIcon}>
            <Icons.Keyboard
              size={32}
              color={preference === 'text' ? colors.gold : colors.gray500}
            />
          </View>
          <View style={styles.optionContent}>
            <Text
              style={[
                styles.optionTitle,
                preference === 'text' && styles.optionTitleSelected,
              ]}
            >
              Text
            </Text>
            <Text style={styles.optionDescription}>
              Fill in the fields manually. Good if you prefer typing or want to log later
              at home.
            </Text>
          </View>
          {preference === 'text' && (
            <View style={styles.checkmark}>
              <Icons.Check size={18} color={colors.gold} strokeWidth={3} />
            </View>
          )}
        </Pressable>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: mainOpacity }]}>
        <Pressable
          style={({ pressed }) => [styles.button, saving && styles.buttonDisabled, pressed && !saving && { opacity: 0.85 }]}
          onPress={handleStart}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.buttonText}>Start Logging</Text>
          )}
        </Pressable>
      </Animated.View>

      {/* Mic permission primer — shows before iOS system dialog */}
      <MicPermissionPrimer
        visible={showMicPrimer}
        onEnable={handleMicEnable}
        onSkip={handleMicSkip}
      />
    </SafeAreaView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  optionCardSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray400,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: colors.white,
  },
  optionDescription: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray500,
    lineHeight: 22,
  },
  checkmark: {
    marginLeft: spacing.sm,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 18,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },

  // ---- Chat Payoff ----
  payoffContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg,
  },
  chatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarText: {
    fontSize: 14,
    color: colors.gold,
  },
  chatName: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
  },
  chatMessages: {
    gap: spacing.sm,
  },
  chatBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gray800,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: '88%',
  },
  chatBubbleText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    lineHeight: 22,
  },
  chatCursor: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gold,
  },
  payoffFooter: {
    paddingTop: spacing.xl,
  },
});
