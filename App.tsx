
import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from './firebaseConfig';
import LoginScreen from './screens/LoginScreen';
import RegistroScreen from './screens/RegistroScreen';
import InicioScreen from './screens/InicioScreen';

export default function App() {
  const [pantalla, setPantalla] = useState('login');
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase);
      setCargando(false);
    });

    return () => cancelar();
  }, []);

  if (cargando) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (usuario) {
    return (
      <View style={{ flex: 1 }}>
        <InicioScreen />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {pantalla === 'login' ? <LoginScreen /> : <RegistroScreen />}

      <Button
        title={pantalla === 'login' ? 'Crear una cuenta' : 'Volver al inicio'}
        onPress={() =>
          setPantalla(pantalla === 'login' ? 'registro' : 'login')
        }
      />

      <StatusBar style="auto" />
    </View>
  );
}
