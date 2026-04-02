/**
 * TOMO — Error Boundary
 *
 * Catches unhandled React errors and shows a recovery screen
 * instead of a white screen crash. Reports to Sentry if configured.
 *
 * USAGE:
 *   Wrap the app in App.tsx:
 *   <ErrorBoundary>
 *     <RootNavigator />
 *   </ErrorBoundary>
 */

import React, { Component, ErrorInfo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from './Icons';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconCircle}>
              <Icons.AlertCircle size={40} color={colors.negative} />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.description}>
              The app ran into an unexpected error. Tap below to try again.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText} numberOfLines={4}>
                  {this.state.error.message}
                </Text>
              </View>
            )}
            <Pressable
              style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.85 }]}
              onPress={this.handleRetry}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.negativeDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  errorBox: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  errorText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.negative,
    fontFamily: 'JetBrains Mono',
  },
  retryButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: 16,
    borderRadius: radius.xl,
    minWidth: 160,
    alignItems: 'center',
  },
  retryText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
});
