/**
 * GymSearchInput — Reusable gym search with debounced autocomplete.
 *
 * Shared between onboarding (YourTrainingScreen) and profile editing
 * (ProfileScreen). Searches the gym database as the user types, shows
 * a dropdown of matches, and treats unmatched text as a custom gym.
 *
 * Does NOT handle location/nearby gym discovery — that stays in
 * onboarding only, which wraps this component.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors, spacing, radius, pressedStyles } from '../config/design-tokens';
import { Icons } from './Icons';
import { searchGyms, type GymWithDistance } from '../services/gymService';
import type { Coordinates } from '../hooks/useLocation';
import { haptics } from '../utils/haptics';

// ============================================
// TYPES
// ============================================

export interface SelectedGym {
  id: string | null;
  name: string;
  isCustom: boolean;
  city?: string;
  state?: string;
  affiliation?: string;
  lat?: number;
  lng?: number;
}

interface GymSearchInputProps {
  /** Pre-selected gym (for edit mode) */
  initialGym?: SelectedGym | null;
  /** Called when user selects a gym from autocomplete or commits custom text */
  onGymSelected: (gym: SelectedGym | null) => void;
  /** Optional coordinates to rank autocomplete results by proximity */
  coords?: Coordinates | null;
  /** Placeholder text */
  placeholder?: string;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function GymSearchInput({
  initialGym,
  onGymSelected,
  coords,
  placeholder = 'Search or add your gym',
  autoFocus = false,
}: GymSearchInputProps) {
  const [selectedGym, setSelectedGym] = useState<SelectedGym | null>(initialGym ?? null);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<GymWithDistance[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup pending search timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // Sync parent when selection changes
  const onGymSelectedRef = useRef(onGymSelected);
  onGymSelectedRef.current = onGymSelected;

  // Track whether this is the initial mount to avoid re-render loops
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Skip notifying parent on initial mount (parent already knows)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    onGymSelectedRef.current(selectedGym);
  }, [selectedGym]);

  const handleTextChange = useCallback((text: string) => {
    setSearchText(text);

    // Clear selection when user starts typing something new
    if (selectedGym && !selectedGym.isCustom) {
      setSelectedGym(null);
    }

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (text.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      const matches = await searchGyms(text, coords, 4);
      setResults(matches);
      setShowDropdown(matches.length > 0);
    }, 200);
  }, [selectedGym, coords]);

  const handleSelectGym = useCallback((gym: GymWithDistance) => {
    haptics.light();
    const selected: SelectedGym = {
      id: gym.id,
      name: gym.name,
      isCustom: false,
      city: gym.city,
      state: gym.stateOrCountry ?? undefined,
      affiliation: gym.affiliation ?? undefined,
      lat: gym.lat,
      lng: gym.lng,
    };
    setSelectedGym(selected);
    setSearchText(gym.name);
    setShowDropdown(false);
  }, []);

  const handleBlur = useCallback(() => {
    // Delay to allow tap on dropdown results
    setTimeout(() => {
      setShowDropdown(false);

      // If user typed something but didn't pick from dropdown, treat as custom
      if (searchText.trim() && !selectedGym) {
        const custom: SelectedGym = {
          id: null,
          name: searchText.trim(),
          isCustom: true,
        };
        setSelectedGym(custom);
      }
    }, 200);
  }, [searchText, selectedGym]);

  const handleSubmit = useCallback(() => {
    if (searchText.trim() && !selectedGym) {
      const custom: SelectedGym = {
        id: null,
        name: searchText.trim(),
        isCustom: true,
      };
      setSelectedGym(custom);
      setShowDropdown(false);
    }
  }, [searchText, selectedGym]);

  const handleClearSelection = useCallback(() => {
    setSelectedGym(null);
    setSearchText('');
    setShowDropdown(false);
  }, []);

  // ---- Selected gym confirmation display ----
  if (selectedGym) {
    return (
      <Pressable style={styles.selectedDisplay} onPress={handleClearSelection}>
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedName}>{selectedGym.name}</Text>
          {selectedGym.city && (
            <Text style={styles.selectedMeta}>
              {[selectedGym.city, selectedGym.state].filter(Boolean).join(', ')}
            </Text>
          )}
        </View>
        <Icons.Check size={18} color={colors.gold} strokeWidth={3} />
      </Pressable>
    );
  }

  // ---- Search input with autocomplete ----
  return (
    <View>
      <TextInput
        style={[
          styles.input,
          showDropdown && styles.inputWithDropdown,
        ]}
        value={searchText}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.gray600}
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="done"
      />
      {showDropdown && (
        <View style={styles.dropdown}>
          {results.map((gym, index) => (
            <Pressable
              key={gym.id || index}
              style={({ pressed }) => [
                styles.dropdownItem,
                index < results.length - 1 && styles.dropdownItemBorder,
                pressed && { backgroundColor: pressedStyles.card.backgroundColor },
              ]}
              onPress={() => handleSelectGym(gym)}
            >
              <Text style={styles.dropdownName}>{gym.name}</Text>
              <Text style={styles.dropdownMeta}>
                {[gym.city, gym.stateOrCountry, gym.affiliation]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  input: {
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
  inputWithDropdown: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    borderColor: colors.gold,
  },
  selectedDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  selectedMeta: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 1,
  },
  dropdown: {
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.gold,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dropdownName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 1,
  },
  dropdownMeta: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray500,
  },
});
