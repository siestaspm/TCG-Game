import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
 
export default function PackOpeningScreen({ route, navigation }) {
  const { setId } = route.params ?? {};
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pack Opening (placeholder)</Text>
      <Text style={styles.subtitle}>setId: {setId}</Text>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>← Back</Text>
      </Pressable>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F6FC', gap: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#14192E' },
  subtitle: { fontSize: 14, color: '#6B7280' },
  button: { backgroundColor: '#14192E', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 999 },
  buttonText: { color: 'white', fontWeight: '700' },
});
 