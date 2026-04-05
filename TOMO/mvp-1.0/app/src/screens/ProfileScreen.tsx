/**
 * Profile Screen — View/edit core profile fields, sign out
 *
 * - Avatar with belt-colored border
 * - Tap-to-edit: name, belt, stripes, gym via bottom sheet modals
 * - Training stats
 * - Sign out button
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Image,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { profileService, sessionService, avatarService } from '../services/supabase';
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

function calculateProfileAge(birthDateStr: string): number {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatWeight(kg: number, unit: 'lb' | 'kg'): string {
  if (unit === 'kg') return `${kg} kg`;
  return `${Math.round(kg * 2.20462)} lb`;
}

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
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);

  const loadAvatarUrl = useCallback(async () => {
    if (!profile?.avatar_url) { setAvatarSignedUrl(null); return; }
    const url = await avatarService.getSignedUrl(profile.avatar_url);
    setAvatarSignedUrl(url);
  }, [profile?.avatar_url]);

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

  // Load count + gym history + avatar on mount and when screen comes into focus
  useEffect(() => {
    loadSessionCount();
    loadGymHistory();
    loadAvatarUrl();
    const unsubscribe = navigation.addListener('focus', () => {
      loadSessionCount();
      loadGymHistory();
      loadAvatarUrl();
    });
    return unsubscribe;
  }, [navigation, loadSessionCount, loadGymHistory, loadAvatarUrl]);

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
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { borderColor: beltColor }]}>
            {avatarSignedUrl ? (
              <Image source={{ uri: avatarSignedUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitial}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            <Pressable
              style={({ pressed }) => [styles.editProfileButton, pressed && { opacity: 0.7 }]}
              onPress={() => setEditSheet('profile')}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Edit name and photo"
            >
              <Icons.Edit size={16} color={colors.gray500} />
            </Pressable>
          </View>
          <View style={styles.beltBadge}>
            <View style={[styles.beltBar, { backgroundColor: beltColor }]} />
            <Text style={styles.beltText}>
              {BELT_LABELS[profile.belt] ?? profile.belt}{stripesText}
            </Text>
          </View>
        </View>

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

        {/* Personal Info card */}
        <View style={styles.card}>
          {/* Birthday — editable with bracket-change warning */}
          <EditableRow
            label="Birthday"
            value={profile.birth_date
              ? `${calculateProfileAge(profile.birth_date)} years old`
              : 'Not set'}
            onPress={() => setEditSheet('birthday')}
          />
          <View style={styles.rowDivider} />

          {/* Gender — editable with impact warning */}
          <EditableRow
            label="Gender"
            value={profile.gender
              ? (profile.gender === 'male' ? 'Male' : 'Female')
              : '+ Add'}
            onPress={() => setEditSheet('gender')}
          />
          <View style={styles.rowDivider} />

          {/* Body Weight — freely editable */}
          <EditableRow
            label="Body Weight"
            value={profile.body_weight_kg
              ? formatWeight(profile.body_weight_kg, profile.weight_unit_preference)
              : '+ Add'}
            onPress={() => setEditSheet('weight')}
          />
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
      <EditProfileSheet
        visible={editSheet === 'profile'}
        name={profile.name}
        avatarUrl={avatarSignedUrl}
        beltColor={beltColor}
        onSave={async (name, avatarUri) => {
          try {
            const updates: Record<string, any> = {};
            if (name !== profile.name) updates.name = name;
            if (avatarUri === null) {
              // Remove avatar
              if (profile.avatar_url) {
                await avatarService.delete(profile.avatar_url);
              }
              updates.avatar_url = null;
            } else if (avatarUri) {
              // Upload new avatar
              const storagePath = await avatarService.upload(avatarUri);
              if (storagePath) updates.avatar_url = storagePath;
            }
            if (Object.keys(updates).length > 0) {
              await profileService.update(updates);
              await refreshProfile();
              await loadAvatarUrl();
            }
            setEditSheet(null);
            haptics.success();
            showToast('Profile updated', 'success');
          } catch {
            haptics.error();
            showToast('Could not save changes', 'error');
          }
        }}
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
      <EditBirthdaySheet
        visible={editSheet === 'birthday'}
        currentBirthDate={profile.birth_date}
        onSave={(date) => handleSave({ birth_date: date })}
        onClose={() => setEditSheet(null)}
      />
      <EditGenderSheet
        visible={editSheet === 'gender'}
        currentGender={profile.gender}
        onSave={(g) => handleSave({ gender: g })}
        onClose={() => setEditSheet(null)}
      />
      <EditWeightSheet
        visible={editSheet === 'weight'}
        weightKg={profile.body_weight_kg}
        unit={profile.weight_unit_preference ?? 'lb'}
        gender={profile.gender}
        onSave={(kg, unit) => handleSave({ body_weight_kg: kg, weight_unit_preference: unit })}
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

