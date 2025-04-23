// App.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { usePushNotifications } from './hooks/usePushNotifications';
import * as Notifications from 'expo-notifications';

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();

  const scheduleLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📬 You've got a test notification",
        body: 'This is a local scheduled notification.',
        data: { source: 'test' },
      },
      trigger: {
        seconds: 3,
      } as Notifications.NotificationTriggerInput,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expo Push Notification Demo</Text>

      <Text style={styles.label}>Expo Push Token:</Text>
      <Text selectable style={styles.token}>
        {expoPushToken || 'Loading...'}
      </Text>

      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.label}>Last Notification:</Text>
          <Text>Title: {notification.request.content.title}</Text>
          <Text>Body: {notification.request.content.body}</Text>
          <Text>Data: {JSON.stringify(notification.request.content.data)}</Text>
        </View>
      )}

      <Button title="📤 Schedule Local Notification" onPress={scheduleLocalNotification} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginTop: 20,
  },
  token: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    fontSize: 12,
  },
  notificationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '100%',
  },
});
