/**
 * Network Error Component — Offline detection + auto-retry
 *
 * Shows a banner overlay when the device is offline.
 * Automatically processes queued uploads when connectivity returns.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { colors, spacing } from '../config/design-tokens';
import { Icons } from './Icons';
import { offlineQueue } from '../services/offline-queue';

/**
 * Banner that appears at the top when offline. Dismisses automatically on reconnect.
 */
export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let wasOffline = false;
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable !== false);
      setIsOffline(offline);
      // When coming back online, process any queued uploads
      if (wasOffline && !offline) {
        offlineQueue.processQueue().catch(() => {});
      }
      wasOffline = offline;
    });
    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Icons.AlertCircle size={16} color={colors.warning} />
      <Text style={styles.bannerText}>No internet connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingTop: 54,
    paddingBottom: 10,
    paddingHorizontal: spacing.md,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warning,
  },
});
