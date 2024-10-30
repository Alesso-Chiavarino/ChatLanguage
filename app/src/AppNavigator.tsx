// AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from './screens/ChatsListScreen';
import ChatScreen from '../(tabs)';
// AppNavigator.js o el archivo de navegación principal



const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChatListScreen">
      <Stack.Screen name="ChatListScreen" component={ChatListScreen} options={{ title: 'Chats' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={({ route }: {route: any}) => ({ title: route.params.chatName })} />
    </Stack.Navigator>
  );
}

