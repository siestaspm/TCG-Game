// src/constants/games.js
//
// Static registry of TCGs the app knows about. This is the generalization
// point: today only One Piece has real `sets`/`cards` data in Supabase, but
// the app is built around "pick a TCG" as its own step so a second game can
// be turned on later just by (1) flipping `available: true` here and
// (2) tagging its rows in Supabase (see useSets.js for the game_code
// fallback this depends on).
//
// `icon` is a key into src/components/icons rendered inside a gradient
// badge as a stand-in monogram - deliberately custom-drawn rather than
// official franchise artwork, which would be trademarked and unsafe to
// embed/redistribute.
export const GAMES = [
  {
    id: 'onepiece',
    name: 'Onepiece TCG',
    tagline: 'Sail, battle, collect.',
    icon: 'sword',
    available: true,
  },
  {
    id: 'dragonball',
    name: 'Dragon Ball Super CG',
    tagline: 'Coming soon',
    icon: 'flame',
    available: false,
  },
];

export function getGame(id) {
  return GAMES.find((g) => g.id === id) ?? GAMES[0];
}
