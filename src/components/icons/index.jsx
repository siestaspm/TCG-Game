// src/components/icons/index.jsx
//
// Custom SVG icon set - replaces react-native-vector-icons entirely. Drawn
// with slightly bolder, rounded strokes (2.4 vs the usual 2) to read a
// little more "game UI" than a generic system icon font, and a couple of
// icons (SwordIcon, FlameIcon) are bespoke to the TCG picker rather than
// pulled from a generic icon set.
import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const BASE_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function withIcon(children) {
  return function Icon({ size = 20, color = '#111629', strokeWidth = 2.4 }) {
    return (
      <Svg width={size} height={size} {...BASE_PROPS} stroke={color} strokeWidth={strokeWidth}>
        {children}
      </Svg>
    );
  };
}

export const HomeIcon = withIcon(
  <>
    <Path d="M4 11.5L12 4l8 7.5" />
    <Path d="M6.5 10v9.5h11V10" />
    <Path d="M10 19.5v-6h4v6" />
  </>,
);

export const BinderIcon = withIcon(
  <>
    <Path d="M12 6c-2.2-1.4-4.8-1.8-7.5-1.3v14c2.7-.5 5.3-.1 7.5 1.3 2.2-1.4 4.8-1.8 7.5-1.3v-14C16.8 4.2 14.2 4.6 12 6z" />
    <Path d="M12 6v14" />
  </>,
);

export const UserIcon = withIcon(
  <>
    <Circle cx="12" cy="8.2" r="3.4" />
    <Path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
  </>,
);

export const LockIcon = withIcon(
  <>
    <Rect x="5" y="11" width="14" height="9" rx="2.2" />
    <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>,
);

export const LogOutIcon = withIcon(
  <>
    <Path d="M10 4H6.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2H10" />
    <Path d="M14.5 8.5L18.5 12l-4 3.5" />
    <Path d="M18 12h-9" />
  </>,
);

export const ChevronRightIcon = withIcon(<Path d="M9 5l7 7-7 7" />);

export const ArrowRightIcon = withIcon(
  <>
    <Path d="M4 12h14.5" />
    <Path d="M13 6l6 6-6 6" />
  </>,
);

export const CheckCircleIcon = withIcon(
  <>
    <Circle cx="12" cy="12" r="8.5" />
    <Path d="M8 12.3l2.6 2.6L16 9.3" />
  </>,
);

// One Piece tile badge - stylized blade.
export const SwordIcon = withIcon(
  <>
    <Path d="M6 18.5L18.5 6" />
    <Path d="M15 6h3.5v3.5" />
    <Path d="M8.7 15.8l-2.5 2.5" />
    <Path d="M4.5 20.5l1.5-1.5" />
  </>,
);

// Dragon Ball tile badge - flame.
export const FlameIcon = withIcon(
  <Path d="M12 3c1.8 2.7-.7 3.9-.7 6.2 0 1.4 1.1 2.4 2.4 2.4a2.4 2.4 0 0 0 2.4-2.4c1.7 1.9 1.9 4.1 1.9 5.5 0 3.5-2.6 6.3-5.7 6.3s-5.7-2.8-5.7-6.3c0-3 1.5-4.7 2.2-6.2.5 1 .2 2.1 1.1 2.6-.5-2.6.8-5 2.1-8.1z" />
);
