import { Tabs, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Pressable } from "react-native";
import { useSession } from "@/ctx";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { session, trabajadores, isLoading } = useSession();

  const trabajador = trabajadores.find((t) => t.id === session?.uid);
  return (
    <Tabs
      screenOptions={{
        headerTitle: `${trabajador?.name}`,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/settings")}
            style={{ marginRight: 15 }}
          >
            <FontAwesome5 name="cog" size={24} color="black" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="fichar"
        options={{
          title: "Fichar",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-clock" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="heramientas"
        options={{
          title: "Mis Herramientas",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="toolbox" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="almacen"
        options={{
          title: "Almacén",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="store" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
