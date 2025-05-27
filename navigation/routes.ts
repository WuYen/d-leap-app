export const ROUTES = {
  Root: {
    MainTabs: 'MainTabs',
    Register: 'Register',
  },
  Tab: {
    Post: 'PostTab',
    Favorite: 'FavoriteTab',
    Author: 'AuthorTab',
  },
  Post: {
    PostList: 'PostList',
    PostDetail: 'PostDetail',
  },
  Favorite: {
    FavoriteList: 'FavoriteList',
    FavoriteDetail: 'FavoriteDetail',
  },
  Author: {
    AuthorList: 'AuthorList',
    AuthorDetail: 'AuthorDetail',
  },
} as const;
