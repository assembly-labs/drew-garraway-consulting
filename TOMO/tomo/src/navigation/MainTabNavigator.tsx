/**
 * Main Tab Navigator — Journal, Log (center button), Profile
 *
 * Matches the prototype's TabBar: bottom-fixed, dark bg, gold active state.
 * MVP has 3 tabs instead of prototype's 4 (Stats, Techniques, Insights deferred).
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { JournalScreen } from '../screens/JournalScreen';
import { SessionLoggerScreen } from '../screens/SessionLoggerScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SessionDetailScreen } from '../screens/SessionDetailScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { Icons } from '../components/Icons';
import { colors, spacing } from '../config/design-tokens';

// Journal stack (list + detail)
export type JournalStackParamList = {
  JournalList: undefined;
  SessionDetail: { sessionId: string };
};

const JournalStack = createNativeStackNavigator<JournalStackParamList>();

function JournalStackNavigator() {
  return (
    <JournalStack.Navigator screenOptions={{ headerShown: false }}>
      <JournalStack.Screen name="JournalList" component={JournalScreen} />
      <JournalStack.Screen name="SessionDetail" component={SessionDetailScreen} />
    </JournalStack.Navigator>
  );
}

// Profile stack (profile + privacy policy)
export type ProfileStackParamList = {
  ProfileMain: undefined;
  PrivacyPolicy: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </ProfileStack.Navigator>
  );
}

// Tab navigator
export type MainTabParamList = {
  JournalTab: undefined;
  LogTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.gray500,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="JournalTab"
        component={JournalStackNavigator}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Icons.Journal size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="LogTab"
        component={SessionLoggerScreen}
        options={{
          tabBarLabel: '',
          tabBarAccessibilityLabel: 'Log Session',
          tabBarIcon: () => (
            <View style={styles.logButton}>
              <Icons.Plus size={28} color={colors.black} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icons.Profile size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.black,
    borderTopColor: colors.gray800,
    borderTopWidth: 1,
    height: 88,
    paddingBottom: 28,
    paddingTop: spacing.sm,
  },
  tabLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
