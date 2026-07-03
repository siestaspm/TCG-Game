// src/hooks/useHaptics.js
// Centralized haptic feedback patterns for consistent feel across the app.

import HapticFeedback from 'react-native-haptic-feedback';

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * useHaptics()
 * Returns object with haptic feedback functions:
 * - tap() — light tap (card flip, subtle interactions)
 * - press() — medium press (button presses, important actions)
 * - success() — success notification (pack opened, rare pull)
 * - error() — error notification (network failure, invalid action)
 * - swipe() — light feedback for swipe completion
 */
export function useHaptics() {
  return {
    /**
     * tap() - Light haptic for subtle interactions
     * Use: Card flip, toggle switch, small confirmation
     */
    tap: () => {
      HapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
    },

    /**
     * press() - Medium haptic for button presses
     * Use: Opening a pack, navigating screens, primary actions
     */
    press: () => {
      HapticFeedback.trigger('impactMedium', HAPTIC_OPTIONS);
    },

    /**
     * impact() - Heavy haptic for important events
     * Use: Rare pull reveal, big moment, collision
     */
    impact: () => {
      HapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
    },

    /**
     * success() - Success notification pattern
     * Use: Pack opened successfully, collection updated, achievement
     */
    success: () => {
      HapticFeedback.trigger('notificationSuccess', HAPTIC_OPTIONS);
    },

    /**
     * error() - Error notification pattern
     * Use: Network error, invalid action, failed request
     */
    error: () => {
      HapticFeedback.trigger('notificationError', HAPTIC_OPTIONS);
    },

    /**
     * warning() - Warning notification pattern
     * Use: Confirm action, low battery, connection issue
     */
    warning: () => {
      HapticFeedback.trigger('notificationWarning', HAPTIC_OPTIONS);
    },

    /**
     * burst() - Rapid light feedback (pulse-like)
     * Use: Confirming multiple selections, rapid interaction
     */
    burst: async () => {
      for (let i = 0; i < 3; i++) {
        HapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    },

    /**
     * celebration() - Heavy + success combo
     * Use: Rare pull, first card of set, special moment
     */
    celebration: async () => {
      HapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
      await new Promise((resolve) => setTimeout(resolve, 100));
      HapticFeedback.trigger('notificationSuccess', HAPTIC_OPTIONS);
    },
  };
}

/**
 * Usage Example:
 *
 * import { useHaptics } from '../hooks/useHaptics';
 *
 * export default function MyComponent() {
 *   const haptics = useHaptics();
 *
 *   const handleCardFlip = () => {
 *     haptics.tap();
 *   };
 *
 *   const handleOpenPack = () => {
 *     haptics.press();
 *   };
 *
 *   const handleRarePull = async () => {
 *     await haptics.celebration();
 *   };
 *
 *   return null;
 * }
 */