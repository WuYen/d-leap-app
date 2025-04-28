// src/hooks/usePushNotifications.ts
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { navigate } from '../navigation/navigationRef';
import { getAccount } from '../utils/storage';
import api from '../utils/api';

// https://docs.expo.dev/versions/latest/sdk/notifications/

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    // 設定通知處理器
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
      }),
    });

    // 註冊推播通知
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        setExpoPushToken(token);

        try {
          const account = await getAccount();
          if (account) {
            await api.post('/expo-token', { account, pushToken: token });
            console.log('✅ Expo Push Token 綁定成功');
          } else {
            console.log('⚠️ 尚未登入，跳過Push Token綁定');
          }
        } catch (error) {
          console.error('❌ Expo Push Token 綁定失敗', error);
        }
      }
    });

    // 監聽接收到的通知
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // 監聽通知回應
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('使用者互動的通知：', response);
      const post = response.notification.request.content.data.post;
      if (post) {
        navigate('Detail', { post }); // ✅ 直接導頁！
      }
    });

    return () => {
      // 移除監聽器
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}

// 註冊推播通知的輔助函式
async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    alert('推播通知僅支援實體裝置');
    return null;
  }

  // Android 13+ 要求先建立通知頻道，否則不會出現權限提示
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('未取得推播通知權限');
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('找不到 Project ID');
    }
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch (error) {
    console.error('取得 Expo Push Token 時發生錯誤：', error);
    return null;
  }
}
