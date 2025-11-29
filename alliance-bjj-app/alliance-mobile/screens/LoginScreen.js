import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAppContext();

  // Auto-login for prototype - bypass authentication entirely
  useEffect(() => {
    // Automatically "log in" after a brief delay for visual effect
    const timer = setTimeout(() => {
      login();
      // Navigation handled by App.js auth state
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    // Instant login for prototype - no validation
    login();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Alliance BJJ</Text>
            <Text style={styles.subtitle}>Prototype Demo</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="demo@example.com"
                editable={false}
                value="demo@example.com"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                editable={false}
                value="prototype"
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Enter Prototype</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={styles.signUpText}>Contact your gym</Text>
            </TouchableOpacity>
          </View>

          {/* Demo notice */}
          <View style={styles.demoHint}>
            <Text style={styles.demoHintText}>🎨 Clickable Prototype - Tap anywhere to proceed</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#737373',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#737373',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#737373',
    fontSize: 14,
  },
  signUpText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  demoHint: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  demoHintText: {
    fontSize: 12,
    color: '#a5a5a5',
    fontStyle: 'italic',
  },
});