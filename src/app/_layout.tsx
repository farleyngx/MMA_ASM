import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../../global.css";

// Disable strict mode to suppress Reanimated render-phase write warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen immediately when loaded
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="search" />
        <Stack.Screen name="detail" />
      </Stack>
    </GestureHandlerRootView>
  );
}
