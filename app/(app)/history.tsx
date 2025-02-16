import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import { useSession } from "@/ctx";
import { SelectList } from "react-native-dropdown-select-list";
import DropDownPicker from "react-native-dropdown-picker";
type Fichaje = {
  id: string;
  obra: string;
  entrada: string;
  salida: string;
  fecha: string;
};
export default function HistoryScreen() {
  const { session, trabajadores, heramientas, isLoading, obras } = useSession();

  const router = useRouter();

  const [selected, setSelected] = React.useState("");
  const [fichajes, setFichajes] = useState<Fichaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFichaje, setSelectedFichaje] = useState(null);
  const [obra, setObra] = useState("");
  const [entrada, setEntrada] = useState(new Date());
  const [salida, setSalida] = useState(new Date());
  const [showEntradaPicker, setShowEntradaPicker] = useState(false);
  const [showSalidaPicker, setShowSalidaPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedObra, setSelectedObra] = useState(obra);
  const [obrasList, setObrasList] = useState(
    obras.map((o) => ({ label: o.nombre, value: o.nombre }))
  );

  useEffect(() => {
    const fetchFichajes = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No hay usuario autenticado");
        setLoading(false);
        return;
      }

      try {
        const fichajesRef = collection(db, "fichajes");

        // 🔹 Obtener solo los fichajes de los últimos 30 días
        const hoy = new Date();
        const hace30Dias = new Date(hoy);
        hace30Dias.setDate(hoy.getDate() - 30);
        const fechaFiltro = hace30Dias.toISOString().split("T")[0]; // "YYYY-MM-DD"

        const q = query(
          fichajesRef,
          where("trabajadorId", "==", user.uid),
          where("fecha", ">=", fechaFiltro),
          orderBy("fecha", "desc") // 🔹 Ordenar por fecha (más reciente primero)
        );

        const snapshot = await getDocs(q);

        const fichajesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFichajes(fichajesData);
      } catch (error) {
        console.error("Error obteniendo fichajes:", error);
      }

      setLoading(false);
    };

    fetchFichajes();
  }, []);

  const parseTime = (timeStr) => {
    if (!timeStr) return new Date(); // Si no hay hora, usar la actual
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return new Date(); // Si falla, usar la actual
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const openModal = (fichaje) => {
    setSelectedFichaje(fichaje);
    setObra(fichaje.obra);
    setEntrada(parseTime(fichaje.entrada));
    setSalida(parseTime(fichaje.salida));
    setModalVisible(true);
  };

  const updateFichaje = async () => {
    if (!selectedFichaje) return;

    try {
      const updatedData = {
        obra: selectedObra, // Asegurar que es el valor correcto
        entrada: entrada.toLocaleTimeString("es-ES", { hour12: false }),
        salida: salida.toLocaleTimeString("es-ES", { hour12: false }),
      };

      // 🔹 Actualizar en Firestore
      await updateDoc(doc(db, "fichajes", selectedFichaje.id), updatedData);

      // 🔹 Actualizar el estado local de fichajes
      setFichajes((prev) =>
        prev.map((item) =>
          item.id === selectedFichaje.id ? { ...item, ...updatedData } : item
        )
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar fichaje:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Fichajes</Text>

      {fichajes.length === 0 ? (
        <Text style={styles.noData}>
          No hay fichajes en los últimos 30 días.
        </Text>
      ) : (
        <FlatList
          data={fichajes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => openModal(item)}>
              <View style={styles.card}>
                <View style={styles.contenedor}>
                  <Text style={styles.fecha}>{item.fecha}</Text>
                  <Text style={styles.obra}>Obra: {item.obra}</Text>
                </View>
                <View style={styles.contenedor}>
                  <Text>Entrada: {item.entrada || "No registrado"}</Text>
                  <Text>Salida: {item.salida || "No registrado"}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* MODAL PARA EDITAR FICHAJE */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Fichaje</Text>

            <Text>Obra:</Text>
            <DropDownPicker
              open={open}
              value={selectedObra}
              items={obrasList}
              setOpen={setOpen}
              setValue={setSelectedObra}
              setItems={setObrasList}
              placeholder="Selecciona una obra"
            />

            <Text>Hora de Entrada:</Text>
            <Pressable
              onPress={() => setShowEntradaPicker(true)}
              style={styles.pickerButton}
            >
              <Text>
                {entrada instanceof Date && !isNaN(entrada.getTime())
                  ? entrada.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Hora no válida"}
              </Text>
            </Pressable>
            {showEntradaPicker && (
              <DateTimePicker
                value={entrada}
                mode="time"
                is24Hour
                display="default"
                onChange={(event, date) => {
                  setShowEntradaPicker(false);
                  if (date) setEntrada(date);
                }}
              />
            )}

            <Text>Hora de Salida:</Text>
            <Pressable
              onPress={() => setShowSalidaPicker(true)}
              style={styles.pickerButton}
            >
              <Text>
                {entrada instanceof Date && !isNaN(entrada.getTime())
                  ? salida.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Hora no válida"}
              </Text>
            </Pressable>
            {showSalidaPicker && (
              <DateTimePicker
                value={salida}
                mode="time"
                is24Hour
                display="default"
                onChange={(event, date) => {
                  setShowSalidaPicker(false);
                  if (date) setSalida(date);
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <Pressable style={styles.saveButton} onPress={updateFichaje}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/fichar")}
      >
        <Text style={styles.addButtonText}>VOLVER</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    // justifyContent: "space-between",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fecha: {
    fontSize: 16,
    fontWeight: "bold",
  },
  obra: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 5,
  },
  contenedor: {
    width: "50%",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "85%", // Ancho del modal
    elevation: 10, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  pickerButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});
