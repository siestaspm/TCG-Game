// Single source of truth for every timing / physics value used by the
// pack-opening feature. Nothing outside this file should hardcode a
// duration, spring config, or dimension ratio.

// Card
export const CARD_WIDTH = 290;
export const CARD_ASPECT_RATIO = 0.72; // width / height
export const CARD_BORDER_RADIUS = 18;

export const MAX_ROTATION = 18; // deg, max tilt while dragging
export const SWIPE_THRESHOLD_RATIO = 0.28; // % of screen width to trigger dismiss
export const SWIPE_VELOCITY = 900;

// Stack presentation
export const STACK_OFFSET_Y = 6; // px each card behind top sits lower
export const STACK_SCALE_STEP = 0.035; // scale shrink per card behind top
export const STACK_MAX_VISIBLE_BEHIND = 4; // cap so a 10-card pack doesn't fan out forever

// Durations (ms)
export const PACK_PRESS_SPRING = { damping: 14, stiffness: 220 };
export const PACK_OPEN_DURATION = 380;
export const FLIP_DURATION = 420;
export const SWIPE_DISMISS_DURATION = 240;
export const NEXT_CARD_SETTLE_DURATION = 220;

// Springs
export const DEFAULT_SPRING = { damping: 14, stiffness: 150 };
export const SNAP_BACK_SPRING = { damping: 18, stiffness: 240 };
export const GLOW_SPRING = { damping: 8, stiffness: 120 };

// Rare-hit effects
export const RARE_GLOW_DURATION = 700;
export const PARTICLE_DURATION = 1200;
export const GLOW_SCALE = 1.06;
export const SHAKE_DISTANCE = 6;
export const SHAKE_DURATION = 70;