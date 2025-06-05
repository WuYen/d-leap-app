import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { favoritesState, isFavoritePostSelector, FavoritePost } from '../states/favoritesState';
import api from '../utils/api';

export default function useFavorite(post: FavoritePost) {
  const setFavorites = useSetRecoilState(favoritesState);
  const isFavorite = useRecoilValue(isFavoritePostSelector(post.id));

  const toggleFavorite = useCallback(async () => {
    const newFavoriteStatus = !isFavorite;

    // optimistic update
    setFavorites((prev) => ({
      ...prev,
      posts: newFavoriteStatus ? [...prev.posts, post] : prev.posts.filter((p) => p.id !== post.id),
    }));

    try {
      const response = await api.get(`/my/post/${post.id}/favorite`);
      console.log('Toggle favorite response:', response);

      setFavorites((prevState) => ({
        ...prevState,
        posts: prevState.posts.map((p) => (p.id === post.id ? (response.data as any) : p)),
      }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorites((prev) => ({
        ...prev,
        posts: isFavorite ? [...prev.posts, post] : prev.posts.filter((p) => p.id !== post.id),
      }));
      alert('收藏失敗');
    }
  }, [post, isFavorite, setFavorites]);

  return [isFavorite, toggleFavorite] as const;
}
