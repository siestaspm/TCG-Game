import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import HomeStackNavigator from './HomeStackNavigator';
import CollectionStackNavigator from './CollectionStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import { colors } from '../../constants/theme';

const Tab = createBottomTabNavigator();

// Each tab keeps its own accent instead of one shared brand color - this is
// the red/blue even-split rule applied to navigation: Home reads blue,
// Binder reads red, Profile stays neutral since it isn't tied to a side.
const TAB_ACCENTS = {
  Home: colors.blue,
  Binder: colors.red,
  Profile: colors.textSecondary,
};

const TAB_ICONS = {
  Home: 'home',
  Binder: 'grid',
  Profile: 'user',
};

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: TAB_ACCENTS[route.name],
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'lowercase',
        },
        tabBarIcon: ({ color }) => (
          <Feather name={TAB_ICONS[route.name]} size={20} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Binder" component={CollectionStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}