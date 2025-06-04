import { useEffect, useState } from 'react';
import api from '../utils/api';
import * as localStorage from '../utils/storage';
import { usePushNotifications } from './usePushNotifications';

type UseAuthResult = {
  isLoggedIn: boolean;
  isLoading: boolean;
  account: string | null;
  expoPushToken: string | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useAuth(): UseAuthResult {
  const { expoPushToken } = usePushNotifications();
  const [account, setAccount] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        setAccount(savedAccount);
        setIsLoggedIn(true);
      } catch (err) {
        console.warn('🔐 自動登入失敗:', err);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [expoPushToken]);

  return {
    expoPushToken,
    isLoggedIn,
    isLoading,
    account,
    setIsLoggedIn,
  };
}
