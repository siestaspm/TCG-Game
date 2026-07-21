// src/components/ui/FloatingTabBar.jsx
//
// Custom tabBar renderer for MainNavigator: an absolutely-positioned,
// floating rounded pill bar (Apple-style) instead of the default full-width
// docked tab bar. The active tab gets a sliding gradient pill behind its
// icon, driven by Reanimated based on each tab's measured layout.
import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { HomeIcon, BinderIcon, UserIcon } from '../icons';
import { colors, gradients, radii, shadow } from '../../constants/theme';

const TAB_ICONS = {
  Home: HomeIcon,
  Binder: BinderIcon,
  Profile: UserIcon,
};

const TAB_LABELS = {
  Home: 'Home',
  Binder: 'Binder',
  Profile: 'Profile',
};

export default function FloatingTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const [tabWidth, setTabWidth] = useState(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(state.index * tabWidth, { damping: 18, stiffness: 180 }) }],
  }));

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 14 }]} pointerEvents="box-none">
      <View
        style={styles.bar}
        onLayout={(e) => setTabWidth(e.nativeEvent.layout.width / state.routes.length)}
      >
        {tabWidth > 0 && (
          <Animated.View style={[styles.indicatorTrack, { width: tabWidth }, indicatorStyle]}>
            <LinearGradient
              colors={gradients.brand}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.indicatorPill}
            />
          </Animated.View>
        )}

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const TabIcon = TAB_ICONS[route.name];

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tab}>
              <TabIcon size={20} color={isFocused ? colors.white : colors.textSecondary} />
              {isFocused && <Text style={styles.label}>{TAB_LABELS[route.name]}</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
    ...shadow.floating,
  },
  indicatorTrack: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 8,
    paddingHorizontal: 4,
  },
  indicatorPill: {
    flex: 1,
    borderRadius: radii.xl,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    zIndex: 1,
  },
  label: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
