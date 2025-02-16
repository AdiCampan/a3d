import { useSession } from "@/ctx";
import { useNavigation, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importa los iconos

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useSession();

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/informs")}
        >
          <FontAwesome5 name="clock" size={24} color="white" />
          <Text style={styles.buttonLabel}>INFORME DIARIO</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          // onPress={() => router.replace("/workers")}
          onPress={() => router.push("/workers")}
        >
          <FontAwesome5 name="clock" size={24} color="white" />
          <Text style={styles.buttonLabel}>INFORMES TRABAJADORES</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/informs")}
        >
          <FontAwesome5 name="tools" size={24} color="white" />
          <Text style={styles.buttonLabel}>INFORME OBRAS</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/register")}
        >
          <FontAwesome5 name="user-plus" size={24} color="white" />
          <Text style={styles.buttonLabel}>ADD TRABAJADOR</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome5 name="arrow-left" size={24} color="#007BFF" />
        <Text style={styles.backButtonLabel}>ATRÁS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD", // Fondo azul claro
  },
  buttonsContainer: {
    width: 270,
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    borderRadius: 50,
    paddingVertical: 15,
    marginVertical: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButtonLabel: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
