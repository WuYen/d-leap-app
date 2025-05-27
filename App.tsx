import React from 'react';
import { View, Text, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { navigationRef } from './navigation/navigationRef';
import api from './utils/api';
import { clearStorage } from './utils/storage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { isLoggedIn, isLoading, expoPushToken, setIsLoggedIn } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 全域操作按鈕 */}
      <DevPanel onLogout={() => setIsLoggedIn(false)} />

      {/* 導航主畫面 */}
      <View style={styles.navigator}>
        <AppNavigator isLoggedIn={isLoggedIn} onSetIsLoggedIn={(isLoggedIn: boolean) => setIsLoggedIn(isLoggedIn)} />
      </View>

      {/* 推播 Token 區塊 */}
      <View style={styles.tokenContainer}>
        <Text style={styles.label}>Expo Push Token:</Text>
        <Text selectable style={styles.tokenText}>
          {expoPushToken || 'Loading.......'}
        </Text>
      </View>
    </View>
  );
}

type DevPanelProps = {
  onLogout: () => void;
};

function DevPanel({ onLogout }: DevPanelProps) {
  const handleLogout = async () => {
    await clearStorage();
    Alert.alert('登出成功');
    navigationRef.current?.reset({
      index: 0,
      routes: [{ name: 'Register' as never }],
    });
  };

  const handlePing = async () => {
    try {
      const result = await api.get('/tool/healthy');
      Alert.alert('Ping 成功', JSON.stringify(result));
    } catch (error) {
      console.error(error);
      Alert.alert('Ping 失敗', '無法連線到Server');
    }
  };

  return (
    <View style={styles.globalButtons}>
      <Button title="登出" onPress={handleLogout} />
      <Button title="測試Ping" onPress={handlePing} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  globalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    marginTop: 20, // 👈 新增這行！往下推一點
    backgroundColor: '#fafafa',
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
