// AuthorStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorListScreen from '../../screens/AuthorListScreen';
import AuthorDetailScreen from '../../screens/AuthorDetailScreen';

const Stack = createNativeStackNavigator();

export default function AuthorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthorList" component={AuthorListScreen} options={{ title: '熱門作者' }} />
      <Stack.Screen name="AuthorDetail" component={AuthorDetailScreen} options={{ title: '作者資料' }} />
    </Stack.Navigator>
  );
}
