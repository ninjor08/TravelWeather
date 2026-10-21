import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_URL
} from './openWeatherConfig';

type Destino = {
  id: string;
  ciudad: string;
  pais: string;
  latitud: number;
  longitud: number;
};

type Clima = {
  temperatura: number;
  descripcion: string;
  humedad: number;
};

export default function ListaDestinosScreen() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [climas, setClimas] = useState<Record<string, Clima>>({});
  const [erroresClima, setErroresClima] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Escuchar los destinos de Firebase en tiempo real
  useEffect(() => {
    const usuario = auth.currentUser;

    if (!usuario) {
      setError('Debes iniciar sesión');
      setCargando(false);
      return;
    }

    const referencia = collection(
      db,
      'usuarios',
      usuario.uid,
      'destinos'
    );

    const cancelar = onSnapshot(
      referencia,
      (resultado) => {
        const lista: Destino[] = resultado.docs.map((documento) => {
          const datos = documento.data();

          return {
            id: documento.id,
            ciudad: datos.ciudad,
            pais: datos.pais,
            latitud: datos.latitud,
            longitud: datos.longitud
          };
        });

        setDestinos(lista);
        setError('');
        setCargando(false);
      },
      (errorFirebase) => {
        console.log('Error de Firebase:', errorFirebase);
        setError('No se pudieron cargar los destinos');
        setCargando(false);
      }
    );

    return () => cancelar();
  }, []);

  // Consultar el clima de cada destino
  useEffect(() => {
    let activo = true;

    async function consultarClima(destino: Destino) {
      try {
        const url =
          `${OPENWEATHER_URL}?lat=${destino.latitud}` +
          `&lon=${destino.longitud}` +
          `&appid=${OPENWEATHER_API_KEY}` +
          `&units=metric&lang=es`;

        const respuesta = await fetch(url);

        if (!respuesta.ok) {
          throw new Error('Error al consultar OpenWeather');
        }

        const datos = await respuesta.json();

        if (activo) {
          setClimas((anteriores) => ({
            ...anteriores,
            [destino.id]: {
              temperatura: datos.main.temp,
              descripcion: datos.weather[0].description,
              humedad: datos.main.humidity
            }
          }));

          setErroresClima((anteriores) => ({
            ...anteriores,
            [destino.id]: ''
          }));
        }
      } catch (errorClima) {
        console.log('Error al consultar clima:', errorClima);

        if (activo) {
          setErroresClima((anteriores) => ({
            ...anteriores,
            [destino.id]:
              'No se pudo consultar el clima. Revisa tu conexión.'
          }));
        }
      }
    }

    // Limpiar los datos anteriores al realizar nuevas consultas
    setClimas({});
    setErroresClima({});

    destinos.forEach((destino) => {
      consultarClima(destino);
    });

    return () => {
      activo = false;
    };
  }, [destinos]);

  // Indicador mientras se cargan los destinos
  if (cargando) {
    return (
      <View style={styles.contenedor}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.mensaje}>Cargando destinos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis destinos</Text>

      {error !== '' ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={destinos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.mensaje}>
              Todavía no tienes destinos registrados.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.ciudad}>
                {item.ciudad}, {item.pais}
              </Text>

              <Text>Latitud: {item.latitud}</Text>
              <Text>Longitud: {item.longitud}</Text>

              {erroresClima[item.id] ? (
                <Text style={styles.errorClima}>
                  {erroresClima[item.id]}
                </Text>
              ) : climas[item.id] ? (
                <View style={styles.clima}>
                  <Text style={styles.temperatura}>
                    {climas[item.id].temperatura} °C
                  </Text>

                  <Text>
                    Clima: {climas[item.id].descripcion}
                  </Text>

                  <Text>
                    Humedad: {climas[item.id].humedad} %
                  </Text>
                </View>
              ) : (
                <View style={styles.cargandoClima}>
                  <ActivityIndicator size="small" color="#2196F3" />
                  <Text style={styles.textoCarga}>
                    Consultando clima...
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  tarjeta: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12
  },
  ciudad: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  clima: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  temperatura: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5
  },
  cargandoClima: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  textoCarga: {
    marginLeft: 10,
    color: '#666'
  },
  errorClima: {
    color: 'red',
    marginTop: 15
  },
  mensaje: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20
  }
});

