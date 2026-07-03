// src/features/pack-opening/lib/rarity.js

// Anything above Common/Uncommon counts as a "hit" worth highlighting.
const BASE_RARITIES = new Set(['C', 'UC']);

export function isHit(rarity) {
  return !BASE_RARITIES.has(rarity);
}

const RARITY_COLORS = {
  C: '#9CA3AF',
  UC: '#6B9AE8',
  R: '#2F6FED',
  SR: '#8B5CF6',
  SEC: '#E0A429',
  L: '#E0A429',
  P: '#E24C4C',
  SP: '#E24C4C',
};

export function rarityColor(rarity) {
  return RARITY_COLORS[rarity] ?? '#6B7280';
}