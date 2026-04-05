/**
 * Session Logger — Review Phase
 *
 * Extracted from SessionLoggerScreen.tsx lines 975-1534.
 * Editable form with all extracted fields plus the DetailBadge helper.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, fontSizes, touchTargets } from '../../config/design-tokens';
import { Icons } from '../../components/Icons';
import { GymChip } from '../../components/GymChip';
import { TECHNIQUE_SUGGESTIONS, SUBMISSION_SUGGESTIONS } from '../../data/bjj-dictionary';
import { sessionService } from '../../services/supabase';
import { ReviewFields, autoWidthChip, Submission } from './types';

export interface ReviewPhaseProps {
  review: ReviewFields;
  setReview: React.Dispatch<React.SetStateAction<ReviewFields>>;
  transcript: string;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  gymName: string | null;
  isGymOverridden: boolean;
  onGymPress: () => void;
  onGymReset: () => void;
}

// ============================================
// DETAIL BADGE HELPER
// ============================================

function DetailBadge({ label, onPress }: { label: string; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.detailBadge, pressed && { opacity: 0.7 }]} onPress={onPress}>
        <Text style={styles.detailBadgeText}>{label}</Text>
        <Icons.Edit size={10} color={colors.gray500} />
      </Pressable>
    );
  }
  return (
    <View style={styles.detailBadge}>
      <Text style={styles.detailBadgeText}>{label}</Text>
    </View>
  );
}

// ============================================
// REVIEW PHASE
// ============================================

export function ReviewPhase({
  review,
  setReview,
  transcript,
  saving,
  onSave,
  onCancel,
  gymName,
  isGymOverridden,
  onGymPress,
  onGymReset,
}: ReviewPhaseProps) {

  const [techniqueInput, setTechniqueInput] = useState('');
  const [injuryInput, setInjuryInput] = useState('');
  const [subGivenInput, setSubGivenInput] = useState('');
  const [subReceivedInput, setSubReceivedInput] = useState('');
  const [editingDetail, setEditingDetail] = useState<'mode' | 'duration' | null>(null);
  const [jiggleSection, setJiggleSection] = useState<'submissionsGiven' | 'submissionsReceived' | null>(null);

  // Autocomplete state
  const [userTechHistory, setUserTechHistory] = useState<string[]>([]);
  const [userSubHistory, setUserSubHistory] = useState<string[]>([]);

  useEffect(() => {
    sessionService.getAutocompleteHistory().then(({ techniques, submissions }) => {
      setUserTechHistory(techniques);
      setUserSubHistory(submissions);
    }).catch(() => { /* silent fallback to static-only */ });
  }, []);

  const getSuggestions = (input: string, type: 'technique' | 'submission', alreadyAdded: string[]): string[] => {
    if (!input || input.length < 2) return [];
    const lower = input.toLowerCase();
    const addedLower = new Set(alreadyAdded.map((a) => a.toLowerCase()));

    // User history first, then static dictionary
    const history = type === 'technique' ? userTechHistory : userSubHistory;
    const staticList = type === 'technique' ? TECHNIQUE_SUGGESTIONS : SUBMISSION_SUGGESTIONS;

    const scored: { term: string; score: number }[] = [];
    const seen = new Set<string>();

    for (const term of [...history, ...staticList]) {
      const termLower = term.toLowerCase();
      if (seen.has(termLower) || addedLower.has(termLower)) continue;
      seen.add(termLower);

      if (termLower.startsWith(lower)) {
        // Prefix match — highest priority; user history terms get extra boost
        scored.push({ term, score: history.includes(term) ? 3 : 2 });
      } else if (termLower.includes(lower)) {
        // Substring match
        scored.push({ term, score: history.includes(term) ? 1.5 : 1 });
      }
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s) => s.term);
  };
  const jiggleAnim = useRef(new Animated.Value(0)).current;

  const startJiggle = (section: 'submissionsGiven' | 'submissionsReceived') => {
    setJiggleSection(section);
    Animated.loop(
      Animated.sequence([
        Animated.timing(jiggleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(jiggleAnim, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(jiggleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(jiggleAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopJiggle = () => {
    jiggleAnim.stopAnimation();
    jiggleAnim.setValue(0);
    setJiggleSection(null);
  };

  const jiggleRotation = jiggleAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2deg', '0deg', '2deg'],
  });

  const addToList = (field: 'techniquesDrilled' | 'injuries', value: string) => {
    if (!value.trim()) return;
    setReview((prev) => ({ ...prev, [field]: [...(prev[field] as string[]), value.trim()] }));
  };

  const removeFromList = (field: 'techniquesDrilled' | 'injuries', index: number) => {
    setReview((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: string, i: number) => i !== index),
    }));
  };

  const addSubmission = (direction: 'submissionsGiven' | 'submissionsReceived', type: string) => {
    if (!type.trim()) return;
    const existing = review[direction].find((s) => s.type.toLowerCase() === type.trim().toLowerCase());
    if (existing) {
      setReview((prev) => ({
        ...prev,
        [direction]: prev[direction].map((s) =>
          s.type.toLowerCase() === type.trim().toLowerCase() ? { ...s, count: s.count + 1 } : s
        ),
      }));
    } else {
      setReview((prev) => ({
        ...prev,
        [direction]: [...prev[direction], { type: type.trim(), count: 1 }],
      }));
    }
  };

  const removeSubmission = (direction: 'submissionsGiven' | 'submissionsReceived', index: number) => {
    setReview((prev) => ({
      ...prev,
      [direction]: prev[direction].filter((_, i) => i !== index),
    }));
  };

  const updateSubmissionCount = (direction: 'submissionsGiven' | 'submissionsReceived', index: number, delta: number) => {
    setReview((prev) => {
      const updated = prev[direction].map((s, i) =>
        i === index ? { ...s, count: Math.max(1, s.count + delta) } : s
      );
      return { ...prev, [direction]: updated };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.reviewHeader}>
        <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.reviewTitle}>Review Session</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.reviewContent} keyboardShouldPersistTaps="handled">

        {/* Gym chip */}
        <GymChip
          gymName={gymName}
          isOverridden={isGymOverridden}
          onPress={onGymPress}
          onReset={onGymReset}
        />

        {/* 1. Training Mode + Duration badges */}
        <View style={styles.detailsRow}>
          <DetailBadge label={review.trainingMode === 'nogi' ? 'No-Gi' : review.trainingMode === 'gi' ? 'Gi' : 'Other'} onPress={() => setEditingDetail('mode')} />
          <DetailBadge label={`${review.durationMinutes} min`} onPress={() => setEditingDetail('duration')} />
        </View>

        {/* Inline detail editors */}
        {editingDetail === 'mode' && (
          <View style={styles.reviewField}>
            <Text style={styles.fieldLabel}>TRAINING MODE</Text>
            <View style={styles.chipRow}>
              {(['gi', 'nogi', 'other'] as const).map((mode) => (
                <Pressable
                  key={mode}
                  style={({ pressed }) => [styles.smallChip, autoWidthChip, review.trainingMode === mode && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => { setReview((p) => ({ ...p, trainingMode: mode })); setEditingDetail(null); }}
                >
                  <Text style={[styles.smallChipText, review.trainingMode === mode && styles.smallChipTextSelected]}>
                    {mode === 'nogi' ? 'No-Gi' : mode === 'gi' ? 'Gi' : 'Other'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {editingDetail === 'duration' && (
          <View style={styles.reviewField}>
            <Text style={styles.fieldLabel}>DURATION</Text>
            <View style={styles.chipRow}>
              {[30, 45, 60, 75, 90, 120].map((min) => (
                <Pressable
                  key={min}
                  style={({ pressed }) => [styles.smallChip, review.durationMinutes === min && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => { setReview((p) => ({ ...p, durationMinutes: min })); setEditingDetail(null); }}
                >
                  <Text style={[styles.smallChipText, review.durationMinutes === min && styles.smallChipTextSelected]}>
                    {min}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 2. Warm-up */}
        <View style={[styles.reviewField, review.warmedUp === null && styles.reviewFieldEmpty]}>
          <Text style={styles.fieldLabel}>WARM-UP</Text>
          <View style={styles.chipRow}>
            {([true, false] as const).map((val) => (
              <Pressable
                key={String(val)}
                style={({ pressed }) => [styles.smallChip, autoWidthChip, review.warmedUp === val && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                onPress={() => setReview((p) => ({ ...p, warmedUp: val }))}
              >
                <Text style={[styles.smallChipText, review.warmedUp === val && styles.smallChipTextSelected]}>
                  {val ? 'Yes' : 'No'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 3. Techniques Trained / Lesson Topic */}
        <View style={[styles.reviewField, review.techniquesDrilled.length === 0 && styles.reviewFieldEmpty]}>
          <Text style={styles.fieldLabel}>TECHNIQUES TRAINED / LESSON TOPIC</Text>
          <View style={styles.tagList}>
            {review.techniquesDrilled.map((t, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.tag, pressed && { opacity: 0.7 }]} onPress={() => removeFromList('techniquesDrilled', i)}>
                <Text style={styles.tagText}>{t}</Text>
                <Icons.Close size={14} color={colors.gray400} />
              </Pressable>
            ))}
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.reviewInput, { flex: 1 }]}
              value={techniqueInput}
              onChangeText={setTechniqueInput}
              placeholder="Add technique or topic (e.g. guard passing)"
              placeholderTextColor={colors.gray600}
              returnKeyType="done"
              onSubmitEditing={() => {
                addToList('techniquesDrilled', techniqueInput);
                setTechniqueInput('');
              }}
            />
          </View>
          {getSuggestions(techniqueInput, 'technique', review.techniquesDrilled).length > 0 && (
            <View style={styles.suggestionsDropdown}>
              {getSuggestions(techniqueInput, 'technique', review.techniquesDrilled).map((suggestion) => (
                <Pressable
                  key={suggestion}
                  style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: colors.gray700 }]}
                  onPress={() => {
                    addToList('techniquesDrilled', suggestion);
                    setTechniqueInput('');
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                  {userTechHistory.includes(suggestion) && (
                    <Text style={styles.suggestionBadge}>recent</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* 4. Did You Spar? */}
        <View style={styles.reviewField}>
          <Text style={styles.fieldLabel}>DID YOU SPAR?</Text>
          <View style={styles.chipRow}>
            {([true, false] as const).map((val) => (
              <Pressable
                key={String(val)}
                style={({ pressed }) => [styles.smallChip, autoWidthChip, review.didSpar === val && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                onPress={() => setReview((p) => ({ ...p, didSpar: val, ...(val ? {} : { sparringRounds: 0, submissionsGiven: [], submissionsReceived: [] }) }))}
              >
                <Text style={[styles.smallChipText, review.didSpar === val && styles.smallChipTextSelected]}>
                  {val ? 'Yes' : 'No'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 5. Sparring Rounds (conditional) */}
        {review.didSpar && (
          <View style={[styles.reviewField, review.sparringRounds === 0 && styles.reviewFieldEmpty]}>
            <Text style={styles.fieldLabel}>SPARRING ROUNDS</Text>
            <View style={styles.chipRow}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <Pressable
                  key={n}
                  style={({ pressed }) => [styles.smallChip, review.sparringRounds === n && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => setReview((p) => ({ ...p, sparringRounds: n }))}
                >
                  <Text style={[styles.smallChipText, review.sparringRounds === n && styles.smallChipTextSelected]}>
                    {n === 7 ? '7+' : n}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* 6. Submissions Landed (conditional) */}
        {review.didSpar && (
          <Pressable
            style={[styles.reviewField, review.submissionsGiven.length === 0 && styles.reviewFieldEmpty]}
            onPress={() => jiggleSection === 'submissionsGiven' && stopJiggle()}
          >
            <Text style={[styles.fieldLabel, { color: colors.positive }]}>SUBMISSIONS LANDED</Text>
            <View style={styles.tagList}>
              {review.submissionsGiven.map((s, i) => (
                <Pressable
                  key={i}
                  onLongPress={() => startJiggle('submissionsGiven')}
                  onPress={() => jiggleSection !== 'submissionsGiven' && updateSubmissionCount('submissionsGiven', i, 1)}
                  delayLongPress={400}
                >
                  <Animated.View style={[styles.tag, styles.tagPositive, { gap: 8 }, jiggleSection === 'submissionsGiven' && { transform: [{ rotate: jiggleRotation }] }]}>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsGiven', i, -1)}>
                      <Icons.Minus size={16} color={colors.positive} />
                    </Pressable>
                    <Text style={[styles.tagText, { color: colors.positive }]}>{s.type} ({s.count})</Text>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsGiven', i, 1)}>
                      <Icons.Plus size={16} color={colors.positive} />
                    </Pressable>
                    {jiggleSection === 'submissionsGiven' && (
                      <Pressable
                        style={styles.jiggleDeleteBadge}
                        hitSlop={8}
                        onPress={() => { removeSubmission('submissionsGiven', i); if (review.submissionsGiven.length <= 1) stopJiggle(); }}
                      >
                        <Icons.Minus size={12} color="#fff" />
                      </Pressable>
                    )}
                  </Animated.View>
                </Pressable>
              ))}
            </View>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.reviewInput, { flex: 1 }]}
                value={subGivenInput}
                onChangeText={setSubGivenInput}
                placeholder="Add submission (e.g. armbar)"
                placeholderTextColor={colors.gray600}
                returnKeyType="done"
                onSubmitEditing={() => {
                  addSubmission('submissionsGiven', subGivenInput);
                  setSubGivenInput('');
                }}
              />
            </View>
            {getSuggestions(subGivenInput, 'submission', review.submissionsGiven.map((s) => s.type)).length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {getSuggestions(subGivenInput, 'submission', review.submissionsGiven.map((s) => s.type)).map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: colors.gray700 }]}
                    onPress={() => {
                      addSubmission('submissionsGiven', suggestion);
                      setSubGivenInput('');
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                    {userSubHistory.includes(suggestion) && (
                      <Text style={styles.suggestionBadge}>recent</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        )}

        {/* 7. Got Caught (conditional) */}
        {review.didSpar && (
          <Pressable
            style={[styles.reviewField, review.submissionsReceived.length === 0 && styles.reviewFieldEmpty]}
            onPress={() => jiggleSection === 'submissionsReceived' && stopJiggle()}
          >
            <Text style={[styles.fieldLabel, { color: colors.negative }]}>GOT CAUGHT</Text>
            <View style={styles.tagList}>
              {review.submissionsReceived.map((s, i) => (
                <Pressable
                  key={i}
                  onLongPress={() => startJiggle('submissionsReceived')}
                  onPress={() => jiggleSection !== 'submissionsReceived' && updateSubmissionCount('submissionsReceived', i, 1)}
                  delayLongPress={400}
                >
                  <Animated.View style={[styles.tag, styles.tagNegative, { gap: 8 }, jiggleSection === 'submissionsReceived' && { transform: [{ rotate: jiggleRotation }] }]}>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsReceived', i, -1)}>
                      <Icons.Minus size={16} color={colors.negative} />
                    </Pressable>
                    <Text style={[styles.tagText, { color: colors.negative }]}>{s.type} ({s.count})</Text>
                    <Pressable hitSlop={8} onPress={() => updateSubmissionCount('submissionsReceived', i, 1)}>
                      <Icons.Plus size={16} color={colors.negative} />
                    </Pressable>
                    {jiggleSection === 'submissionsReceived' && (
                      <Pressable
                        style={styles.jiggleDeleteBadge}
                        hitSlop={8}
                        onPress={() => { removeSubmission('submissionsReceived', i); if (review.submissionsReceived.length <= 1) stopJiggle(); }}
                      >
                        <Icons.Minus size={12} color="#fff" />
                      </Pressable>
                    )}
                  </Animated.View>
                </Pressable>
              ))}
            </View>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.reviewInput, { flex: 1 }]}
                value={subReceivedInput}
                onChangeText={setSubReceivedInput}
                placeholder="Add submission (e.g. triangle)"
                placeholderTextColor={colors.gray600}
                returnKeyType="done"
                onSubmitEditing={() => {
                  addSubmission('submissionsReceived', subReceivedInput);
                  setSubReceivedInput('');
                }}
              />
            </View>
            {getSuggestions(subReceivedInput, 'submission', review.submissionsReceived.map((s) => s.type)).length > 0 && (
              <View style={styles.suggestionsDropdown}>
                {getSuggestions(subReceivedInput, 'submission', review.submissionsReceived.map((s) => s.type)).map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    style={({ pressed }) => [styles.suggestionRow, pressed && { backgroundColor: colors.gray700 }]}
                    onPress={() => {
                      addSubmission('submissionsReceived', suggestion);
                      setSubReceivedInput('');
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                    {userSubHistory.includes(suggestion) && (
                      <Text style={styles.suggestionBadge}>recent</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        )}

        {/* 8. Injuries */}
        <View style={[styles.reviewField, review.injuries.length === 0 && styles.reviewFieldEmpty]}>
          <Text style={[styles.fieldLabel, { color: colors.warning }]}>INJURIES</Text>
          <View style={styles.tagList}>
            {review.injuries.map((injury, i) => (
              <Pressable key={i} style={({ pressed }) => [styles.tag, styles.tagWarning, pressed && { opacity: 0.7 }]} onPress={() => removeFromList('injuries', i)}>
                <Text style={[styles.tagText, { color: colors.warning }]}>{injury}</Text>
                <Icons.Close size={14} color={colors.warning} />
              </Pressable>
            ))}
          </View>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.reviewInput, { flex: 1 }]}
              value={injuryInput}
              onChangeText={setInjuryInput}
              placeholder="Add injury (e.g. sore elbow)"
              placeholderTextColor={colors.gray600}
              returnKeyType="done"
              onSubmitEditing={() => {
                addToList('injuries', injuryInput);
                setInjuryInput('');
              }}
            />
          </View>
        </View>

        {/* 9. Instructor */}
        <View style={[styles.reviewField, review.instructor === '' && styles.reviewFieldEmpty]}>
          <Text style={styles.fieldLabel}>INSTRUCTOR</Text>
          <TextInput
            style={styles.reviewInput}
            value={review.instructor}
            onChangeText={(t) => setReview((p) => ({ ...p, instructor: t }))}
            placeholder="Who taught class?"
            placeholderTextColor={colors.gray600}
          />
        </View>

        {/* 10. Session Type */}
        <View style={styles.reviewField}>
          <Text style={styles.fieldLabel}>SESSION TYPE</Text>
          <View style={styles.chipRow}>
            {(['class', 'open_mat', 'competition_training', 'other'] as const).map((kind) => (
              <Pressable
                key={kind}
                style={({ pressed }) => [styles.smallChip, autoWidthChip, review.sessionKind === kind && styles.smallChipSelected, pressed && { opacity: 0.7 }]}
                onPress={() => setReview((p) => ({ ...p, sessionKind: kind }))}
              >
                <Text style={[styles.smallChipText, review.sessionKind === kind && styles.smallChipTextSelected]}>
                  {kind === 'open_mat' ? 'Open Mat' : kind === 'competition_training' ? 'Comp Training' : kind === 'class' ? 'Regular Class' : 'Other'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Voice Transcript — full text at bottom */}
        {transcript ? (
          <View style={styles.transcriptCard}>
            <View style={styles.transcriptCardHeader}>
              <Text style={styles.transcriptCardLabel}>VOICE TRANSCRIPT</Text>
            </View>
            <Text style={[styles.transcriptCardText, { maxHeight: 200 }]}>
              {transcript}
            </Text>
          </View>
        ) : null}

        {/* Save button */}
        <Pressable
          style={({ pressed }) => [styles.saveButton, saving && { opacity: 0.7 }, pressed && !saving && { opacity: 0.85 }]}
          onPress={onSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.saveButtonText}>Save Session</Text>
          )}
        </Pressable>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  cancelText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  reviewTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  reviewContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  detailBadgeText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray300,
    textTransform: 'capitalize',
  },
  fieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  reviewField: {
    marginBottom: spacing.lg,
  },
  reviewFieldEmpty: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingLeft: spacing.sm,
    backgroundColor: colors.goldUltraDim,
    borderRadius: radius.sm,
  },
  reviewInput: {
    fontFamily: 'Inter',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  jiggleDeleteBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.negative,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  suggestionsDropdown: {
    backgroundColor: colors.gray800,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginTop: 4,
    overflow: 'hidden',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray700,
  },
  suggestionText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray300,
  },
  suggestionBadge: {
    fontFamily: 'JetBrains Mono',
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tagPositive: {
    backgroundColor: colors.positiveDim,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  tagNegative: {
    backgroundColor: colors.negativeDim,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  tagWarning: {
    backgroundColor: colors.warningDim,
    borderColor: colors.warningDimBorder,
  },
  tagText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray300,
  },
  addRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallChip: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallChipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  smallChipText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray400,
  },
  smallChipTextSelected: {
    color: colors.gold,
  },
  transcriptCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    overflow: 'hidden',
  },
  transcriptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  transcriptCardLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  transcriptCardText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.gold,
    paddingVertical: 18,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
});
