import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatScreen'>; // Cambia esto a 'ChatScreen'

export default function ChatsListScreen() {
  const [chats, setChats] = useState([
    { id: '1', name: 'Juan Pérez', lastMessage: '¡Hola! ¿Cómo estás?', lastMessageTime: '10:30 AM' },
    { id: '2', name: 'Carlos López', lastMessage: 'Nos vemos mañana', lastMessageTime: '9:00 AM' },
    { id: '3', name: 'Grupo Amigos', lastMessage: 'Confirmado para las 7pm', lastMessageTime: 'Ayer' },
  ]);

  const navigation = useNavigation<NavigationProp>(); // Navegación

  const openChat = (chatId: string) => {
    navigation.navigate('ChatScreen', { chatId }); // Navegar a la pantalla de chat con el ID
  };

  const renderChat = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => openChat(item.id)}>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderChat}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
});
