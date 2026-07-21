// src/components/ui/GradientBackground.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/theme';

export default function GradientBackground({
  children,
  colors = gradients.brand,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
}) {
  return (
    <LinearGradient colors={colors} start={start} end={end} style={[styles.fill, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
