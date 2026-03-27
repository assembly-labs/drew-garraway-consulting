/**
 * Profile Screen — View/edit core profile fields, sign out
 *
 * - Avatar with belt-colored border
 * - Tap-to-edit: name, belt, stripes, gym via bottom sheet modals
 * - Training stats
 * - Sign out button
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/MainTabNavigator';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { colors, spacing, radius, getBeltColor } from '../config/design-tokens';
import { Icons } from '../components/Icons';
import { GymSearchInput, type SelectedGym } from '../components/GymSearchInput';
import { GymCard } from '../components/GymCard';
import { GymHistoryList } from '../components/GymHistoryList';
import { ProfileSkeleton } from '../components/Skeleton';
import { profileService, sessionService } from '../services/supabase';
import { userGymService } from '../services/userGymService';
import type { BeltLevel, UserGym } from '../types/mvp-types';
import { haptics } from '../utils/haptics';

const BELT_LABELS: Record<string, string> = {
  white: 'White Belt',
  blue: 'Blue Belt',
  purple: 'Purple Belt',
  brown: 'Brown Belt',
  black: 'Black Belt',
};

const BELTS: BeltLevel[] = ['white', 'blue', 'purple', 'brown', 'black'];

type ProfileNav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileNav>();
  const { profile, refreshProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const [editSheet, setEditSheet] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [gymHistory, setGymHistory] = useState<UserGym[]>([]);
  const [primaryGym, setPrimaryGym] = useState<UserGym | null>(null);
  const [gymSessionCounts, setGymSessionCounts] = useState<Record<string, number>>({});
  const [editingGymNotes, setEditingGymNotes] = useState<UserGym | null>(null);

  const loadSessionCount = useCallback(async () => {
    const count = await sessionService.getCount();
    setSessionCount(count);
  }, []);

  const loadGymHistory = useCallback(async () => {
    const [gyms, counts] = await Promise.all([
      userGymService.list(),
      userGymService.getSessionCountsByGym(),
    ]);
    setGymHistory(gyms);
    setPrimaryGym(gyms.find(g => g.is_primary) ?? null);
    setGymSessionCounts(counts);
  }, []);

  // Load count + gym history on mount and when screen comes into focus
  useEffect(() => {
    loadSessionCount();
    loadGymHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      loadSessionCount();
      loadGymHistory();
    });
    return unsubscribe;
  }, [navigation, loadSessionCount, loadGymHistory]);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const handleSave = async (updates: Record<string, any>) => {
    try {
      await profileService.update(updates);
      await refreshProfile();
      setEditSheet(null);
      haptics.success();
      showToast('Profile updated', 'success');
    } catch {
      haptics.error();
      showToast('Could not save changes', 'error');
    }
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileSkeleton />
      </SafeAreaView>
    );
  }

  const beltColor = getBeltColor(profile.belt);
  const stripesText = profile.stripes > 0 ? ` · ${profile.stripes} stripe${profile.stripes !== 1 ? 's' : ''}` : '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + Name */}
        <Pressable style={({ pressed }) => [styles.profileHeader, pressed && { opacity: 0.85 }]} onPress={() => setEditSheet('name')}>
          <View style={[styles.avatar, { borderColor: beltColor }]}>
            <Text style={styles.avatarInitial}>
              {profile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            <Icons.Edit size={16} color={colors.gray600} />
          </View>
          <View style={styles.beltBadge}>
            <View style={[styles.beltBar, { backgroundColor: beltColor }]} />
            <Text style={styles.beltText}>
              {BELT_LABELS[profile.belt] ?? profile.belt}{stripesText}
            </Text>
          </View>
        </Pressable>

        {/* Info card — each row is tappable */}
        <View style={styles.card}>
          <EditableRow label="Belt" value={`${BELT_LABELS[profile.belt]}${stripesText}`} onPress={() => setEditSheet('belt')} />
          <View style={styles.rowDivider} />
          <EditableRow
            label="Training Target"
            value={`${profile.target_frequency}x / week`}
            onPress={() => setEditSheet('frequency')}
          />
          <View style={styles.rowDivider} />
          <EditableRow
            label="Logging Preference"
            value={profile.logging_preference === 'voice' ? 'Voice' : 'Text'}
            onPress={() => setEditSheet('logging')}
          />
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sessions Logged</Text>
            <Text style={styles.sessionCountValue}>{sessionCount}</Text>
          </View>
        </View>

        {/* Gym Card — current home gym + actions */}
        <GymCard
          primaryGym={primaryGym}
          fallbackGymName={profile.gym_name}
          sessionCount={primaryGym ? (gymSessionCounts[primaryGym.id] ?? 0) : 0}
          onChangeGym={() => setEditSheet('gym')}
        />

        {/* Gym History — collapsible timeline */}
        <GymHistoryList
          gyms={gymHistory}
          sessionCounts={gymSessionCounts}
          onEditNotes={(gym) => {
            setEditingGymNotes(gym);
            setEditSheet('gym_notes');
          }}
        />

        {/* Privacy Policy + Version */}
        <Pressable
          style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        >
          <Icons.Shield size={16} color={colors.gray500} />
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Icons.ChevronRight size={14} color={colors.gray600} />
        </Pressable>

        <Text style={styles.versionText}>TOMO v1.0.0</Text>

        {/* Sign out */}
        <Pressable style={({ pressed }) => [styles.signOutButton, pressed && { opacity: 0.7 }]} onPress={handleSignOut}>
          <Icons.Logout size={18} color={colors.negative} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      {/* Edit Sheets */}
      <EditNameSheet
        visible={editSheet === 'name'}
        value={profile.name}
        onSave={(name) => handleSave({ name })}
        onClose={() => setEditSheet(null)}
      />
      <EditBeltSheet
        visible={editSheet === 'belt'}
        belt={profile.belt}
        stripes={profile.stripes}
        onSave={(belt, stripes) => handleSave({ belt, stripes })}
        onClose={() => setEditSheet(null)}
      />
      <ChangeGymSheet
        visible={editSheet === 'gym'}
        currentGymName={primaryGym?.gym_name ?? profile.gym_name}
        onSave={async (gym) => {
          try {
            await userGymService.changePrimary(gym);
            await refreshProfile();
            await loadGymHistory();
            setEditSheet(null);
            haptics.success();
            showToast('Home gym updated', 'success');
          } catch {
            haptics.error();
            showToast('Could not change gym', 'error');
          }
        }}
        onClose={() => setEditSheet(null)}
      />
      <GymNotesSheet
        visible={editSheet === 'gym_notes'}
        gym={editingGymNotes}
        onSave={async (notes) => {
          if (!editingGymNotes) return;
          try {
            await userGymService.update(editingGymNotes.id, { notes });
            await loadGymHistory();
            setEditSheet(null);
            setEditingGymNotes(null);
            haptics.success();
            showToast('Notes saved', 'success');
          } catch {
            haptics.error();
            showToast('Could not save notes', 'error');
          }
        }}
        onClose={() => { setEditSheet(null); setEditingGymNotes(null); }}
      />
      <EditFrequencySheet
        visible={editSheet === 'frequency'}
        value={profile.target_frequency}
        onSave={(freq) => handleSave({ target_frequency: freq })}
        onClose={() => setEditSheet(null)}
      />
      <EditLoggingSheet
        visible={editSheet === 'logging'}
        value={profile.logging_preference}
        onSave={(pref) => handleSave({ logging_preference: pref })}
        onClose={() => setEditSheet(null)}
      />
    </SafeAreaView>
  );
}

