// src/features/auth/screens/LoginScreen.jsx
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

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn({ email: email.trim(), password });
    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
    }
    // On success, AuthProvider's session state updates automatically and
    // RootNavigator switches to MainNavigator - no manual navigation needed here.
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to keep opening packs</Text>

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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>
          Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
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
  error: { color: colors.red, fontSize: 13, fontWeight: '600' },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  link: { textAlign: 'center', marginTop: 16, color: colors.textSecondary, fontSize: 13 },
  linkBold: { color: colors.blue, fontWeight: '700' },
});