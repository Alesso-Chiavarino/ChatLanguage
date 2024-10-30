import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, TextInput, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@/context/UserContext/UserContext';
import { useNavigation } from '@react-navigation/native';

export default function TabTwoScreen() {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(''); 
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const languages = [
      { label: 'Español', key: 'ES' },
      { label: 'English', key: 'EN' },
      { label: 'Français', key: 'FR' },
      { label: 'Deutsch', key: 'DE' },
      { label: '中文', key: 'ZH' },
  ];

  const { user, updateUserName, updateUserLanguage, logout } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      setName((user as any).name);
      setStatus((user as any).status); 
      setSelectedLanguage((user as any).language); 
    }
  }, [user]);

  const handleLanguageSelect = async (language: { label: string, key: string }) => {
    setSelectedLanguage(language.label);
    await updateUserLanguage(language.key);
    setLanguageModalVisible(false);
  };

  const handleProfileUpdate = async () => {
    await updateUserName(name);
    setProfileModalVisible(false);
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('index' as never);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 50 }} />

      <TouchableOpacity style={styles.profileContainer} onPress={() => setProfileModalVisible(true)}>
        <Image
          source={{ uri: `https://robohash.org/${name}` }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileStatus}>{status}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer} onPress={() => setLanguageModalVisible(true)}>
        <Ionicons name="language-outline" size={24} color="#333" />
        <Text style={styles.optionText}>Language: {selectedLanguage}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Modal
        visible={languageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLanguageSelect(item)} style={styles.languageItem}>
                  <Text style={styles.languageText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Status"
              value={status}
              onChangeText={(text) => setStatus(text)}
            />

            <Button title="Save" onPress={handleProfileUpdate} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginBottom: 15,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileStatus: {
    color: '#666',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginBottom: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#d9534f',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  languageText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
