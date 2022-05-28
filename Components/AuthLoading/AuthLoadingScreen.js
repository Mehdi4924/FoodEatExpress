import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {colorOrange, colorWhite, phColor} from './../../../GlobalCons/colors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoadingScreen extends Component {
  componentDidMount = async () => {
    let data = await AsyncStorage.getItem('token');
    setTimeout(() => {
      if (data) {
        this.props.navigation.navigate('Resturents');
      } else {
        this.props.navigation.navigate('Auth');
      }
    }, 4000);
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
   
<View style={styles.logoContainer}>
    <Image
        style={{
            width: '100%',
            resizeMode: 'contain',
            position:'absolute',bottom:'30%',
            height: '55%'

        }}
        source={require('../../Assets/eat.png')}
    />
   <View
            style={{
              height: '8%',
              bottom: responsiveHeight(5),
              position: 'absolute',
              width: '100%',
              backgroundColor: '#dc4b3e',
            }}>
            <Animatable.Text
              animation={'fadeOutRight'}
              duration={3500}
              direction={'normal'}
              style={{
                color: colorWhite,
                fontWeight: 'bold',
                fontSize: responsiveFontSize(3),
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                top: responsiveHeight(1.6),
              }}>
              Order Food Online
            </Animatable.Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'white',
},
logoContainer: {
  flex:1,
    width: responsiveWidth(100),
    justifyContent: 'flex-end'
},
});
