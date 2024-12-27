import React from 'react';
import { View, Text, StatusBar as RNStatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './(redux)/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import queryClient from "./(services)/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Stack
            screenOptions={{
              headerShown: false, 
            }}
          >
            <Stack.Screen name="index" options={{ title: "Loading" }} />
            <Stack.Screen name="onboarding" options={{ title: "Onboarding" }} />
            
            <Stack.Screen name="auth/login" options={{ title: "Login" }} />
            <Stack.Screen name="auth/registar" options={{ title: "Register" }} />
          </Stack>
        </PaperProvider>
      </QueryClientProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <RNStatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
        translucent={true}
      />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <RootLayout />
    </Provider>
  );
}

export default App;
