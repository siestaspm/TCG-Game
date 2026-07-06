// Declarative "what should happen when this rarity is revealed" table.
// UI/animation code should only ever call getCardEffects() + triggerCardEffects();
// it should never branch on a rarity string itself.

import { isHit } from '../../../constants/rarity';
import {
  playRareAnimation,
  stopRareAnimation,
  shakeCard,
} from '../animations/rareAnimations';

const EFFECTS = {
  C: { glow: false, particles: false, shake: false, haptic: 'impactLight', sound: 'common' },
  UC: { glow: false, particles: false, shake: false, haptic: 'impactLight', sound: 'common' },
  R: { glow: true, particles: false, shake: false, haptic: 'impactMedium', sound: 'rare' },
  SR: { glow: true, particles: true, shake: true, haptic: 'notificationSuccess', sound: 'superRare' },
  SEC: { glow: true, particles: true, shake: true, haptic: 'notificationSuccess', sound: 'secretRare' },
  SP: { glow: true, particles: true, shake: true, haptic: 'notificationSuccess', sound: 'specialRare' },
  L: { glow: true, particles: true, shake: true, haptic: 'notificationSuccess', sound: 'leader' },
  P: { glow: true, particles: true, shake: true, haptic: 'notificationSuccess', sound: 'promo' },
};

const FALLBACK = {
  glow: false,
  particles: false,
  shake: false,
  haptic: 'impactLight',
  sound: 'common',
};

export function getCardEffects(rarity) {
  if (EFFECTS[rarity]) return EFFECTS[rarity];
  // Unknown rarity code: fall back to "is it at least a hit" heuristic
  // rather than silently treating it as common.
  return isHit(rarity)
    ? { ...FALLBACK, glow: true, haptic: 'impactMedium', sound: 'rare' }
    : FALLBACK;
}

/**
 * Starts every animated side-effect for a card reveal in one call.
 * `sharedValues` must contain the shared values owned by the revealing card
 * (see useCardAnimations). `onFeedback` is an optional JS-thread callback
 * fired once, used to trigger haptics/sound from host app code without this
 * module depending on any specific haptics/audio library.
 */
export function triggerCardEffects(rarity, sharedValues, onFeedback) {
  const effects = getCardEffects(rarity);

  if (effects.glow || effects.particles) {
    playRareAnimation(sharedValues);
  }

  if (effects.shake) {
    shakeCard(sharedValues.translateX);
  }

  if (onFeedback) {
    onFeedback({ haptic: effects.haptic, sound: effects.sound });
  }

  return effects;
}

export function clearCardEffects(sharedValues) {
  stopRareAnimation(sharedValues);
}