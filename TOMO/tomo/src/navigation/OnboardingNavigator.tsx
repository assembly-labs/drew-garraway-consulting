/**
 * Onboarding Navigator — linear flow
 *
 * ONBOARDING_SCREEN_ORDER is the single source of truth for progress
 * calculation. Add/remove screens here and the progress bar auto-adjusts.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

/**
 * Screen order for progress bar calculation.
 * Add/remove entries here — all progress percentages auto-adjust.
 */
export const ONBOARDING_SCREEN_ORDER = [
  'Welcome',
  'AboutYou',
  'YourTraining',
  'GetStarted',
] as const;
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { AboutYouScreen } from '../screens/onboarding/AboutYouScreen';
import { YourTrainingScreen } from '../screens/onboarding/YourTrainingScreen';
import { GetStartedScreen } from '../screens/onboarding/GetStartedScreen';

export type OnboardingStackParamList = {
  Welcome: undefined;
  AboutYou: undefined;
  YourTraining: { name: string; belt: string; stripes: number };
  GetStarted: {
    name: string;
    belt: string;
    stripes: number;
    gymId: string | null;
    gymName: string;
    gymIsCustom: boolean;
    gymCity?: string;
    gymState?: string;
    gymAffiliation?: string;
    gymLat?: number;
    gymLng?: number;
    locationPermission: 'granted' | 'denied' | 'skipped';
    targetFrequency: number;
    trainingGoals?: string[];
    experienceLevel?: string;
  };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AboutYou" component={AboutYouScreen} />
      <Stack.Screen name="YourTraining" component={YourTrainingScreen} />
      <Stack.Screen
        name="GetStarted"
        component={GetStartedScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
