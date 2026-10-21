
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  async function ingresar() {
    if (!correo.trim() || !contrasena) {
      Alert.alert('Aviso', 'Completa todos los campos');
      return;
    }

    try {
      setCargando(true);

      await signInWithEmailAndPassword(
        auth,
        correo.trim(),
        contrasena
      );

      Alert.alert('Éxito', 'Inicio de sesión correcto');

    } catch (error: any) {
      console.log('Error de inicio de sesión:', error.code);

      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'El correo electrónico no es válido');
      } else if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión: ' + error.code);
      }

    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Iniciar sesión</Text>

      <TextInput
        style={styles.entrada}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.entrada}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={ingresar}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>
          {cargando ? 'INGRESANDO...' : 'INGRESAR'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  entrada: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  boton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 5,
  },
  textoBoton: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
