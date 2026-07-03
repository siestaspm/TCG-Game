import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressIndicator({ current = 0, total = 0 }) {
  if (!total) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={[styles.dot, index < current && styles.activeDot]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    width: 18,
    backgroundColor: '#2F6FED',
  },
});