import { selector } from 'recoil';
import api from '../utils/api';
import { LeaderboardItem } from '../types';

export const authorsState = selector<LeaderboardItem[]>({
  key: 'authorsState',
  get: async () => {
    const res = await api.get<LeaderboardItem[]>('/my/authors/rank');
    return res.data;
  },
});
