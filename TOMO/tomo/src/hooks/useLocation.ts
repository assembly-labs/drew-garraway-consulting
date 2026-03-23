/**
 * useLocation — Hook for requesting and getting device location
 *
 * Wraps expo-location with a simple state machine:
 * - 'idle' → haven't asked yet
 * - 'loading' → requesting permission or fetching coords
 * - 'granted' → have coordinates
 * - 'denied' → user denied or system denied
 * - 'skipped' → user chose "I'll type it myself"
 */

import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

export type LocationState = 'idle' | 'loading' | 'granted' | 'denied' | 'skipped';

export interface Coordinates {
  lat: number;
  lng: number;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const requestLocation = useCallback(async () => {
    setState('loading');

    try {
      // Check if already granted
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

      if (existingStatus === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
        setState('granted');
        return;
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setState('denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
      setState('granted');
    } catch {
      setState('denied');
    }
  }, []);

  const skip = useCallback(() => {
    setState('skipped');
  }, []);

  const checkExistingPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }, []);

  return {
    state,
    coords,
    requestLocation,
    skip,
    checkExistingPermission,
  };
}
