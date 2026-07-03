// src/app/navigation/MainNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetSelectScreen from '../../features/sets/screens/SetSelectScreen';
import PackOpeningScreen from '../../features/pack-opening/screens/PackOpeningScreen';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SetSelect" component={SetSelectScreen} />
      <Stack.Screen name="PackOpening" component={PackOpeningScreen} />
    </Stack.Navigator>
  );
}