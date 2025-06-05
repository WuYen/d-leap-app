import { atom, selectorFamily } from 'recoil';
import { MyPostHistoricalResponse, PostInfo } from '../types';

//TODO: all those type definitions should be moved to /types/index.ts
export type FavoritePost = PostInfo | MyPostHistoricalResponse;

export type FavoritesState = {
  posts: FavoritePost[];
  authors: any[];
  loading: boolean;
};

export const favoritesState = atom<FavoritesState>({
  key: 'favoritesState',
  default: {
    posts: [],
    authors: [],
    loading: true,
  },
});

export const isFavoritePostSelector = selectorFamily<boolean, number>({
  key: 'isFavoritePostSelector',
  get:
    (postId: number) =>
    ({ get }) => {
      const state = get(favoritesState);
      return state.posts.some((p) => p.id === postId);
    },
});
