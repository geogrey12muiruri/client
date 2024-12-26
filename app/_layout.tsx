import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import store from './(redux)/store';

function RootLayout() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Main Layout</Text>
    </View>
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
