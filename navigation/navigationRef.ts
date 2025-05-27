// navigation/navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { ROUTES } from './routes';

// 建立一個 navigation 控制器（ref）
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<Name extends string>(name: Name, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}

export function navigateToPostDetail(post: any) {
  navigate(ROUTES.Root.MainTabs, {
    screen: ROUTES.Tab.Post,
    params: {
      screen: ROUTES.Post.PostDetail,
      params: { post },
    },
  });
}

export function navigateToAuthorDetail(author: any) {
  navigate(ROUTES.Root.MainTabs, {
    screen: ROUTES.Tab.Author,
    params: {
      screen: ROUTES.Author.AuthorDetail,
      params: { author },
    },
  });
}
