// src/app/navigation/HomeStackNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../features/home/screens/HomeScreen';
import SetSelectScreen from '../../features/sets/screens/SetSelectScreen';
import PackOpeningScreen from '../../features/pack-opening/screens/PackOpeningScreen';
import CardDetailScreen from '../../features/collection/screens/CardDetailScreen';
import QuestsScreen from '../../features/economy/screens/QuestsScreen';
import { colors } from '../../constants/theme';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.mist },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SetSelect" component={SetSelectScreen} />
      <Stack.Screen name="PackOpening" component={PackOpeningScreen} />
      {/*
        Reached from a pack pull, so CardDetailScreen should read
        route.params.context === 'pulled' and hide the "back to binder"
        affordance - see CollectionStackNavigator for the other entry point.
      */}
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
      <Stack.Screen name="Quests" component={QuestsScreen} />
    </Stack.Navigator>
  );
}