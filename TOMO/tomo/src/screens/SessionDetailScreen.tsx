/**
 * Session Detail Screen — View full session + edit via bottom sheets + delete
 *
 * Ported from prototype's SessionDetail.tsx:
 * - Header: date, training mode badge, kind, duration
 * - AI narrative summary (collapsible, gold left border)
 * - Sections: techniques, sparring, injuries, instructor, warm-up, notes
 * - Tap section → bottom sheet edit modal
 * - Delete with confirmation (soft delete)
 * - Transcript collapsible at bottom
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { JournalStackParamList } from '../navigation/MainTabNavigator';
import { colors, spacing, radius } from '../config/design-tokens';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icons } from '../components/Icons';
import { SessionDetailSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { sessionService, audioService, profileService } from '../services/supabase';
import { userGymService } from '../services/userGymService';
import { generateNarrativeSummary } from '../utils/journal-helpers';
import type { Session, SessionUpdate, TrainingMode, SessionKind, Submission } from '../types/mvp-types';
import { haptics } from '../utils/haptics';

type Props = NativeStackScreenProps<JournalStackParamList, 'SessionDetail'>;

// ============================================
// MAIN COMPONENT
// ============================================

export function SessionDetailScreen({ route, navigation }: Props) {
  const { sessionId } = route.params;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [editSheet, setEditSheet] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showNarrative, setShowNarrative] = useState(true);
  const [gymName, setGymName] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadSession = useCallback(async () => {
    try {
      const data = await sessionService.get(sessionId);
      setSession(data);
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Look up gym name: user_gym_id → userGymService, fallback → profile gym_name
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      if (session.user_gym_id) {
        const gyms = await userGymService.list();
        const match = gyms.find((g) => g.id === session.user_gym_id);
        if (!cancelled && match) { setGymName(match.gym_name); return; }
      }
      // Fallback: profile gym
      const profile = await profileService.get();
      if (!cancelled && profile?.gym_name) { setGymName(profile.gym_name); return; }
      if (!cancelled) setGymName(null);
    })();
    return () => { cancelled = true; };
  }, [session?.id, session?.user_gym_id]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const [isSaving, setIsSaving] = useState(false);
  const handleUpdate = async (fields: SessionUpdate) => {
    if (!session || isSaving) return;
    setIsSaving(true);
    try {
      await sessionService.update(session.id, fields);
      await loadSession();
      setEditSheet(null);
      haptics.success();
      showToast('Changes saved', 'success');
    } catch (err) {
      haptics.error();
      showToast('Could not save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = () => {
    if (isDeleting) return;
    haptics.warning();
    Alert.alert(
      'Delete this session?',
      "This can't be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await sessionService.softDelete(session!.id);
              // Clean up audio file if it exists
              if (session!.audio_path) {
                audioService.delete(session!.audio_path).catch(() => {});
              }
              showToast('Session deleted', 'info');
              navigation.goBack();
            } catch (err) {
              setIsDeleting(false);
              showToast('Could not delete session', 'error');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <SessionDetailSkeleton />
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Session not found</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const modeLabel = session.training_mode === 'nogi' ? 'No-Gi' : session.training_mode === 'gi' ? 'Gi' : session.training_mode === 'other' ? 'Other' : '';
  const kindLabel = session.session_kind === 'open_mat' ? 'Open Mat' : session.session_kind ? session.session_kind.charAt(0).toUpperCase() + session.session_kind.slice(1) : '';
  const modeColor = session.training_mode === 'gi' ? colors.trainingGi : session.training_mode === 'nogi' ? colors.trainingNogi : colors.gray500;
  const narrative = generateNarrativeSummary(session);

  const formattedDate = new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = session.time
    ? new Date(`2000-01-01T${session.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow1}>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Icons.Back size={22} color={colors.gray400} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.headerCenter, pressed && { opacity: 0.7 }]} onPress={() => setEditSheet('date')}>
            <View style={styles.editDateRow}>
              <Text style={styles.headerDate}>{formattedDate}{formattedTime ? ` · ${formattedTime}` : ''}</Text>
              <Icons.Edit size={12} color={colors.gray600} />
            </View>
          </Pressable>
          <View style={{ width: 44 }} />
        </View>
        <Pressable style={({ pressed }) => [styles.headerRow2, pressed && { opacity: 0.7 }]} onPress={() => setEditSheet('trainingDetails')} accessibilityRole="button" accessibilityLabel="Edit training details">
          <View style={styles.headerMeta}>
            <View style={[styles.modeBadge, { backgroundColor: modeColor + '22', borderColor: modeColor + '44' }]}>
              <Text style={[styles.modeBadgeText, { color: modeColor }]}>{modeLabel}</Text>
            </View>
            <Text style={styles.headerDetail}>{kindLabel}</Text>
            <Text style={styles.headerDetail}>{session.duration_minutes} min</Text>
            {session.did_spar && (
              <Text style={styles.headerDetail}>{session.sparring_rounds} rnd{(session.sparring_rounds ?? 0) !== 1 ? 's' : ''}</Text>
            )}
            <Icons.Edit size={12} color={colors.gray600} />
          </View>
        </Pressable>
        {gymName ? (
          <View style={styles.gymRow}>
            <Icons.MapPin size={14} color={colors.gray500} />
            <Text style={styles.gymName} numberOfLines={1} ellipsizeMode="tail">
              {gymName}
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* AI Narrative Summary */}
        {narrative ? (
          <Pressable style={({ pressed }) => pressed && { opacity: 0.85 }} onPress={() => setShowNarrative((p) => !p)}>
            <View style={styles.narrativeCard}>
              <View style={styles.narrativeHeader}>
                <Text style={styles.narrativeLabel}>SESSION SUMMARY</Text>
                {showNarrative ? <Icons.ChevronUp size={14} color={colors.gray500} /> : <Icons.ChevronDown size={14} color={colors.gray500} />}
              </View>
              {showNarrative && <Text style={styles.narrativeText}>{narrative}</Text>}
            </View>
          </Pressable>
        ) : null}

        {/* Notes — elevated, editable, personal space */}
        <Pressable
          style={({ pressed }) => [styles.notesCard, !session.notes && styles.notesCardEmpty, pressed && { opacity: 0.85 }]}
          onPress={() => setEditSheet('notes')}
        >
          <View style={styles.notesHeader}>
            <Text style={styles.notesLabel}>MY NOTES</Text>
            <Icons.Edit size={16} color={colors.gray500} />
          </View>
          {session.notes ? (
            <Text style={styles.notesText}>{session.notes}</Text>
          ) : (
            <Text style={styles.notesEmptyText}>Tap to add notes...</Text>
          )}
        </Pressable>

        {/* Lesson Topic */}
        <DetailSection
          label="LESSON TOPIC"
          onEdit={() => setEditSheet('topic')}
          empty={!session.lesson_topic}
        >
          <Text style={styles.sectionText}>{session.lesson_topic || 'Not recorded'}</Text>
        </DetailSection>

        {/* Techniques Drilled */}
        <DetailSection
          label="TECHNIQUES DRILLED"
          onEdit={() => setEditSheet('techniques')}
          empty={(session.techniques_drilled ?? []).length === 0}
        >
          {(session.techniques_drilled ?? []).length > 0 ? (
            <View style={styles.tagList}>
              {(session.techniques_drilled ?? []).map((t, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No techniques recorded</Text>
          )}
        </DetailSection>

        {/* Sparring Details */}
        {session.did_spar && (
          <DetailSection
            label="SPARRING"
            onEdit={() => setEditSheet('sparring')}
          >
            <Text style={styles.sectionText}>
              {session.sparring_rounds} round{(session.sparring_rounds ?? 0) !== 1 ? 's' : ''}
            </Text>
            {session.submissions_given && session.submissions_given.length > 0 && (
              <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }} onPress={() => setEditSheet('submissionsGiven')}>
                <View style={styles.subRow}>
                  <Text style={[styles.subLabel, { color: colors.positive }]}>Subs landed:</Text>
                  <Text style={styles.sectionText}>
                    {session.submissions_given.map((s) => `${s.type} (${s.count})`).join(', ')}
                  </Text>
                  <Icons.Edit size={12} color={colors.gray600} />
                </View>
              </Pressable>
            )}
            {session.submissions_received && session.submissions_received.length > 0 && (
              <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }} onPress={() => setEditSheet('submissionsReceived')}>
                <View style={styles.subRow}>
                  <Text style={[styles.subLabel, { color: colors.negative }]}>Got caught:</Text>
                  <Text style={styles.sectionText}>
                    {session.submissions_received.map((s) => `${s.type} (${s.count})`).join(', ')}
                  </Text>
                  <Icons.Edit size={12} color={colors.gray600} />
                </View>
              </Pressable>
            )}
          </DetailSection>
        )}

        {/* Injuries (Fix #1) */}
        <DetailSection
          label="INJURIES"
          onEdit={() => setEditSheet('injuries')}
          empty={(session.injuries ?? []).length === 0}
        >
          {(session.injuries ?? []).length > 0 ? (
            <View style={styles.tagList}>
              {(session.injuries ?? []).map((injury, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: colors.warningDim, borderColor: colors.warningDimBorder }]}>
                  <Text style={[styles.tagText, { color: '#f59e0b' }]}>{injury}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No injuries recorded</Text>
          )}
        </DetailSection>

        {/* Instructor */}
        <DetailSection
          label="INSTRUCTOR"
          onEdit={() => setEditSheet('instructor')}
          empty={!session.instructor}
        >
          <Text style={styles.sectionText}>{session.instructor || 'Not recorded'}</Text>
        </DetailSection>

        {/* Warm-up */}
        <DetailSection
          label="WARM-UP"
          onEdit={() => setEditSheet('warmup')}
          empty={session.warmed_up === null || session.warmed_up === undefined}
        >
          <Text style={styles.sectionText}>
            {session.warmed_up === true ? 'Yes' : session.warmed_up === false ? 'No' : 'Not recorded'}
          </Text>
        </DetailSection>

        {/* Transcript (collapsible — demoted to subtle toggle) */}
        {session.transcript ? (
          <Pressable style={({ pressed }) => pressed && { opacity: 0.85 }} onPress={() => setShowTranscript((p) => !p)}>
            <View style={styles.transcriptSection}>
              <View style={styles.transcriptToggle}>
                <Icons.Mic size={14} color={colors.gray600} />
                <Text style={styles.transcriptToggleText}>View voice transcript</Text>
                {showTranscript ? <Icons.ChevronUp size={12} color={colors.gray600} /> : <Icons.ChevronDown size={12} color={colors.gray600} />}
              </View>
              {showTranscript && (
                <Text style={styles.transcriptText}>{session.transcript}</Text>
              )}
            </View>
          </Pressable>
        ) : null}

        {/* Delete */}
        <Pressable style={({ pressed }) => [styles.deleteButton, pressed && { opacity: 0.7 }]} onPress={handleDelete}>
          <Icons.Trash size={16} color={colors.negative} />
          <Text style={styles.deleteText}>Delete Session</Text>
        </Pressable>
      </ScrollView>

      {/* Edit Bottom Sheets */}
      <EditTopicSheet
        visible={editSheet === 'topic'}
        value={session.lesson_topic ?? ''}
        onSave={(val) => handleUpdate({ lesson_topic: val || null })}
        onClose={() => setEditSheet(null)}
      />
      <EditTechniquesSheet
        visible={editSheet === 'techniques'}
        value={session.techniques_drilled ?? []}
        onSave={(val) => handleUpdate({ techniques_drilled: val })}
        onClose={() => setEditSheet(null)}
      />
      <EditNotesSheet
        visible={editSheet === 'notes'}
        value={session.notes ?? ''}
        onSave={(val) => handleUpdate({ notes: val || null })}
        onClose={() => setEditSheet(null)}
      />
      <EditSparringSheet
        visible={editSheet === 'sparring'}
        rounds={session.sparring_rounds ?? 0}
        onSave={(rounds) => handleUpdate({ sparring_rounds: rounds })}
        onClose={() => setEditSheet(null)}
      />
      <EditTrainingDetailsSheet
        visible={editSheet === 'trainingDetails'}
        mode={session.training_mode}
        kind={session.session_kind}
        duration={session.duration_minutes}
        didSpar={session.did_spar}
        onSave={(mode, kind, duration, didSpar) =>
          handleUpdate({ training_mode: mode as TrainingMode, session_kind: kind as SessionKind, duration_minutes: duration, did_spar: didSpar })
        }
        onClose={() => setEditSheet(null)}
      />
      <EditInjuriesSheet
        visible={editSheet === 'injuries'}
        value={session.injuries ?? []}
        onSave={(val) => handleUpdate({ injuries: val })}
        onClose={() => setEditSheet(null)}
      />
      <EditSubmissionsSheet
        visible={editSheet === 'submissionsGiven'}
        title="Submissions Landed"
        value={session.submissions_given ?? []}
        onSave={(val) => handleUpdate({ submissions_given: val })}
        onClose={() => setEditSheet(null)}
      />
      <EditSubmissionsSheet
        visible={editSheet === 'submissionsReceived'}
        title="Got Caught"
        value={session.submissions_received ?? []}
        onSave={(val) => handleUpdate({ submissions_received: val })}
        onClose={() => setEditSheet(null)}
      />
      <EditInstructorSheet
        visible={editSheet === 'instructor'}
        value={session.instructor ?? ''}
        onSave={(val) => handleUpdate({ instructor: val || null })}
        onClose={() => setEditSheet(null)}
      />
      <EditWarmupSheet
        visible={editSheet === 'warmup'}
        value={session.warmed_up ?? null}
        onSave={(val) => handleUpdate({ warmed_up: val })}
        onClose={() => setEditSheet(null)}
      />
      <EditDateSheet
        visible={editSheet === 'date'}
        value={session.date}
        time={session.time}
        onSave={(date, time) => handleUpdate({ date, time })}
        onClose={() => setEditSheet(null)}
      />
    </SafeAreaView>
  );
}

