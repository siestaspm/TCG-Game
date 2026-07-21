// All rarity logic lives here. UI components read from this file only —
// never branch on rarity strings directly in a component.

const BASE_RARITIES = new Set(['C', 'UC']);

// Ordered worst -> best, used only for display sorting if ever needed.
export const RARITY_ORDER = ['C', 'UC', 'R', 'SR', 'SEC', 'SP', 'L', 'P'];

const RARITY_COLORS = {
  C: '#8891A8',
  UC: '#5FA8E0',
  R: '#2F6FED',
  SR: '#8B5CF6',
  SEC: '#F0B429',
  L: '#FF5A5F',
  P: '#2FD9C4',
  SP: '#E85DC0',
};

const RARITY_LABELS = {
  C: 'Common',
  UC: 'Uncommon',
  R: 'Rare',
  SR: 'Super Rare',
  SEC: 'Secret Rare',
  L: 'Leader',
  P: 'Promo',
  SP: 'Special Rare',
};

/** Anything above Common/Uncommon counts as a "hit" worth celebrating. */
export function isHit(rarity) {
  return !BASE_RARITIES.has(rarity);
}

export function rarityColor(rarity) {
  return RARITY_COLORS[rarity] ?? '#6B7280';
}

export function rarityLabel(rarity) {
  return RARITY_LABELS[rarity] ?? rarity;
}