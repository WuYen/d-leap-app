import { selector } from 'recoil';
import api from '../utils/api';
import { PostInfo } from '../types';

export const postsState = selector<PostInfo[]>({
  key: 'postsState',
  get: async () => {
    const res = await api.get<PostInfo[]>('my/posts');
    return res.data;
  },
});
