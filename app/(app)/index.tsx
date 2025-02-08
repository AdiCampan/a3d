import { Text, View } from "react-native";

import { useSession } from "../../ctx";
import { Redirect } from "expo-router";

export default function Index() {
  const { signOut, session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  } else {
    return <Redirect href="/(tabs)/fichar" />;
  }

  // return (
  //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //     <Text
  //       onPress={() => {
  //         // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
  //         signOut();
  //       }}
  //     >
  //       Sign Out
  //     </Text>
  //   </View>
  // );
}
