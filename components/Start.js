import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, } from 'react-native';

const Start = ({ navigation }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('');

    return (
      <ImageBackground
        source={require("../assets/BackgroundImage.png")}
        resizeMode='cover'
        style={styles.backgroundImagge}
      >
      
      <View style={styles.container}>

        <View style={styles.subContainer}>
          <Text style={styles.title}>Chat App!</Text>
        </View>

        <View style={styles.subContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Type your name'
          />

          <Text>Choose your Background Color</Text>
          <View style={styles.radioButtonContainer}>
            <TouchableOpacity
              style={[styles.radioButton, {backgroundColor: "#ff006e"}]}
              onPress={() => setColor("#ff006e")}
            >
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, {backgroundColor: "#8338ec"}]}
              onPress={() => setColor("#8338ec")}
            >
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, {backgroundColor: "#80ed99"}]}
              onPress={() => setColor("#80ed99")}
            >
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, {backgroundColor: "#363537"}]}
              onPress={() => setColor("#363537")}
            >
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Chat', { name: name, color: color})}
          >
            <Text>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    backgroundImagge: {
      flex:1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    subContainer: {
      flex:1,
      alignItems: "center",
      justifyContent: "center",
      width: "88%",
    },
    title: {
      fontWeight: "bold",
      fontSize: 45,
      fontWeight: 600,
      color: "#FFFFFF"
    },
    textInput: {
      width: "88%",
      padding: 15,
      borderWidth: 1,
      marginTop: 15,
      marginBottom: 15,
      fontSize: 16,
      color: "#757083",
    },
    
    radioButtonContainer: {
      width: "70%",
      flexDirection: "row",
      justifyContent: "space-around",
      margin:20,
    },
    radioButton: {
      backgroundColor: "black",
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    button: {
      alignItems: "center",
      backgroundColor: "#ECF7FE",
      padding: 10,
      
    },
    text: {
      fontSize: 16,
      fontWeight: 300,
      color: "#757083"
    }
    
  });

export default Start;