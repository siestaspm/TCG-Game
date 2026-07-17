import React from 'react';
import { View, StyleSheet } from 'react-native';

import PackView from '../components/PackView';
import { useOpenPack } from '../hooks/useOpenPack';
import { usePackEconomy } from '../../economy/hooks/usePackEconomy';
import { useSet } from '../../sets/hooks/useSets';
import { colors } from '../../../constants/theme';

export default function PackOpeningScreen({ route, navigation }) {
  const { setId } = route.params;
  const { mutate: openPack, data, isPending, isError, error, reset } = useOpenPack();
  const { data: economy } = usePackEconomy();
  const { data: set } = useSet(setId);

  // Derived directly from mutation data — no extra state/useEffect needed,
  // and no risk of `cards` going stale relative to `data`.
  const cards = data?.cards ?? [];

  const handleRequestOpen = () => {
    // Clear any previous error so a retry after a failed open doesn't
    // immediately re-show the last error message before the new result
    // comes back.
    reset();
    openPack(setId);
  };

  return (
    <View style={styles.container}>
      <PackView
        cards={cards}
        onRequestOpen={handleRequestOpen}
        loading={isPending}
        isError={isError}
        errorMessage={error?.message}
        creditCost={set?.credit_cost}
        freePacksRemaining={economy?.freePacksRemaining}
        creditBalance={economy?.creditBalance}
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