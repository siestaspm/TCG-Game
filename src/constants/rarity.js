// src/constants/rarity.js
//
// Single source of truth for rarity -> color/label. Used by CollectionScreen
// and CardDetailScreen so this can't drift out of sync between them (it
// was previously copy-pasted in both files with the same object).
//
// This is intentionally separate from theme.js - rarity colors encode game
// meaning (how rare a pull is), not app brand identity. The red/blue theme
// never overrides these.

// Worst -> best, used for display sorting if ever needed.
export const RARITY_ORDER = ['C', 'UC', 'R', 'SR', 'SEC', 'SP', 'L', 'P'];

const BASE_RARITIES = new Set(['C', 'UC']);

export const RARITY_STYLES = {
  C:   { color: '#8B93A6', label: 'Common',     glow: false },
  UC:  { color: '#3DDC84', label: 'Uncommon',   glow: false },
  R:   { color: '#3B9CFF', label: 'Rare',       glow: false },
  SR:  { color: '#B15CFF', label: 'Super Rare', glow: true },
  SEC: { color: '#FFB020', label: 'Secret Rare',glow: true },
  L:   { color: '#FF4D6D', label: 'Leader',     glow: true },
  P:   { color: '#33D9E8', label: 'Promo',      glow: false },
  SP:  { color: '#FF7AD9', label: 'Special',    glow: true },
};

export function getRarityStyle(rarity) {
  return RARITY_STYLES[rarity] ?? RARITY_STYLES.C;
}

// Convenience accessors - these used to live in pack-opening's own
// lib/rarity.js with a DIFFERENT color table than the one above. Now
// there's only one table, so the binder and the pack-opening reveal can
// never show two different colors for the same rarity again.
export function rarityColor(rarity) {
  return getRarityStyle(rarity).color;
}

export function rarityLabel(rarity) {
  return getRarityStyle(rarity).label;
}

/** Anything above Common/Uncommon counts as a "hit" worth celebrating. */
export function isHit(rarity) {
  return !BASE_RARITIES.has(rarity);
}