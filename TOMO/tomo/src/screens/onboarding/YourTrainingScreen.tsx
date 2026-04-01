/**
 * Onboarding Screen 3: Your Training
 *
 * Redesigned gym picker: location soft-ask → nearby gyms / inline autocomplete.
 * No modal. Everything inline.
 *
 * Also: frequency picker, optional goals + experience.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, radius } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import { GymSearchInput, type SelectedGym } from '../../components/GymSearchInput';
import { haptics } from '../../utils/haptics';
import { useLocation } from '../../hooks/useLocation';
import { findNearbyGyms, type GymWithDistance } from '../../services/gymService';
import { OnboardingProgressBar } from '../../components/OnboardingProgressBar';
import type { LocationPermission } from '../../types/mvp-types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'YourTraining'>;

const FREQUENCY_OPTIONS = [
  { label: '1-2x / week', value: 2 },
  { label: '3-4x / week', value: 4 },
  { label: '5+ / week', value: 5 },
];

const GOAL_OPTIONS = ['Competition', 'Fitness', 'Self-Defense', 'Mental Health', 'Community', 'Hobby'];

const EXPERIENCE_OPTIONS = [
  { label: '< 6 months', value: 'new' },
  { label: '6mo - 2yr', value: 'beginner' },
  { label: '2 - 5yr', value: 'intermediate' },
  { label: '5+ yr', value: 'experienced' },
];

type GymPickerState = 'soft-ask' | 'loading-nearby' | 'nearby' | 'text-only';

/** IBJJF weight class lookup — returns class name for a given weight in kg and gender */
function getWeightClass(weightKg: number, gender: 'male' | 'female' | undefined): string {
  const maleClasses = [
    { max: 57.5, name: 'Rooster (Galo)' },
    { max: 64.0, name: 'Light Feather (Pluma)' },
    { max: 70.0, name: 'Feather (Pena)' },
    { max: 76.0, name: 'Light (Leve)' },
    { max: 82.3, name: 'Middle (Medio)' },
    { max: 88.3, name: 'Medium Heavy (Meio Pesado)' },
    { max: 94.3, name: 'Heavy (Pesado)' },
    { max: 100.5, name: 'Super Heavy (Super Pesado)' },
    { max: Infinity, name: 'Ultra Heavy (Pesadissimo)' },
  ];
  const femaleClasses = [
    { max: 48.5, name: 'Rooster (Galo)' },
    { max: 53.5, name: 'Light Feather (Pluma)' },
    { max: 58.5, name: 'Feather (Pena)' },
    { max: 64.0, name: 'Light (Leve)' },
    { max: 69.0, name: 'Middle (Medio)' },
    { max: 74.0, name: 'Medium Heavy (Meio Pesado)' },
    { max: 79.3, name: 'Heavy (Pesado)' },
    { max: Infinity, name: 'Super Heavy (Super Pesado)' },
  ];

  if (!gender) {
    const m = maleClasses.find(c => weightKg <= c.max);
    const f = femaleClasses.find(c => weightKg <= c.max);
    return `${m?.name ?? 'Ultra Heavy'} (men) / ${f?.name ?? 'Super Heavy'} (women)`;
  }

  const classes = gender === 'male' ? maleClasses : femaleClasses;
  return classes.find(c => weightKg <= c.max)?.name ?? (gender === 'male' ? 'Ultra Heavy' : 'Super Heavy');
}

const LB_TO_KG = 0.453592;
const KG_TO_LB = 2.20462;

