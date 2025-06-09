import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import * as localStorage from '../utils/storage';
import api from '../utils/api';
import { usePushNotifications } from './usePushNotifications';
import { authState } from '../states/authState';

type UseAuthResult = {
  isLoggedIn: boolean;
  isLoading: boolean;
  account: string | null;
  expoPushToken: string | null;
};

export function useAuth(): UseAuthResult {
  const { expoPushToken } = usePushNotifications();
  const [auth, setAuth] = useRecoilState(authState);

  // 自動登入流程
  useEffect(() => {
    const autoLogin = async (account: string) => {
      console.log('autoLogin account:', account);
      try {
        const res = await api.post<{ token: string }>('/login/expo', {
          account: account,
          pushToken: expoPushToken ?? '', // allow null for simulator
        });

        setAuth({ isLoggedIn: true, account: account, isLoading: false, token: res.data.token });
        console.log('🔐 登入成功:', account);
      } catch (err) {
        setAuth({ isLoggedIn: false, account: null, isLoading: false, token: null });
        console.warn('🔐 登入失敗:', err);
      }
    };

    const getStoredAccount = async () => {
      const storedAccount = await localStorage.getAccount();
      return storedAccount;
    };

    console.log('autoLogin effect', auth);
    if (!auth.isLoggedIn) {
      getStoredAccount().then((storedAccount) => {
        const account = storedAccount || auth.account;
        if (account) {
          autoLogin(account);
        } else {
          setAuth({ isLoggedIn: false, account: null, isLoading: false, token: null });
          console.log('🔐 無法登入，未找到帳號');
          return;
        }
      });
    }
  }, [expoPushToken, auth.account, auth.isLoggedIn, setAuth]);

  return {
    expoPushToken,
    isLoggedIn: auth.isLoggedIn,
    isLoading: auth.isLoading,
    account: auth.account,
  };
}
