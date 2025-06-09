// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../utils/api';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useRecoilState } from 'recoil';
import { authState } from '../states/authState';

export default function RegisterScreen() {
  //TODO: 試著從 localStorage 取得帳號，若有則自動填入
  const [account, setAccount] = useState('');
  const { expoPushToken } = usePushNotifications();
  const [, setAuth] = useRecoilState(authState);

  const handleRegister = async () => {
    try {
      setAuth((prev) => ({ ...prev, isLoading: true }));
      await api.post('/login/expo/register', { account, pushToken: expoPushToken });
      //TODO: handling regis error message
      Alert.alert('註冊成功！');
      // update account will trigger useAuth hook login flow
      setAuth((prev) => ({ ...prev, isLoading: true, account }));
    } catch {
      Alert.alert('錯誤', '註冊失敗');
      setAuth({ isLoggedIn: false, account: '', isLoading: false, token: '' });
    }
  };

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
