 'use strict';
 import type {Node} from 'react';
 import {ImageBackground, StyleSheet, Text, useColorScheme} from 'react-native';
 import React from 'react';
 import Colors from './Colors';
//  import HermesBadge from './HermesBadge';
 
 const Header = (): Node => {
   const isDarkMode = useColorScheme() === 'dark';
   return (
     <ImageBackground
       accessibilityRole="image"
       source={require('./logo.png')}
       style={[
         styles.background,
         {
           backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
         },
       ]}
       imageStyle={styles.logo}>
       {/* <HermesBadge /> */}
       <Text
         style={[
           styles.text,
           {
             color: isDarkMode ? Colors.white : Colors.black,
           },
         ]}>
         Welcome to
         {'\n'}
         Accident Detection System
       </Text>
     </ImageBackground>
   );
 };
 
 const styles = StyleSheet.create({
   background: {
     paddingBottom: 40,
     paddingTop: 96,
     paddingHorizontal: 32,
   },
   logo: {
     opacity: 0.2,
     overflow: 'visible',
     resizeMode: 'cover',
     /*
      * These negative margins allow the image to be offset similarly across screen sizes and component sizes.
      *
      * The source logo.png image is 512x512px, so as such, these margins attempt to be relative to the
      * source image's size.
      */
     marginLeft: -128,
     marginBottom: -192,
   },
   text: {
     fontSize: 40,
     fontWeight: '700',
     textAlign: 'center',
   },
 });
 
 export default Header;
 