/**
 * Auth Screen — Email sign in / sign up
 * Apple Sign-In deferred until Apple Developer account is activated.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { colors, spacing, radius } from '../config/design-tokens';
import { Icons } from '../components/Icons';
import { supabase } from '../services/supabase';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password.', 'warning');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          showToast(error, 'error');
        }
      } else {
        const { error, session } = await signUp(email.trim(), password);
        if (error) {
          showToast(error, 'error');
        } else if (!session) {
          // No session returned = email confirmation is required by Supabase.
          // This is a fallback — the intended config has email confirmation OFF.
          showToast('Check your email for a confirmation link, then sign in.', 'success');
          setMode('signin');
        }
        // If session exists, onAuthStateChange fires SIGNED_IN automatically
        // and navigation moves user to onboarding. No toast needed.
      }
    } catch (error: any) {
      showToast(error?.message ?? 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showToast('Enter your email above first.', 'warning');
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Password reset link sent. Check your email.', 'success');
      }
    } catch {
      showToast('Could not send reset email. Try again.', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TOMO</Text>
            <Text style={styles.logoSubtext}>友</Text>
            <Text style={styles.logoDescriptor}>BJJ TRAINING JOURNAL</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <TextInput
                style={[styles.textInput, emailFocused && styles.textInputFocused]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor={colors.gray600}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={[styles.passwordContainer, passwordFocused && styles.textInputFocused]}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={mode === 'signup' ? 'Create a password' : 'Your password'}
                  placeholderTextColor={colors.gray600}
                  secureTextEntry={!showPassword}
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <Pressable
                  style={styles.eyeToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={4}
                >
                  {showPassword
                    ? <Icons.EyeOff size={20} color={colors.gray500} />
                    : <Icons.Eye size={20} color={colors.gray500} />
                  }
                </Pressable>
              </View>
            </View>

            {/* Forgot Password — only on sign in */}
            {mode === 'signin' && (
              <Pressable
                style={({ pressed }) => [styles.forgotPassword, pressed && { opacity: 0.7 }]}
                onPress={handleForgotPassword}
                disabled={resetLoading}
              >
                <Text style={styles.forgotPasswordText}>
                  {resetLoading ? 'Sending...' : 'Forgot password?'}
                </Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [styles.button, loading && styles.buttonDisabled, pressed && !loading && { opacity: 0.85 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.black} />
              ) : (
                <Text style={styles.buttonText}>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Toggle mode */}
          <Pressable
            style={({ pressed }) => [styles.toggleMode, pressed && { opacity: 0.7 }]}
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            <Text style={styles.toggleModeText}>
              {mode === 'signin'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text style={styles.toggleModeLink}>
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoText: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 8,
  },
  logoSubtext: {
    fontFamily: 'Inter',
    fontSize: 32,
    color: colors.gold,
    marginTop: spacing.sm,
  },
  logoDescriptor: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
    marginTop: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    letterSpacing: 2,
  },
  textInput: {
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
  textInputFocused: {
    borderColor: colors.gold,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Inter',
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    fontSize: 17,
    fontWeight: '500',
    color: colors.white,
  },
  eyeToggle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 18,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    fontWeight: '700',
    color: colors.black,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray400,
    textDecorationLine: 'underline',
  },
  toggleMode: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  toggleModeText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '500',
    color: colors.gray500,
  },
  toggleModeLink: {
    fontFamily: 'Inter-SemiBold',
    color: colors.gold,
    fontWeight: '600',
  },
});
