// src/app/navigation/CollectionStackNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CollectionScreen from '../../features/collection/screens/CollectionScreen';
import CardDetailScreen from '../../features/collection/screens/CardDetailScreen';
import { colors } from '../../constants/theme';

const Stack = createNativeStackNavigator();

export default function CollectionStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.mist },
      }}
    >
      <Stack.Screen name="CollectionMain" component={CollectionScreen} />
      {/*
        Reached from the binder grid, so CardDetailScreen should read
        route.params.context === 'binder' and show binder-oriented UI
        (dupe count styling etc) - see HomeStackNavigator for the other
        entry point. Same screen component in both stacks, on purpose.
      */}
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
    </Stack.Navigator>
  );
}