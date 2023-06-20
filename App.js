import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import {
  getFirestore,
} from "firebase/firestore";

const Stack = createNativeStackNavigator();

const App = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyC1wTiSVU4Es3kruL24XDjPaRw6qzLRe-g",
    authDomain: "chat-app-173d9.firebaseapp.com",
    projectId: "chat-app-173d9",
    storageBucket: "chat-app-173d9.appspot.com",
    messagingSenderId: "209819662129",
    appId: "1:209819662129:web:a9a06a1d21b5d5cd9d6210"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        >
          {props => <Chat db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});

export default App;

