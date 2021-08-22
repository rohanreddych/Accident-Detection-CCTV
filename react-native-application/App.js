/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  Linking
} from 'react-native';

import Header from './components/Header';
import LoginScreen from './components/Login';
import SignupScreen from './components/Signup';
import DashScreen from './components/Home';

import messaging, { firebase } from '@react-native-firebase/messaging';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import {
  Colors,
  DebugInstructions,
  // Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Separator = () => <View style={styles.separator} />;

const Stack = createStackNavigator();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
})


messaging().onMessage(async (remoteMessage, navigation) => {
  Alert.alert('An accident has been detected!', JSON.stringify(remoteMessage['data']));
  // navigation.navigate("Past");
});



const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

function HomeScreen({ navigation }){
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return (
    
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Separator />
          <Section title="Emergency Responders please Login or Signup">
          </Section>
            <Separator />
            <Separator />
          <View style={styles.fixToText}>
            <Button
              style={styles.buttonStyle}
              title="Login"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
          <Separator />
          <Separator />
          <View style={styles.fixToText}>
            <Button
              title="Signup"
              style={styles.buttonStyle}
              onPress={() => navigation.navigate("Signup") }
            />

          </View>
            <Separator />
            <Separator />
          <View>
          <Text>
            For Help Visit 
          </Text>
          <Text style={{color: 'blue'}} onPress={() => Linking.openURL('http://google.com')}> Documentation </Text>

          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
    
  );
}

const App: () => Node = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dash" component={DashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonStyle: {
    padding: 10,
    alignSelf: "center"
  },
  fixToText: {
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
});

export default App;
