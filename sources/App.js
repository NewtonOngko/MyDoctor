import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {LogBox, SafeAreaView} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import store from './redux/store';
import Router from './Router';

const MainApp = () => {
  LogBox.ignoreAllLogs(true);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
        <FlashMessage position="top" />
      </SafeAreaView>
    </>
  );
};
const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
