import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from './routes';
import { PostInfo } from '../types';

export type PostStackParamList = {
  [ROUTES.Post.PostList]: undefined;
  [ROUTES.Post.PostDetail]: { post: PostInfo };
};

export type FavoriteStackParamList = {
  [ROUTES.Favorite.FavoriteList]: undefined;
  [ROUTES.Favorite.FavoriteDetail]: { item: any };
};

export type AuthorStackParamList = {
  [ROUTES.Author.AuthorList]: undefined;
  [ROUTES.Author.AuthorDetail]: { author?: any; authorId: string };
};

export type RootTabParamList = {
  [ROUTES.Tab.Post]: NavigatorScreenParams<PostStackParamList>;
  [ROUTES.Tab.Favorite]: NavigatorScreenParams<FavoriteStackParamList>;
  [ROUTES.Tab.Author]: NavigatorScreenParams<AuthorStackParamList>;
};

export type RootStackParamList = {
  [ROUTES.Root.MainTabs]: NavigatorScreenParams<RootTabParamList>;
  [ROUTES.Root.Register]: undefined;
};
