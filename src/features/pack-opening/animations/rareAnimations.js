import { withSequence, withTiming, withRepeat, withSpring } from 'react-native-reanimated';

import {
  GLOW_SCALE,
  GLOW_SPRING,
  RARE_GLOW_DURATION,
  PARTICLE_DURATION,
  SHAKE_DISTANCE,
  SHAKE_DURATION,
} from './constants';

/** Starts the looping glow + particle-progress animation for a hit card. */
export function playRareAnimation({ glowOpacity, glowScale, particleProgress }) {
  'worklet';

  glowOpacity.value = withSequence(
    withTiming(0.9, { duration: RARE_GLOW_DURATION * 0.25 }),
    withRepeat(withTiming(0.45, { duration: RARE_GLOW_DURATION * 0.5 }), -1, true),
  );

  glowScale.value = withSpring(GLOW_SCALE, GLOW_SPRING);

  particleProgress.value = withTiming(1, { duration: PARTICLE_DURATION });
}

/** Stops the glow/particle loop — used when a card is dismissed mid-animation. */
export function stopRareAnimation({ glowOpacity, glowScale, particleProgress }) {
  'worklet';

  glowOpacity.value = withTiming(0, { duration: 180 });
  glowScale.value = withSpring(1, GLOW_SPRING);
  particleProgress.value = 0;
}

/** A short, contained left-right shake — does not touch translateY/rotate. */
export function shakeCard(translateX) {
  'worklet';

  translateX.value = withSequence(
    withTiming(-SHAKE_DISTANCE, { duration: SHAKE_DURATION }),
    withTiming(SHAKE_DISTANCE, { duration: SHAKE_DURATION }),
    withTiming(-SHAKE_DISTANCE * 0.6, { duration: SHAKE_DURATION }),
    withTiming(0, { duration: SHAKE_DURATION }),
  );
}