export function YourTrainingScreen({ navigation, route }: Props) {
  const { name, belt, stripes, birthDate, gender } = route.params;

  // Location
  const location = useLocation();

  // Gym picker state
  const [gymPickerState, setGymPickerState] = useState<GymPickerState>('soft-ask');
  const [nearbyGyms, setNearbyGyms] = useState<GymWithDistance[]>([]);
  const [selectedGym, setSelectedGym] = useState<SelectedGym | null>(null);

  // Other fields
  const [targetFrequency, setTargetFrequency] = useState<number>(4);
  const [trainingGoals, setTrainingGoals] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [weightText, setWeightText] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');

  // Animations
  const softAskOpacity = useRef(new Animated.Value(1)).current;
  const softAskHeight = useRef(new Animated.Value(1)).current;
  const nearbyOpacity = useRef(new Animated.Value(0)).current;

  const canContinue = selectedGym !== null;

  // Check if location was already granted (e.g. re-entering screen)
  useEffect(() => {
    (async () => {
      const alreadyGranted = await location.checkExistingPermission();
      if (alreadyGranted) {
        // Skip soft ask, go straight to loading nearby
        handleEnableLocation(true);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnableLocation = useCallback(async (alreadyGranted = false) => {
    if (!alreadyGranted) {
      haptics.medium();
    }

    // Animate soft ask card out
    Animated.parallel([
      Animated.timing(softAskOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(softAskHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setGymPickerState('loading-nearby');

    if (alreadyGranted) {
      // Already have permission, just get coords
      await location.requestLocation();
    } else {
      await location.requestLocation();
    }
  }, [location, softAskOpacity, softAskHeight]);

  // When location state changes, fetch nearby gyms
  useEffect(() => {
    if (location.state === 'granted' && location.coords) {
      fetchNearbyGyms();
    } else if (location.state === 'denied') {
      setGymPickerState('text-only');
      animateNearbyIn();
    }
  }, [location.state, location.coords]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNearbyGyms = async () => {
    if (!location.coords) return;

    try {
      const gyms = await findNearbyGyms(location.coords, 25, 5);
      setNearbyGyms(gyms);
      setGymPickerState(gyms.length > 0 ? 'nearby' : 'text-only');
    } catch {
      setGymPickerState('text-only');
    }
    animateNearbyIn();
  };

  const animateNearbyIn = () => {
    Animated.timing(nearbyOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const handleSkipLocation = () => {
    haptics.light();
    location.skip();

    // Animate soft ask out
    Animated.parallel([
      Animated.timing(softAskOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(softAskHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setGymPickerState('text-only');
    setTimeout(() => animateNearbyIn(), 200);
  };

  const handleSelectNearbyGym = (gym: GymWithDistance) => {
    haptics.light();
    setSelectedGym({
      id: gym.id,
      name: gym.name,
      isCustom: false,
      city: gym.city,
      state: gym.stateOrCountry ?? undefined,
      affiliation: gym.affiliation ?? undefined,
      lat: gym.lat,
      lng: gym.lng,
    });
  };

  const handleGymSearchSelected = (gym: SelectedGym | null) => {
    // Only update if this came from the text search (not nearby cards)
    // Nearby card selection is handled by handleSelectNearbyGym
    setSelectedGym(gym);
  };

  const toggleGoal = (goal: string) => {
    haptics.light();
    setTrainingGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const getLocationPermission = (): LocationPermission => {
    if (location.state === 'granted') return 'granted';
    if (location.state === 'denied') return 'denied';
    return 'skipped';
  };

  // Convert weight text to kg for storage
  const getWeightKg = (): number | undefined => {
    const num = parseFloat(weightText);
    if (isNaN(num) || num <= 0) return undefined;
    return weightUnit === 'lb' ? Math.round(num * LB_TO_KG * 10) / 10 : num;
  };

  // Weight class hint text
  const weightClassHint = (() => {
    const kg = getWeightKg();
    if (!kg) return null;
    return getWeightClass(kg, gender);
  })();

  const handleContinue = () => {
    if (!selectedGym) return;
    haptics.medium();
    navigation.navigate('GetStarted', {
      name,
      belt,
      stripes,
      birthDate,
      gender,
      gymId: selectedGym.id,
      gymName: selectedGym.name,
      gymIsCustom: selectedGym.isCustom,
      gymCity: selectedGym.city,
      gymState: selectedGym.state,
      gymAffiliation: selectedGym.affiliation,
      gymLat: selectedGym.lat,
      gymLng: selectedGym.lng,
      locationPermission: getLocationPermission(),
      targetFrequency,
      trainingGoals: trainingGoals.length > 0 ? trainingGoals : undefined,
      experienceLevel: experienceLevel || undefined,
      bodyWeightKg: getWeightKg(),
      weightUnitPreference: weightUnit,
    });
  };

  // ============================================
  // RENDER HELPERS
  // ============================================

  const renderSoftAsk = () => {
    if (gymPickerState !== 'soft-ask') return null;

    // Interpolate height for collapse animation
    const maxHeight = softAskHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 300],
    });

    return (
      <Animated.View style={{ opacity: softAskOpacity, maxHeight, overflow: 'hidden' }}>
        <View style={styles.locationCard}>
          <View style={styles.locationCardHeader}>
            <Icons.MapPin size={22} color={colors.gold} />
            <Text style={styles.locationCardTitle}>Find gyms near you</Text>
          </View>
          <Text style={styles.locationCardDesc}>
            We'll show nearby BJJ gyms so you can pick yours in one tap.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.enableButton, pressed && { opacity: 0.9 }]}
            onPress={() => handleEnableLocation(false)}
          >
            <Text style={styles.enableButtonText}>Enable Location</Text>
          </Pressable>
        </View>
        <Pressable
          style={({ pressed }) => [styles.skipLink, pressed && { opacity: 0.7 }]}
          onPress={handleSkipLocation}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipLinkText}>I'll type it myself</Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderLoadingNearby = () => {
    if (gymPickerState !== 'loading-nearby') return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.gold} size="small" />
        <Text style={styles.loadingText}>Finding nearby gyms...</Text>
      </View>
    );
  };

  const renderNearbyGyms = () => {
    if (gymPickerState !== 'nearby') return null;

    return (
      <Animated.View style={{ opacity: nearbyOpacity }}>
        <View style={styles.nearbyList}>
          {nearbyGyms.map((gym, index) => {
            const isSelected = selectedGym?.id === gym.id && !selectedGym?.isCustom;
            return (
              <Pressable
                key={gym.id || index}
                style={[
                  styles.gymCard,
                  isSelected && styles.gymCardSelected,
                  index < nearbyGyms.length - 1 && styles.gymCardBorder,
                ]}
                onPress={() => handleSelectNearbyGym(gym)}
              >
                <View style={styles.gymCardInfo}>
                  <Text style={styles.gymName}>{gym.name}</Text>
                  <Text style={styles.gymMeta}>
                    {[gym.city, gym.stateOrCountry].filter(Boolean).join(', ')}
                    {gym.distance_mi != null ? ` · ${gym.distance_mi} mi` : ''}
                  </Text>
                </View>
                {isSelected && (
                  <Icons.Check size={18} color={colors.gold} strokeWidth={3} />
                )}
              </Pressable>
            );
          })}
        </View>

        {renderSearchFallback()}
      </Animated.View>
    );
  };

  const renderTextOnlyMode = () => {
    if (gymPickerState !== 'text-only') return null;

    return (
      <Animated.View style={{ opacity: nearbyOpacity }}>
        <GymSearchInput
          initialGym={selectedGym}
          onGymSelected={handleGymSearchSelected}
          coords={location.coords}
        />
      </Animated.View>
    );
  };

  const renderSearchFallback = () => {
    // Hide the search input only when a NEARBY gym is selected (shown via
    // checkmark on the card above). If the user selected via autocomplete
    // search, the GymSearchInput must stay mounted to show its gold
    // confirmation display.
    const isNearbySelection = selectedGym && nearbyGyms.some(g => g.id === selectedGym.id);
    if (isNearbySelection) return null;

    return (
      <GymSearchInput
        initialGym={selectedGym}
        onGymSelected={handleGymSearchSelected}
        coords={location.coords}
      />
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingProgressBar screenName="YourTraining" />
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
            <Text style={styles.title}>Your Training</Text>
          </View>

          {/* Gym Picker */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>YOUR GYM</Text>
            {renderSoftAsk()}
            {renderLoadingNearby()}
            {renderNearbyGyms()}
            {renderTextOnlyMode()}
          </View>

          {/* Frequency */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>HOW OFTEN DO YOU TRAIN?</Text>
            <View style={styles.chipRow}>
              {FREQUENCY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={({ pressed }) => [
                    styles.chip,
                    targetFrequency === opt.value && styles.chipSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => { haptics.light(); setTargetFrequency(opt.value); }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      targetFrequency === opt.value && styles.chipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Optional divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>TELL US MORE (OPTIONAL)</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Goals */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>TRAINING GOALS</Text>
            <View style={styles.chipRow}>
              {GOAL_OPTIONS.map((goal) => (
                <Pressable
                  key={goal}
                  style={({ pressed }) => [
                    styles.chip,
                    trainingGoals.includes(goal) && styles.chipSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      trainingGoals.includes(goal) && styles.chipTextSelected,
                    ]}
                  >
                    {goal}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Experience */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>TOTAL YEARS OF TRAINING</Text>
            <View style={styles.chipRow}>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  style={({ pressed }) => [
                    styles.chip,
                    experienceLevel === opt.value && styles.chipSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => {
                    haptics.light();
                    setExperienceLevel(experienceLevel === opt.value ? '' : opt.value);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      experienceLevel === opt.value && styles.chipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Body Weight */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>BODY WEIGHT (OPTIONAL)</Text>
            <Text style={styles.weightHint}>
              Helps suggest your competition weight class. Only visible to you.
            </Text>
            <View style={styles.weightRow}>
              <TextInput
                style={styles.weightInput}
                value={weightText}
                onChangeText={(val: string) => {
                  // Allow only numbers and one decimal
                  const cleaned = val.replace(/[^0-9.]/g, '');
                  if (cleaned.split('.').length <= 2) {
                    setWeightText(cleaned);
                  }
                }}
                placeholder={weightUnit === 'lb' ? '165' : '75'}
                placeholderTextColor={colors.gray600}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
              <View style={styles.unitToggle}>
                <Pressable
                  style={[
                    styles.unitChip,
                    weightUnit === 'lb' && styles.unitChipSelected,
                  ]}
                  onPress={() => {
                    haptics.light();
                    if (weightUnit !== 'lb') {
                      // Convert kg to lb display
                      const num = parseFloat(weightText);
                      if (!isNaN(num) && num > 0) {
                        setWeightText(String(Math.round(num * KG_TO_LB)));
                      }
                      setWeightUnit('lb');
                    }
                  }}
                >
                  <Text style={[styles.unitText, weightUnit === 'lb' && styles.unitTextSelected]}>lb</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.unitChip,
                    weightUnit === 'kg' && styles.unitChipSelected,
                  ]}
                  onPress={() => {
                    haptics.light();
                    if (weightUnit !== 'kg') {
                      // Convert lb to kg display
                      const num = parseFloat(weightText);
                      if (!isNaN(num) && num > 0) {
                        setWeightText(String(Math.round(num * LB_TO_KG * 10) / 10));
                      }
                      setWeightUnit('kg');
                    }
                  }}
                >
                  <Text style={[styles.unitText, weightUnit === 'kg' && styles.unitTextSelected]}>kg</Text>
                </Pressable>
              </View>
            </View>
            {weightClassHint && (
              <Text style={styles.weightClassHint}>{weightClassHint}</Text>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              !canContinue && styles.buttonDisabled,
              pressed && canContinue && { opacity: 0.85 },
            ]}
            onPress={handleContinue}
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

// ============================================
// STYLES
// ============================================

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
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
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

  // ---- Location Soft Ask ----
  locationCard: {
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  locationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  locationCardDesc: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  enableButton: {
    backgroundColor: colors.gold,
    height: 48,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enableButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.black,
  },
  skipLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  skipLinkText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
  },

  // ---- Loading ----
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
  },

  // ---- Nearby Gyms ----
  nearbyList: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  gymCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  gymCardSelected: {
    backgroundColor: colors.goldDim,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  gymCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  gymCardInfo: {
    flex: 1,
  },
  gymName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  gymMeta: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
  },

  // ---- Chips ----
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  chipText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  chipTextSelected: {
    color: colors.gold,
  },

  // ---- Divider ----
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray700,
  },
  dividerText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
    letterSpacing: 1.5,
  },

  // ---- Weight ----
  weightHint: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  weightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  weightInput: {
    fontFamily: 'Inter',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 17,
    fontWeight: '500',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gray700,
    width: 100,
    textAlign: 'center',
    minHeight: 48,
  },
  unitToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  unitChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    minHeight: 48,
    justifyContent: 'center',
  },
  unitChipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  unitText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  unitTextSelected: {
    color: colors.gold,
  },
  weightClassHint: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gold,
    marginTop: spacing.sm,
  },

  // ---- Footer ----
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
