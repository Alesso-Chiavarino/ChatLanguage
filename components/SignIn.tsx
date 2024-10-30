import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import { useUser } from '@/context/UserContext/UserContext';

const LanguageSelector = ({ visible, onClose, onSelect }: {
    visible: any,
    onClose: any,
    onSelect: any
}) => {
    const languages = [
        { label: 'Español', key: 'ES' },
        { label: 'English', key: 'EN' },
        // Puedes agregar más idiomas aquí
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecciona el idioma</Text>
                    <FlatList
                        data={languages}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => { onSelect(item.key); onClose(); }} style={styles.languageItem}>
                                <Text style={styles.languageText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const SignIn = () => {
    const { register, logout, user, login } = useUser(); // Asegúrate de agregar la función `login` en el contexto
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState(''); // Estado para la contraseña
    const [defaultLanguage, setDefaultLanguage] = useState('EN');
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true); // Controla el modo de inicio de sesión o registro

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, ingresa tu correo electrónico y contraseña.');
            return;
        }
        // Aquí debes agregar la lógica de validación del inicio de sesión
        const isValidUser = await login(email, password); // Llama a la función login del contexto

        if (isValidUser as any) {
            Alert.alert('Éxito', 'Has iniciado sesión correctamente.');
        } else {
            Alert.alert('Error', 'Credenciales incorrectas.');
        }
    };

    const handleRegister = async () => {
        if (!email || !fullName || !password) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        await register({ name: fullName, lastname: '', email, password, defaultLanguage }); // Agrega la contraseña en el registro
        // Limpiar campos después del registro
        setEmail('');
        setFullName('');
        setPassword(''); // Resetea la contraseña
        setDefaultLanguage('EN'); // Resetea el idioma al valor por defecto
    };

    const handleLanguageSelect = (language: any) => {
        setDefaultLanguage(language);
    };

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Text style={styles.title}>Bienvenido, {(user as any).name}!</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>{isLoginMode ? 'Iniciar Sesión' : 'Registro'}</Text>
                    
                    {/* Etiqueta y campo de correo electrónico */}
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    
                    {/* Etiqueta y campo de contraseña */}
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {!isLoginMode && (
                        <>
                            {/* Etiqueta y campo de nombre completo */}
                            <Text style={styles.label}>Nombre Completo</Text>
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                            <TouchableOpacity onPress={() => setLanguageModalVisible(true)} style={styles.languageButton}>
                                <Text style={styles.languageButtonText}>{`Idioma: ${defaultLanguage}`}</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={isLoginMode ? handleLogin : handleRegister}
                    >
                        <Text style={styles.buttonText}>{isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsLoginMode(!isLoginMode)}
                        style={styles.toggleButton}
                    >
                        <Text style={styles.toggleButtonText}>
                            {isLoginMode ? '¿No tienes cuenta? Regístrate aquí.' : '¿Ya tienes cuenta? Inicia sesión aquí.'}
                        </Text>
                    </TouchableOpacity>

                    {/* Modal para seleccionar el idioma */}
                    <LanguageSelector
                        visible={languageModalVisible}
                        onClose={() => setLanguageModalVisible(false)}
                        onSelect={handleLanguageSelect}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9', // Fondo más claro
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Texto más oscuro para contraste
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333', // Color para las etiquetas
        marginBottom: 5,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
        backgroundColor: '#fff', // Fondo blanco para campos de entrada
    },
    languageButton: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    languageButtonText: {
        fontSize: 16,
        color: '#333',
    },
    registerButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutButton: {
        backgroundColor: '#FF4136',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    toggleButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    toggleButtonText: {
        color: '#007BFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente para modal
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    languageItem: {
        padding: 10,
    },
    languageText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SignIn;
