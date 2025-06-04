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

/**
 * Navigate to the AuthorDetail screen.
 *
 * This helper accepts either an author object or an author id string. The
 * AuthorDetail screen expects both the authorId and, optionally, the author
 * object itself. Supplying only the author object previously caused a runtime
 * error because the required `authorId` parameter was missing.
 */
export function navigateToAuthorDetail(author: any) {
  const params =
    typeof author === 'string'
      ? { authorId: author }
      : { author, authorId: author?.name };

  navigate(ROUTES.Root.MainTabs, {
    screen: ROUTES.Tab.Author,
    params: {
      screen: ROUTES.Author.AuthorDetail,
      params,
    },
  });
}
