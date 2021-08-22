import React, {useState, Component, useEffect} from 'react';

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

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function SingleAccident(props) {
  var d = props.data;

  try {
    var location = d['location'];
  } catch (c) {
    console.log('Location not found');
    location = 'LOCATION';
  }

  try {
    var isres = d["isResolved"]
  } catch (error) {
    console.log("isresolved not dou");
    isres = "TRUE"
  }

  try {
    var res = d["resolvedBy"]
  } catch (error) {
    console.log("resolvedBy");
    res = "EMP101"
  }

  try {
    var time = d["time"]["seconds"]
  } catch (error) {
    console.log("Time")
    time = "124023"
  }

  return (
    <View>
      <Text>{location}</Text>
      <Text>{isres}</Text>
      <Text>{res}</Text>
      <Text>{time}</Text>
    </View>
  );
}

// function Accident() {
//   const user = auth().currentUser;
//   if (user) {
//     var uuid = user.uid;
//     firestore()
//       .collection('users')
//       .where('uid', '==', uuid)
//       .get()
//       .then(data => {
//         var locationID = data.docs[0]['_data']['locationID'];
//         console.log("inside first if");
//         firestore()
//           .collection('accidents')
//           .where('location', '==', locationID)
//           .get()
//           .then(data => {
//             if (data.docs.length > 0) {
//                 console.log("inside length if");
//               return data.docs.map((item)=>{
//                 console.log(item);
//                 return (
//                   <Text key={item} >item</Text>
//                 )
//               })

//             }
//     else {
//               return (<Text>No Accidents in your location.</Text>);
//             }
//           });
//       });
//   }
//   else{
//     return <Text>CONSOLE</Text>;
//   }
// }

export default class Accident extends React.Component {
  state = {
    acs: [],
  };

  componentDidMount() {
    const user = auth().currentUser;
    if (user) {
      var uuid = user.uid;
      firestore()
        .collection('users')
        .where('uid', '==', uuid)
        .get()
        .then(data => {
          var locationID = data.docs[0]['_data']['locationID'];
          console.log('inside first if');
          firestore()
            .collection('accidents')
            .where('location', '==', locationID)
            .get()
            .then(dat => {
              if (dat.docs.length > 0) {
                this.setState({acs: dat.docs});
                // console.log(dat.docs);
                // for (let i = 0; i< dat.docs.length;i++){
                //   console.log(dat.docs[i]["_data"])
                // }
              }
            });
        });
    }
  }

  render() {
    const {acs} = this.state;
    if (acs.length == 0) {
      return (
        <Text key={Date.now()}>No Accidents In Your Area in the past.</Text>
      );
    } else {
      return acs.map(i => {
        i = i['_data'];

        // console.log(i);

        return <SingleAccident key={Date.now()} data={i}></SingleAccident>;
      });
      // return <Text key={Date.now()}>ACCS</Text>
    }
  }
}

// export default Accident;
