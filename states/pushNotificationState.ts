import { atom } from 'recoil';
import * as Notifications from 'expo-notifications';
import { LeaderboardItem } from '../types';

export const pushTokenState = atom<string | null>({
  key: 'pushTokenState',
  default: null,
});

export const lastNotificationState = atom<Notifications.Notification | null>({
  key: 'lastNotificationState',
  default: null,
});

export const pendingAuthorState = atom<LeaderboardItem | string | null>({
  key: 'pendingAuthorState',
  default: null,
});
