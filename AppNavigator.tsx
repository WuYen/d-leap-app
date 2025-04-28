// AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import { PostItem } from './types/PostItem';

export type RootStackParamList = {
  Login: undefined;
  List: undefined;
  Detail: { post: PostItem };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: true }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='List' component={ListScreen} />
      <Stack.Screen name='Detail' component={DetailScreen} />
    </Stack.Navigator>
  );
}
