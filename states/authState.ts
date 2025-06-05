import { atom } from 'recoil';

export type AuthState = {
  isLoggedIn: boolean;
  account: string | null;
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    isLoggedIn: false,
    account: null,
  },
});
