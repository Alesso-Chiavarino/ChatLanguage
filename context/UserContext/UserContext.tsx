import React, { createContext, useContext, useState } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

const UserContext = createContext({
    user: null,
    register: async (userData: any) => { },
    login: async (email: string, password: string) => { },
    logout: () => { },
    updateUserName: async (name: string) => { },
    updateUserLanguage: async (language: string) => { },
});

export function UserProvider({ children }: any) {
    const [user, setUser] = useState<any>(null);

    const register = async ({ name, email, password, defaultLanguage }: {
        name: string,
        email: string,
        password: string,
        defaultLanguage: string,
    }) => {
        try {
            const db = getFirestore();
            const userDoc = doc(db, 'Users', email);
            await setDoc(userDoc, {
                name,
                email,
                password,
                language: defaultLanguage,
            });

            setUser({ name, email, language: defaultLanguage });

            Alert.alert('Registro exitoso', `¡Bienvenido, ${name}!`);
        } catch (error) {
            console.error("Error en el registro:", error);
            Alert.alert('Error', 'No se pudo registrar. Inténtalo de nuevo.');
        }
    };

    const login = async (email: string, password: string): Promise<any> => {
        try {
            const db = getFirestore();
            const userDoc = doc(db, 'Users', email);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (userData.password === password) {
                    setUser({ name: userData.name, email: userData.email, language: userData.language });
                    Alert.alert('Inicio de sesión exitoso', `¡Bienvenido de nuevo, ${userData.name}!`);
                    return true;
                } else {
                    Alert.alert('Error', 'Contraseña incorrecta. Inténtalo de nuevo.');
                    return false;
                }
            } else {
                Alert.alert('Error', 'No se encontró ningún usuario con este correo electrónico.');
                return false;
            }
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            Alert.alert('Error', 'No se pudo iniciar sesión. Inténtalo de nuevo.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente.');
    };

    // Función para actualizar el nombre del usuario
    const updateUserName = async (name: string) => {
        if (!user) return;

        try {
            const db = getFirestore();
            const userDoc = doc(db, 'Users', user.email);
            await setDoc(userDoc, { name }, { merge: true }); 

            setUser((prevUser: any) => ({ ...prevUser, name }));
            Alert.alert('Éxito', 'Nombre actualizado correctamente.');
        } catch (error) {
            console.error("Error al actualizar el nombre:", error);
            Alert.alert('Error', 'No se pudo actualizar el nombre.');
        }
    };

    const updateUserLanguage = async (language: string) => {
        if (!user) return;

        try {
            const db = getFirestore();
            const userDoc = doc(db, 'Users', user.email);
            await setDoc(userDoc, { language }, { merge: true });

            setUser((prevUser: any) => ({ ...prevUser, language }));
            Alert.alert('Éxito', 'Idioma actualizado correctamente.');
        } catch (error) {
            console.error("Error al actualizar el idioma:", error);
            Alert.alert('Error', 'No se pudo actualizar el idioma.');
        }
    };

    return (
        <UserContext.Provider value={{ user, register, login, logout, updateUserName, updateUserLanguage }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
