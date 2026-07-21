import {
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';

import {
  PACK_PRESS_SPRING,
  PACK_OPEN_DURATION,
  IDLE_FLOAT_DISTANCE,
  IDLE_FLOAT_DURATION,
  IDLE_SHEEN_DURATION,
  RIP_WOBBLE_DEG,
  RIP_FLASH_DURATION,
  RIP_SCREEN_SHAKE_DISTANCE,
} from './constants';

/** Small squeeze on press-in, tactile feedback before the rip. */
export function pressPack(packScale) {
  'worklet';
  packScale.value = withSpring(0.96, PACK_PRESS_SPRING);
}

/** Return to normal size if the press is released without opening. */
export function releasePack(packScale) {
  'worklet';
  packScale.value = withSpring(1, PACK_PRESS_SPRING);
}

/**
 * Gentle up/down bob + sheen sweep while the pack sits waiting for a tap -
 * makes it read as something alive/tappable rather than a static image.
 * Both loop forever until stopIdlePack cancels them.
 */
export function startIdlePack({ packTranslateY, packSheen }) {
  'worklet';

  packTranslateY.value = withRepeat(
    withSequence(
      withTiming(-IDLE_FLOAT_DISTANCE, { duration: IDLE_FLOAT_DURATION / 2 }),
      withTiming(0, { duration: IDLE_FLOAT_DURATION / 2 }),
    ),
    -1,
    true,
  );

  if (packSheen) {
    packSheen.value = withRepeat(withTiming(1, { duration: IDLE_SHEEN_DURATION }), -1, false);
  }
}

/** Cancels the idle bob/sheen and snaps back to rest before the rip plays. */
export function stopIdlePack({ packTranslateY, packSheen }) {
  'worklet';
  packTranslateY.value = withTiming(0, { duration: 150 });
  if (packSheen) packSheen.value = 0;
}

/**
 * Plays the "rip open" animation and calls onFinished once it's fully
 * played out, so callers never have to guess a matching setTimeout.
 *
 * More than a scale+fade: the pack wobbles as it tears, a radial flash
 * fires behind it, and the whole screen gets a one-frame shake for impact.
 */
export function openPack({
  packScale,
  packOpacity,
  packRotate,
  packFlash,
  screenShake,
  onFinished,
}) {
  'worklet';

  packScale.value = withSequence(
    withTiming(1.08, { duration: PACK_OPEN_DURATION * 0.4 }),
    withTiming(1.3, { duration: PACK_OPEN_DURATION * 0.6 }),
  );

  if (packRotate) {
    packRotate.value = withSequence(
      withTiming(-RIP_WOBBLE_DEG, { duration: PACK_OPEN_DURATION * 0.25 }),
      withTiming(RIP_WOBBLE_DEG, { duration: PACK_OPEN_DURATION * 0.25 }),
      withTiming(0, { duration: PACK_OPEN_DURATION * 0.5 }),
    );
  }

  if (packFlash) {
    packFlash.value = withSequence(
      withTiming(0.9, { duration: RIP_FLASH_DURATION * 0.35 }),
      withTiming(0, { duration: RIP_FLASH_DURATION * 0.65 }),
    );
  }

  if (screenShake) {
    screenShake.value = withSequence(
      withTiming(-RIP_SCREEN_SHAKE_DISTANCE, { duration: 45 }),
      withTiming(RIP_SCREEN_SHAKE_DISTANCE * 0.7, { duration: 45 }),
      withTiming(-RIP_SCREEN_SHAKE_DISTANCE * 0.4, { duration: 45 }),
      withTiming(0, { duration: 45 }),
    );
  }

  packOpacity.value = withTiming(
    0,
    { duration: PACK_OPEN_DURATION },
    (finished) => {
      if (finished && onFinished) {
        runOnJS(onFinished)();
      }
    },
  );
}

/** Resets pack visuals so the same shared values can be reused for another pack. */
export function resetPack({ packScale, packOpacity, packRotate, packTranslateY, packFlash }) {
  'worklet';
  packScale.value = 1;
  packOpacity.value = 1;
  if (packRotate) packRotate.value = 0;
  if (packTranslateY) packTranslateY.value = 0;
  if (packFlash) packFlash.value = 0;
}
