import { interpolate, withSpring, withTiming, runOnJS } from 'react-native-reanimated';

import {
  DEFAULT_SPRING,
  SNAP_BACK_SPRING,
  SWIPE_DISMISS_DURATION,
  FLIP_DURATION,
  MAX_ROTATION,
} from './constants';

/** Called continuously while the top card is being dragged. */
export function updateDrag({ event, translateX, translateY, rotateZ }) {
  'worklet';

  translateX.value = event.translationX;
  translateY.value = event.translationY * 0.08;

  rotateZ.value = interpolate(
    event.translationX,
    [-300, 0, 300],
    [-MAX_ROTATION, 0, MAX_ROTATION],
    'clamp',
  );
}

/** Snaps the card back to center — used when a drag doesn't clear the threshold. */
export function resetDrag({ translateX, translateY, rotateZ }) {
  'worklet';

  translateX.value = withSpring(0, SNAP_BACK_SPRING);
  translateY.value = withSpring(0, SNAP_BACK_SPRING);
  rotateZ.value = withSpring(0, SNAP_BACK_SPRING);
}

/** Flings the card off-screen, then calls onFinished on the JS thread. */
export function dismissCard({ translateX, rotateZ, direction = 1, screenWidth, onFinished }) {
  'worklet';

  rotateZ.value = withTiming(MAX_ROTATION * direction, { duration: SWIPE_DISMISS_DURATION });

  translateX.value = withTiming(
    screenWidth * 1.5 * direction,
    { duration: SWIPE_DISMISS_DURATION },
    (finished) => {
      if (finished && onFinished) {
        runOnJS(onFinished)();
      }
    },
  );
}

/**
 * Flips a card from back-facing to front-facing, using a SINGLE view whose
 * content is swapped by the caller at the midpoint (see onMidpoint).
 *
 * Rotates 0 -> 90 (card turns edge-on, effectively invisible at 90deg),
 * calls onMidpoint so the caller can swap CardBack -> CardFace, then jumps
 * rotateY instantly to -90 and animates -90 -> 0. The jump matters: if we
 * instead kept rotating 90 -> 180, the newly-swapped content would render
 * mirrored/backwards. Approaching 0 from -90 instead keeps it upright.
 */
export function flipToFront({ rotateY }, { onMidpoint, onFinished } = {}) {
  'worklet';

  const half = FLIP_DURATION / 2;

  rotateY.value = withTiming(90, { duration: half }, (finished) => {
    if (!finished) return;

    if (onMidpoint) {
      runOnJS(onMidpoint)();
    }

    rotateY.value = -90; // instant jump, still edge-on so no visible pop
    rotateY.value = withTiming(0, { duration: half }, (finished2) => {
      if (finished2 && onFinished) {
        runOnJS(onFinished)();
      }
    });
  });
}