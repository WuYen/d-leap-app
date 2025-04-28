import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../utils/api';
import { saveAccount, saveJwtToken, getAccount } from '../utils/storage';
import { usePushNotifications } from '../hooks/usePushNotifications';

const LoginScreen = () => {
  const [account, setAccount] = useState('');
  const [inputMode, setInputMode] = useState(false); // 要不要進入輸入模式
  const navigation = useNavigation();
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const tryAutoLogin = async () => {
      const savedAccount = await getAccount();

      if (savedAccount && expoPushToken) {
        console.log('🔄 嘗試自動登入中...');
        try {
          await login(savedAccount, expoPushToken);
          navigation.navigate('List');
        } catch (error) {
          console.error('自動登入失敗', error);
          Alert.alert('登入失敗 ❌', '請重新登入');
          setInputMode(true);
        }
      } else {
        // 沒帳號，需要使用者自己輸入
        setInputMode(true);
      }
    };

    if (expoPushToken) {
      tryAutoLogin();
    }
  }, [expoPushToken]);

  const login = async (account: string, pushToken: string) => {
    const res = await api.post<{ token: string }>('/login-expo-user', {
      account,
      pushToken,
    });
    const jwtToken = res.token;
    await saveAccount(account);
    await saveJwtToken(jwtToken);
    console.log('✅ 登入成功');
  };

  const handleRegister = async () => {
    try {
      await api.post('/expo-token', { account, pushToken: expoPushToken });
      Alert.alert('註冊成功 ✨', '推播token已經綁定！');

      // 註冊完可以直接自動登入
      await login(account, expoPushToken!);
      navigation.navigate('List');
    } catch (error) {
      console.error('註冊失敗', error);
      Alert.alert('註冊失敗 ❌', '請確認帳號或推播資訊');
    }
  };

  if (!inputMode) {
    // 還在嘗試自動登入，不顯示輸入框
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
};

export default LoginScreen;
