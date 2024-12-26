import React from 'react';
import { View, Text, StatusBar as RNStatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './(redux)/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Main Layout</Text>
      </View>
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
