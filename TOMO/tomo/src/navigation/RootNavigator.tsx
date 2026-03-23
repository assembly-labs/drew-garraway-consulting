/**
 * Root Navigator — Controls auth flow → onboarding → main app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { colors } from '../config/design-tokens';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { authState } = useAuth();

  if (authState === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.gold,
          background: colors.black,
          card: colors.black,
          text: colors.white,
          border: colors.gray700,
          notification: colors.gold,
        },
        fonts: {
          regular: { fontFamily: 'Inter', fontWeight: '500' },
          medium: { fontFamily: 'Inter-SemiBold', fontWeight: '600' },
          bold: { fontFamily: 'Inter-Bold', fontWeight: '700' },
          heavy: { fontFamily: 'Unbounded-ExtraBold', fontWeight: '800' },
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {authState === 'unauthenticated' && (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
        {authState === 'needs_onboarding' && (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
        {authState === 'authenticated' && (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
