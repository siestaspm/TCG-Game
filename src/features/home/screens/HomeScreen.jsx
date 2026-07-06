// src/features/home/screens/HomeScreen.jsx
//
// Placeholder content so the new Home tab has something real to navigate
// from. Layout follows the mockup we designed (welcome header, banner into
// SetSelect, two quick-action tiles) but isn't wired to live data yet -
// that's the next step once navigation is confirmed working.

import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../constants/theme';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>welcome back</Text>
      <Text style={styles.title}>Captain</Text>

      <Pressable style={styles.banner} onPress={() => navigation.navigate('SetSelect')}>
        <Text style={styles.bannerEyebrow}>Browse sets</Text>
        <Text style={styles.bannerTitle}>Open your next pack</Text>
      </Pressable>

      <View style={styles.quickRow}>
        <Pressable
          style={[styles.quickTile, { borderLeftColor: colors.blue }]}
          onPress={() => navigation.navigate('SetSelect')}
        >
          <Text style={styles.quickLabel}>Sets</Text>
          <Text style={styles.quickHint}>Browse and open</Text>
        </Pressable>

        <Pressable
          style={[styles.quickTile, { borderLeftColor: colors.red }]}
          onPress={() => navigation.getParent()?.navigate('Binder')}
        >
          <Text style={styles.quickLabel}>My binder</Text>
          <Text style={styles.quickHint}>View your collection</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist },
  content: { padding: 20, paddingTop: 56, gap: 16 },

  eyebrow: { color: colors.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 2 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 },

  banner: {
    backgroundColor: colors.blueLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.blue,
    padding: 16,
    gap: 6,
  },
  bannerEyebrow: { color: colors.blueDeep, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },

  quickRow: { flexDirection: 'row', gap: 10 },
  quickTile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    padding: 14,
    gap: 4,
  },
  quickLabel: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  quickHint: { color: colors.textSecondary, fontSize: 11 },
});