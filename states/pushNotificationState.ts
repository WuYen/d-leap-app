import { atom } from 'recoil';
import * as Notifications from 'expo-notifications';

export const pushTokenState = atom<string | null>({
  key: 'pushTokenState',
  default: null,
});

export const lastNotificationState = atom<Notifications.Notification | null>({
  key: 'lastNotificationState',
  default: null,
});
