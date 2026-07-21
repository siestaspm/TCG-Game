// One deliberate rule, everywhere: surfaces stay quiet (near-white,
// nonchalant) so that the handful of places that use the brand gradient -
// buttons, the active tab pill, hero banners, auth screens - actually pop.
// Saturated color smeared across every background is what made this feel
// "off" before; concentrating it into a few high-impact moments is the fix.
export const colors = {
  // Navy/brand family - anchored on the app's signature #05308C, pushed a
  // touch more vivid so it reads as "electric" rather than corporate navy.
  blueDeep: '#04205C',
  blue: '#0B3FA8',
  blueBright: '#2E6BFF',
  blueLight: '#ECF1FC',

  // Secondary accent - a raspberry/magenta-leaning coral (not stop-sign
  // red), pairs with the navy without reading as an error state. Used for
  // the Binder tab, destructive actions, and rare-hit accents.
  redDeep: '#9C2F52',
  red: '#FF3D71',
  redLight: '#FFE8EF',

  // A third, sparingly-used "boom" accent - electric cyan - reserved for
  // rare glow/particle moments and the odd bit of sparkle. Not a UI chrome
  // color; don't use it for buttons/text.
  glow: '#2FE6D9',

  // Neutral - kept intentionally close to white/near-black so the brand
  // colors carry all the visual weight.
  mist: '#F6F7FB',
  white: '#FFFFFF',
  border: '#E7E9F2',
  textPrimary: '#0E1220',
  textSecondary: '#767C93',
};

// Gradient stop lists for <LinearGradient colors={...} />. "brand" is the
// signature navy-to-electric-blue sweep used on hero surfaces, primary
// buttons, and the floating tab bar's active pill - the app's one "BOOM"
// gradient, so it should never show up as a plain flat background.
export const gradients = {
  brand: ['#04205C', '#0B3FA8', '#2E6BFF'],
  brandVertical: ['#04205C', '#0B3FA8'],
  coral: ['#FF6B9D', '#FF3D71'],
  // A punchier variant of brand for one-off "big moment" surfaces (rare
  // pull celebrations, onboarding) - same family, wider spread, ends on
  // the glow accent instead of blueBright.
  boom: ['#04205C', '#0B3FA8', '#2FE6D9'],
  // Whole-screen backdrop for content pages (Home, Binder, Profile, etc.) -
  // nonchalant on purpose: near-white with the faintest cool whisper, so
  // plain white cards still read cleanly and the brand gradient elsewhere
  // on the page is what actually catches the eye.
  surface: ['#FFFFFF', '#F4F7FD', '#F7F9FD'],
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#0B1A3A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  floating: {
    shadowColor: '#0B1A3A',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
};

export const theme = { colors, gradients, radii, shadow };

export default theme;
