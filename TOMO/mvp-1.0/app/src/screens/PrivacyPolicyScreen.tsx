/**
 * Privacy Policy Screen — In-app scrollable privacy policy
 *
 * Required for TestFlight submission. Accessible from Profile screen.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from '../components/Icons';

export function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
          onPress={() => navigation.goBack()}
        >
          <Icons.Back size={22} color={colors.gray400} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last updated March 13, 2026</Text>

        <Section title="Overview">
          TOMO is a BJJ training journal that helps you log sessions via voice or text.
          Your privacy matters. This policy explains what data we collect, how we use it, and your rights.
        </Section>

        <Section title="What We Collect">
          {`\u2022 Account info: Email address (for authentication).

\u2022 Profile data: Name, belt rank, gym name, training preferences. You provide this during onboarding.

\u2022 Session data: Training logs you create, including techniques drilled, sparring details, submissions, injuries, instructor, and notes.

\u2022 Voice recordings: Audio recorded when you use voice logging. Recordings are processed for transcription and then stored securely. They are never shared.

\u2022 Device info: Crash reports via Sentry (device model, OS version, stack traces). No personal data is included in crash reports.`}
        </Section>

        <Section title="How We Use Your Data">
          {`\u2022 To provide the core journaling experience (storing and displaying your training sessions).

\u2022 To transcribe voice recordings into text using AssemblyAI (a third-party transcription service).

\u2022 To extract structured session data from transcripts using AI (Anthropic Claude).

\u2022 To fix bugs and improve app stability via crash reports.`}
        </Section>

        <Section title="Third-Party Services">
          {`\u2022 Supabase: Database and authentication. Data stored in the US.

\u2022 AssemblyAI: Voice transcription. Audio is processed and not retained.

\u2022 Anthropic: AI text processing. Transcripts are processed and not retained.

\u2022 Sentry: Crash reporting. No personal data collected.`}
        </Section>

        <Section title="Data Storage & Security">
          All data is stored in Supabase (PostgreSQL) with row-level security policies.
          Voice recordings are stored in a private bucket accessible only to the recording user.
          All data is transmitted over HTTPS. We do not sell or share your data with advertisers.
        </Section>

        <Section title="Data Retention">
          Your data is retained as long as your account exists. You can delete individual sessions at any time.
          To delete your entire account and all associated data, contact us at the email below.
        </Section>

        <Section title="Your Rights">
          {`\u2022 Access, correct, or delete your personal data at any time.

\u2022 Export your session data (feature coming soon).

\u2022 Delete your account by contacting us.`}
        </Section>

        <Section title="Children">
          TOMO is not intended for children under 13. We do not knowingly collect data from children under 13.
        </Section>

        <Section title="Changes">
          We may update this policy. Changes will be posted here with an updated date.
          Continued use of the app after changes constitutes acceptance.
        </Section>

        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.body}>
            Questions about this privacy policy?
          </Text>
          <Text style={styles.email}>drew@assemblylabs.co</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  updated: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray600,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray400,
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  email: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600',
    color: colors.gold,
    marginTop: spacing.xs,
  },
});
