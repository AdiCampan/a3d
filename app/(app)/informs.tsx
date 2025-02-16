import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { useSession } from "@/ctx";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
const Informs = () => {
  const navigation = useNavigation();
  const { trabajadores, isLoading, fichajes } = useSession();
  const [fichajesHoy, setFichajesHoy] = useState([]);

  useEffect(() => {
    if (fichajes.length > 0 && trabajadores.length > 0) {
      const fechaHoy = moment().format("YYYY-MM-DD");
      const fichajesDelDia = fichajes.filter((f) => f.fecha === fechaHoy);

      if (fichajesDelDia.length > 0) {
        const fichajesConNombre = fichajesDelDia.map((ficha) => {
          const trabajador = trabajadores.find(
            (t) => t.id === ficha.trabajadorId
          );
          return {
            ...ficha,
            trabajadorNombre: trabajador ? trabajador.name : "Desconocido",
            entrada: moment(ficha.entrada, "HH:mm:ss").format("HH:mm"),
            salida: moment(ficha.salida, "HH:mm:ss").format("HH:mm"),
          };
        });

        setFichajesHoy(fichajesConNombre);
      } else {
        Alert.alert("No hay fichajes hoy");
        console.log("No hay fichajes para hoy.");
      }
    }
  }, [fichajes, trabajadores]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ marginLeft: 125, fontSize: 20 }}>
        {moment().format("YYYY-MM-DD")}
      </Text>
      {fichajesHoy.length === 0 ? (
        <Text>No hay fichajes registrados para hoy.</Text>
      ) : (
        <View style={styles.table}>
          <View style={styles.header}>
            <Text style={styles.headerCell}>Trabajador</Text>
            <Text style={styles.headerCell}>Entrada</Text>
            <Text style={styles.headerCell}>Salida</Text>
            <Text style={styles.headerCell}>Obra</Text>
          </View>
          <FlatList
            data={fichajesHoy}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{item.trabajadorNombre}</Text>
                <Text style={styles.cell}>{item.entrada}</Text>
                <Text style={styles.cell}>{item.salida}</Text>
                <Text style={styles.cell}>{item.obra}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <Pressable style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonLabel}>ATRÁS</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Informs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    padding: 10,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  workerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    marginBottom: 10,
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
    padding: 7,
  },
  headerCell: {
    flex: 1,
    fontSize: 13,
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
  buttonsContainer: {
    marginTop: 20,
    alignItems: "center",
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
  },
  buttonLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
