import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ImageBackground,
  Image,
  Platform,
  ToastAndroid,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import {
  colorWhite,
  colorBlack,
  sfRegular,
  phColor,
  blue,
} from './../../../GlobalCons/colors';
//import ModalDropdown from 'react-native-modal-dropdown';
import { Divider } from '../CustomComponents/CustomSafeAreaView';
import { color } from 'react-native-reanimated';
import { SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import CustomModal from '../CustomComponents/CustomModal';
import NetInfo from "@react-native-community/netinfo";
import { myurl } from '../../../GlobalCons/myurl';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { UrlTile } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import axios from 'axios'
import messaging from '@react-native-firebase/messaging';
import moment from 'moment'
import * as RNLocalize from "react-native-localize";


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.input1 = React.createRef();
    this.state = {
       mycurrentposition: '',
      email: '',
      password: '',
      loading: false,
      skloading:false,
      fbloading: false,
      googleloading: false,
      appleloading: false,
      lat: 'Europe/London',
      errormodalvisible: false,
      errormodalmessage: '',
      forgottenpassword: false,
      forgottenpasswordloading: false,
      phone: 0,
      appleToken:'',
      codeavailable: false,
      code: 0,
      resetpassword: false,
      jumptonextmodal: false,
      newpassword: '',
      confirmpassword: '',
      passwordresetcomplete: false,
      passwordforgottenresponse: {},
      notToken:'',
      timezone:'',
    };
  }
  onAppleButtonPress = async()=> {
   
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
   // console.log('this is the function222', appleAuthRequestResponse);
    

    var myHeaders = new Headers();
    // myHeaders.append('Authorization', `Bearer ${appleAuthRequestResponse.identityToken}`);
    var formdata = new FormData();
    formdata.append('email', appleAuthRequestResponse.email);
    formdata.append('social_id',appleAuthRequestResponse.identityToken);
    formdata.append('name', appleAuthRequestResponse.fullName.familyName+appleAuthRequestResponse.fullName.givenName);
    formdata.append('login_type', "apple");
    formdata.append('timezone', this.state.timezone);
    formdata.append('notificationToken', this.state.notToken);


    //console.log("Check the formdata for apple auth backend",formdata);
    var requestOptions = {
      method: 'POST',
      body:formdata,
      headers: myHeaders,
      redirect: 'follow',

    };
    //'https://pizzakebab.ranglerztech.website/api/user-social-login'
    fetch(
      `${myurl}api/user-social-login`, requestOptions,
      ).then(response => response.text()).then( async result => {
        let data = JSON.parse(result);
        if (data.successData) {
          await AsyncStorage.setItem('token', data.successData.accessToken);
    await AsyncStorage.setItem('Login', "true");
    await AsyncStorage.setItem('UserData',JSON.stringify(data.successData));
          if(data.successData.address == null ){

            this.props.navigation.navigate('DeliveryAddress',{item:1 });
        }else{
             
             this.props.navigation.navigate("Resturents")
             
        }
      }
        // console.log("Check appke auth sucess responce",JSON.parse(result));
        //  this.props.navigation.navigate('Resturents')

               //    if(data.successData.address == null ){
              //     this.props.navigation.navigate('DeliveryAddress',{item:1 });
             // }else{
            //      this.props.navigation.navigate("Resturents")  
           // }
          //
         //this.props.navigation.navigate('DeliveryAddress', { item: 1 })
        })
        .catch(error => {
          this.setState({ errormodalmessage: 'Could not Login please try again' })
       //   console.log("Check error for the apple auth",error)
          this.setState({ errormodalvisible: true })
          //console.log('error=>', error); 
          this.setState({ appleloading: false });
        });
  
//     fetch('https://appleid.apple.com/auth/keys', {
//   method: 'GET',
//   headers: {
//     'Authorization':appleAuthRequestResponse.identityToken,
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   }.then((res)=>{
//       console.log("CHeck APpke GEt URL REsponce",res)
//   })
//   .catch((err)=>{
//     console.log("CHeck APpke GEt URL err",err)
// })
//});
    // get current authentication state for user
    // /!\ This method must be tested on -- -- a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
    
  }  
  
  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getFcmToken()
    }
  }
  getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
     console.log(fcmToken);
     this.setState({ notToken: fcmToken })
     console.log("Your Firebase Token is:", fcmToken);
    } else {
     console.log("Failed", "No token received");
    }
  }
            
  componentDidMount = async () => {
    this.requestUserPermission()
    // const timeZone = await TimeZone.getTimeZone().then(zone => zone);
    // console.log({ timeZone });
    // console.log('timezone1',timeZone)
    // this.setState({ timezone: timeZone });
    this.setState({ timezone: RNLocalize.getTimeZone()})
    FontAwesome.loadFont()

    this.input1.current.setNativeProps({ autoCapitalize: 'none' });
    Geocoder.init('AIzaSyDYDxMDR6_NTCfynYvm6V1YvhiNbHt6uV4');
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.')
      }
      return appleAuth.onCredentialRevoked(async () => {
        console.warn('If this function executes, User Credentials have been Revoked');
      });
    });
    Geolocation.getCurrentPosition(
      (position) => {
         //console.log("check your current position",position)
          //console.log('this is current lati',position.coords.latitude);
         // console.log('this is current long',position.coords.longitude);
          this.setState({mycurrentposition: position.coords})
       // console.log('this issssssssssss :'   , this.state.mycurrentposition)

          //this.setState({mycurrentposition: position.coords.latitude});
      },
      (error) => {
          // See error code charts below.
          //console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
    // console.log('this is current lat',JSON.parse(position)),
    // console.log('this is current long',position.longitude),
    //const timeZone = await TimeZone.getTimeZone().then(zone => zone);
    //this.setState({ lat: timeZone });

    GoogleSignin.configure({
      // scopes: [''], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '611119042734-5p0a0ticpkiqb7vvat9d2072clv3iifn.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    var d = new Date();
    // console.log(d.getTimezoneOffset())
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
    });

  }
  signInGoogle = async () => {
    try {
      this.setState({ googleloading: true });
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true, });
      this.setState({ isLoading: true });
      const userInfo = await GoogleSignin.signIn();
      let info = userInfo.user;
      //alert(JSON.stringify(userInfo))
      // console.log('googgle User Data', info)


      var formdata = new FormData();
      formdata.append("email", info.email);
      formdata.append("social_id", info.id);
      formdata.append("login_type", "google");
      formdata.append("name", info.name);
      formdata.append("image", info.photo);
      formdata.append("phone", "N/A");
      formdata.append("timezone",this.state.timezone);
      formdata.append('notificationToken', this.state.notToken);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      //"https://pizzakebab.ranglerztech.website/api/user-social-login"
      fetch(`${myurl}/api/user-social-login`, requestOptions)
        .then(response => response.text())
        .then(async result => {
          let data = JSON.parse(result);

          if (data.successData) {
            
            await AsyncStorage.setItem('token', data.successData.accessToken);
    await AsyncStorage.setItem('Login', "true");
    await AsyncStorage.setItem('UserData',JSON.stringify(data.successData));
            if(data.successData.address == null ){

              this.props.navigation.navigate('DeliveryAddress',{item:1 });
          }else{
               
               this.props.navigation.navigate("Resturents")
               
          }
            //this.props.navigation.navigate('DeliveryAddress', { item: 1 })
            // console.log(result, 'test');
            this.setState({ googleloading: false });
          } else {
            this.setState({ loading: false });
            this.setState({ errormodalmessage: data.message })
            this.setState({ errormodalvisible: true })
            alert(data.message);
            // console.log(result, 'test');
            this.setState({ googleloading: false });
          }
        })
        .catch(error => {
          this.setState({ errormodalmessage: 'Could not Login please try again' })
          this.setState({ errormodalvisible: true })
          //console.log('error=>', error); 
          this.setState({ googleloading: false });
        });
    } catch (error) {
      //console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //console.log('User Cancelled the Login Flow');
        this.setState({ googleloading: false });
      } else if (error.code === statusCodes.IN_PROGRESS) {
       // console.log('Signing In');
        this.setState({ loading: false });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState({ googleloading: false });
        //console.log('Play Services Not Available or Outdated');
        this.setState({ errormodalmessage: 'Play Services Not Available or Outdated' })
        this.setState({ errormodalvisible: true })
      } else {
        //console.log('Some Other Error Happened', error.message);
        this.setState({ googleloading: false });
        // this._getCurrentUserInfo()
      }
    }
  };
  _responseInfoCallback = (error, result) => {
    console.log("in info function",result)
    console.log("in info err",error)
    
    if (error) {
    alert('Error fetching data: ' + error.toString());
    } else {
    this.setState({ fbloading: true });
    // console.log('result',result)
    var myHeaders = new Headers();
    var formdata = new FormData();
    formdata.append('email', result.email);
    formdata.append('social_id',result.id);
    formdata.append('name', result.name);
    formdata.append('login_type', "facebook");
    formdata.append('timezone',this.state.timezone);
    formdata.append('notificationToken', this.state.notToken);
    console.log("Check user form data for social login",formdata)
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/user-social-login'
    fetch(
    `${myurl}/api/user-social-login`,
    requestOptions,
    )
    .then(response => response.text())
    .then(async result => {
    let data = JSON.parse(result);
    if (data.successData) {
    console.log("responce FBBBBBBBBBBBBBBBBB", data.successData);
    await AsyncStorage.setItem('token', data.successData.accessToken);
    await AsyncStorage.setItem('Login', "true");
    await AsyncStorage.setItem('UserData',JSON.stringify(data.successData));

    if(data.successData.address == null ){
    this.props.navigation.navigate('DeliveryAddress',{item:1});
    }else{
    
    this.props.navigation.navigate("Resturents")
    
    }
    // console.log(result, 'test');
    this.setState({ fbloading: false });
    } else {
    this.setState({ fbloading: false });
    this.setState({ errormodalmessage: data.message })
    this.setState({ errormodalvisible: true })
    //alert(data.message);
    // console.log(result, 'test');
    }
    })
    .catch(error => {
    this.setState({ fbloading: false });
    this.setState({ loading: false });
    this.setState({ loading: false });
    this.setState({ errormodalmessage: 'Could not Login please try again' })
    this.setState({ errormodalvisible: true })
    //alert('error', error);
    });
    }
    };

  LoginWithFb = async () => {
    try {
      let result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        alert('Login was Cancelled');
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          this.callback(data.accessToken);
          if (!result.isCancelled) {
            // this.props.navigation.navigate('UserInfo')
          }
        });
        // console.log(result);
        // alert("login was successful with permission :"
        //     + result.grantedPermissions.toString()
        // )
      }
    } catch (error) {
      this.setState({ fbloading: false });
      this.setState({ loading: false });
      this.setState({ errormodalmessage: 'Could not Login please try again' })
      this.setState({ errormodalvisible: true })
      //alert('login field with error :' + error);
    }
  };

  callback = token => {
    // console.log(
    // token,
    // new GraphRequestManager().addRequest(infoRequest).start(),
    // );
    console.log('dsvba datata res from social login ====>>>33',token)
    
    const infoRequest = new GraphRequest(
    '/me?fields=name,picture,email',
    {
    accessToken: token,
    prameters: {
    fields: {
    string: 'email , name,first_name, middle_name, last_name',
    },
    },
    },
    this._responseInfoCallback,
    console.log('dsvba datata res from social login ====>>>44',infoRequest)
    
    );
    
    
    new GraphRequestManager().addRequest(infoRequest).start();
    }


  Skipfunction = ()=>{
    Geocoder.init('AIzaSyDYDxMDR6_NTCfynYvm6V1YvhiNbHt6uV4');
    // this.props.navigation.navigate('Resturents')


    Geolocation.getCurrentPosition(
         (position) => {
             this.setState({mycurrentposition: position.coords})
              const  locations = new FormData();
              locations.append('latitude',this.state.mycurrentposition.latitude);
              locations.append('longitude', this.state.mycurrentposition.longitude);
              console.log('my locations Formdata',locations);
       axios.post('https://app.foodsafety.uk.com/api/get-branches-ios',locations)
     .then(async (res) => {
          console.log("Get Res Sucess",res)
          await AsyncStorage.setItem("getResturant",JSON.stringify(res.data.successData));
          await AsyncStorage.setItem('token', 'null');
          await AsyncStorage.setItem('Login', "false");
          await AsyncStorage.setItem('UserData', 'null');
          this.props.navigation.navigate('Resturents',{ResturentData:res.data.successData})
     })
     .catch(error => {
          console.log("Get Sucess Error",error)
     })
         },
         (error) => {
             console.log(error.code, error.message);
         },
         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
       )

   }

  login() {
    if (this.state.email == '' || this.state.password == '') {
      ToastAndroid.show('Please enter all the fields', ToastAndroid.LONG);
      this.setState({ loading: false });
    } else {
      var myHeaders = new Headers();
      var formdata = new FormData();
      formdata.append('email', this.state.email);
      formdata.append('password', this.state.password);
      formdata.append('timezone', this.state.timezone);
      formdata.append('notificationToken', this.state.notToken);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      //'https://pizzakebab.ranglerztech.website/api/user-login'
      fetch(
        `${myurl}/api/user-login`,
        requestOptions,
      )
        .then(response => response.text())
        .then(async result => {
          let data = JSON.parse(result);
          
          if (data.successData) {
           await AsyncStorage.setItem("getResturant",'null');
            //console.log(data.successData);
            this.setState({ loading: false });
            await AsyncStorage.setItem('token', data.successData.accessToken);
            await AsyncStorage.setItem('Login', "true");
             await AsyncStorage.setItem('UserData',JSON.stringify(data.successData));
            this.props.navigation.navigate('Resturents');
            // console.log(result, 'test');
          } else {
            this.setState({ loading: false });
            this.setState({ errormodalmessage: data.message })
            this.setState({ errormodalvisible: true })
            //alert(data.message);
            // console.log(result, 'test');
          }
        })
        .catch(error => {
          this.setState({ loading: false });
          this.setState({ errormodalmessage: 'Could not Signin' })
          this.setState({ errormodalvisible: true })
          //alert('error', JSON.stringify(error));
        });
    }
  }

  render() {
    // console.log(this.state.email, this.state.password, 'checking');

    return (
      <SafeAreaView
        forceInset={{ top: 'never', bottom: 'never' }}
        style={styles.container}>
        <ScrollView style={{flex:1}}>
          {console.log("TImezone check ======= >>>>>",this.state.timezone)}
          <StatusBar
            backgroundColor="transparent"
            barStyle={'light-content'}
            translucent={true}
          />
          <CustomModal isVisible={this.state.errormodalvisible}>

            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {/* <Divider height={responsiveHeight(15)} /> */}
              <View style={styles.modalMainContainer}>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={require('../../Assets/Group9564.png')}
                    style={styles.modalImageStyle}
                  />
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={{
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: 'bold',
                    color: '#e12c2c',
                    textAlign: 'center',
                    color: blue
                  }}>
                    {this.state.errormodalmessage}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: blue, height: '10%', width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    this.setState({ errormodalvisible: false })
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    OK
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </CustomModal>
          <CustomModal isVisible={this.state.forgottenpassword}>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {/* <Divider height={responsiveHeight(15)} /> */}
              <View style={styles.modalMainContainer}>
                <View style={styles.modalTextContainer}>
                  <Text style={{
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: 'bold',
                    color: '#e12c2c',
                    textAlign: 'center',
                    color: blue
                  }}>
                    {this.state.codeavailable ? (
                      'We sent you a 4-digit code your number via sms.Please enter your code!'
                    ) : (
                        'Please enter your phone number'
                      )
                    }
                  </Text>
                </View>
                {this.state.codeavailable ? (
                  <View
                    style={{
                      height: responsiveHeight(9),
                      width: '40%',
                      borderWidth: 1,
                      borderColor: 'black',
                      justifyContent: 'center',
                      alignItems: 'center',
                      //marginHorizontal: responsiveHeight(1),
                      backgroundColor: 'rgba(214,207,199,0.1)',
                      borderRadius: 5,
                      marginTop: responsiveHeight(1),
                    }}>
                    <TextInput
                      placeholder="Code"
                      style={{ width: '100%', textAlign: "center", paddingHorizontal: responsiveHeight(2) }}
                      placeholderTextColor={'#000'}
                      keyboardType="decimal-pad"
                      maxLength={4}
                      value={this.state.code}
                      onChangeText={text => {
                        this.setState({ code: text })
                      }}
                    />

                  </View>
                ) : (
                    <View
                      style={{
                        height: responsiveHeight(9),
                        width: '90%',
                        borderWidth: 1,
                        borderColor: 'black',
                        justifyContent: 'center',
                        alignItems: 'center',
                        //marginHorizontal: responsiveHeight(1),
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                        marginTop: responsiveHeight(1),
                      }}>
                      <TextInput
                        placeholder="Phone number"
                        style={{ width: '100%', textAlign: "center", paddingHorizontal: responsiveHeight(2) }}
                        placeholderTextColor={'#000'}
                        keyboardType="decimal-pad"
                        maxLength={15}
                        value={this.state.phone}
                        onChangeText={text => {
                          this.setState({ phone: text })
                        }}
                      />

                    </View>
                  )

                }
                <TouchableOpacity
                  style={{ backgroundColor: blue, height: '10%', width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={async () => {
                    if (this.state.jumptonextmodal == false) {
                      if (this.state.phone == 0) {
                        ToastAndroid.show('Please add the phone number', ToastAndroid.SHORT)
                      } else {
                        this.setState({ forgottenpasswordloading: true })
                        var myHeaders = new Headers();
                        var formdata = new FormData();
                        formdata.append('phone', this.state.phone);
                        var requestOptions = {
                          method: 'POST',
                          headers: myHeaders,
                          body: formdata,
                          redirect: 'follow',
                        };
                        //'https://pizzakebab.ranglerztech.website/api/forget-password'
                        fetch(`${myurl}/api/forget-password`, requestOptions)
                          .then(response => response.text())
                          .then(async (result) => {
                            let data = JSON.parse(result);
                            if (data.status == 200) {
                             // console.log(data)
                              this.setState({ passwordforgottenresponse: data })
                              this.setState({ forgottenpasswordloading: false })
                              this.setState({ codeavailable: true })
                              this.setState({ jumptonextmodal: true })
                              //alert(JSON.stringify(this.state.passwordforgottenresponse))
                            } else {
                              this.setState({ forgottenpasswordloading: false })
                              this.setState({ forgottenpassword: false })
                              this.setState({ errormodalvisible: true })
                              this.setState({ errormodalmessage: data.message })
                              //alert(data)
                            }
                          }).catch((error) => {
                            this.setState({ forgottenpasswordloading: false })
                            this.setState({ forgottenpassword: false })
                            this.setState({ errormodalvisible: true })
                            this.setState({ errormodalmessage: 'Error Please try again' })
                          })

                        /*setTimeout(() => {
                          //this.setState({ forgottenpassword: false })
                          this.setState({ forgottenpasswordloading: false })
                          this.setState({ codeavailable: true })
                          this.setState({ jumptonextmodal: true })
                        }, 3000)*/
                      }
                    } else {
                      this.setState({ forgottenpasswordloading: true })
                      if (this.state.passwordforgottenresponse.successData == this.state.code) {
                        ToastAndroid.show('Success', ToastAndroid.SHORT)
                        this.setState({ jumptonextmodal: false })
                        this.setState({ codeavailable: false })
                        this.setState({ forgottenpasswordloading: false })
                        this.setState({ forgottenpassword: false })
                        this.setState({ resetpassword: true })
                      } else {
                        ToastAndroid.show('Code is incorrect! Please try again', ToastAndroid.LONG)
                        this.setState({ forgottenpasswordloading: false })
                      }
                      /*setTimeout(() => {
                        this.setState({ jumptonextmodal: false })
                        this.setState({ codeavailable: false })
                        this.setState({ forgottenpasswordloading: false })
                        this.setState({ forgottenpassword: false })
                        this.setState({ resetpassword: true })
                      }, 3000)*/
                    }


                  }}
                >
                  {this.state.forgottenpasswordloading ? (
                    <ActivityIndicator size={'small'} color="#FFF" />
                  ) : (
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        OK
                      </Text>
                    )
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: 'red', height: '10%', width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    this.setState({ forgottenpassword: false })
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    Cancel
                </Text>
                </TouchableOpacity>

              </View>
            </View>
          </CustomModal>
          <CustomModal isVisible={this.state.resetpassword}>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {/* <Divider height={responsiveHeight(15)} /> */}
              <View style={styles.modalMainContainer}>
                <View style={styles.modalTextContainer}>
                  {this.state.passwordresetcomplete != true ? (
                    <Text style={{
                      fontSize: responsiveFontSize(2.5),
                      fontWeight: 'bold',
                      color: '#e12c2c',
                      textAlign: 'center',
                      color: blue
                    }}>
                      Enter you new password
                    </Text>
                  ) : (
                      <Text style={{
                        fontSize: responsiveFontSize(2.5),
                        fontWeight: 'bold',
                        color: '#e12c2c',
                        textAlign: 'center',
                        color: blue
                      }}>
                        Reset Successfull
                      </Text>
                    )
                  }
                </View>
                {
                  this.state.passwordresetcomplete ? (
                    <View style={styles.modalImageContainer}>
                      <Image
                        source={require('../../Assets/Group9562.png')}
                        style={styles.modalImageStyle}
                      />
                    </View>
                  ) : (
                      <View style={{ height: '50%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View
                          style={{
                            height: responsiveHeight(9),
                            width: '90%',
                            borderWidth: 1,
                            borderColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center',
                            //marginHorizontal: responsiveHeight(1),
                            backgroundColor: 'rgba(214,207,199,0.1)',
                            borderRadius: 5,
                            marginTop: responsiveHeight(1),
                          }}>
                          <TextInput
                            placeholder="New password"
                            style={{ width: '100%', textAlign: "center", paddingHorizontal: responsiveHeight(2) }}
                            placeholderTextColor={'#000'}
                            keyboardType='default'
                            secureTextEntry={true}
                            maxLength={10}
                            value={this.state.newpassword}
                            onChangeText={text => {
                              this.setState({ newpassword: text })
                            }}
                          />

                        </View>
                        <View
                          style={{
                            height: responsiveHeight(9),
                            width: '90%',
                            borderWidth: 1,
                            borderColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center',
                            //marginHorizontal: responsiveHeight(1),
                            backgroundColor: 'rgba(214,207,199,0.1)',
                            borderRadius: 5,
                            marginTop: responsiveHeight(1),
                          }}>
                          <TextInput
                            placeholder="Confirm password"
                            style={{ width: '100%', textAlign: "center", paddingHorizontal: responsiveHeight(2) }}
                            placeholderTextColor={'#000'}
                            keyboardType='default'
                            secureTextEntry={true}
                            maxLength={10}
                            value={this.state.confirmpassword}
                            onChangeText={text => {
                              this.setState({ confirmpassword: text })
                            }}
                          />

                        </View>
                      </View>
                    )
                }

                <TouchableOpacity
                  style={{ backgroundColor: blue, height: '10%', width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={async () => {
                    if (this.state.passwordresetcomplete != true) {
                      if (this.state.newpassword != this.state.confirmpassword) {
                        ToastAndroid.show('Passwords dont match! Please try again', ToastAndroid.SHORT)
                      } else {
                        this.setState({ forgottenpasswordloading: true })
                        var myHeaders = new Headers();
                        var formdata = new FormData();
                        formdata.append('phone', this.state.phone);
                        formdata.append('password', this.state.newpassword);
                        var requestOptions = {
                          method: 'POST',
                          headers: myHeaders,
                          body: formdata,
                          redirect: 'follow',
                        };
                        //'https://pizzakebab.ranglerztech.website/api/reset-password'
                        fetch(`${myurl}/api/reset-password`, requestOptions)
                          .then(response => response.text())
                          .then((result) => {
                            let data = JSON.parse(result);
                            //alert(result)
                           // console.log(data)
                            if (data.status == 200) {
                              this.setState({ forgottenpasswordloading: false })
                              this.setState({ passwordresetcomplete: true })
                            }
                            else {
                              this.setState({ forgottenpasswordloading: false })
                              this.setState({ forgottenpassword: false })
                              this.setState({ resetpassword: false })
                              this.setState({ errormodalvisible: true })
                              this.setState({ errormodalmessage: data.message })
                            }
                          }).catch((error) => {
                            this.setState({ forgottenpasswordloading: false })
                            this.setState({ forgottenpassword: false })
                            this.setState({ resetpassword: false })
                            this.setState({ errormodalvisible: true })
                            this.setState({ errormodalmessage: 'Error Please try again' })
                          })
                        /*setTimeout(() => {
                          this.setState({ forgottenpasswordloading: false })
                          this.setState({ passwordresetcomplete: true })
                          //this.setState({ resetpassword: false })
                        }, 3000)*/
                      }
                    } else {
                      this.setState({ resetpassword: false })
                    }

                  }}
                >
                  {this.state.forgottenpasswordloading ? (
                    <ActivityIndicator size={'small'} color="#FFF" />
                  ) : (
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        OK
                      </Text>
                    )
                  }
                </TouchableOpacity>

              </View>
            </View>
          </CustomModal>
          {/* <ImageBackground style={[styles.container,{}]} source={require('../../Assets/bg.png')}> */}
          <ImageBackground
            style={[styles.container, {}]}
            source={require('../../Assets/Image1.jpg')}
          //   imageStyle={{resizeMode: 'cover'}}
          >
            {/* <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}> */}
            <LinearGradient
              colors={['rgba(0,0,0,0.1) ', 'rgba(0,0,0,0.9)']}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}>
              <Divider height={responsiveHeight(4)} />
              <Divider height={responsiveHeight(4)} />
              <TouchableOpacity 
                onPress={()=>this.Skipfunction()}
              >
              <View style={{alignItems:"flex-end",paddingHorizontal:20}}>
                <Text style={{color:"white"}}>Skip Now</Text>
              </View>
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <Text style={styles.titleTextStyle1}>{'Welcome back'}</Text>
                <Divider height={responsiveHeight(1)} />
                <Text style={styles.titleTextStyle2}>
                  {'Sign in to continue'}
                </Text>
              </View>
              <Divider height={responsiveHeight(4)} />
              {/* <View style={styles.inputContainer}> */}

              <Input
                placeholder="Name"
                ref={this.input1}
                placeholderTextColor={phColor}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputTextStyle}
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
              {/* <Divider height={responsiveHeight(1)} /> */}
              <Input
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor={phColor}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputTextStyle}
                value={this.state.password}
                onChangeText={text => this.setState({ password: text })}
              />
              <Divider height={responsiveHeight(5)} />
              {this.state.loading ? (
                <View
                  style={[
                    styles.buttonContainer,
                    { justifyContent: 'center', alignItems: 'center' },
                  ]}>
                  <ActivityIndicator size={'small'} color="#FFF" />
                </View>
              ) : (
                  <Button
                    title="SIGN IN"
                    onPress={() => {
                      this.setState({ loading: true });
                      this.login();
                    }}
                    titleStyle={styles.buttonTitleStyle}
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainer}
                  />
                )}
                <Divider height={responsiveHeight(2)} />
              <Button
                onPress={() => this.onAppleButtonPress()}
                title="Continue with Apple"
                loading={this.state.googleloading}
                titleStyle={styles.buttonTitleStyle}
                icon={
                  <FontAwesome
                    name={'apple'}
                    size={responsiveWidth(6.5)}
                    color={colorBlack}
                    style={{ marginRight: responsiveWidth(3.5) }}
                  />
                }
                titleStyle={{color : 'black', fontWeight : '900'}}
                buttonStyle={[styles.buttonStyle, { backgroundColor: 'white', color:'black' }]}
                containerStyle={styles.buttonContainer}
              />
              <Divider height={responsiveHeight(2)} />
              <Button
                onPress={() => this.LoginWithFb()}
                title="Continue with Facebook"
                loading={this.state.fbloading}
                titleStyle={styles.buttonTitleStyle}
                icon={
                  <FontAwesome
                    name={'facebook'}
                    size={responsiveWidth(6.5)}
                    color={colorWhite}
                    style={{ marginRight: responsiveWidth(2) }}
                  />
                }
                buttonStyle={[styles.buttonStyle, { backgroundColor: '#2b71b8' }]}
                containerStyle={styles.buttonContainer}
              />
              <Divider height={responsiveHeight(2)} />
              <Button
                onPress={async () => {
                  //await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false, });
                  //const userInfo = await GoogleSignin.signIn();
                  //alert(JSON.stringify(userInfo))
                  this.signInGoogle()
                }}
                title="Continue with Google"
                loading={this.state.googleloading}
                icon={
                  <FontAwesome
                    name={'google'}
                    size={responsiveWidth(6.5)}
                    color={colorWhite}
                    style={{ marginRight: responsiveWidth(3.5) }}
                  />
                }
                titleStyle={styles.buttonTitleStyle}
                buttonStyle={[styles.buttonStyle, { backgroundColor: '#dc4b3e' }]}
                containerStyle={styles.buttonContainer}
              />
              
              <Divider height={responsiveHeight(4)} />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ forgottenpassword: true })
                }}
                activeOpacity={0.5}
                style={{ alignItems: 'center' }}>
                <Text style={styles.titleTextStyle3}>{'Forgot password?'}</Text>
              </TouchableOpacity>
              <Divider height={responsiveHeight(5)} />
              <TouchableOpacity
                activeOpacity={0.5}
                style={{ alignItems: 'center' }}
                onPress={() => this.props.navigation.navigate('SignUp', { notificationtoken: this.state.nottoken })}>
                <Text style={styles.titleTextStyle3}>
                  {"Don't have account?  "}
                  <Text
                    style={{
                      textDecorationColor: colorWhite,
                      textDecorationLine: 'underline',
                    }}>
                    {'Sign Up'}
                  </Text>
                </Text>
                <Divider height={responsiveHeight(4)} />
              </TouchableOpacity>
              {/* </View> */}
              {/* </View> */}
              <Text>Hello
            </Text>
            </LinearGradient>
          </ImageBackground>
          {/* </ImageBackground> */}
        </ScrollView>
      </SafeAreaView>
    );

  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    // zIndex:1
  },
  container: {
    flex: 1,
    // backgroundColor: colorWhite,
  },
  titleContainer: {
    // height: responsiveHeight(15),
    width: responsiveWidth(85),
    alignSelf: 'center',
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  titleTextStyle1: {
    fontSize: responsiveFontSize(5),
    fontWeight: 'bold',
    color: colorWhite,
  },
  titleTextStyle2: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '900',
    color: colorWhite,
  },
  inputContainer: {
    height: responsiveHeight(9),
    width: responsiveWidth(85),
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inputContainerStyle: {
    // backgroundColor:'green',
    borderBottomWidth:
      Platform.Version <= 28 ? responsiveHeight(0.1) : responsiveHeight(0.08),
    borderBottomColor: colorWhite,
  },
  inputTextStyle: {
    fontSize: responsiveFontSize(2),
    fontWeight: '900',
    color: colorWhite,
  },
  buttonContainer: {
    height: responsiveHeight(8),
    width: responsiveWidth(80),
    alignSelf: 'center',
    backgroundColor: '#303f88',
    padding: 0,
  },
  buttonStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#303f88',
    borderRadius: responsiveWidth(2),
  },
  buttonTitleStyle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '900',
    color: colorWhite,
  },
  titleTextStyle3: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '900',
    color: colorWhite,
  },
  modalMainContainer: {
    height: responsiveHeight(70),
    width: responsiveWidth(85),
    alignSelf: 'center',
    backgroundColor: colorWhite,
    borderRadius: responsiveWidth(3),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: responsiveWidth(4),
  },
  modalImageContainer: {
    height: responsiveHeight(20),
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageStyle: {
    height: '90%',
    width: '90%',
    resizeMode: 'contain',
  },
  modalTextContainer: {
    height: responsiveHeight(10),
    //backgroundColor:'red',
    width: '90%',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  modalTextStyle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: '#e12c2c',
    textAlign: 'center',
  },
  modalDecTextStyle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalButtonContainer: {
    height: responsiveHeight(8),
    width: responsiveWidth(70),
    alignSelf: 'center',
    borderRadius: responsiveWidth(10),
    // backgroundColor:red,
    //  backgroundColor: 'red',
    padding: 0,
  },
});
