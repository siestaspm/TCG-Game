// src/components/ui/ScreenBackground.jsx
//
// Whole-page backdrop for content screens (Home, Binder, Profile, Quests,
// etc). A thin wrapper around GradientBackground pinned to gradients.surface
// - the subtle app-wide atmosphere gradient - so screens don't each have to
// import LinearGradient + the surface stops themselves.
import React from 'react';
import GradientBackground from './GradientBackground';
import AbstractBackdrop from './AbstractBackdrop';
import { gradients } from '../../constants/theme';

export default function ScreenBackground({ children, style }) {
  return (
    <GradientBackground colors={gradients.surface} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={style}>
      <AbstractBackdrop />
      {children}
    </GradientBackground>
  );
}
