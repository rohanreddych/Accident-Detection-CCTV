import React, {useState} from 'react';
import Node from 'react';

const util = require('util');

import {
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  Linking,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app'
const usersCollection = firestore().collection('users');

const __isValidEmail = email => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

function LoginScreen({navigation}) {
  async function onAppBootstrap() {
    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();
    // console.log(token);
    // console.log("rphan 3453456 tosf");
    var em = auth().currentUser.email;
    usersCollection
      .where('email', '==', em)
      .get()
      .then(dat => {
        // console.log(dat.docs["_"]);
        // console.log(dat);
        docId = dat.docs[0]["ref"]["_documentPath"]["_parts"][1]
        
        // console.log(uid);
        usersCollection.doc(docId).update({deviceToken: token});
        // console.log(util.inspect(dat, false, null, true /* enable colors */))
        // console.log(util.inspect(dat.docs[0]["ref"], false, null, true))
        // console.log(dat.docs[0]["ref"]["_documentPath"])
        
      }).catch(e=>console.log(e));
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isValid, setValid] = useState(true);

  const _login = () => {
    if (!email) {
      setError('Email required *');
      setValid(false);
      return;
    } else if (!password && password.trim() && password.length > 6) {
      setError('Weak password, minimum 5 chars');
      setValid(false);
      return;
    } else if (!__isValidEmail(email)) {
      setError('Invalid Email');
      setValid(false);
      return;
    }
    let signInRequestData = {
      email,
      password,
    };

    __doSingIn(email, password);
  };

  const __doSingIn = async (email, password) => {
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        Alert.alert('Success ✅', 'Logged successfully');
        navigation.navigate('Dash');
        onAppBootstrap();
        
        // firebase.messaging().o
        //TODO
                

      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Login</Text>
      <View>
        <TextInput
          placeholder="email"
          onChangeText={text => {
            setError;
            setEmail(text);
          }}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="password"
          onChangeText={text => setPassword(text)}
        />
        <Button title="Login" onPress={_login} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
  },
  buttonStyle: {
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});

export default LoginScreen;