// ============================================
// ROW COMPONENTS
// ============================================

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function EditableRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.editableValue}>
        <Text style={styles.rowValue}>{value}</Text>
        <Icons.ChevronRight size={14} color={colors.gray600} />
      </View>
    </Pressable>
  );
}

// ============================================
// SHEET WRAPPER
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

// ============================================
// EDIT SHEETS
// ============================================

function EditNameSheet({ visible, value, onSave, onClose }: {
  visible: boolean; value: string; onSave: (v: string) => void; onClose: () => void;
}) {
  const [text, setText] = useState(value);
  useEffect(() => { if (visible) setText(value); }, [visible, value]);
  const canSave = text.trim().length > 0;
  return (
    <SheetWrapper visible={visible} title="Edit Name" onClose={onClose} onSave={() => canSave && onSave(text.trim())}>
      <TextInput
        style={styles.sheetInput}
        value={text}
        onChangeText={setText}
        placeholder="Your name"
        placeholderTextColor={colors.gray600}
        autoFocus
        autoCapitalize="words"
      />
    </SheetWrapper>
  );
}

function EditBeltSheet({ visible, belt, stripes, onSave, onClose }: {
  visible: boolean; belt: string; stripes: number;
  onSave: (belt: string, stripes: number) => void; onClose: () => void;
}) {
  const [b, setB] = useState(belt);
  const [s, setS] = useState(stripes);
  useEffect(() => { if (visible) { setB(belt); setS(stripes); } }, [visible, belt, stripes]);
  return (
    <SheetWrapper visible={visible} title="Belt & Stripes" onClose={onClose} onSave={() => onSave(b, s)}>
      <Text style={styles.sheetFieldLabel}>BELT</Text>
      <View style={styles.beltRow}>
        {BELTS.map((bl) => {
          const bc = getBeltColor(bl);
          const selected = b === bl;
          return (
            <Pressable key={bl} style={[styles.beltOption, selected && styles.beltOptionSelected]} onPress={() => setB(bl)}>
              <View style={[styles.beltCircle, { backgroundColor: bc }, bl === 'white' && styles.beltCircleWhite, selected && { borderColor: colors.gold, borderWidth: 3 }]} />
              <Text style={[styles.beltLabel, selected && styles.beltLabelSelected]}>{BELT_LABELS[bl]?.replace(' Belt', '')}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={[styles.sheetFieldLabel, { marginTop: spacing.lg }]}>STRIPES</Text>
      <View style={styles.chipRow}>
        {[0, 1, 2, 3, 4].map((n) => (
          <Pressable key={n} style={[styles.chip, s === n && styles.chipSelected]} onPress={() => setS(n)}>
            <Text style={[styles.chipText, s === n && styles.chipTextSelected]}>{n}</Text>
          </Pressable>
        ))}
      </View>
    </SheetWrapper>
  );
}

function ChangeGymSheet({ visible, currentGymName, onSave, onClose }: {
  visible: boolean; currentGymName: string; onSave: (gym: SelectedGym) => void; onClose: () => void;
}) {
  const [gym, setGym] = useState<SelectedGym | null>(null);

  // Reset when sheet opens
  useEffect(() => { if (visible) setGym(null); }, [visible]);

  const canSave = gym !== null && gym.name.trim().length > 0;

  const handleSave = () => {
    if (!canSave || !gym) return;
    Alert.alert(
      'Change Home Gym?',
      `Switching from ${currentGymName} to ${gym.name}. Your history at ${currentGymName} will be saved.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => onSave(gym) },
      ]
    );
  };

  return (
    <SheetWrapper visible={visible} title="Change Home Gym" onClose={onClose} onSave={handleSave}>
      <GymSearchInput
        key={visible ? 'open' : 'closed'}
        onGymSelected={setGym}
        placeholder="Search for your new gym"
        autoFocus
      />
    </SheetWrapper>
  );
}

function GymNotesSheet({ visible, gym, onSave, onClose }: {
  visible: boolean; gym: UserGym | null; onSave: (notes: string) => void; onClose: () => void;
}) {
  const [text, setText] = useState('');

  useEffect(() => { if (visible && gym) setText(gym.notes ?? ''); }, [visible, gym]);

  return (
    <SheetWrapper visible={visible} title={gym?.gym_name ?? 'Gym Notes'} onClose={onClose} onSave={() => onSave(text.trim())}>
      <Text style={{
        fontFamily: 'JetBrains Mono-SemiBold',
        fontSize: 12,
        fontWeight: '600',
        color: colors.gray500,
        letterSpacing: 2,
        marginBottom: spacing.sm,
      }}>
        NOTES
      </Text>
      <TextInput
        style={[styles.sheetInput, { minHeight: 80, textAlignVertical: 'top' }]}
        value={text}
        onChangeText={setText}
        placeholder="e.g., Got my blue belt here"
        placeholderTextColor={colors.gray600}
        autoFocus
        multiline
      />
    </SheetWrapper>
  );
}

function EditFrequencySheet({ visible, value, onSave, onClose }: {
  visible: boolean; value: number; onSave: (v: number) => void; onClose: () => void;
}) {
  const [freq, setFreq] = useState(value);
  useEffect(() => { if (visible) setFreq(value); }, [visible, value]);
  return (
    <SheetWrapper visible={visible} title="Training Frequency" onClose={onClose} onSave={() => onSave(freq)}>
      <View style={styles.chipRow}>
        {[{ label: '1-2x / week', value: 2 }, { label: '3-4x / week', value: 4 }, { label: '5+ / week', value: 5 }].map((opt) => (
          <Pressable key={opt.value} style={[styles.freqChip, freq === opt.value && styles.chipSelected]} onPress={() => setFreq(opt.value)}>
            <Text style={[styles.chipText, freq === opt.value && styles.chipTextSelected]}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </SheetWrapper>
  );
}

function EditLoggingSheet({ visible, value, onSave, onClose }: {
  visible: boolean; value: string; onSave: (v: string) => void; onClose: () => void;
}) {
  const [pref, setPref] = useState(value);
  useEffect(() => { if (visible) setPref(value); }, [visible, value]);
  return (
    <SheetWrapper visible={visible} title="Logging Preference" onClose={onClose} onSave={() => onSave(pref)}>
      <View style={styles.chipRow}>
        {[{ label: 'Voice', value: 'voice' }, { label: 'Text', value: 'text' }].map((opt) => (
          <Pressable key={opt.value} style={[styles.freqChip, pref === opt.value && styles.chipSelected]} onPress={() => setPref(opt.value)}>
            <Text style={[styles.chipText, pref === opt.value && styles.chipTextSelected]}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.gray800,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitial: {
    fontFamily: 'Unbounded-Bold',
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  name: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  beltBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  beltBar: {
    width: 32,
    height: 12,
    borderRadius: 2,
  },
  beltText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray400,
  },
  card: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
  },
  rowLabel: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
  },
  rowValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  sessionCountValue: {
    fontFamily: 'JetBrains Mono-Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.gold,
  },
  editableValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.gray700,
    marginHorizontal: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    marginBottom: spacing.md,
  },
  linkText: {
    fontFamily: 'Inter',
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray300,
  },
  versionText: {
    fontFamily: 'JetBrains Mono',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.negativeDimBorder,
  },
  signOutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.negative,
  },

  // Sheet styles
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
  sheetFieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },

  // Belt picker
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
    width: 44,
    height: 44,
    borderRadius: 22,
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

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  chipText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray400,
  },
  chipTextSelected: {
    color: colors.gold,
  },
  freqChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
});
