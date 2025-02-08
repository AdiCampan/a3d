import {
  Image,
  StyleSheet,
  Button,
  Text,
  Pressable,
  View,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeScreen() {
  const router = useRouter();

  const [selected, setSelected] = React.useState("");
  const [obras, setObras] = useState([]); // Lista de obras desde Firestore
  const [newObra, setNewObra] = useState(""); // Estado para nueva obra
  const [user, setUser] = useState(null); // Aquí deberías cargar el usuario autenticado
  const [fichajeId, setFichajeId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || "Usuario",
          email: currentUser.email,
        });

        verificarFichajeAbierto(currentUser.uid); // 🔹 Verificar si hay un fichaje abierto
      } else {
        setUser(null);
        setFichajeId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        verificarFichajeAbierto(user.uid);
      }
    }, [user])
  );

  const fichar = async () => {
    if (!user || !selected) {
      Alert.alert("Error", "Selecciona una obra antes de fichar.");
      return;
    }

    const now = new Date();
    const fecha = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const horaActual = now.toLocaleTimeString("es-ES", { hour12: false });

    try {
      const fichajesRef = collection(db, "fichajes");

      if (!fichajeId) {
        // 🚀 Fichar ENTRADA
        const docRef = await addDoc(fichajesRef, {
          trabajadorId: user.uid,
          nombre: user.displayName || "Anonimo",
          obra: selected,
          fecha: fecha,
          entrada: horaActual,
          salida: "",
        });
        setFichajeId(docRef.id); // Guardar ID para fichar salida después

        Alert.alert("ENTRADA", `Entrada registrada a las ${horaActual}`);
      } else {
        // 🚀 Fichar SALIDA
        await updateDoc(doc(fichajesRef, fichajeId), {
          salida: horaActual,
        });

        Alert.alert("SALIDA", `Salida registrada a las ${horaActual}`);
        setFichajeId(null); // Resetear para siguiente fichaje
      }
    } catch (error) {
      console.error("Error al fichar:", error);
      Alert.alert("Error", "Hubo un problema al fichar. Intenta de nuevo.");
    }
  };

  const obtenerFichajesPorTrabajador = async (id: any) => {
    const fichajesRef = collection(db, "fichajes");
    const q = query(fichajesRef, where("trabajadorId", "==", id));

    const snapshot = await getDocs(q);
    const fichajes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return fichajes;
  };

  const obtenerDatos = async () => {
    const idTrabajador = user.uid;
    const fichajesTrabajador = await obtenerFichajesPorTrabajador(idTrabajador);
  };

  obtenerDatos();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "obras"), (snapshot) => {
      const obrasArray = snapshot.docs.map((doc) => ({
        key: doc.id,
        value: doc.data().nombre,
      }));
      setObras(obrasArray);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Función para agregar una nueva obra
  const addObra = async () => {
    if (newObra.trim() === "") return;
    try {
      await addDoc(collection(db, "obras"), { nombre: newObra });
      setNewObra(""); // Limpiar input después de agregar
    } catch (error) {
      console.error("Error al agregar obra:", error);
    }
  };

  const verificarFichajeAbierto = async (userId) => {
    const fichajesRef = collection(db, "fichajes");
    const q = query(
      fichajesRef,
      where("trabajadorId", "==", userId),
      where("fecha", "==", new Date().toISOString().split("T")[0]), // Solo hoy
      where("salida", "==", "") // Sin salida
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const fichajeAbierto = snapshot.docs[0].data();
      setFichajeId(snapshot.docs[0].id); // Guardamos el ID del fichaje
      setSelected(fichajeAbierto.obra); // Seleccionamos la obra en el dropdown
    } else {
      setFichajeId(null);
      setSelected(""); // Si no hay fichaje abierto, se resetea
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/logo-A3D.png")}
          style={styles.logoA3D}
        />
      }
    >
      <SelectList
        maxHeight={400}
        setSelected={setSelected}
        data={obras}
        save="value"
        placeholder="Elige una obra..."
        boxStyles={styles.dropdown}
        dropdownStyles={styles.dropdownList}
        dropdownTextStyles={styles.dropdownText}
        inputStyles={styles.dropdownInput}
        defaultOption={selected ? { key: selected, value: selected } : null} // Aquí se establece la obra seleccionada
      />

      <View style={styles.ficharContainer}>
        <Pressable
          style={[
            styles.addButton,
            selected ? styles.buttonActive : styles.buttonDisabled,
          ]}
          disabled={!selected}
          onPress={fichar}
        >
          <Text style={styles.buttonLabel}>
            {fichajeId ? "Fichar SALIDA" : "Fichar ENTRADA"}
          </Text>
        </Pressable>

        <View style={{ marginTop: 15 }}>
          <TextInput
            autoCorrect={false}
            style={styles.input}
            placeholder="Obra nueva..."
            value={newObra}
            onChangeText={setNewObra}
          />

          <Pressable
            style={[
              styles.addButton,
              newObra.trim() ? styles.buttonActive : styles.buttonDisabled,
            ]}
            onPress={addObra}
            disabled={!newObra.trim()} // Deshabilita si el input está vacío
          >
            <Text style={styles.addButtonText}>OBRA NUEVA</Text>
          </Pressable>
        </View>

        <View style={styles.historyContainer}>
          <Pressable
            style={styles.addButton}
            onPress={() => router.push("/(app)/history")}
          >
            <Text style={styles.addButtonText}>HISTORIAL FICHAJES</Text>
          </Pressable>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logoA3D: {
    height: 100,
    width: "95%",
    bottom: 20,
    right: 20,
    left: 10,
    position: "absolute",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
  },
  dropdown: {
    marginHorizontal: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  dropdownList: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownInput: {
    fontSize: 16,
    color: "#333",
  },
  ficharContainer: {
    height: "100%",
    marginHorizontal: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonActive: {
    backgroundColor: "#007BFF",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  historyContainer: {
    bottom: 0,
  },
});
