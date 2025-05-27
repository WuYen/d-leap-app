import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList, PostStackParamList, FavoriteStackParamList, AuthorStackParamList } from './types';

export const useRootRoute = <T extends keyof RootStackParamList>() => useRoute<RouteProp<RootStackParamList, T>>();

export const usePostRoute = <T extends keyof PostStackParamList>() => useRoute<RouteProp<PostStackParamList, T>>();

export const useFavoriteRoute = <T extends keyof FavoriteStackParamList>() =>
  useRoute<RouteProp<FavoriteStackParamList, T>>();

export const useAuthorRoute = <T extends keyof AuthorStackParamList>() =>
  useRoute<RouteProp<AuthorStackParamList, T>>();
