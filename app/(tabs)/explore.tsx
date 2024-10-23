import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, TextInput, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabTwoScreen() {
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [name, setName] = useState('Fede Casani');
  const [status, setStatus] = useState('Si puedes imaginarlo, puedes programarlo');

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setLanguageModalVisible(false);
  };

  const handleProfileUpdate = () => {
    setProfileModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 50 }} />

      {/* User Profile Section */}
      <TouchableOpacity style={styles.profileContainer} onPress={() => setProfileModalVisible(true)}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileStatus}>{status}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
      </TouchableOpacity>

      {/* Language Option */}
      <TouchableOpacity style={styles.optionContainer} onPress={() => setLanguageModalVisible(true)}>
        <Ionicons name="language-outline" size={24} color="#333" />
        <Text style={styles.optionText}>Language: {selectedLanguage}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
      </TouchableOpacity>

      {/* Language Selection Modal */}
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
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleLanguageSelect(item)} style={styles.languageItem}>
                  <Text style={styles.languageText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Input fields for name and status */}
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

            {/* Save Button */}
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
    backgroundColor: '#F5F5F5',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileStatus: {
    fontSize: 14,
    color: '#666',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  languageItem: {
    paddingVertical: 10,
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
    marginBottom: 15,
  },
});
