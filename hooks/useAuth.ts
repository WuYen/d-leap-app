import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import api from '../utils/api';
import * as localStorage from '../utils/storage';
import { usePushNotifications } from './usePushNotifications';
import { authState } from '../states/authState';

type UseAuthResult = {
  isLoggedIn: boolean;
  isLoading: boolean;
  account: string | null;
  expoPushToken: string | null;
  setIsLoggedIn: (value: boolean) => void;
};

export function useAuth(): UseAuthResult {
  const { expoPushToken } = usePushNotifications();
  const [auth, setAuth] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState(true);

  // 自動登入流程
  useEffect(() => {
    const autoLogin = async () => {
      const savedAccount = await localStorage.getAccount();
      if (!savedAccount) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.post<{ token: string }>('/login/expo', {
          account: savedAccount,
          pushToken: expoPushToken ?? '', // allow null for simulator
        });
        await localStorage.saveJwtToken(res.data.token);
        setAuth({ isLoggedIn: true, account: savedAccount });
      } catch (err) {
        console.warn('🔐 自動登入失敗:', err);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [expoPushToken, setAuth]);

  return {
    expoPushToken,
    isLoggedIn: auth.isLoggedIn,
    isLoading,
    account: auth.account,
    setIsLoggedIn: (value: boolean) =>
      setAuth((prev) => ({ ...prev, isLoggedIn: value })),
  };
}
