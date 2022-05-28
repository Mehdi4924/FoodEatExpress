import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  blue,
  colorWhite,
  lightBlack,
  colorBlack,
} from '../../../GlobalCons/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Anticon from 'react-native-vector-icons/AntDesign';
import CategoriesFlatList from './CategoriesFlatList';
import MyStatusBar from '../CustomComponents/MyStatusBar';
// import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { ListItem, Input, Button, Badge } from 'react-native-elements';
import CustomModal from '../CustomComponents/CustomModal';
import NetInfo from '@react-native-community/netinfo';
import { myurl } from '../../../GlobalCons/myurl';
import { Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios'
let LoginStatus = '';
export default class Resturents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      mycurrentposition: '',
      // data: this.props.navigation.state.params.ResturentData!=undefined?this.props.navigation.state.params.ResturentData:[],
      visible: false,
    };
  }
  componentDidMount = async () => {
    console.log('check the params data on Resturents', this.props);
    Ionicons.loadFont()
    Anticon.loadFont();
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.')
      }
    });
    LoginStatus = await AsyncStorage.getItem('Login');
    console.log("check user Login Status", LoginStatus);
    if (LoginStatus == 'false') {
      // Alert.alert('ya false hwa status tyrie')

      // this.setState({ loading:true });
      console.log("CHeck me i am called in ")
      Geolocation.getCurrentPosition(
        (position) => {
          const locations = new FormData();
          locations.append('latitude', position.coords.latitude);
          locations.append('longitude', position.coords.longitude);
          console.log('my locations Formdata', locations);
          axios.post('https://app.foodsafety.uk.com/api/get-branches-ios', locations)
            .then(async (res) => {
              console.log("Get Res Sucess skipo", res)
              this.setState({
                data: res.data.successData
              })
              this.setState({ loading: false });
              // console.log('enddd ');
              //  this.props.navigation.navigate('Resturents',{ResturentData:res.data.successData})
            })
            .catch(error => {
              console.log("Get Sucess Error", error)
            })
        },
        (error) => {
          console.log('errrrrr', error);

        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      )

      StatusBar.setBarStyle('light-content');
    } else {
      this.getResturant();
      console.log("HII I AMMMMMMMM COME AGAIN ")
      // Alert.alert('ya false hwa status')
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
    }



  };
  // componentWillUnmount() {
  //   this._unsubscribe();
  // }
  getResturant = async () => {
    let data = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/get-branches'
    fetch(
      `${myurl}/api/get-branches`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        let dataa = JSON.parse(result);
        // if (dataa.successData) {
        this.setState({ data: dataa.successData, loading: false });
        //console.log('ADeeeeeeel'+JSON.stringify(dataa.successData))
        //alert(JSON.stringify(dataa.successData))
        //alert(JSON.stringify(dataa.successData))
        console.log('Resturants', JSON.parse(result));
        // } else {
        //   this.setState({ loading: false });
        //   alert(dataa.message);
        //   console.log(result, 'test');
        // }
      })
      .catch(error => {
        this.setState({ loading: false });
        alert(error.message, 'Error:Please connect to internet.')
      });
  }
  printCards = post => {

    console.log(post.item);
    let item = post.item;
    //alert(JSON.stringify(item))
    if (item.background_type == 'color') {
      return (
        <TouchableOpacity
          style={{
            padding: responsiveWidth(1),
            backgroundColor: item.color,
            elevation: 10,
            width: responsiveWidth(90),
            flex: 1,
            marginRight: responsiveWidth(4),
            marginLeft: responsiveWidth(5),
            borderRadius: responsiveWidth(1),
            borderWidth: 1.5,
            borderColor: '#f2c129',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.7}
          onPress={async () => {
            let data = await AsyncStorage.getItem('resturant');
            await AsyncStorage.setItem("country", JSON.stringify(item.country));
            let val = await AsyncStorage.getItem('storeData');
            console.log("cehck the value in resturents screen", val)
            await AsyncStorage.setItem("r_id", JSON.stringify(item.id))
            await AsyncStorage.setItem("r_name", item.name)
            console.log(data);
            if (data == null) {
              {
                this.props.navigation.navigate('Categories', {
                  id: { id: item.id, name: item.name, country: item.country },
                });
              }
            } else if (data == JSON.stringify(item.id)) {
              this.props.navigation.navigate('Categories', {
                id: { id: item.id, name: item.name, country: item.country },
              });
            } else {
              this.setState({ visible: true });
            }
          }}

        >

          <View
            style={{
              flex: 1,
              flexDirection: 'row'
            }}>


            <View style={Styles.cardLeftContainer}>
              {
                console.log('Image address' + item.image)
              }
              <Image
                source={{ uri: item.image }}
                style={{ height: '90%', width: '80%', resizeMode: 'contain' }}
              />
            </View>

            <CustomModal isVisible={this.state.visible}>
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <View style={Styles.modalMainContainer}>
                  <View style={Styles.modalTextContainer}>
                    <Text style={Styles.modalTextStyle}>
                      By leaving this restaurant page,the item you've added to your
                      cart will be cleared.
                    </Text>
                  </View>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      this.setState({ visible: false });
                    }}
                    titleStyle={Styles.buttonTitleStyle}
                    buttonStyle={[
                      Styles.buttonStyle,
                      { borderRadius: responsiveWidth(10), top: responsiveHeight(2) },
                    ]}
                    containerStyle={Styles.modalButtonContainer}
                  />
                  <Button
                    title="Ok"
                    onPress={async () => {
                      console.log("check this Ok 3 ===================================================");
                      console.log("check cart data 888", await AsyncStorage.getItem('storeData'));
                      await AsyncStorage.removeItem('storeData');
                      console.log("after deleting the cart ", await AsyncStorage.getItem('storeData'));
                      console.log("async data check 1", await AsyncStorage.getItem('adeelarray'));
                      console.log("check this array", await AsyncStorage.removeItem('resturant'));
                      console.log("check this array", await AsyncStorage.removeItem('data'));
                      // console.log("check this array",await AsyncStorage.removeItem('adeelarray'));
                      let data = [];
                      console.log("async data check 2", data);
                      await AsyncStorage.setItem('adeelarray', JSON.stringify(data))
                      console.log("async data check 2", await AsyncStorage.getItem('adeelarray'));
                      await AsyncStorage.removeItem("resturant");
                      await AsyncStorage.removeItem("data");
                      await AsyncStorage.setItem("country", JSON.stringify(item.country));
                      this.props.navigation.navigate('Categories', {
                        id: { id: item.id, name: item.name, country: item.country },
                      });
                      this.setState({ visible: false });
                    }}
                    titleStyle={Styles.buttonTitleStyle}
                    buttonStyle={[
                      Styles.buttonStyle,
                      {
                        borderRadius: responsiveWidth(10),
                        backgroundColor: '#e12c2c', top: responsiveHeight(2)
                      },
                    ]}
                    containerStyle={Styles.modalButtonContainer}
                  />
                </View>
              </View>
            </CustomModal>
            <View style={Styles.cardRightContainer}>
              <Text style={{
                color: item.text_color != null ? item.text_color : colorBlack,
                fontSize: responsiveFontSize(2),
              }} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={{
                color: item.text_color != null ? item.text_color : colorBlack,
                fontSize: responsiveFontSize(1.8),
              }}>{item.address}</Text>

            </View>
          </View>
          {item.discount ? (
            <View
              style={{
                minHeight: responsiveHeight(5),
                width: '100%',
                paddingHorizontal: '5%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
              <View
                style={{
                  flex: 3,
                  flexDirection: 'row'
                }}>
                <Ionicons
                  name='pricetags-outline'
                  color={'red'}
                  size={responsiveHeight(3)}
                />
                <Text
                  style={{
                    color: 'red',
                    fontSize: responsiveHeight(1.5),
                    marginLeft: '5%'
                  }}>
                  Spend {item.country != null ? item.country == 'pakistan' ? 'PKR' : '£' : '£'} {item.discount.min_spend}, get {item.discount.percentage_off}% off.
                </Text>
              </View>
              {item.delivery != null ? (
                <View
                  style={{
                    flex: 1,
                  }}>
                  {console.log('item delivery time', item.delivery.time)}
                  <Badge value={item.delivery.time} status="success"
                    badgeStyle={{
                      height: responsiveHeight(4),
                      width: responsiveWidth(20)
                    }}
                    textStyle={{
                      fontSize: 10
                    }}
                  />
                </View>
              ) : <View></View>}

            </View>
          ) : (
            <View>
              {item.delivery != null ? (
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'black',
                    width: '98%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end'
                  }}>
                  {console.log('item delivery time', item.delivery.time)}
                  <Badge value={item.delivery.time} status="success"
                    badgeStyle={{
                      height: responsiveHeight(3.8),
                      width: responsiveWidth(20)
                    }}
                    textStyle={{
                      fontSize: 10
                    }}
                  />
                </View>
              ) : <View></View>}
            </View>
          )

          }
        </TouchableOpacity>
      );
    }
    else if (item.background_type == 'image') {
      return (
        <TouchableOpacity
          onPress={async () => {
            let data = await AsyncStorage.getItem('resturant');
            await AsyncStorage.setItem("country", JSON.stringify(item.country));
            await AsyncStorage.setItem("r_id", JSON.stringify(item.id))
            await AsyncStorage.setItem("r_name", item.name)
            console.log(data);
            if (data == null) {
              {
                this.props.navigation.navigate('Categories', {
                  id: { id: item.id, name: item.name, country: item.country },
                });
              }
            } else if (data == JSON.stringify(item.id)) {
              this.props.navigation.navigate('Categories', {
                id: { id: item.id, name: item.name, country: item.country },
              });
            } else {
              this.setState({ visible: true });
            }
          }}

        >
          <ImageBackground
            source={{ uri: item.background_image }}
            style={{
              padding: responsiveWidth(1),
              // backgroundColor: colorWhite,
              backgroundColor: item.color,
              elevation: 10,
              width: responsiveWidth(90),
              flex: 1,
              // maxHeight:responsiveHeight(17),
              // height: responsiveHeight(13),
              // top: responsiveHeight(34),
              marginRight: responsiveWidth(4),
              marginLeft: responsiveWidth(5),
              //flexDirection: 'row',
              borderRadius: responsiveWidth(1),
              borderWidth: 1.5,
              borderColor: '#f2c129',
              justifyContent: 'space-between',
            }}
            activeOpacity={0.7}
            onPress={async () => {
              let data = await AsyncStorage.getItem('resturant');
              // await AsyncStorage.removeItem("data")
              // console.log()
              await AsyncStorage.setItem("country", JSON.stringify(item.country));
              await AsyncStorage.setItem("r_id", JSON.stringify(item.id))
              await AsyncStorage.setItem("r_name", item.name)
              console.log(data);
              if (data == null) {
                {
                  this.props.navigation.navigate('Categories', {
                    id: { id: item.id, name: item.name, country: item.country },
                  });
                }
              } else if (data == JSON.stringify(item.id)) {
                this.props.navigation.navigate('Categories', {
                  id: { id: item.id, name: item.name, country: item.country },
                });
              } else {
                this.setState({ visible: true });
              }
            }}>

            <View
              style={{
                flex: 1,
                flexDirection: 'row'
              }}>


              <View style={Styles.cardLeftContainer}>
                {
                  console.log('Image address' + item.image)
                }
                <Image
                  source={{ uri: item.image }}
                  style={{ height: '90%', width: '80%', resizeMode: 'contain' }}
                />
              </View>

              <CustomModal isVisible={this.state.visible}>
                <View
                  style={{
                    flex: 1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* <Divider height={responsiveHeight(15)} /> */}
                  <View style={Styles.modalMainContainer}>
                    <View style={Styles.modalTextContainer}>
                      <Text style={Styles.modalTextStyle}>
                        By leaving this restaurant page,the item you've added to your
                        cart will be cleared.
                      </Text>
                    </View>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        // this.props.navigation.navigate('Resturents');
                        this.setState({ visible: false });
                      }}
                      titleStyle={Styles.buttonTitleStyle}
                      buttonStyle={[
                        Styles.buttonStyle,
                        { borderRadius: responsiveWidth(10), top: responsiveHeight(2) },
                      ]}
                      containerStyle={Styles.modalButtonContainer}
                    />
                    <Button
                      title="Ok"
                      onPress={async () => {
                        console.log("check this Ok 1");
                        // await AsyncStorage.removeItem('adeelarray')
                        console.log("check cart data 888", await AsyncStorage.getItem('storeData'));
                        await AsyncStorage.removeItem('storeData');
                        console.log("after deleting the cart ", await AsyncStorage.getItem('storeData'));
                        console.log("check cart data", await AsyncStorage.getItem('storeData'));
                        await AsyncStorage.removeItem("resturant")
                        await AsyncStorage.removeItem("data")
                        await AsyncStorage.setItem("country", JSON.stringify(item.country));
                        this.props.navigation.navigate('Categories', {
                          id: { id: item.id, name: item.name, country: item.country },
                        });
                        // this.cancel(item.id)
                        // this.props.navigation.navigate('Resturents');
                        this.setState({ visible: false });
                      }}
                      titleStyle={Styles.buttonTitleStyle}
                      buttonStyle={[
                        Styles.buttonStyle,
                        {
                          borderRadius: responsiveWidth(10),
                          backgroundColor: '#e12c2c', top: responsiveHeight(2)
                        },
                      ]}
                      containerStyle={Styles.modalButtonContainer}
                    />
                  </View>
                </View>
              </CustomModal>
              <View style={Styles.cardRightContainer}>
                <Text style={{
                  color: item.text_color != null ? item.text_color : colorBlack,
                  fontSize: responsiveFontSize(2),
                }} numberOfLines={2}>
                  {item.name}
                  {/* {'No 1 Pizza and Kebab'} */}
                </Text>
                {/*<Text style={Styles.cardTextStyle1}>{item.email}</Text>*/}
                <Text style={{
                  color: item.text_color != null ? item.text_color : colorBlack,
                  fontSize: responsiveFontSize(1.8),
                }}>{item.address}</Text>
                {/*<Text style={Styles.cardTextStyle1}>{item.phone}</Text>*/}
                {/* <View flexDirection={'row'}>{this.renderRatings(5)}</View> */}

              </View>
            </View>
            {item.discount ? (
              <View
                style={{
                  minHeight: responsiveHeight(5),
                  width: '100%',
                  //backgroundColor:'green',
                  paddingHorizontal: '5%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                  //paddingVertical:'2%'
                }}>
                <View
                  style={{
                    flex: 3,
                    //backgroundColor: 'green',
                    flexDirection: 'row'
                  }}>
                  <Ionicons
                    name='pricetags-outline'
                    color={'red'}
                    size={responsiveHeight(3)}
                  />
                  <Text
                    style={{
                      color: 'red',
                      //fontWeight: 'bold',
                      fontSize: responsiveHeight(1.5),
                      marginLeft: '5%'
                    }}>
                    Spend {item.country != null ? item.country == 'pakistan' ? 'PKR' : '£' : '£'} {item.discount.min_spend}, get {item.discount.percentage_off}% off.
                  </Text>
                </View>
                {item.delivery != null ? (
                  <View
                    style={{
                      flex: 1,
                      //backgroundColor: 'grey'
                    }}>
                    {console.log('item delivery time', item.delivery.time)}
                    <Badge value={item.delivery.time} status="success"
                      badgeStyle={{
                        height: responsiveHeight(4),
                        width: responsiveWidth(20)
                      }}
                      textStyle={{
                        fontSize: 10
                      }}
                    />
                  </View>
                ) : <View></View>}

              </View>
            ) : (
              <View>
                {item.delivery != null ? (
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor: 'black',
                      width: '98%',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end'
                    }}>
                    {console.log('item delivery time', item.delivery.time)}
                    <Badge value={item.delivery.time} status="success"
                      // badgeStyle={{
                      // height: responsiveHeight(4),
                      // width:responsiveWidth(25)
                      // }}
                      badgeStyle={{
                        height: responsiveHeight(3.8),
                        width: responsiveWidth(20)
                      }}
                      textStyle={{
                        fontSize: 10
                      }}
                    />
                  </View>
                ) : <View></View>}
              </View>
            )

            }
          </ImageBackground>
        </TouchableOpacity>

      );
    }
    else {
      return (
        <TouchableOpacity
          style={{
            padding: responsiveWidth(1),
            // backgroundColor: colorWhite,
            backgroundColor: item.color,
            elevation: 10,
            width: responsiveWidth(90),
            flex: 1,
            // maxHeight:responsiveHeight(17),
            // height: responsiveHeight(13),
            // top: responsiveHeight(34),
            marginRight: responsiveWidth(4),
            marginLeft: responsiveWidth(5),
            //flexDirection: 'row',
            borderRadius: responsiveWidth(1),
            borderWidth: 1.5,
            borderColor: '#f2c129',
            justifyContent: 'space-between',
          }}
          activeOpacity={0.7}
          onPress={async () => {
            let data = await AsyncStorage.getItem('resturant');
            // await AsyncStorage.removeItem("data")
            // console.log()
            let val = await AsyncStorage.getItem('storeData');
            console.log("cehck the value in resturents screen", val)
            await AsyncStorage.setItem("country", JSON.stringify(item.country));
            await AsyncStorage.setItem("r_id", JSON.stringify(item.id))
            await AsyncStorage.setItem("r_name", item.name)
            console.log(data);
            if (data == null) {
              {
                this.props.navigation.navigate('Categories', {
                  id: { id: item.id, name: item.name, country: item.country },
                });
              }
            } else if (data == JSON.stringify(item.id)) {
              this.props.navigation.navigate('Categories', {
                id: { id: item.id, name: item.name, country: item.country },
              });
            } else {
              this.setState({ visible: true });
            }
          }}>

          <View
            style={{
              flex: 1,
              flexDirection: 'row'
            }}>


            <View style={Styles.cardLeftContainer}>
              {
                console.log('Image address' + item.image)
              }
              <Image
                source={{ uri: item.image }}
                style={{ height: '90%', width: '80%', resizeMode: 'contain' }}
              />
            </View>

            <CustomModal isVisible={this.state.visible}>
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Divider height={responsiveHeight(15)} /> */}
                <View style={Styles.modalMainContainer}>
                  <View style={Styles.modalTextContainer}>
                    <Text style={Styles.modalTextStyle}>
                      By leaving this restaurant page,the item you've added to your
                      cart will be cleared.
                    </Text>
                  </View>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      // this.props.navigation.navigate('Resturents');
                      this.setState({ visible: false });
                    }}
                    titleStyle={Styles.buttonTitleStyle}
                    buttonStyle={[
                      Styles.buttonStyle,
                      { borderRadius: responsiveWidth(10), top: responsiveHeight(2) },
                    ]}
                    containerStyle={Styles.modalButtonContainer}
                  />
                  <Button
                    title="Ok"
                    onPress={async () => {
                      console.log("check this Ok 2");
                      console.log("check cart data 888", await AsyncStorage.getItem('storeData'));
                      await AsyncStorage.removeItem('storeData');
                      console.log("after deleting the cart ", await AsyncStorage.getItem('storeData'));
                      console.log("check cart data", await AsyncStorage.getItem('storeData'));
                      await AsyncStorage.removeItem('adeelarray')
                      await AsyncStorage.removeItem("resturant")
                      await AsyncStorage.removeItem("data")
                      await AsyncStorage.setItem("country", JSON.stringify(item.country));
                      this.props.navigation.navigate('Categories', {
                        id: { id: item.id, name: item.name, country: item.country },
                      });
                      // this.cancel(item.id)
                      // this.props.navigation.navigate('Resturents');
                      this.setState({ visible: false });
                    }}
                    titleStyle={Styles.buttonTitleStyle}
                    buttonStyle={[
                      Styles.buttonStyle,
                      {
                        borderRadius: responsiveWidth(10),
                        backgroundColor: '#e12c2c', top: responsiveHeight(2)
                      },
                    ]}
                    containerStyle={Styles.modalButtonContainer}
                  />
                </View>
              </View>
            </CustomModal>
            <View style={Styles.cardRightContainer}>
              <Text style={{
                color: item.text_color != null ? item.text_color : colorBlack,
                fontSize: responsiveFontSize(2),
              }} numberOfLines={2}>
                {item.name}
                {/* {'No 1 Pizza and Kebab'} */}
              </Text>
              {/*<Text style={Styles.cardTextStyle1}>{item.email}</Text>*/}
              <Text style={{
                color: item.text_color != null ? item.text_color : colorBlack,
                fontSize: responsiveFontSize(1.8),
              }}>{item.address}</Text>
              {/*<Text style={Styles.cardTextStyle1}>{item.phone}</Text>*/}
              {/* <View flexDirection={'row'}>{this.renderRatings(5)}</View> */}

            </View>
          </View>
          {item.discount ? (
            <View
              style={{
                minHeight: responsiveHeight(5),
                width: '100%',
                //backgroundColor:'green',
                paddingHorizontal: '5%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
                //paddingVertical:'2%'
              }}>
              <View
                style={{
                  flex: 3,
                  //backgroundColor: 'green',
                  flexDirection: 'row'
                }}>
                <Ionicons
                  name='pricetags-outline'
                  color={'red'}
                  size={responsiveHeight(3)}
                />
                <Text
                  style={{
                    color: 'red',
                    //fontWeight: 'bold',
                    fontSize: responsiveHeight(1.5),
                    marginLeft: '5%'
                  }}>

                  Spend {item.country != null ? item.country == 'pakistan' ? 'PKR' : '£' : '£'} {item.discount.min_spend}, get {item.discount.percentage_off}% off.
                </Text>
              </View>
              {item.delivery != null ? (
                <View
                  style={{
                    flex: 1,
                    //backgroundColor: 'grey'
                  }}>
                  {console.log('item delivery time', item.delivery.time)}
                  <Badge value={item.delivery.time} status="success"
                    badgeStyle={{
                      height: responsiveHeight(4),
                      width: responsiveWidth(20)
                    }}
                    textStyle={{
                      fontSize: 10
                    }}
                  />
                </View>
              ) : <View></View>}

            </View>
          ) : (
            <View>
              {item.delivery != null ? (
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'black',
                    width: '98%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end'
                  }}>
                  {console.log('item delivery time', item.delivery.time)}
                  <Badge value={item.delivery.time} status="success"
                    // badgeStyle={{
                    // height: responsiveHeight(4),
                    // width:responsiveWidth(25)
                    // }}
                    badgeStyle={{
                      height: responsiveHeight(3.8),
                      width: responsiveWidth(20)
                    }}
                    textStyle={{
                      fontSize: 10
                    }}
                  />
                </View>
              ) : <View></View>}
            </View>
          )

          }
        </TouchableOpacity>
      );
    }
    console.log("check the item in Resturent Listing Print Card Function", item)
    let index = post.index;

  };
  render() {
    if (Platform.OS === 'android') {
      // StatusBar.setBarStyle('dark-content');
      return (
        <>
          {/* <View style={{ backgroundColor: blue, height: 50 }}>
            <StatusBar
              barStyle={'light-content'}
              translucent
              backgroundColor={blue}
            />
          </View> */}

          <View style={Styles.container}>
            {/* <StatusBar
              barStyle={'light-content'}
              translucent
              backgroundColor={blue}
            /> */}
            <View style={Styles.Header}>
              <View style={Styles.topHeader}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}>
                  <Image
                    style={{
                      height: responsiveHeight(4),
                      width: responsiveWidth(6),
                    }}
                    source={require('../../Assets/icons-Menu-1.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={Styles.SearchHeader}>
                <Text
                  style={{
                    color: 'white',
                    marginLeft: '10%',
                    fontWeight: 'bold',
                    fontSize: responsiveHeight(5)
                  }}
                >
                  Restaurantssssss
                </Text>
              </View>

              {/*<View style={Styles.SearchHeader}>
                <View style={Styles.SearchView}>
                  <TouchableOpacity style={Styles.Left}>
                    {/*<Ionicons
                      color={'#D5D5D5'}
                      size={responsiveFontSize(3)}
                      name={'ios-search'}
                    />
                  </TouchableOpacity>
                  <View style={Styles.Right}>
                    <TextInput
                      placeholder={'Post Code'}
                      placeholderTextColor={'#D5D5D5'}
                      style={Styles.Textinput}
                    />
                  </View>
                </View>
              </View>*/}
            </View>
            {this.state.loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color="#303f88" size={'large'} />
              </View>
            ) : this.state.data.length > 0 ? (
              <FlatList
                data={this.state.data}
                keyExtractor={item => item.id}
                contentContainerStyle={Styles.contentContainerStyle}
                ItemSeparatorComponent={() => <View style={Styles.Seprator} />}
                renderItem={item => this.printCards(item)}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: blue,
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(4),
                    letterSpacing: 1,
                    fontSize: responsiveFontSize(3),
                  }}>
                  {'No Restaurants Found'}
                </Text>
              </View>
            )}
          </View>
        </>
      );
    } else if (Platform.OS === 'ios') {
      return (
        <>
          <MyStatusBar backgroundColor={blue} barStyle="light-content" />
          <SafeAreaView style={Styles.container}>
            {/* <View style={Styles.Header}>
              <View style={Styles.topHeader}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}>
                  <Image
                    style={{
                      height: responsiveHeight(4),
                      width: responsiveWidth(6),
                    }}
                    source={require('../../Assets/icons-Menu-1.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={Styles.SearchHeader}>
                <Text
                  style={{
                    color: 'white',
                    marginLeft: '10%',
                    fontWeight: 'bold',
                    fontSize: responsiveHeight(5)
                  }}
                >
                  Restaurantsssss
                    </Text>
              </View>

              {/*<View  check this style={Styles.SearchHeader}>
                <View style={Styles.SearchView}>
                  <TouchableOpacity style={Styles.Left}>
                    {/*<Ionicons
                      color={'#D5D5D5'}
                      size={responsiveFontSize(3)}
                      name={'ios-search'}
                    />
                  </TouchableOpacity>
                  <View style={Styles.Right}>
                    <TextInput
                      placeholder={'Post Code'}
                      placeholderTextColor={'#D5D5D5'}
                      style={Styles.Textinput}
                    />
                  </View>
                </View>
              </View>
            </View>
        
         */}
            <View style={Styles.Header}>
              <View style={Styles.topHeader}>
                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}>
                  <Image
                    style={{
                      height: responsiveHeight(4),
                      width: responsiveWidth(6)
                    }}
                    source={require('../../Assets/icons-Menu-1.png')}
                  />
                </TouchableOpacity>
                <View style={Styles.SearchHeader}>
                  <Text
                    style={{
                      color: 'white',
                      // marginLeft: '10%',
                      alignSelf: 'center',
                      fontWeight: 'bold',

                      fontSize: responsiveFontSize(3),
                      marginTop: responsiveHeight(5)
                    }}
                  >
                    Restaurants & Grocery Stores
                  </Text>
                </View>
              </View>

              <View style={Styles.header} >
                <Text
                  style={{
                    color: 'white',
                    // marginLeft: '15%',
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    marginLeft: 30,
                    marginTop: 2,
                    alignSelf: 'center',
                    fontSize: responsiveFontSize(2.6)
                  }}
                >
                  Order Takeaway Food Online
                </Text>
              </View>

            </View>


            {this.state.loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color="#303f88" size={'large'} />
              </View>
            ) : this.state.data.length > 0 ? (
              <FlatList
                data={this.state.data}
                keyExtractor={item => item.id}
                contentContainerStyle={Styles.contentContainerStyle}
                ItemSeparatorComponent={() => <View style={Styles.Seprator} />}
                renderItem={item => this.printCards(item)}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: blue,
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(4),
                    letterSpacing: 1,
                    fontSize: responsiveFontSize(3),
                  }}>
                  {'No Restaurants Found'}
                </Text>
              </View>
            )}
          </SafeAreaView>
        </>
      );
    }
  }
}
const Styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: responsiveHeight(2),
  },
  modalMainContainer: {
    height: responsiveHeight(50),
    width: responsiveWidth(85),
    alignSelf: 'center',
    backgroundColor: colorWhite,
    borderRadius: responsiveWidth(2),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: responsiveWidth(4),
  },
  Seprator: {
    marginTop: responsiveHeight(3),
  },
  MainCard: {
    height: responsiveHeight(23),
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colorWhite,
    elevation: 5,
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
  },

  cardLeftContainer: {
    // backgroundColor: 'red',
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRightContainer: {
    // backgroundColor: 'blue',
    width: '80%',
    height: '100%',
  },

  cardTextStyle: {
    color: colorBlack,
    fontSize: responsiveFontSize(2),
  },
  cardTextStyle1: {
    color: '#b8b8b8',
    fontSize: responsiveFontSize(1.8),
  },
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },
  Header: {
    height: responsiveHeight(20),
    width: '100%',
    backgroundColor: blue,
  },
  topHeader: {
    height: responsiveHeight(10),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(4),
    // backgroundColor:'red'
  },
  HeaderText: {
    color: colorWhite,
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveWidth(1),
  },
  SearchHeader: {
    height: responsiveHeight(10),
    width: '100%',
    justifyContent: 'center',
  },
  SearchView: {
    width: '91%',
    alignSelf: 'center',
    height: responsiveHeight(6),
    backgroundColor: colorWhite,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Left: {
    width: '14%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Right: {
    width: '86%',
    justifyContent: 'center',
  },
  Textinput: {
    padding: 0,
    margin: 0,
    fontSize: responsiveFontSize(2),
  },
  modalTextContainer: {
    height: responsiveHeight(15),
    width: '90%',
    alignItems: 'center',
    // backgroundColor: 'red'
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
  modalTextStyle: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: colorBlack,
    textAlign: 'center',
  },
  TriangleShapeCSS: {
    width: 0,
    height: 0,
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 120,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
    transform: [{ rotate: '-27deg' }]
  }
});
