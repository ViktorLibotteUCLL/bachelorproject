import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { use, useCallback, useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "./Splashscreen";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// SplashScreen.preventAutoHideAsync();

// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2750);
  }, []);

  useEffect(() => {
    if (loaded) {
      //SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {loading ? (
        <SplashScreen />
      ) : (
        <>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="translationScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="conversionScreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="historyScreen"
              options={{ headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
        </>
      )}
    </ThemeProvider>
  );
}