function EditProfileSheet({ visible, name, avatarUrl, beltColor, onSave, onClose }: {
  visible: boolean;
  name: string;
  avatarUrl: string | null;
  beltColor: string;
  onSave: (name: string, avatarUri: string | null | undefined) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState(name);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null | undefined>(undefined);
  // undefined = no change, null = removed, string = new local file

  useEffect(() => {
    if (visible) { setText(name); setLocalAvatarUri(undefined); }
  }, [visible, name]);

  const canSave = text.trim().length > 0;

  const displayUri = localAvatarUri === undefined ? avatarUrl : localAvatarUri;

  const pickImage = async (useCamera: boolean) => {
    const permResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permResult.granted) {
      Alert.alert('Permission needed', useCamera ? 'Camera access is required to take a photo.' : 'Photo library access is required.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

    if (!result.canceled && result.assets[0]) {
      setLocalAvatarUri(result.assets[0].uri);
    }
  };

  const showPhotoOptions = () => {
    const hasPhoto = displayUri !== null;
    if (Platform.OS === 'ios') {
      const options = hasPhoto
        ? ['Take Photo', 'Choose from Library', 'Remove Photo', 'Cancel']
        : ['Take Photo', 'Choose from Library', 'Cancel'];
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: options.length - 1, destructiveButtonIndex: hasPhoto ? 2 : undefined },
        (idx) => {
          if (idx === 0) pickImage(true);
          else if (idx === 1) pickImage(false);
          else if (hasPhoto && idx === 2) setLocalAvatarUri(null);
        }
      );
    } else {
      // Android fallback
      Alert.alert('Change Photo', undefined, [
        { text: 'Take Photo', onPress: () => pickImage(true) },
        { text: 'Choose from Library', onPress: () => pickImage(false) },
        ...(hasPhoto ? [{ text: 'Remove Photo', style: 'destructive' as const, onPress: () => setLocalAvatarUri(null) }] : []),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  return (
    <SheetWrapper visible={visible} title="Edit Profile" onClose={onClose} onSave={() => canSave && onSave(text.trim(), localAvatarUri)}>
      {/* Avatar with camera overlay */}
      <View style={editProfileStyles.avatarSection}>
        <Pressable
          onPress={showPhotoOptions}
          style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
        >
          <View style={[editProfileStyles.avatar, { borderColor: beltColor }]}>
            {displayUri ? (
              <Image source={{ uri: displayUri }} style={editProfileStyles.avatarImage} />
            ) : (
              <Text style={styles.avatarInitial}>{text.charAt(0).toUpperCase() || '?'}</Text>
            )}
          </View>
          <View style={editProfileStyles.cameraOverlay}>
            <Icons.Camera size={14} color={colors.white} />
          </View>
        </Pressable>
        <Text style={editProfileStyles.changePhotoText}>Tap to change photo</Text>
      </View>

      {/* Name input */}
      <Text style={styles.sheetFieldLabel}>NAME</Text>
      <TextInput
        style={styles.sheetInput}
        value={text}
        onChangeText={setText}
        placeholder="Your name"
        placeholderTextColor={colors.gray600}
        autoCapitalize="words"
      />
    </SheetWrapper>
  );
}

const editProfileStyles = StyleSheet.create({
  avatarSection: {
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.black,
  },
  changePhotoText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: spacing.sm,
  },
});

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

/** IBJJF Masters age brackets */
function getAgeBracket(age: number): string {
  if (age < 30) return 'Adult';
  if (age < 36) return 'Masters 1 (30+)';
  if (age < 41) return 'Masters 2 (36+)';
  if (age < 46) return 'Masters 3 (41+)';
  if (age < 51) return 'Masters 4 (46+)';
  if (age < 56) return 'Masters 5 (51+)';
  return 'Masters 6 (56+)';
}

function EditBirthdaySheet({ visible, currentBirthDate, onSave, onClose }: {
  visible: boolean;
  currentBirthDate: string;
  onSave: (date: string) => void;
  onClose: () => void;
}) {
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
  }, []);
  const minDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 100);
    return d;
  }, []);

  const [date, setDate] = useState<Date>(new Date(currentBirthDate));

  useEffect(() => {
    if (visible) setDate(new Date(currentBirthDate));
  }, [visible, currentBirthDate]);

  const currentAge = calculateProfileAge(currentBirthDate);
  const newAge = calculateProfileAge(date.toISOString().slice(0, 10));
  const currentBracket = getAgeBracket(currentAge);
  const newBracket = getAgeBracket(newAge);
  const bracketChanged = currentBracket !== newBracket;
  const dateChanged = date.toISOString().slice(0, 10) !== currentBirthDate;

  const handleSave = () => {
    const newDateStr = date.toISOString().slice(0, 10);
    if (!dateChanged) { onClose(); return; }

    if (bracketChanged) {
      Alert.alert(
        'Age Bracket Change',
        `Changing your birthday moves you from ${currentBracket} to ${newBracket}. This will affect your training insights, competition brackets, and peer comparisons across your entire history.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Change Birthday', style: 'destructive', onPress: () => onSave(newDateStr) },
        ]
      );
    } else {
      onSave(newDateStr);
    }
  };

  return (
    <SheetWrapper visible={visible} title="Birthday" onClose={onClose} onSave={handleSave}>
      <Text style={profileEditStyles.hint}>
        Your age shapes your training insights, recovery recommendations, and competition brackets.
      </Text>
      <DateTimePicker
        value={date}
        mode="date"
        display="spinner"
        maximumDate={maxDate}
        minimumDate={minDate}
        onChange={(_event, selectedDate) => {
          if (selectedDate) setDate(selectedDate);
        }}
        textColor={colors.white}
        themeVariant="dark"
        style={{ height: 180, marginTop: spacing.sm }}
      />
      {dateChanged && (
        <View style={profileEditStyles.changePreview}>
          <Text style={profileEditStyles.changeLabel}>
            {currentAge} years old ({currentBracket})
          </Text>
          <Text style={profileEditStyles.changeArrow}>{'   >>>   '}</Text>
          <Text style={[
            profileEditStyles.changeLabel,
            bracketChanged && { color: colors.gold },
          ]}>
            {newAge} years old ({newBracket})
          </Text>
        </View>
      )}
      {bracketChanged && (
        <Text style={profileEditStyles.warning}>
          This changes your competition age bracket. Your insights and comparisons will update to reflect the new bracket.
        </Text>
      )}
    </SheetWrapper>
  );
}

function EditGenderSheet({ visible, currentGender, onSave, onClose }: {
  visible: boolean;
  currentGender: 'male' | 'female' | null;
  onSave: (g: 'male' | 'female') => void;
  onClose: () => void;
}) {
  const [g, setG] = useState<'male' | 'female' | null>(currentGender);
  useEffect(() => { if (visible) setG(currentGender); }, [visible, currentGender]);

  const isChange = currentGender !== null && g !== null && g !== currentGender;

  const handleSave = () => {
    if (!g) return;
    if (isChange) {
      Alert.alert(
        'Change Gender?',
        'Changing your gender will update your competition weight class, peer comparisons, and training insights across your entire history. This significantly affects how your data is interpreted.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Change Gender', style: 'destructive', onPress: () => onSave(g) },
        ]
      );
    } else {
      onSave(g);
    }
  };

  return (
    <SheetWrapper visible={visible} title="Gender" onClose={onClose} onSave={handleSave}>
      <Text style={profileEditStyles.hint}>
        Your gender affects competition weight classes, peer comparisons, and how we personalize your insights.
      </Text>
      <View style={styles.chipRow}>
        {[{ label: 'Male', value: 'male' as const }, { label: 'Female', value: 'female' as const }].map((opt) => (
          <Pressable key={opt.value} style={[styles.freqChip, g === opt.value && styles.chipSelected]} onPress={() => setG(opt.value)}>
            <Text style={[styles.chipText, g === opt.value && styles.chipTextSelected]}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
      {isChange && (
        <Text style={profileEditStyles.warning}>
          Switching from {currentGender === 'male' ? 'Male' : 'Female'} to {g === 'male' ? 'Male' : 'Female'} will change your competition weight class and recalculate all peer comparisons.
        </Text>
      )}
    </SheetWrapper>
  );
}

const profileEditStyles = StyleSheet.create({
  hint: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  warning: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gold,
    marginTop: spacing.md,
    lineHeight: 18,
  },
  changePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    flexWrap: 'wrap',
  },
  changeLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray400,
  },
  changeArrow: {
    fontFamily: 'JetBrains Mono',
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray600,
  },
});

function EditWeightSheet({ visible, weightKg, unit, gender, onSave, onClose }: {
  visible: boolean;
  weightKg: number | null;
  unit: 'lb' | 'kg';
  gender: 'male' | 'female' | null;
  onSave: (kg: number | null, unit: 'lb' | 'kg') => void;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [u, setU] = useState<'lb' | 'kg'>(unit);

  useEffect(() => {
    if (visible) {
      setU(unit);
      if (weightKg) {
        setText(unit === 'kg' ? String(weightKg) : String(Math.round(weightKg * 2.20462)));
      } else {
        setText('');
      }
    }
  }, [visible, weightKg, unit]);

  const handleSave = () => {
    const num = parseFloat(text);
    if (isNaN(num) || num <= 0) {
      onSave(null, u);
    } else {
      const kg = u === 'lb' ? Math.round(num * 0.453592 * 10) / 10 : num;
      onSave(kg, u);
    }
  };

  return (
    <SheetWrapper visible={visible} title="Body Weight" onClose={onClose} onSave={handleSave}>
      <Text style={profileEditStyles.hint}>
        Only visible to you. Helps suggest your competition weight class.
      </Text>
      <View style={weightSheetStyles.row}>
        <TextInput
          style={weightSheetStyles.input}
          value={text}
          onChangeText={(t) => {
            const cleaned = t.replace(/[^0-9.]/g, '');
            if (cleaned.split('.').length <= 2) setText(cleaned);
          }}
          placeholder={u === 'lb' ? '165' : '75'}
          placeholderTextColor={colors.gray600}
          keyboardType="decimal-pad"
          autoFocus
        />
        <View style={weightSheetStyles.unitRow}>
          {(['lb', 'kg'] as const).map((opt) => (
            <Pressable
              key={opt}
              style={[styles.freqChip, u === opt && styles.chipSelected]}
              onPress={() => {
                if (u !== opt) {
                  const num = parseFloat(text);
                  if (!isNaN(num) && num > 0) {
                    setText(opt === 'kg'
                      ? String(Math.round(num * 0.453592 * 10) / 10)
                      : String(Math.round(num * 2.20462)));
                  }
                  setU(opt);
                }
              }}
            >
              <Text style={[styles.chipText, u === opt && styles.chipTextSelected]}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SheetWrapper>
  );
}

const weightSheetStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  input: {
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
  unitRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarInitial: {
    fontFamily: 'Unbounded-Bold',
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  editProfileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 13,
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
  lockedLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    borderRadius: radius.full,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
    minHeight: 48,
    justifyContent: 'center',
  },
});
