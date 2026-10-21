
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

import DestinoScreen from './DestinoScreen';
import ListaDestinosScreen from './ListaDestinosScreen';

export default function InicioScreen() {
  const [pantalla, setPantalla] = useState('inicio');

  async function cerrarSesion() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }

  if (pantalla === 'registrar') {
    return (
      <View style={styles.contenedorPantalla}>
        <DestinoScreen />

        <TouchableOpacity
          style={styles.boton}
          onPress={() => setPantalla('inicio')}
        >
          <Text style={styles.textoBoton}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (pantalla === 'lista') {
    return (
      <View style={styles.contenedorPantalla}>
        <ListaDestinosScreen />

        <TouchableOpacity
          style={styles.boton}
          onPress={() => setPantalla('inicio')}
        >
          <Text style={styles.textoBoton}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>TravelWeather</Text>

      <Text style={styles.texto}>
        Bienvenido a tu aplicación de viajes
      </Text>

      <Text style={styles.texto}>
        Guarda tus destinos y consulta el clima.
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => setPantalla('registrar')}
      >
        <Text style={styles.textoBoton}>Registrar destino</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => setPantalla('lista')}
      >
        <Text style={styles.textoBoton}>Mis destinos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonCerrar}
        onPress={cerrarSesion}
      >
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#fff'
  },
  contenedorPantalla: {
    flex: 1,
    paddingBottom: 25,
    backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  texto: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  boton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    marginTop: 15
  },
  botonCerrar: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    marginTop: 15
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
