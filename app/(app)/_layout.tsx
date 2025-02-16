import { Stack, Redirect } from "expo-router";
import { useSession } from "../../ctx"; // Importa el contexto de sesión
import { Text } from "react-native";

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: true, headerTitle: "ADMINISTRATOR" }}>
      {/* <Redirect href="/(tabs)/fichar" /> */}
      {/* <Stack.Screen name="fichar" /> */}
    </Stack>
  );
}
