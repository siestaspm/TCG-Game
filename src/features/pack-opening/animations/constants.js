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
export const PARTICLE_COUNT = 12;
export const PARTICLE_DISTANCE = 110; // px a particle travels outward at full progress
export const PARTICLE_SIZE = 7;

// Pack idle (waiting for tap) - subtle breathing/shimmer so the pack reads
// as "alive" rather than a static button.
export const IDLE_FLOAT_DISTANCE = 8;
export const IDLE_FLOAT_DURATION = 1400;
export const IDLE_SHEEN_DURATION = 2600;

// Pack rip - punchier than a plain scale+fade: a rotational wobble, a
// radial flash burst, and a screen-wide micro-shake all fire together.
export const RIP_WOBBLE_DEG = 5;
export const RIP_FLASH_DURATION = 260;
export const RIP_SCREEN_SHAKE_DISTANCE = 10;

// First-card flip gets a small scale "pop" at the midpoint on top of the
// existing rotateY flip, so it reads as a reveal rather than a flat spin.
export const FLIP_POP_SCALE = 1.08;

// Results grid - cards stagger in one at a time instead of popping in as a
// flat grid.
export const RESULT_STAGGER_MS = 55;