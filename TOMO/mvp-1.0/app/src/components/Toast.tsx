/**
 * TOMO — Toast Notification System
 *
 * Global toast notifications with auto-dismiss. Provides a context so any
 * screen can trigger toasts without prop drilling.
 *
 * USAGE:
 *   import { useToast } from '@/components/Toast';
 *
 *   const { showToast } = useToast();
 *   showToast('Session saved', 'success');
 *   showToast('Upload failed', 'error');
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons } from './Icons';
import { colors, spacing, radius, typography, shadows } from '../config/design-tokens';

// --- Types ---

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

// --- Context ---

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// --- Provider ---

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setToast(null));
  }, [fadeAnim, translateY]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration = 3000) => {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Reset animation values
      fadeAnim.setValue(0);
      translateY.setValue(20);

      const id = ++nextId;
      setToast({ id, message, type, duration });

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss
      timerRef.current = setTimeout(dismiss, duration);
    },
    [fadeAnim, translateY, dismiss],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.container,
            { bottom: Math.max(insets.bottom, spacing.md) + 60 },
            { opacity: fadeAnim, transform: [{ translateY }] },
          ]}
          pointerEvents="box-none"
        >
          <Pressable
            style={[styles.toast, typeStyles[toast.type]]}
            onPress={dismiss}
          >
            <View style={styles.iconWrap}>
              {toast.type === 'success' && (
                <Icons.CheckCircle size={20} color={colors.positive} />
              )}
              {toast.type === 'error' && (
                <Icons.AlertCircle size={20} color={colors.negative} />
              )}
              {toast.type === 'warning' && (
                <Icons.AlertCircle size={20} color={colors.warning} />
              )}
              {toast.type === 'info' && (
                <Icons.Info size={20} color={colors.info} />
              )}
            </View>
            <Text style={[styles.message, messageTypeStyles[toast.type]]} numberOfLines={2}>
              {toast.message}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    maxWidth: 400,
    width: '100%',
    ...shadows.elevated,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.body,
    flex: 1,
  },
});

const typeStyles = StyleSheet.create({
  success: {
    backgroundColor: colors.toastSuccess,
    borderColor: colors.positive,
  },
  error: {
    backgroundColor: colors.toastError,
    borderColor: colors.negative,
  },
  warning: {
    backgroundColor: colors.toastWarning,
    borderColor: colors.warning,
  },
  info: {
    backgroundColor: colors.toastInfo,
    borderColor: colors.info,
  },
});

const messageTypeStyles = StyleSheet.create({
  success: { color: colors.positive },
  error: { color: colors.negative },
  warning: { color: colors.warning },
  info: { color: colors.info },
});
