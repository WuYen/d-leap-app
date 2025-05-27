import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  RootStackParamList,
  RootTabParamList,
  PostStackParamList,
  FavoriteStackParamList,
  AuthorStackParamList,
} from './types';

export const useRootNavigation = () => useNavigation<NativeStackNavigationProp<RootStackParamList>>();

export const useTabNavigation = () => useNavigation<NativeStackNavigationProp<RootTabParamList>>();

export const usePostNavigation = () => useNavigation<NativeStackNavigationProp<PostStackParamList>>();

export const useFavoriteNavigation = () => useNavigation<NativeStackNavigationProp<FavoriteStackParamList>>();

export const useAuthorNavigation = () => useNavigation<NativeStackNavigationProp<AuthorStackParamList>>();
