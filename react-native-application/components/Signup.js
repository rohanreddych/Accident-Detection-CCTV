import React, {useState} from 'react';
import Node from 'react';

import {
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');

const __isValidEmail = email => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

function SignupScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [empid, setEmpid] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setValid] = useState(true);

  const __doSignUp = () => {
    if (!email) {
      setError('Email required *');
      setValid(false);
      return;
    }
    if (!location) {
      setError('Please Enter Your Office Location Code');
      setValid(false);
      return;
    }
    if (!empid) {
      setError('Please enter your Employee ID');
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

    __doCreateUser(email, password);

    // console.log("token", token);

    // console.log(auth().currentUser  )

    // __addDetailsToDb(email, location, empid, token);
  };

  const __addDetailsToDb = async (email, location, empid, token) => {
    usersCollection
      .add({
        email: email,
        empID: empid,
        locationID: location,
        uid: token,
      })
      .then(() => {
        console.log('User! added');
      })
      .catch(error => {
        console.error(error.code);
      });
  };

  const __doCreateUser = async (email, password) => {

    var uid;

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        if (data.user) {
        // console.log('User ID :- ', data.user.uid);
        // console.log("loc",location);
        Alert.alert('Success ✅', 'Account created successfully');
        navigation.navigate("Login");
        // return data.user.uid;
        __addDetailsToDb(email, location, empid, data.user.uid);
        }
      })
      .catch(error => {
        console.log(error);
      });

    //   let response = await auth().createUserWithEmailAndPassword(
    //     email,
    //     password,
    //   );
    //   if (response && response.user) {
    //     Alert.alert('Success ✅', 'Account created successfully');
    //     navigation.navigate("Login");
    //     return response.user;
    //   }
    // } catch (e) {
    //   console.error(e.message);
    // }
  };

  return (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Signup</Text>
      <View>
        <TextInput
          placeholder="Employee ID"
          onChangeText={text => {
            setError;
            setEmpid(text);
          }}
          error={isValid}
        />
        <TextInput
          placeholder="email"
          onChangeText={text => {
            setError;
            setEmail(text);
          }}
          error={isValid}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="password"
          error={isValid}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          placeholder="Location Code"
          onChangeText={text => {
            setError;
            setLocation(text);
          }}
          error={isValid}
        />
        <Button title="Signup" onPress={__doSignUp} />
        {error ? (
          <View style={styles.errorLabelContainerStyle}>
            <Text style={styles.errorTextStyle}>{error}</Text>
          </View>
        ) : null}
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

export default SignupScreen;
