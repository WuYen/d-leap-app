// navigation/navigationRef.ts
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

// 建立一個 navigation 控制器（ref）
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// 封裝 navigate 方法，讓外部使用
export function navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as any, params as any);
    }
}
