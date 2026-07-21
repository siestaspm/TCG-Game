// src/features/profile/screens/ChangePasswordScreen.jsx
import React, { useState } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { supabase } from '../../../lib/supabase';
import TextField from '../../../components/ui/TextField';
import Button from '../../../components/ui/Button';
import Surface from '../../../components/ui/Surface';
import ScreenBackground from '../../../components/ui/ScreenBackground';
import { colors } from '../../../constants/theme';

export default function ChangePasswordScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!password || !confirmPassword) {
      setError('Fill in both fields.');
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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <ScreenBackground>
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹ Back</Text>
        </Pressable>

        <Text style={styles.title}>Change password</Text>
        <Text style={styles.subtitle}>Choose a new password for your account.</Text>

        <Surface style={styles.card}>
          <TextField
            label="New password"
            placeholder="New password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
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
          {success ? <Text style={styles.success}>Password updated.</Text> : null}

          <Button
            title="Update password"
            onPress={handleSubmit}
            loading={submitting}
            style={styles.button}
          />
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60, gap: 6 },

  backButton: { alignSelf: 'flex-start', paddingVertical: 4, marginBottom: 4 },
  backButtonText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },

  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginBottom: 18 },

  card: { gap: 4 },
  fieldSpacing: { marginTop: 14 },

  error: { color: colors.redDeep, fontSize: 13, fontWeight: '600', marginTop: 14 },
  success: { color: colors.blueDeep, fontSize: 13, fontWeight: '600', marginTop: 14 },

  button: { marginTop: 18 },
});
