import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function Index() {
  const {user, token, checkAuth, logout} = useAuthStore();

  console.log("User:", user);
  console.log("Token:", token);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Hello {user?.username}</Text>
      <Text style={styles.title}>Token: {token}</Text>

      <Link href="/(auth)/signup">Sign Up</Link>
      <Link href="/(auth)">Login</Link>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});