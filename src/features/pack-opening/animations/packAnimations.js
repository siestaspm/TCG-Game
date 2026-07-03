import { withSpring, withTiming, withSequence, runOnJS } from 'react-native-reanimated';

import { PACK_PRESS_SPRING, PACK_OPEN_DURATION } from './constants';

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
 * Plays the "rip open" animation and calls onFinished once it's fully
 * played out, so callers never have to guess a matching setTimeout.
 */
export function openPack({ packScale, packOpacity, onFinished }) {
  'worklet';

  packScale.value = withSequence(
    withTiming(1.08, { duration: PACK_OPEN_DURATION * 0.4 }),
    withTiming(1.3, { duration: PACK_OPEN_DURATION * 0.6 }),
  );

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
export function resetPack({ packScale, packOpacity }) {
  'worklet';
  packScale.value = 1;
  packOpacity.value = 1;
}