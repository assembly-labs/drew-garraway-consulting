/**
 * GymPickerSheet — Bottom sheet for overriding the gym on a session.
 *
 * Used in SessionLoggerScreen when the user taps the gym chip.
 * Wraps GymSearchInput in a modal with contextual copy explaining
 * that this only affects the current session.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../config/design-tokens';
import { GymSearchInput, type SelectedGym } from './GymSearchInput';

interface GymPickerSheetProps {
  visible: boolean;
  onSelect: (gym: SelectedGym) => void;
  onClose: () => void;
}

export function GymPickerSheet({ visible, onSelect, onClose }: GymPickerSheetProps) {
  const [gym, setGym] = useState<SelectedGym | null>(null);

  useEffect(() => { if (visible) setGym(null); }, [visible]);

  const canSave = gym !== null && gym.name.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }} onPress={onClose} hitSlop={8}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
          <Text style={styles.title}>Switch Gym</Text>
          <Pressable
            style={({ pressed }) => pressed && { opacity: 0.7 }}
            onPress={() => canSave && gym && onSelect(gym)}
            hitSlop={8}
          >
            <Text style={[styles.save, !canSave && { opacity: 0.3 }]}>Done</Text>
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.subtitle}>
            Training somewhere else today? Your home gym won't change.
          </Text>
          <GymSearchInput
            key={visible ? 'open' : 'closed'}
            onGymSelected={setGym}
            placeholder="Where are you training today?"
            autoFocus
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  cancel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray400,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  save: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.gold,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray500,
    marginBottom: spacing.md,
  },
});
