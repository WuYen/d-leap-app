import { atom } from 'recoil';

export const navigationReadyState = atom<boolean>({
  key: 'navigationReadyState',
  default: false,
});
