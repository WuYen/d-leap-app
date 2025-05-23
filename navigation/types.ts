import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// PostItem 型別（從 PostItem.ts 引入）
import { PostItem } from '../types/PostItem';

export type RootStackParamList = {
  List: undefined;
  Detail: { post: PostItem };
};

// 泛型型別：根據畫面名稱取得對應的 NavigationProp
export type NavigationProps<RouteName extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>;
