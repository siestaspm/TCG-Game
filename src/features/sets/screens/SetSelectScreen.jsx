import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SetSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Select (placeholder)</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('PackOpening', { setId: 'demo' })}
      >
        <Text style={styles.buttonText}>Go to Pack Opening →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F6FC', gap: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#14192E' },
  button: { backgroundColor: '#2F6FED', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 999 },
  buttonText: { color: 'white', fontWeight: '700' },
});