
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function DestinoScreen() {
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardarDestino = async () => {
    // Validar que todos los campos estén completos
    if (
      !ciudad.trim() ||
      !pais.trim() ||
      !latitud.trim() ||
      !longitud.trim()
    ) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    // Convertir las coordenadas a números
    const lat = Number(latitud);
    const lon = Number(longitud);

    // Validar las coordenadas
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      Alert.alert('Error', 'Ingresa coordenadas válidas');
      return;
    }

    // Obtener el usuario que inició sesión
    const usuario = auth.currentUser;

    if (!usuario) {
      Alert.alert('Error', 'Debes iniciar sesión');
      return;
    }

    try {
      setGuardando(true);

      // Guardar el destino en Cloud Firestore
      await addDoc(
        collection(db, 'usuarios', usuario.uid, 'destinos'),
        {
          ciudad: ciudad.trim(),
          pais: pais.trim(),
          latitud: lat,
          longitud: lon
        }
      );

      Alert.alert('Correcto', 'Destino guardado en Firebase');

      // Limpiar el formulario
      setCiudad('');
      setPais('');
      setLatitud('');
      setLongitud('');

    } catch (error) {
      console.log('Error al guardar destino:', error);
      Alert.alert('Error', 'No se pudo guardar el destino');

    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registrar destino</Text>

      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        value={ciudad}
        onChangeText={setCiudad}
      />

      <TextInput
        style={styles.input}
        placeholder="País"
        value={pais}
        onChangeText={setPais}
      />

      <TextInput
        style={styles.input}
        placeholder="Latitud"
        value={latitud}
        onChangeText={setLatitud}
        keyboardType="numbers-and-punctuation"
      />

      <TextInput
        style={styles.input}
        placeholder="Longitud"
        value={longitud}
        onChangeText={setLongitud}
        keyboardType="numbers-and-punctuation"
      />

      {guardando ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <Button
          title="Guardar destino"
          onPress={guardarDestino}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5
  }
});
