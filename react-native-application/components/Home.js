import React, {useState, Component} from 'react';

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

import Ionicons from 'react-native-vector-icons/Ionicons';

import {firestore} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Accident from './Accident';

const Separator = () => <View style={styles.separator} />;

const Tab = createBottomTabNavigator();

function Profile({navigation}) {
  
  const user = auth().currentUser;

  const logout = () => {
    auth().signOut().then(() => console.log("user signed out"));
    navigation.navigate("Home")
  }

  let email = user.email;
  let uid = user.uid;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>User Profile</Text>
      <Text>{email}</Text>
      <Separator></Separator>
      <Separator></Separator>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Button title="Logout" style={ styles.buttonStyle } onPress={logout} />
    </View>
  );
}


function CurrentAlert() {
  const getData = () => {
    return 3;
  };

  return (
    <View>
      <Text>Current Accident</Text>
    </View>
  );
}


function DashScreen({navigation}) {
  return (
    // <NavigationContainer independent={true}>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Profile') {
            iconName = focused
                ? 'person-outline'
                : 'person-circle-outline';
            } else if (route.name === 'Past') {
              iconName = focused ? 'notifications-outline' : 'notifications-circle-outline';
            } else if (route.name === 'Current') {
              iconName = 'warning-outline'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Current" component={CurrentAlert} />
        <Tab.Screen name="Past" component={Accident} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    // </NavigationContainer>
    // <View>
    //   <Text>Roahn</Text>
    // </View>
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
    justifyContent: 'space-between',
    alignItems: "center",
    alignSelf: 'center'
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
  },
});

export default DashScreen;
