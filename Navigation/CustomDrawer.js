import React, { Component } from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { DrawerActions } from 'react-navigation-drawer';
import CustomSafeAreaView, {
  Divider,
} from '../Components/CustomComponents/CustomSafeAreaView';
import { NavigationEvents } from 'react-navigation';
import { colorWhite, colorBlack, lightBlack } from '../../GlobalCons/colors';
import { ListItem, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {myurl} from '../../GlobalCons/myurl'

import { connect } from 'react-redux';
let userToken='';
let LoginStatus ='';
let UserInformation ='';

export default class CustomDrawer extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: '',
      dataa: null,
      loading: true,
      loggedout: false,
      resturent:'',
      check: null
    };
  }

  componentDidMount = async () => {
    let data = await AsyncStorage.getItem("data")
    let userInfo = await AsyncStorage.getItem("getResturant")
    userToken= await AsyncStorage.getItem('token');
    LoginStatus = await AsyncStorage.getItem('Login');
    UserInformation = JSON.parse(await AsyncStorage.getItem('UserData'));
   console.log("check user token",userToken);
   console.log("check user Login Status",LoginStatus);
   console.log("check user Information",UserInformation);



    const Info = JSON.stringify(userInfo);
// console.log("Hi I am Drawer",Info);
this.setState({resturent:Info,loading:false})
   // console.log(",,,,,,,,,,,,,,,,,,,data", data)
  //   this.setState({ dataa: JSON.parse(data) })

  //   let dataa = await AsyncStorage.getItem('token');
  //   var myHeaders = new Headers();
  //   myHeaders.append('Authorization', `Bearer ${dataa}`);

  //   var requestOptions = {
  //     method: 'GET',
  //     headers: myHeaders,
  //     redirect: 'follow',
  //   };
  //   if(Info!=null){
  //             console.log("you are come from skip now");
  //   }else{
  //   //'https://pizzakebab.ranglerztech.website/api/user-data'
  //   console.log("hi on else in compmount")

  //   fetch(
  //     `${myurl}/api/user-data`,
  //     requestOptions,
  //   )
  //     .then(response => response.text())
  //     .then(result => {
  //       let dataa = JSON.parse(result);
  //       if (dataa.status == 200) {
  //         this.setState({ data: dataa.successData, loading: false });
  //       } else {
  //         alert(dataa.message);
  //       }
  //     })
  //     .catch(error => alert('error', error));
  //   this._navListener = this.props.navigation.addListener('willFocus', async () => {
  //     // StatusBar.setHidden(true)
  //   });
  // }
  };
  onFocusFunction = async () => {
    let data = await AsyncStorage.getItem("data");
    let userInfo = await AsyncStorage.getItem("getResturant");
    const Info = JSON.parse(userInfo);

// console.log("Hi I am Drawer on focus",Info);
   // console.log(",,,,,,,,,,,,,,,,,,,data", data)
    this.setState({ dataa: JSON.parse(data) })
    let dataa = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${dataa}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    if(Info==null){
      // console.log("come from skip now in onfocusFunctoin")
    }else{
    //'https://pizzakebab.ranglerztech.website/api/user-data'
    // console.log("hi on focnus call")
    fetch(
      `${myurl}/api/user-data`,
      requestOptions,
    )
      .then(response => response.text())
      .then((result) => {
        let dataa = JSON.parse(result);
        // console.log("check your data in user-data",dataa);
        if (dataa.status == 200) {
          // console.log('check data from api ', dataa.successData);
          this.setState({ data: dataa.successData , loading: false },()=> {
            // console.log("data store ");
          });
        } else {
          // alert(dataa.message);
        }
      })
      .catch(error => alert('error', error));
    // StatusBar.setHidden(true)
  }
  };
  logOut = async () => {
    // this.props.navigation.navigate('Login');

    let data = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);


    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/user-logout',
    fetch(
      `${myurl}/api/user-logout`,
      requestOptions,
    )
      .then(response => response.text())
      .then(async result => {
        let dataa = JSON.parse(result);
        if (dataa.status == 200) {
          //alert(dataa.message);
          await AsyncStorage.clear()
          this.props.navigation.navigate('Login');

          //this.setState({loggedout:true})
        } else {
          alert(dataa.message);
        }
      })
      .catch(error => alert('error', error));
  };
  cart = async () => {
    let data = await AsyncStorage.getItem("cartvalues");
     console.log("data", data);
    // if (data) {
    //   let d = JSON.parse(data)
    //  // console.log("data22", d[0].item.branch_id)
    //   this.props.navigation.navigate('Cart', { Order: d[0].item.branch_id, item: JSON.parse(data) })
    //   this.props.navigation.navigate('Cart');
    // }
    // else {
    //   this.props.navigation.navigate('Cart', { Order: null })
    // }

  }
  render() {

    let { dataa } = this.state
    if (this.state.loggedout == true) {
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>loggedout</Text>
      </View>
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.profileMainContainer}>

            {/* <NavigationEvents onWillFocus={() => this.onFocusFunction()} /> */}
            <Divider height={responsiveHeight(13)} />
            <View style={styles.profileContainer}>
            
{/* {this.state.resturent=='null'?:} */}
              {this.state.loading ? (
                <View style={styles.profileRightContainer}>
                  <ActivityIndicator size="small" color="#67cd00" style={{ alignSelf: 'center' }} />
                </View>
              ) : (
                
                  <View style={styles.profileRightContainer}>
                   {LoginStatus == 'true' ?
                   
                  <View>
                    {/* {console.log("this is the resturent data",this.state.resturent)} */}
                     {/* {console.log('datattatattatatt check',this.state.data)} */}
                    <View style={styles.profileLeftContainer}>
                    {LoginStatus =='true' ? <Image
                    source={{ uri: UserInformation.image }}
                    style={styles.profile}
                    />
                    : <Image
                    source={require('../Assets/profile1.png')}
                    style={styles.profileImageStyle}
                    />}
                    </View>
                   <View style={styles.profileRightTextContainer1}>
                      <Text style={{color:'black',fontSize:14,fontWeight:'bold'}}>
                        {/* {console.log("cehck data wheer error",this.state.data)} */}
                        {UserInformation.name}
                      </Text>
                      <AntDesign
                        name={'checkcircle'}
                        size={responsiveWidth(6)}
                        color={'#67cd00'}
                      />
                    </View>
                    <Text style={{color:'black',fontSize:14,}}>{UserInformation.email}</Text>
                  
                  </View>
                  
                  :
                      <View>
                      <View style={{justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity 
                          style={{justifyContent:'center',alignItems:'center',borderRadius:5,width:120,height:40,backgroundColor:'rgb(57,59,130)'}}
                          onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={{color:'white',fontSize:16}}>Login / Signup</Text>
                        </TouchableOpacity>
                        </View>
                      </View>
                   } 
                
                  
                  </View>
                )}
            </View>
          </View>
          <Divider height={responsiveHeight(3)} />
          {LoginStatus=='true'?
          <View>
            <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => {this.props.navigation.navigate('Home');
            this.props.navigation.closeDrawer()}}>
            <Text style={styles.contentTextStyle}>{'Restaurants'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />

          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={async() => {
              let curr= await AsyncStorage.getItem('Currency');
              let phone= await AsyncStorage.getItem('phone');
              return (
                this.props.navigation.navigate('Mycart', { from: 'drawer',country:curr,Phone:phone })
              )
            }}>
            <Text style={styles.contentTextStyle}>{'Cart'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate('Profile')}>
            <Text style={styles.contentTextStyle}>{'Profile'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />

          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate('FavouriteDeals')}>
            <Text style={styles.contentTextStyle}>{'Favourite Deals'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate('TrackOrder')}>
            <Text style={styles.contentTextStyle}>{'Track Order'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate('OrderHistory')}>
            <Text style={styles.contentTextStyle}>{'Order History'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => this.logOut()}>
            <Text style={styles.contentTextStyle}>{'Logout'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
       </View>
         
         :
          <View>
   <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.contentTextStyle}>{'Restaurants'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />

          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={0.5}
            onPress={() => {
              //this.cart()
              return (
                this.props.navigation.navigate('Cart', { from: 'drawer' })
              )
            }}>
            <Text style={styles.contentTextStyle}>{'Cart'}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
    
          </View>
          
          }
       
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },
  profileMainContainer: {
    height: responsiveHeight(30),
    width: '100%',
    backgroundColor: '#f6f6f6',
  },
  profile: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
    borderRadius: responsiveHeight(9),
    backgroundColor: '#eaeaea',
  },
  profileContainer: {
    height: responsiveHeight(12),
    width: responsiveWidth(68),
    // backgroundColor: 'green',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLeftContainer: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(6),
    backgroundColor: '#eaeaea',
    borderWidth: 1.5,
    borderColor: colorBlack,
  },
  profileRightContainer: {
    height: responsiveHeight(9),
    width: '70%',
    justifyContent: 'center',
    // backgroundColor: 'pink'
  },
  profileRightTextContainer1: {
    marginTop:5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prfileTextStyle1: {
    fontSize: responsiveFontSize(2.3),
    fontWeight: '900',
    color: colorBlack,
  },
  prfileTextStyle2: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: '900',
    color: '#565656',
  },
  profileImageStyle: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
  },
  contentContainer: {
    height: responsiveHeight(7.5),
    width: responsiveWidth(58),
    backgroundColor: colorWhite,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  contentTextStyle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: '900',
    color: colorBlack,
  },
  line: {
    marginTop: responsiveHeight(0.1),
    marginBottom: responsiveHeight(0.1),
    height: responsiveHeight(0.1),
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#d1d1d1',
  },
});
/*const mapStateToProps = state => {
  console.log('i m state', state);
  return {
    Data: state.data,
  };
};
const actions = {
};

export default connect(
  mapStateToProps,
  actions,
)(CustomDrawer);*/

