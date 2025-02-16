import { Tabs, useRouter } from "expo-router";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { Pressable } from "react-native";
import { useSession } from "@/ctx";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  const { signOut } = useSession();
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
            <AntDesign name="setting" size={24} color="black" />
          </Pressable>
        ),
        headerLeft: () => (
          <Pressable
            onPress={() => {
              signOut();
              router.replace("/sign-in");
            }}
            style={{ paddingLeft: 15, marginRight: 35 }}
          >
            <SimpleLineIcons name="logout" size={24} color="black" />
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
      <Tabs.Screen
        name="obras"
        options={{
          title: "Obras",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home-work" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
