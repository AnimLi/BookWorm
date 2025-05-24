import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    checkAuth();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) router.replace("/(auth)");
    else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");
  }, [user, token, segments, isMounted]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot/> {/* 确保 Slot 组件正确渲染 */}
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}