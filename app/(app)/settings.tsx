import BackButton from "@/components/components/BackButton";
import { useSession } from "@/ctx";
import { useNavigation, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function SettingsScreen() {
  const navigation = useNavigation();

  const router = useRouter();
  const { signOut } = useSession();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <BackButton goBack={navigation.goBack} />
      <Text style={{ fontSize: 20 }}>Settings</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={() => {
            signOut();
            router.replace("/sign-in");
          }}
        >
          <Text style={styles.buttonLabel}>LOG-OUT</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button]}
          onPress={() => {
            router.replace("/register");
          }}
        >
          <Text style={styles.buttonLabel}>+ TRABAJADOR</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 190,
    marginTop: 20,
    marginHorizontal: 20,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: 50,
    // minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "row",
    backgroundColor: "#007BFF",
  },

  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
