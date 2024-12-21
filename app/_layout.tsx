import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import store from "./(redux)/store";
import { Provider, useDispatch } from "react-redux";
import { loadUser } from "./(redux)/authSlice";
import { PaperProvider } from 'react-native-paper'; // Import PaperProvider
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    dispatch(loadUser());
  }, [loaded, dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Stack
            screenOptions={{
              headerShown: false, 
            }}
          >
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="auth/registar" options={{ title: "Register" }} />
            <Stack.Screen name="auth/login" options={{ title: "Login" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </Provider>
  );
}

export default App;
