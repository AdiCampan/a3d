import {
  StyleSheet,
  Image,
  Platform,
  FlatList,
  View,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useSession } from "@/ctx";
import drill from "../../assets/images/drill.png";

export default function heramientas() {
  const { session, trabajadores, heramientas, isLoading } = useSession();
  const [misHeramientas, setMisHeramientas] = useState([]);

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Fecha desconocida";
    const date = new Date(timestamp.seconds * 1000); // Convertir segundos a milisegundos
    return (
      date.toLocaleDateString("es-ES") + " " + date.toLocaleTimeString("es-ES")
    );
  };

  useEffect(() => {
    if (!session || trabajadores.length === 0 || heramientas.length === 0) {
      return; // Esperar a que los datos estén listos
    }

    const trabajador = trabajadores.find((t) => t.id === session.uid);
    if (!trabajador) return; // Asegurarse de que el trabajador existe

    const myTools = heramientas.filter((tool) => tool.owner === trabajador.id);
    setMisHeramientas(myTools);
  }, [session, trabajadores, heramientas]); // 🔹 Dependencias agregadas

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/logo-A3D.png")}
          style={styles.reactLogo}
        />
      }
    >
      <FlatList
        data={misHeramientas}
        renderItem={({ item }) => (
          <View style={styles.toolItem}>
            <View>
              <Text style={styles.toolName}>{item.name}</Text>
              <Text style={styles.toolOwner}>
                desde: {formatDate(item.date)}
              </Text>
            </View>
            {/* <Image source={drill} style={styles.image} /> */}

            <FontAwesome
              name="wrench"
              size={20}
              color="black"
              style={styles.icon}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled={true} // Permite desplazamiento anidado
        contentContainerStyle={{ flexGrow: 1 }} // Asegura que todo el contenido se renderice correctamente
        scrollEnabled={false} // Evita conflictos con el scroll del ParallaxScrollView
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  reactLogo: {
    height: 100,
    width: "95%",
    bottom: 40,
    right: 20,
    left: 10,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  toolItem: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  toolName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  toolOwner: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  icon: {
    // marginL: 30,
  },
  image: {
    height: 30,
    width: 50,
  },
});