// ============================================
// DETAIL SECTION
// ============================================

function DetailSection({
  label,
  labelColor,
  onEdit,
  empty,
  children,
}: {
  label: string;
  labelColor?: string;
  onEdit: () => void;
  empty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.section, empty && styles.sectionEmpty, pressed && { opacity: 0.85 }]} onPress={onEdit}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, labelColor ? { color: labelColor } : undefined]}>{label}</Text>
        <Icons.Edit size={14} color={colors.gray700} />
      </View>
      {children}
    </Pressable>
  );
}

// ============================================
// EDIT SHEETS
// ============================================

function SheetWrapper({
  visible,
  title,
  onClose,
  onSave,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.sheetContainer}>
        <View style={styles.sheetHeader}>
          <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }} onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}>
            <Text style={styles.sheetCancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.sheetTitle}>{title}</Text>
          <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }} onPress={onSave} hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}>
            <Text style={styles.sheetSave}>Save</Text>
          </Pressable>
        </View>
        <View style={styles.sheetBody}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
}

function EditTopicSheet({ visible, value, onSave, onClose }: { visible: boolean; value: string; onSave: (v: string) => void; onClose: () => void }) {
  const [text, setText] = useState(value);
  useEffect(() => { if (visible) setText(value); }, [visible, value]);
  return (
    <SheetWrapper visible={visible} title="Lesson Topic" onClose={onClose} onSave={() => onSave(text)}>
      <TextInput style={styles.sheetInput} value={text} onChangeText={setText} placeholder="What did class focus on?" placeholderTextColor={colors.gray600} autoFocus />
    </SheetWrapper>
  );
}

