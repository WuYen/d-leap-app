// RegisterScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import api from '../utils/api';
import * as localStorage from '../utils/storage';
import { usePushNotifications } from '../hooks/usePushNotifications';

type Props = {
  onSetIsLoggedIn: (isLoggedIn: boolean) => void;
};

export default function RegisterScreen({ onSetIsLoggedIn }: Props) {
  const [account, setAccount] = useState('');
  const { expoPushToken } = usePushNotifications();

  const handleRegister = async () => {
    try {
      await api.post('/login/expo/register', { account, pushToken: expoPushToken });
      Alert.alert('註冊成功！');
      const res = await api.post<{ token: string }>('/login/expo', {
        account,
        pushToken: expoPushToken,
      });
      //TODO: error handling, res should be checked
      await localStorage.saveAccount(account);
      await localStorage.saveJwtToken(res.data.token);
      onSetIsLoggedIn(true);
    } catch {
      Alert.alert('錯誤', '註冊失敗');
      await localStorage.clearStorage();
      onSetIsLoggedIn(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder='輸入帳號'
        value={account}
        onChangeText={setAccount}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title='註冊並登入' onPress={handleRegister} />
    </View>
  );
}
