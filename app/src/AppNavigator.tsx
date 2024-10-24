import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatsListScreen from '../src/screens/ChatsListScreen'; // I de lista de chats
import ChatScreen from '../src/screens/ChatScreen'; // Importa la pantalla de detalles del chat

export type RootStackParamList = {
  ChatsList: undefined;
  ChatScreen: { chatId: string }; // La pantalla ChatScreen recibe un chatId
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="ChatsList"> {/* Asegúrate de que aquí esté "ChatsList" */}
      <Stack.Screen name="ChatsList" component={ChatsListScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
