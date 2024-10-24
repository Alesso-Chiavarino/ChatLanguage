import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator'; // Asegúrate de que el path sea correcto

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator /> {/* Aquí se carga el AppNavigator */}
    </NavigationContainer>
  );
}
