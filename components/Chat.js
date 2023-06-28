import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  // onSnapshot implements real time communication by acting as a listener
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';




const Chat = ({ isConnected, db, route, navigation, storage }) => {

    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);
    
    // must declare outside of the useEffect function so that the reference to old onSnapShot () is not lost
    let unsubMessages;
    
    // if there's a connection: fetch messages from firebase, if not: load from Async storage (loadCachedMessages)
    useEffect(() => {
      navigation.setOptions({ title: name });

      if (isConnected === true) {
        if (unsubMessages) unsubMessages();
        unsubMessages = null;
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        unsubMessages = onSnapshot(q, async (docs) => {
          let newMessages = [];
          docs.forEach(doc => {
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis())
            });
          });

          cacheMessages(newMessages);
          setMessages(newMessages);

        });

      } else loadCachedMessages();

      return () => {
        if (unsubMessages) unsubMessages();
      }


    }, [isConnected, ]);

    // stores messages to localStorage (asyncStorage)
    const loadCachedMessages = async () => {
      const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(cachedMessages));
    };

    // same logic as when using localStorage, and "try-catch" is an error handler
    const cacheMessages = async (messagesToCache) => {
      try {
        await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
      } catch (error) {
        console.log(error.message);
      }
    };


  // Function that adds a new message to the "messages" collection in Firestore when the user sends a message
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  const renderCustomActions = (props) => {
    return <CustomActions 
      userID={userID} 
      storage={storage}
      {...props}
      />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
        return (
            <MapView
                style={{
                    width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3,
                }}
                region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        );
    }
    return null;
  };

  
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }
  
  // all props provided by GiftedChat library
  // renderActions = plus/circle button to use images and location (CustomActions.js)
  // renderCustomView = renders the map
 return (

   <View style={[styles.container, {backgroundColor: color}]}>
     <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      renderActions={renderCustomActions}
      renderCustomView={renderCustomView}
      onSend={messages => onSend(messages)}
      user={{
        _id: userID,
        name: name
      }}
    />
    {/* fix for blocked view on android */}
    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
   </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  }
  
});

export default Chat;