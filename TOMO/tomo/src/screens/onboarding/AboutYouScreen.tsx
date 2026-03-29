/**
 * Onboarding Screen 2: About You
 * Name input, belt picker (5 options), stripes picker (0-4).
 * All required fields.
 *
 * References prototype ProfileScreen belt picker + Settings belt switcher.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, radius, getBeltColor } from '../../config/design-tokens';
import { haptics } from '../../utils/haptics';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';
import { Icons } from '../../components/Icons';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'AboutYou'>;

const BELTS = ['white', 'blue', 'purple', 'brown', 'black'] as const;
const BELT_LABELS: Record<string, string> = {
  white: 'White',
  blue: 'Blue',
  purple: 'Purple',
  brown: 'Brown',
  black: 'Black',
};

export function AboutYouScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [belt, setBelt] = useState<string>('');
  const [stripes, setStripes] = useState<number>(0);

  const canContinue = name.trim().length > 0 && belt !== '';

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgressBar screenName="AboutYou" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icons.Back size={22} color={colors.gray400} />
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>About You</Text>
            <Text style={styles.subtitle}>
              Tell us a little about yourself so we can personalize your experience.
            </Text>
          </View>

          {/* Name */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>FIRST NAME</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your first name"
              placeholderTextColor={colors.gray600}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Belt */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>BELT</Text>
            <View style={styles.beltRow}>
              {BELTS.map((b) => {
                const beltColor = getBeltColor(b);
                const isSelected = belt === b;
                return (
                  <Pressable
                    key={b}
                    style={({ pressed }) => [
                      styles.beltOption,
                      isSelected && styles.beltOptionSelected,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => { haptics.light(); setBelt(b); }}
                  >
                    <View
                      style={[
                        styles.beltCircle,
                        { backgroundColor: beltColor },
                        b === 'white' && styles.beltCircleWhite,
                        isSelected && { borderColor: colors.gold, borderWidth: 3 },
                      ]}
                    />
                    <Text
                      style={[
                        styles.beltLabel,
                        isSelected && styles.beltLabelSelected,
                      ]}
                    >
                      {BELT_LABELS[b]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Stripes — only show after belt selected */}
          {belt !== '' && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>STRIPES</Text>
              <Text style={styles.stripeHint}>0 if you don't have any yet</Text>
              <View style={styles.stripesRow}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <Pressable
                    key={s}
                    style={({ pressed }) => [
                      styles.stripeOption,
                      stripes === s && styles.stripeOptionSelected,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => { haptics.light(); setStripes(s); }}
                  >
                    <Text
                      style={[
                        styles.stripeText,
                        stripes === s && styles.stripeTextSelected,
                      ]}
                    >
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.button, !canContinue && styles.buttonDisabled, pressed && !canContinue ? {} : pressed ? { opacity: 0.85 } : {}]}
            onPress={() => {
              if (canContinue) {
                haptics.medium();
                navigation.navigate('YourTraining', {
                  name: name.trim(),
                  belt,
                  stripes,
                });
              }
            }}
            disabled={!canContinue}
          >
            <Text style={[styles.buttonText, !canContinue && styles.buttonTextDisabled]}>
              Continue
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flex: {
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
    lineHeight: 22,
  },
  field: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  stripeHint: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  textInput: {
    fontFamily: 'Inter',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: '500',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  beltRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  beltOption: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
  },
  beltOptionSelected: {
    backgroundColor: colors.goldDim,
  },
  beltCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: spacing.xs,
  },
  beltCircleWhite: {
    borderWidth: 2,
    borderColor: colors.gray600,
  },
  beltLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
  },
  beltLabelSelected: {
    color: colors.gold,
  },
  stripesRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  stripeOption: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeOptionSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  stripeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray400,
  },
  stripeTextSelected: {
    color: colors.gold,
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
    backgroundColor: colors.gray800,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
  buttonTextDisabled: {
    color: colors.gray600,
  },
});
