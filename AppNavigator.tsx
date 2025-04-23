// AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigation/navigationRef'; // 👈 引入 ref

import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import { PostItem } from './types/PostItem';

export type RootStackParamList = {
    List: undefined;
    Detail: { post: PostItem };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer ref={navigationRef}> 
            <Stack.Navigator initialRouteName="List">
                <Stack.Screen name="List" component={ListScreen} />
                <Stack.Screen name="Detail" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
