import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Importa Firebase
import { FontAwesome5 } from "@expo/vector-icons"; // Importa los iconos

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("adi@gmail.com");
  const [password, setPassword] = useState("111111");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/fichar");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={require("@/assets/images/logo3.png")}
          style={styles.logoA3D}
        />
      </View>

      {/* <Text style={styles.title}>Iniciar Sesión</Text> */}

      {/* Input Email */}
      <View style={styles.inputContainer}>
        <FontAwesome5
          name="envelope"
          size={20}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Input Contraseña */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Botón de Login */}
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        <FontAwesome5 name="sign-in-alt" size={20} color="white" />
        <Text style={styles.buttonLabel}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
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
    padding: 20,
  },
  image: {
    // backgroundColor: "white",
    width: 280,
    height: 280,
    marginBottom: 50,
  },
  logoA3D: {
    height: "100%",
    width: "300%",
    resizeMode: "contain",
    bottom: 10,
    right: 20,
    left: 50,
    position: "absolute",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#007BFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    borderRadius: 50, // Botón redondo
    paddingVertical: 15,
    width: "100%",
    maxWidth: 350,
    marginTop: 20,
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
});
