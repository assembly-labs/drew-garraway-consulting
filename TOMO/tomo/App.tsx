import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import {
  Unbounded_500Medium,
  Unbounded_700Bold,
  Unbounded_800ExtraBold,
  Unbounded_900Black,
} from '@expo-google-fonts/unbounded';
import {
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { colors } from './src/config/design-tokens';
import { AuthProvider } from './src/hooks/useAuth';
import { ToastProvider } from './src/components/Toast';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/RootNavigator';
import { OfflineBanner } from './src/components/NetworkError';

Sentry.init({
  dsn: Constants.expoConfig?.extra?.sentryDsn ?? '',
  // Only send errors in production, not during development
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
});

function App() {
  const [fontsLoaded] = useFonts({
    // Unbounded — headlines, hero numbers (weight 500+)
    Unbounded: Unbounded_500Medium,
    'Unbounded-Bold': Unbounded_700Bold,
    'Unbounded-ExtraBold': Unbounded_800ExtraBold,
    'Unbounded-Black': Unbounded_900Black,
    // Inter — body text (weight 500+)
    Inter: Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    // JetBrains Mono — labels, data values (weight 500+)
    'JetBrains Mono': JetBrainsMono_500Medium,
    'JetBrains Mono-SemiBold': JetBrainsMono_600SemiBold,
    'JetBrains Mono-Bold': JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <StatusBar style="light" />
            <OfflineBanner />
            <RootNavigator />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(App);