function EditNotesSheet({ visible, value, onSave, onClose }: { visible: boolean; value: string; onSave: (v: string) => void; onClose: () => void }) {
  const [text, setText] = useState(value);
  useEffect(() => { if (visible) setText(value); }, [visible, value]);
  return (
    <SheetWrapper visible={visible} title="Notes" onClose={onClose} onSave={() => onSave(text)}>
      <TextInput style={[styles.sheetInput, { minHeight: 120, textAlignVertical: 'top' }]} value={text} onChangeText={setText} placeholder="Anything to remember?" placeholderTextColor={colors.gray600} multiline autoFocus />
    </SheetWrapper>
  );
}

function EditTechniquesSheet({ visible, value, onSave, onClose }: { visible: boolean; value: string[]; onSave: (v: string[]) => void; onClose: () => void }) {
  const [items, setItems] = useState<string[]>(value);
  const [input, setInput] = useState('');
  useEffect(() => { if (visible) { setItems(value); setInput(''); } }, [visible, value]);
  const addItem = () => { if (input.trim()) { setItems((p) => [...p, input.trim()]); setInput(''); } };
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  return (
    <SheetWrapper visible={visible} title="Techniques" onClose={onClose} onSave={() => onSave(items)}>
      <View style={styles.tagList}>
        {items.map((t, i) => (
          <Pressable key={i} style={styles.editTag} onPress={() => removeItem(i)}>
            <Text style={styles.editTagText}>{t}</Text>
            <Icons.Close size={14} color={colors.gray400} />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.sheetInput}
        value={input}
        onChangeText={setInput}
        placeholder="Add technique and press return"
        placeholderTextColor={colors.gray600}
        returnKeyType="done"
        onSubmitEditing={addItem}
      />
    </SheetWrapper>
  );
}


function EditSparringSheet({ visible, rounds, onSave, onClose }: { visible: boolean; rounds: number; onSave: (r: number) => void; onClose: () => void }) {
  const [val, setVal] = useState(rounds);
  useEffect(() => { if (visible) setVal(rounds); }, [visible, rounds]);
  return (
    <SheetWrapper visible={visible} title="Sparring Rounds" onClose={onClose} onSave={() => onSave(val)}>
      <View style={styles.chipRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <Pressable key={n} style={[styles.roundChip, val === n && styles.roundChipSelected]} onPress={() => setVal(n)}>
            <Text style={[styles.roundChipText, val === n && styles.roundChipTextSelected]}>{n}</Text>
          </Pressable>
        ))}
      </View>
    </SheetWrapper>
  );
}


