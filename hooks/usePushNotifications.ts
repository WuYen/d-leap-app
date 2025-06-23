// src/hooks/usePushNotifications.ts
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { navigationRef, navigateToAuthorDetail } from '../navigation/navigationRef';
import { PostInfo } from '../types';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { lastNotificationState, pushTokenState } from '../states/pushNotificationState';

let pendingAuthor: any = null; // 全域暫存

// https://docs.expo.dev/versions/latest/sdk/notifications/
export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useRecoilState(pushTokenState);
  const setNotification = useSetRecoilState(lastNotificationState);

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
      }
    });

    // 監聽接收到的通知
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // 監聽通知回應
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('使用者互動的通知：', response);
      const post = response.notification.request.content.data.post as PostInfo;
      if (post) {
        if (navigationRef.isReady()) {
          navigateToAuthorDetail(post.author);
        } else {
          pendingAuthor = post.author;
        }
      }
    });

    // 監聽 navigation ready
    const unsubscribe = navigationRef.addListener?.('state', () => {
      if (navigationRef.isReady() && pendingAuthor) {
        navigateToAuthorDetail(pendingAuthor);
        pendingAuthor = null;
      }
    });

    return () => {
      // 移除監聽器
      notificationListener.current?.remove();
      responseListener.current?.remove();
      unsubscribe?.();
    };
  }, [setExpoPushToken, setNotification]);

  return {
    expoPushToken,
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
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
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
