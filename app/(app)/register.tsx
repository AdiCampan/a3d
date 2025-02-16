import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import Background from "../../components/components/Background";
import TextInput from "../../components/components/TextInput";
import Button from "../../components/components/Button";
import { Text } from "react-native-paper";
import { theme } from "../../components/components/theme";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import BackButton from "../../components/components/BackButton";

import { emailValidator } from "../../components/helpers/emailValidator";
import { passwordValidator } from "../../components/helpers/passwordValidator";
import { nameValidator } from "../../components/helpers/nameValidator";
import { phoneValidator } from "../../components/helpers/phoneValidator";
import { ref, onValue, set } from "firebase/database";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import Header from "../../components/components/Header";
import { useSession } from "@/ctx";
import { router } from "expo-router";

export default function RegisterScreen() {
  const { session, trabajadores, heramientas, fichajes, isLoading, obras } =
    useSession();
  const navigation = useNavigation();

  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [error, setError] = useState(null);

  // const image = require("../../Logotipos Finales/Logotipos/Color/Color.png");

  const onSignUpPressed = () => {
    setError(null);
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const phoneError = phoneValidator(phoneNumber.value);
    if (emailError || passwordError || nameError || phoneError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPhoneNumber({ ...phoneNumber, error: phoneError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;

        const usuario = {
          name: name.value,
          email: email.value,
          phoneNumber: phoneNumber.value,
          role: 0,
          id: user.uid,
        };

        try {
          // Guardar en Firestore en la colección "trabajadores"
          await setDoc(doc(db, "trabajadores", user.uid), usuario);

          // Actualizar perfil del usuario en Firebase Auth
          await updateProfile(auth.currentUser, {
            displayName: name.value,
            photoURL: "https://example.com/jane-q-user/profile.jpg",
          });
          alert("Agregado con exito !");
          navigation.goBack();
          console.log("Usuario registrado y datos guardados en Firestore");
        } catch (error) {
          console.error("Error guardando en Firestore:", error);
          setError(error.message);
        }
      })
      .catch((error) => {
        console.log("Register error", error);
        setError(error.message);
      });
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      {/* <Image source={image} style={styles.image} /> */}

      <Header>Create Account</Header>
      <TextInput
        label="Nombre completo"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text: any) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
        description={undefined}
      />
      <TextInput
        label="Teléfono"
        returnKeyType="next"
        value={phoneNumber.value}
        onChangeText={(text: any) => setPhoneNumber({ value: text, error: "" })}
        error={!!phoneNumber.error}
        errorText={phoneNumber.error}
        description={undefined}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: any) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description={undefined}
      />
      <TextInput
        label="Contrasena"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text: any) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        description={undefined}
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      {/* <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View> */}
      {error && (
        <View>
          <Text>{error}</Text>
        </View>
      )}
      <Button
        mode="outlined"
        // onPress={() => navigation.goBack()}
        onPress={() => {
          router.replace("/settings");
        }}
        style={{ marginTop: 24 }}
      >
        IR ATRAS
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  image: {
    height: 100,
    width: 100,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#007bff",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
});
