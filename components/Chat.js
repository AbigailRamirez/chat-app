import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Chat = ({ isConnected, db, route, navigation }) => {

    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    let unsubMessages;

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

    const loadCachedMessages = async () => {
      const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
      setMessages(JSON.parse(cachedMessages));
    };

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
  

 return (

   <View style={[styles.container, {backgroundColor: color}]}>
     <GiftedChat
      messages={messages}
      renderBubble={renderBubble}
      renderInputToolbar={renderInputToolbar}
      onSend={messages => onSend(messages)}
      user={{
        _id: userID
      }}
      name={{ name: name }}
    />
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