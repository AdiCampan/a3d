import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { useSession } from "@/ctx";

export default function AlmacenScreen() {
  const { trabajadores, heramientas } = useSession();

  const [tools, setTools] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [newTool, setNewTool] = useState({ name: "", owner: "" });

  // Estados para DropDownPicker
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  // 🔹 Sincronizar herramientas y trabajadores
  useEffect(() => {
    setWorkers(trabajadores);
    setTools(heramientas);
  }, [trabajadores, heramientas]);

  const handleAddTool = async () => {
    if (!newTool.name || !newTool.owner) {
      Alert.alert("Error", "Por favor, completa todos los campos");
      return;
    }

    try {
      if (editMode && selectedTool?.id) {
        // 🔹 Actualizar herramienta existente en Firestore con nueva fecha
        const toolRef = doc(db, "heramientas", selectedTool.id);
        await updateDoc(toolRef, {
          ...newTool,
          date: serverTimestamp(), // 🔥 Se guarda la fecha de modificación
          id: selectedTool.id,
        });
        Alert.alert("Éxito", "Herramienta actualizada correctamente");
      } else {
        // 🔹 Agregar nueva herramienta con fecha de creación
        const docRef = await addDoc(collection(db, "heramientas"), {
          ...newTool,
          date: serverTimestamp(),
        });

        // 🔹 Ahora actualizar el documento para incluir el ID
        await updateDoc(docRef, { id: docRef.id });
        Alert.alert("Éxito", "Herramienta añadida correctamente");
      }

      setModalVisible(false);
      setNewTool({ name: "", owner: "" });
      setEditMode(false);
      setSelectedTool(null);
    } catch (error) {
      console.error("Error al guardar herramienta:", error);
      Alert.alert("Error", "No se pudo guardar la herramienta");
    }
  };

  // 🔹 Abrir modal en modo edición
  const editTool = (tool) => {
    setSelectedTool(tool);
    setNewTool({ name: tool.name, owner: tool.owner });
    setEditMode(true);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Almacén de Herramientas</Text>

        <FlatList
          data={tools}
          renderItem={({ item }) => {
            const ownerName =
              workers.find((worker) => worker.id === item.owner)?.name ||
              "Desconocido";
            return (
              <Pressable style={styles.toolItem} onPress={() => editTool(item)}>
                <Text style={styles.toolName}>{item.name}</Text>
                <Text style={styles.toolOwner}>Propietario: {ownerName}</Text>
              </Pressable>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />

        <Pressable
          style={styles.addButton}
          onPress={() => {
            setEditMode(false);
            setNewTool({ name: "", owner: "" });
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Añadir Herramienta</Text>
        </Pressable>

        {/* 🔹 MODAL PARA AÑADIR/EDITAR */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editMode ? "Editar Herramienta" : "Añadir Herramienta"}
              </Text>
              <TextInput
                autoCorrect={false}
                style={styles.input}
                placeholder="Nombre de la herramienta"
                value={newTool.name}
                onChangeText={(text) => setNewTool({ ...newTool, name: text })}
              />
              <DropDownPicker
                open={open}
                value={newTool.owner}
                items={workers.map((worker) => ({
                  label: worker.name,
                  value: worker.id,
                }))}
                setOpen={setOpen}
                setValue={(callback) => {
                  const value =
                    typeof callback === "function"
                      ? callback(newTool.owner)
                      : callback;
                  setNewTool({ ...newTool, owner: value });
                }}
                placeholder="Selecciona un propietario"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddTool}
                >
                  <Text style={styles.modalButtonText}>
                    {editMode ? "Guardar" : "Añadir"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 10,
  },
  toolItem: {
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
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "#f44336",
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
