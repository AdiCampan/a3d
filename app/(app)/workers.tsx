import { useSession } from "@/ctx";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { FlatList, Pressable, View, StyleSheet, Text } from "react-native";

const Workers = () => {
  const navigation = useNavigation();
  const { trabajadores, fichajes, isLoading } = useSession();
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(
    moment().format("YYYY-MM")
  );
  const [fichajesTrabajador, setFichajesTrabajador] = useState([]);

  useEffect(() => {
    if (trabajadorSeleccionado) {
      const fichajesMes = fichajes.filter(
        (f) =>
          f.trabajadorId === trabajadorSeleccionado.id &&
          f.fecha.startsWith(mesSeleccionado)
      );

      const fichajesFormateados = fichajesMes.map((ficha) => ({
        ...ficha,
        entrada: moment(ficha.entrada, "HH:mm:ss").format("HH:mm"),
        salida: moment(ficha.salida, "HH:mm:ss").format("HH:mm"),
      }));

      setFichajesTrabajador(fichajesFormateados);
    }
  }, [trabajadorSeleccionado, mesSeleccionado, fichajes]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {trabajadorSeleccionado ? (
        <>
          <Picker
            selectedValue={mesSeleccionado}
            onValueChange={(itemValue) => setMesSeleccionado(itemValue)}
          >
            {[...Array(12)].map((_, i) => {
              const mes = moment().subtract(i, "months").format("YYYY-MM");
              return <Picker.Item key={mes} label={mes} value={mes} />;
            })}
          </Picker>

          <View style={styles.table}>
            <View style={styles.header}>
              <Text style={styles.headerCell}>Día</Text>
              <Text style={styles.headerCell}>Entrada</Text>
              <Text style={styles.headerCell}>Salida</Text>
              <Text style={styles.headerCell}>Obra</Text>
            </View>
            <FlatList
              data={fichajesTrabajador}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <Text style={styles.cell}>
                    {moment(item.fecha).format("DD")}
                  </Text>
                  <Text style={styles.cell}>{item.entrada}</Text>
                  <Text style={styles.cell}>{item.salida}</Text>
                  <Text style={styles.cell}>{item.obra}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>

          <Pressable
            style={styles.button}
            onPress={() => setTrabajadorSeleccionado(null)}
          >
            <Text style={styles.buttonLabel}>Volver</Text>
          </Pressable>
        </>
      ) : (
        <FlatList
          data={trabajadores}
          renderItem={({ item }) => (
            <Pressable onPress={() => setTrabajadorSeleccionado(item)}>
              <View style={styles.workerRow}>
                <Text style={styles.workerName}>{item.name}</Text>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  workerRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  workerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Workers;
