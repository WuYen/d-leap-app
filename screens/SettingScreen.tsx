// screens/SettingScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function SettingScreen() {
  const { expoPushToken } = usePushNotifications();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Expo Push Token:</Text>
      <Text selectable style={styles.tokenText}>
        {expoPushToken || 'Loading...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});