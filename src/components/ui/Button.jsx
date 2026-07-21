// src/components/ui/Button.jsx
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, gradients, radii } from '../../constants/theme';

const VARIANT_TEXT_COLOR = {
  primary: colors.white,
  secondary: colors.blue,
  destructive: colors.redDeep,
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const isDisabled = disabled || loading;
  const content = loading ? (
    <ActivityIndicator color={VARIANT_TEXT_COLOR[variant]} />
  ) : (
    <Text style={[styles.text, { color: VARIANT_TEXT_COLOR[variant] }]}>{title}</Text>
  );

  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={[isDisabled && styles.disabled, style]}>
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.pill}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.pill,
        variant === 'secondary' && styles.secondary,
        variant === 'destructive' && styles.destructive,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radii.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.blueLight,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  destructive: {
    backgroundColor: colors.redLight,
    borderWidth: 1,
    borderColor: colors.red,
  },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '700', fontSize: 15 },
});
