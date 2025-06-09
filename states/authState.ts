import { atom } from 'recoil';
import * as localStorage from '../utils/storage';

export type AuthState = {
  isLoggedIn: boolean;
  account: string | null;
  token: string | null;
  isLoading: boolean;
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    account: null,
    token: null,
    isLoading: true,
  },
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      (async () => {
        const account = await localStorage.getAccount();
        account &&
          setSelf({
            isLoggedIn: false,
            account,
            token: null,
            isLoading: true,
          });
      })();

      // 同步 localStorage 寫入
      onSet((newValue) => {
        localStorage.saveJwtToken(newValue.token ?? '');
        localStorage.saveAccount(newValue.account ?? '');
      });
    },
  ],
});
