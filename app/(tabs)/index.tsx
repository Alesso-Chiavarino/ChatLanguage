import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import SignIn from '@/components/SignIn';
import { useUser } from '@/context/UserContext/UserContext';
import { db } from '../../services/firebase/config';
import { collection, onSnapshot, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { DeeplDataProvider } from '@/services/deepl';

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
};

type Chat = {
  id: string;
  users: string[];
  lastMessage?: string;
  timestamp?: string;
};

type User = {
  email: string;
  name: string;
};

export default function ChatScreen() {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [potentialUsers, setPotentialUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<any>([]);

  useEffect(() => {
    if (user) {
      fetchChatsAndUsers();
      const chatsRef = collection(db, 'Chats');
      const unsubscribe = onSnapshot(chatsRef, fetchChatsAndUsers);
      return () => unsubscribe();
    }
  }, [user]);

  const fetchChatsAndUsers = async () => {
    try {
      const usersRef = collection(db, 'Users');
      const snapshot = await getDocs(usersRef);

      const allUsers = snapshot.docs.map((doc) => ({
        email: doc.data().email,
        name: doc.data().name,
        language: doc.data().language,
      })) as User[];

      setAllUsers(allUsers);

      const filteredUsers = allUsers.filter((potentialUser) => potentialUser.email !== (user as any).email);

      const chatsRef = collection(db, 'Chats');
      const q = query(chatsRef, where('users', 'array-contains', (user as any).email));
      const chatSnapshot = await getDocs(q);

      const loadedChats = chatSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];

      const chatUsersSet = new Set(loadedChats.flatMap(chat => chat.users));

      setChats(loadedChats);
      setPotentialUsers(filteredUsers.filter(
        (potentialUser) => !chatUsersSet.has(potentialUser.email)
      ));
    } catch (error) {
      console.error("Error al cargar chats o usuarios:", error);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      const messagesRef = collection(db as any, `Chats/${selectedChat.id}/Messages`);
      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        messagesData.sort((a, b) => {
          return parseInt(a.id) - parseInt(b.id);
        });
        setMessages(messagesData.reverse());
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  const sendMessage = async (reciverUser: any) => {
    if (typeof newMessage !== 'string' || newMessage.trim().length === 0) return;

    const deeplDataProvider = new DeeplDataProvider("80852368-1580-4f9b-92ea-07c3f32b7664:fx");

    try {
      const translatedMessage = await deeplDataProvider.translateText(newMessage, reciverUser.language);

      const newMessageObject: Message = {
        id: (messages.length + 1).toString(),
        text: translatedMessage,
        sender: (user as any).email,
        timestamp: new Date().toISOString(),
      };

      if (!selectedChat || !selectedChat.id) {
        console.log("No hay chat seleccionado o el ID del chat es indefinido.");
        return;
      }

      await addDoc(collection(db as any, `Chats/${selectedChat.id}/Messages`), newMessageObject);
      setNewMessage('');
    } catch (err) {
      console.log("Error al traducir el mensaje:", err);
    }
  };


  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.sender === (user as any).email ? styles.userMessage : styles.otherMessage]}>
      <ThemedText style={styles.messageText}>{item.text}</ThemedText>
    </View>
  );

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUser = item.users.find((u: string) => u !== (user as any).email) || 'Usuario desconocido';

    return (
      <TouchableOpacity onPress={() => openChat(item)} style={styles.chatItem}>
        <Image source={{ uri: `https://robohash.org/${otherUser}` }} style={styles.profileImage} />
        <View style={styles.chatItemTextContainer}>
          <Text style={styles.chatItemText}>{otherUser}</Text>
          <Text style={styles.lastMessageText}>{item.lastMessage || 'Nuevo mensaje'}</Text>
        </View>
      </TouchableOpacity>
    );
  };


  const renderPotentialUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => startNewChat(item)} style={styles.chatItem}>
      <Image source={{ uri: `https://robohash.org/${item.name}` }} style={styles.profileImage} />
      <View style={styles.chatItemTextContainer}>
        <Text style={styles.chatItemText}>{item.name}</Text>
        <Text style={styles.chatItemText}>Nuevo chat</Text>
      </View>
    </TouchableOpacity>
  );


  const openChat = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  const backToChatList = () => {
    setSelectedChat(null);
    setMessages([]);
  };

  const startNewChat = async (newUser: User) => {
    const existingChat = chats.find(chat => chat.users.includes(newUser.email) && chat.users.includes((user as any).email));

    if (existingChat) {
      openChat(existingChat);
      return;
    }

    const newChat = {
      users: [(user as any).email, newUser.email],
      lastMessage: '',
      timestamp: new Date().toISOString(),
    };

    const chatRef = await addDoc(collection(db, 'Chats'), newChat);
    openChat({ id: chatRef.id, ...newChat });
  };

  if (!user) {
    return <SignIn />;
  }

  const reciverUserEmail = selectedChat && selectedChat.users.find((u: string) => u !== (user as any).email)
  console.log("MEWAD", reciverUserEmail)
  // find reciver user id
  const reciverUser = allUsers.find((u: any) => u.email === reciverUserEmail)

  console.log("AWD2", reciverUser)

  return (
    <ThemedView style={styles.container}>
      {selectedChat ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={backToChatList} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Image source={{ uri: `https://robohash.org/${reciverUser.email}` }} style={styles.profileImage} />
            <ThemedText style={styles.headerText}>
              {selectedChat.users.find((u: string) => u !== (user as any).email) || 'Usuario desconocido'}
            </ThemedText>
          </View>


          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
            inverted
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.inputContainer}
          >
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => sendMessage(reciverUser)} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitleMain}>Chats</Text>
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          {potentialUsers && potentialUsers.length > 0 && <Text style={styles.sectionTitle}>Usuarios disponibles:</Text>}
          <FlatList
            data={potentialUsers}
            renderItem={renderPotentialUserItem}
            keyExtractor={(item) => item.email}
            style={styles.potentialUserList}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F0F4F8',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  potentialUserList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    display: 'flex',
    flexDirection: 'row',
  },
  chatItemText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  sectionTitleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatItemTextContainer: {
    flex: 1,
  },

});
