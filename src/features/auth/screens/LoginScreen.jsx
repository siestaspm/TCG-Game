// src/features/auth/screens/LoginScreen.jsx
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
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>welcome back</Text>
          <Text style={styles.title}>Log in</Text>
          <Text style={styles.subtitle}>Keep opening packs and growing your binder.</Text>

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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Log In" onPress={handleLogin} loading={submitting} style={styles.button} />
          </Surface>

          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>
              Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
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
  button: { marginTop: 18 },

  link: { textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  linkBold: { color: colors.white, fontWeight: '800' },
});
