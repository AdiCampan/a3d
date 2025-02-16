import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useSession } from "@/ctx";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Obras = () => {
  const [fontsLoaded] = useFonts({
    Fredoka: require("../../assets/fonts/Fredoka.ttf"),
  });
  const sessionData = useSession();

  const { session, trabajadores, heramientas, fichajes, isLoading, obras } =
    sessionData;
  const [selectedObra, setSelectedObra] = useState(null);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handlePressObra = (obra) => {
    if (selectedObra?.id === obra.id) {
      setSelectedObra(null);
    } else {
      setSelectedObra(obra);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <View style={styles.headerContainer} onLayout={onLayout}>
          <Image
            source={require("@/assets/images/logo-A3D.png")}
            style={styles.reactLogo}
          />
          <Text style={styles.titulo}>OBRAS</Text>
          <Text style={styles.tituloDescripcion}>en curso</Text>
        </View>
      }
    >
      <View style={styles.contenedor}>
        <FlatList
          data={obras}
          renderItem={({ item }) => {
            const hoy = new Date().toISOString().split("T")[0];

            const trabajadoresHoy = fichajes
              .filter(
                (fichaje) =>
                  fichaje.fecha === hoy && fichaje.obra === item.nombre
              )
              .map((fichaje) =>
                trabajadores.find((t) => t.id === fichaje.trabajadorId)
              )
              .filter(Boolean);

            const herramientasEnUso = heramientas.filter((h) =>
              trabajadoresHoy.some((t) => t.id === h.owner)
            );

            return (
              <TouchableOpacity onPress={() => handlePressObra(item)}>
                <View style={styles.obra}>
                  <Text style={styles.name}>{item.nombre}</Text>
                  <FontAwesome
                    name={
                      selectedObra?.id === item.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color="black"
                  />
                </View>
                {selectedObra?.id === item.id && (
                  <View style={styles.detalles}>
                    <Text style={styles.subtitulo}>
                      Trabajadores hoy en la obra:
                    </Text>
                    {trabajadoresHoy.map((trabajador, index) => (
                      <Text key={index} style={styles.detalleTexto}>
                        {trabajador.name}
                      </Text>
                    ))}
                    <Text style={styles.subtitulo}>Herramientas en uso:</Text>
                    {herramientasEnUso.map((herramienta, index) => (
                      <Text key={index} style={styles.detalleTexto}>
                        {herramienta.name}
                      </Text>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          nestedScrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={false}
        />
      </View>
    </ParallaxScrollView>
  );
};

export default Obras;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: 130,
  },
  reactLogo: {
    height: 100,
    width: "100%",
    position: "absolute",
    opacity: 0.2,
  },
  titulo: {
    fontFamily: "Fredoka",
    fontSize: 46,
    // fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  tituloDescripcion: {
    left: 50,
  },
  contenedor: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  obra: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 17,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  detalles: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  detalleTexto: {
    fontSize: 14,
    color: "#555",
  },
  // Remove the incorrect useFonts function definition
});
