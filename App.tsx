import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { usePushNotifications } from './hooks/usePushNotifications';
import { navigationRef } from './navigation/navigationRef';
import api from './utils/api';
import { getAccount, clearStorage } from './utils/storage';

export default function App() {
  const { expoPushToken } = usePushNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tryAutoLogin = async () => {
      console.log('Trying auto login...');
      const savedAccount = await getAccount();
      if (savedAccount && expoPushToken) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };

    //TODO: 這邊 如果在虛擬機 上執行，expoPushToken 會是 undefined, 就不會關閉loading and loggin status 也不會登入
    if (expoPushToken) tryAutoLogin();
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      console.log('Force close loading state after 5 seconds');
    }, 5000);
  }, [expoPushToken]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 全域操作按鈕 */}
      <DevPanel onLogout={() => setIsLoggedIn(false)} />

      {/* 導航主畫面 */}
      <View style={styles.navigator}>
        <AppNavigator isLoggedIn={isLoggedIn} onLoginSuccess={() => setIsLoggedIn(true)} />
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
      routes: [{ name: 'Login' as never }],
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
      <Button title='登出' onPress={handleLogout} />
      <Button title='測試Ping' onPress={handlePing} />
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
