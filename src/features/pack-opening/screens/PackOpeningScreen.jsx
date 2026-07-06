import React from 'react';
import { View, StyleSheet } from 'react-native';

import PackView from '../components/PackView';
import { useOpenPack } from '../hooks/useOpenPack';
import { colors } from '../../../constants/theme';

export default function PackOpeningScreen({ route, navigation }) {
  const { setId } = route.params;
  const { mutate: openPack, data, isPending } = useOpenPack();

  // Derived directly from mutation data — no extra state/useEffect needed,
  // and no risk of `cards` going stale relative to `data`.
  const cards = data?.cards ?? [];

  return (
    <View style={styles.container}>
      <PackView
        cards={cards}
        onRequestOpen={() => openPack(setId)}
        loading={isPending}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mist,
  },
});