import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppNavigator from './AppNavigator';
import { usePushNotifications } from './hooks/usePushNotifications';

export default function App() {
  const { expoPushToken } = usePushNotifications();

  return (
    <View style={styles.container}>
      {/* 導航主畫面 */}
      <View style={styles.navigator}>
        <AppNavigator />
      </View>

      {/* 推播 Token 區塊 */}
      <View style={styles.tokenContainer}>
        <Text style={styles.label}>Expo Push Token:</Text>
        <Text selectable style={styles.tokenText}>
          {expoPushToken || 'Loading...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigator: {
    flex: 1,
  },
  tokenContainer: {
    padding: 10,
    backgroundColor: '#eee',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
