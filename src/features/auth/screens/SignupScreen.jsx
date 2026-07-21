// src/features/auth/screens/SignupScreen.jsx
import React, { useState } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import GradientBackground from '../../../components/ui/GradientBackground';
import Surface from '../../../components/ui/Surface';
import TextField from '../../../components/ui/TextField';
import Button from '../../../components/ui/Button';
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
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>get started</Text>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Start building your collection.</Text>

          <Surface style={styles.card}>
            <TextField
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="Password"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.fieldSpacing}
            />
            <TextField
              label="Confirm password"
              placeholder="Confirm password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.fieldSpacing}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {checkEmailMessage ? <Text style={styles.success}>{checkEmailMessage}</Text> : null}

            <Button title="Sign Up" onPress={handleSignup} loading={submitting} style={styles.button} />
          </Surface>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Log in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 12 },

  eyebrow: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', color: colors.white, marginTop: 2 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },

  card: { gap: 4 },
  fieldSpacing: { marginTop: 14 },

  error: { color: colors.redDeep, fontSize: 13, fontWeight: '600', marginTop: 14 },
  success: { color: colors.blueDeep, fontSize: 13, fontWeight: '600', marginTop: 14 },
  button: { marginTop: 18 },

  link: { textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  linkBold: { color: colors.white, fontWeight: '800' },
});
