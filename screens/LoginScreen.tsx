// LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import api from '../utils/api';
import { saveAccount, saveJwtToken, getAccount } from '../utils/storage';
import { usePushNotifications } from '../hooks/usePushNotifications';

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [account, setAccount] = useState('');
  const [inputMode, setInputMode] = useState(false);
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const tryAutoLogin = async () => {
      const savedAccount = await getAccount();
      if (savedAccount && expoPushToken) {
        try {
          await login(savedAccount, expoPushToken);
          onLoginSuccess();
        } catch {
          Alert.alert('自動登入失敗', '請重新登入');
          setInputMode(true);
        }
      } else {
        setInputMode(true);
      }
    };

    if (expoPushToken) tryAutoLogin();
  }, [expoPushToken]);

  const login = async (account: string, token: string) => {
    const res = await api.post('/login/expo', { account, pushToken: token });
    await saveAccount(account);
    await saveJwtToken(res.data.token);
  };

  const handleRegister = async () => {
    try {
      await api.post('/login/expo/register', { account, pushToken: expoPushToken });
      Alert.alert('註冊成功！');
      await login(account, expoPushToken!);
      onLoginSuccess();
    } catch {
      Alert.alert('錯誤', '註冊失敗');
    }
  };

  if (!inputMode) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder="輸入帳號"
        value={account}
        onChangeText={setAccount}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="註冊並登入" onPress={handleRegister} />
    </View>
  );
}
