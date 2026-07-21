// src/components/ui/Surface.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, shadow } from '../../constants/theme';

export default function Surface({ children, style, padded = true, ...rest }) {
  return (
    <View style={[styles.base, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  padded: { padding: 16 },
});