function EditTrainingDetailsSheet({ visible, mode, kind, duration, didSpar, onSave, onClose }: {
  visible: boolean;
  mode: string;
  kind: string;
  duration: number;
  didSpar: boolean;
  onSave: (mode: string, kind: string, duration: number, didSpar: boolean) => void;
  onClose: () => void;
}) {
  const DURATIONS = [30, 45, 60, 75, 90, 120];
  const [m, setM] = useState(mode);
  const [k, setK] = useState(kind);
  const [d, setD] = useState(duration);
  const [s, setS] = useState(didSpar);
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState('');
  useEffect(() => {
    if (visible) {
      setM(mode); setK(kind); setD(duration); setS(didSpar);
      const isPreset = DURATIONS.includes(duration);
      setShowCustom(!isPreset);
      setCustomText(!isPreset ? String(duration) : '');
    }
  }, [visible, mode, kind, duration, didSpar]);

  const MODES = [
    { label: 'Gi', value: 'gi' },
    { label: 'No-Gi', value: 'nogi' },
    { label: 'Other', value: 'other' },
  ];
  const KINDS = [
    { label: 'Regular Class', value: 'class' },
    { label: 'Open Mat', value: 'open_mat' },
    { label: 'Comp Training', value: 'competition_training' },
    { label: 'Other', value: 'other' },
  ];

  const handlePresetTap = (min: number) => {
    setD(min);
    setShowCustom(false);
    setCustomText('');
  };

  const handleCustomTap = () => {
    setShowCustom(true);
    setCustomText(String(d));
  };

  const handleCustomChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '');
    setCustomText(digits);
    const num = parseInt(digits, 10);
    if (num >= 15 && num <= 300) {
      setD(num);
    }
  };

  const handleCustomBlur = () => {
    const num = parseInt(customText, 10);
    if (!num || num === 0) {
      setShowCustom(false);
      setCustomText('');
    } else if (num < 15) {
      setD(15);
      setCustomText('15');
    } else if (num > 300) {
      setD(300);
      setCustomText('300');
    }
  };

  const isCustomActive = showCustom && !DURATIONS.includes(d);
  const customLabel = isCustomActive && customText && parseInt(customText, 10) >= 15 ? customText : 'Custom';

  return (
    <SheetWrapper visible={visible} title="Training Details" onClose={onClose} onSave={() => onSave(m, k, d, s)}>
      <Text style={styles.sheetFieldLabel}>TRAINING MODE</Text>
      <View style={styles.chipRow}>
        {MODES.map((opt) => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [styles.roundChip, m === opt.value && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
            onPress={() => setM(opt.value)}
          >
            <Text style={[styles.roundChipText, m === opt.value && styles.roundChipTextSelected]}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sheetFieldLabel, { marginTop: spacing.lg }]}>SESSION TYPE</Text>
      <View style={styles.chipRow}>
        {KINDS.map((opt) => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [styles.roundChip, k === opt.value && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
            onPress={() => setK(opt.value)}
          >
            <Text style={[styles.roundChipText, k === opt.value && styles.roundChipTextSelected]}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sheetFieldLabel, { marginTop: spacing.lg }]}>DURATION</Text>
      <View style={styles.chipRow}>
        {DURATIONS.map((min) => (
          <Pressable
            key={min}
            style={({ pressed }) => [styles.roundChip, d === min && !showCustom && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
            onPress={() => handlePresetTap(min)}
          >
            <Text style={[styles.roundChipText, d === min && !showCustom && styles.roundChipTextSelected]}>{min}</Text>
          </Pressable>
        ))}
        <Pressable
          style={({ pressed }) => [styles.roundChip, showCustom && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
          onPress={handleCustomTap}
        >
          <Text style={[styles.roundChipText, showCustom && styles.roundChipTextSelected]}>{customLabel}</Text>
        </Pressable>
      </View>
      {showCustom && (
        <TextInput
          style={styles.customDurationInput}
          value={customText}
          onChangeText={handleCustomChange}
          onBlur={handleCustomBlur}
          keyboardType="number-pad"
          placeholder="15–300 min"
          placeholderTextColor={colors.gray600}
          maxLength={3}
          autoFocus
        />
      )}

      <Text style={[styles.sheetFieldLabel, { marginTop: spacing.lg }]}>SPARRING</Text>
      <View style={styles.chipRow}>
        <Pressable
          style={({ pressed }) => [styles.roundChip, s && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
          onPress={() => setS(true)}
        >
          <Text style={[styles.roundChipText, s && styles.roundChipTextSelected]}>Yes</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.roundChip, !s && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
          onPress={() => setS(false)}
        >
          <Text style={[styles.roundChipText, !s && styles.roundChipTextSelected]}>No</Text>
        </Pressable>
      </View>
    </SheetWrapper>
  );
}

function EditInjuriesSheet({ visible, value, onSave, onClose }: { visible: boolean; value: string[]; onSave: (v: string[]) => void; onClose: () => void }) {
  const [items, setItems] = useState<string[]>(value);
  const [input, setInput] = useState('');
  useEffect(() => { if (visible) { setItems(value); setInput(''); } }, [visible, value]);
  const addItem = () => { if (input.trim()) { setItems((p) => [...p, input.trim()]); setInput(''); } };
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  return (
    <SheetWrapper visible={visible} title="Injuries" onClose={onClose} onSave={() => onSave(items)}>
      <View style={styles.tagList}>
        {items.map((t, i) => (
          <Pressable key={i} style={styles.editTag} onPress={() => removeItem(i)}>
            <Text style={styles.editTagText}>{t}</Text>
            <Icons.Close size={14} color={colors.gray400} />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.sheetInput}
        value={input}
        onChangeText={setInput}
        placeholder="Add injury and press return"
        placeholderTextColor={colors.gray600}
        returnKeyType="done"
        onSubmitEditing={addItem}
      />
    </SheetWrapper>
  );
}

function EditSubmissionsSheet({ visible, title, value, onSave, onClose }: { visible: boolean; title: string; value: Submission[]; onSave: (v: Submission[]) => void; onClose: () => void }) {
  const [items, setItems] = useState<Submission[]>(value);
  const [input, setInput] = useState('');
  useEffect(() => { if (visible) { setItems(value); setInput(''); } }, [visible, value]);
  const addItem = () => {
    if (!input.trim()) return;
    const existing = items.findIndex((s) => s.type.toLowerCase() === input.trim().toLowerCase());
    if (existing >= 0) {
      setItems((p) => p.map((s, i) => i === existing ? { ...s, count: s.count + 1 } : s));
    } else {
      setItems((p) => [...p, { type: input.trim(), count: 1 }]);
    }
    setInput('');
  };
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  return (
    <SheetWrapper visible={visible} title={title} onClose={onClose} onSave={() => onSave(items)}>
      <View style={styles.tagList}>
        {items.map((s, i) => (
          <Pressable key={i} style={styles.editTag} onPress={() => removeItem(i)}>
            <Text style={styles.editTagText}>{s.type} ({s.count})</Text>
            <Icons.Close size={14} color={colors.gray400} />
          </Pressable>
        ))}
      </View>
      <TextInput
        style={styles.sheetInput}
        value={input}
        onChangeText={setInput}
        placeholder="Add submission and press return"
        placeholderTextColor={colors.gray600}
        returnKeyType="done"
        onSubmitEditing={addItem}
      />
    </SheetWrapper>
  );
}

function EditInstructorSheet({ visible, value, onSave, onClose }: { visible: boolean; value: string; onSave: (v: string) => void; onClose: () => void }) {
  const [text, setText] = useState(value);
  useEffect(() => { if (visible) setText(value); }, [visible, value]);
  return (
    <SheetWrapper visible={visible} title="Instructor" onClose={onClose} onSave={() => onSave(text)}>
      <TextInput style={styles.sheetInput} value={text} onChangeText={setText} placeholder="Who taught class?" placeholderTextColor={colors.gray600} autoFocus />
    </SheetWrapper>
  );
}

function EditWarmupSheet({ visible, value, onSave, onClose }: { visible: boolean; value: boolean | null; onSave: (v: boolean | null) => void; onClose: () => void }) {
  const [val, setVal] = useState(value);
  useEffect(() => { if (visible) setVal(value); }, [visible, value]);
  return (
    <SheetWrapper visible={visible} title="Warm-up" onClose={onClose} onSave={() => onSave(val)}>
      <View style={styles.chipRow}>
        <Pressable
          style={({ pressed }) => [styles.roundChip, val === true && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
          onPress={() => setVal(true)}
        >
          <Text style={[styles.roundChipText, val === true && styles.roundChipTextSelected]}>Yes</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.roundChip, val === false && styles.roundChipSelected, pressed && { opacity: 0.7 }]}
          onPress={() => setVal(false)}
        >
          <Text style={[styles.roundChipText, val === false && styles.roundChipTextSelected]}>No</Text>
        </Pressable>
      </View>
    </SheetWrapper>
  );
}

function EditDateSheet({ visible, value, time, onSave, onClose }: {
  visible: boolean; value: string; time: string | null;
  onSave: (date: string, time: string | null) => void; onClose: () => void;
}) {
  const [date, setDate] = useState(new Date(value + 'T12:00:00'));
  const [sessionTime, setSessionTime] = useState(
    time ? new Date(`2000-01-01T${time}:00`) : new Date()
  );
  useEffect(() => {
    if (visible) {
      setDate(new Date(value + 'T12:00:00'));
      setSessionTime(time ? new Date(`2000-01-01T${time}:00`) : new Date());
    }
  }, [visible, value, time]);

  // Limit to last 90 days
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 90);

  return (
    <SheetWrapper visible={visible} title="Edit Date & Time" onClose={onClose} onSave={() => {
      const iso = date.toISOString().split('T')[0];
      const timeStr = `${String(sessionTime.getHours()).padStart(2, '0')}:${String(sessionTime.getMinutes()).padStart(2, '0')}`;
      onSave(iso, timeStr);
    }}>
      <Text style={styles.sheetFieldLabel}>DATE</Text>
      <DateTimePicker
        value={date}
        mode="date"
        display="spinner"
        onChange={(_: any, selected?: Date) => { if (selected) setDate(selected); }}
        minimumDate={minDate}
        maximumDate={new Date()}
        themeVariant="dark"
      />
      <Text style={[styles.sheetFieldLabel, { marginTop: spacing.md }]}>TIME</Text>
      <DateTimePicker
        value={sessionTime}
        mode="time"
        display="spinner"
        onChange={(_: any, selected?: Date) => { if (selected) setSessionTime(selected); }}
        themeVariant="dark"
      />
    </SheetWrapper>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.gray400,
    marginBottom: spacing.md,
  },
  backLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gold,
  },

  // Header
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  headerRow1: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow2: {
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  editDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerDate: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
  },
  headerDetail: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
  },
  gymRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  gymName: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    flexShrink: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['3xl'],
  },

  // Narrative
  narrativeCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    backgroundColor: colors.goldUltraDim,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  narrativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  narrativeLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1.5,
  },
  narrativeText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 22,
  },

  // Notes (elevated)
  notesCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gray500,
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  notesCardEmpty: {
    borderStyle: 'dashed' as const,
    borderLeftColor: colors.gray600,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notesLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray400,
    letterSpacing: 1.5,
  },
  notesText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  notesEmptyText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
  },

  // Sections
  section: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionEmpty: {
    borderStyle: 'dashed',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 1.5,
  },
  sectionText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 22,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
    fontStyle: 'italic',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  tagText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray300,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  subLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },

  // Transcript (demoted toggle)
  transcriptSection: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  transcriptToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  transcriptToggleText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray600,
    flex: 1,
  },
  transcriptText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray400,
    fontStyle: 'italic',
    lineHeight: 22,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    paddingLeft: spacing.md,
    marginTop: spacing.sm,
  },

  // Delete
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    marginTop: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.negativeDim,
  },
  deleteText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.negative,
  },

  // Edit sheets
  sheetContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray700,
  },
  sheetCancel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  sheetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  sheetSave: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.gold,
  },
  sheetBody: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sheetInput: {
    fontFamily: 'Inter',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  customDurationInput: {
    fontFamily: 'Inter',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.gold,
    marginTop: spacing.sm,
    width: 120,
  },
  sheetFieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  editTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginBottom: spacing.sm,
  },
  editTagText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray300,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roundChip: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundChipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  roundChipText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray400,
  },
  roundChipTextSelected: {
    color: colors.gold,
  },
});
