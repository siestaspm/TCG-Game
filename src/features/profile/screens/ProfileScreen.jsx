// src/features/profile/screens/ProfileScreen.jsx
//
// Placeholder so the new Profile tab has something real to render. Pull
// history / stats from your plan aren't wired up yet - sign out is,
// since RootNavigator needs a real way back to AuthNavigator to test the
// full nav tree end to end.

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../auth/hooks/useAuth';
import { colors } from '../../../constants/theme';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Pull history and account settings land here.</Text>

      <Pressable style={styles.signOutButton} onPress={() => signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist, padding: 20, paddingTop: 56, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 13 },
  signOutButton: {
    marginTop: 24,
    backgroundColor: colors.redLight,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: { color: colors.redDeep, fontWeight: '700', fontSize: 14 },
});