
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RegistroScreen() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);

  async function registrar() {
    if (!correo.trim() || !contrasena || !confirmar) {
      Alert.alert('Aviso', 'Completa todos los campos');
      return;
    }

    if (contrasena !== confirmar) {
      Alert.alert('Aviso', 'Las contraseñas no coinciden');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Aviso', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setCargando(true);

      await createUserWithEmailAndPassword(
        auth,
        correo.trim(),
        contrasena
      );

      Alert.alert('Registro', 'Usuario registrado correctamente');

      setCorreo('');
      setContrasena('');
      setConfirmar('');

    } catch (error: any) {
      console.log('Error de Firebase:', error.code, error.message);

      Alert.alert(
        'Error de registro',
        error.code || 'No se pudo registrar el usuario'
      );

    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <TouchableOpacity
        style={styles.boton}
        onPress={registrar}
        disabled={cargando}
      >
        <Text style={styles.textoBoton}>
          {cargando ? 'REGISTRANDO...' : 'REGISTRARSE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15
  },
  boton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 5
  },
  textoBoton: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

