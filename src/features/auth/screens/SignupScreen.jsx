// src/features/auth/screens/SignupScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../../../constants/theme';

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [checkEmailMessage, setCheckEmailMessage] = useState(null);

  const handleSignup = async () => {
    setError(null);
    setCheckEmailMessage(null);

    if (!email || !password || !confirmPassword) {
      setError('Fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await signUp({ email: email.trim(), password });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is enabled in your Supabase project, signUp succeeds
    // but returns no session yet - the user has to confirm via email first.
    if (data.user && !data.session) {
      setCheckEmailMessage('Check your inbox to confirm your email, then log in.');
      return;
    }

    // If email confirmation is disabled, a session comes back immediately and
    // AuthProvider picks it up automatically - no manual navigation needed.
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>Start building your collection</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {checkEmailMessage ? <Text style={styles.success}>{checkEmailMessage}</Text> : null}

      <Pressable style={styles.button} onPress={handleSignup} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.mist, gap: 12 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  error: { color: colors.redDeep, fontSize: 13, fontWeight: '600' },
  success: { color: colors.blueDeep, fontSize: 13, fontWeight: '600' },
  button: {
    backgroundColor: colors.red,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center', marginTop: 16, color: colors.textSecondary, fontSize: 13 },
  linkBold: { color: colors.red, fontWeight: '700' },
});