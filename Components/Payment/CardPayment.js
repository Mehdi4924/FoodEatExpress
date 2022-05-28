import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  ToastAndroid,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {WebView} from 'react-native-webview';
import {colorWhite, colorBlack, lightBlack} from './../../../GlobalCons/colors';
import {Icon, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import CustomModal from '../CustomComponents/CustomModal';
import {myurl} from '../../../GlobalCons/myurl';
import Toast from 'react-native-simple-toast';
import SimpleToast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function CardPayment(props) {
  const [address, setaddress] = useState('');
  const [address1, setaddress1] = useState('');
  const [postalCode, setpostalCode] = useState('');
  const [webView, setWebView] = useState('');
  const [indicator, setIndicator] = useState(false);
  const [card, setCard] = useState();
  const [selected, setSelected] = useState('new');

  let previousData = props.navigation.state.params.previousData;

  useEffect(() => {
    getAllCards();
  }, []);

  const CustomStatusBar = ({backgroundColor, barStyle = 'light-content'}) => {
    const insets = useSafeAreaInsets();
    return (
      <View style={{height: insets.top, backgroundColor}}>
        <StatusBar
          animated={true}
          backgroundColor={backgroundColor}
          barStyle={barStyle}
        />
      </View>
    );
  };

  const getAllCards = async () => {
    let dataa = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${dataa}`);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${myurl}/api/user-card`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let dataa = JSON.parse(result);
        console.log('this is user cards details', dataa);
        setCard(dataa.successData);
        // setCard([]);
      })
      .catch((error) => {});
  };

  const sendData = async () => {
    if (address == '' || address1 == '' || postalCode == '') {
      Toast.show('Please Enter All The Details First');
    } else {
      setIndicator(true);
      var formdata = new FormData();
      var myHeaders = new Headers();
      let dataa = await AsyncStorage.getItem('token');
      myHeaders.append('Authorization', `Bearer ${dataa}`);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      formdata.append('menu', previousData.menu);
      formdata.append('subtotal', previousData.subtotal);
      formdata.append('tax', previousData.tax);
      formdata.append('delivery', previousData.delivery);
      formdata.append('total', previousData.total);
      formdata.append('branch_id', previousData.branch_id);
      formdata.append('feedback', previousData.feedback);
      formdata.append('address_note', previousData.address_note);
      formdata.append('discount', previousData.discount);
      formdata.append('wallet', previousData.wallet);
      formdata.append('phone', previousData.phone);
      formdata.append('card', selected);
      formdata.append('address', previousData.address_note);
      formdata.append('address1', address1);
      formdata.append('postCode', postalCode);

      console.log('check form data ', formdata);

      fetch(`${myurl}/api/save-order`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          console.log('save order ka responce++++++++======>>>>>', result);
          let res = JSON.parse(result);
          setIndicator(false);
          //   console.log('save order ka responce++++++++======>>>>>', result);
          setWebView(res.successData.url);
        })
        .catch((error) => {
          console.log('this is error', error);
          setIndicator(false);
          SimpleToast.show('Order Failed');
        });
    }
  };
  return (
    <View style={{flex: 1}}>
      <CustomStatusBar backgroundColor="#393b82" />
      <SafeAreaView forceInset={{top: 'never'}} style={styles.maincontainer}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            {console.log(card)}
            {webView == '' ? (
              <>
                <View style={styles.header}>
                  <View style={styles.iconcontainer}>
                    <Icon
                      name="chevron-left"
                      type="font-awesome"
                      color="white"
                      size={responsiveWidth(8)}
                      onPress={() => {
                        props.navigation.goBack();
                      }}
                    />
                    <View style={styles.titlecontainer}>
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: responsiveWidth(8),
                          marginLeft: responsiveWidth(7),
                        }}>
                        Add Card Details
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.card}>
                    {card && card.length > 0 ? (
                      <>
                        <Text
                          style={{
                            marginTop: responsiveHeight(25),
                            fontWeight: 'bold',
                            fontSize: 20,
                          }}>
                          Select Card
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            height: responsiveHeight(9.5),
                            marginTop: responsiveHeight(2),
                            alignItems: 'center',
                            width: '85%',
                            borderColor: 'white',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgba(214,207,199,0.1)',
                            borderRadius: 5,
                          }}>
                          <TouchableOpacity
                            style={{
                              width: '100%',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}
                            onPress={() => {
                              setSelected('save');
                            }}>
                            <View style={{flex: 1}}>
                              <Icon name="credit-card" type="font-awesome" />
                            </View>
                            <View style={{flex: 4}}>
                              <Text>{card[0].number}</Text>
                            </View>
                            <View style={{flex: 1}}>
                              <AntDesign
                                name={'checkcircle'}
                                size={responsiveFontSize(3.5)}
                                color={
                                  selected == 'save' ? '#e12c2c' : 'lightgray'
                                }
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text
                          style={{
                            marginTop: responsiveHeight(25),
                            fontWeight: 'bold',
                            fontSize: 14,
                            alignSelf: 'center',
                            textAlign: 'center',
                            color: '#393b82',
                          }}>
                          No Card Added
                        </Text>
                      </>
                    )}
                    <Text
                      style={{
                        marginVertical: responsiveHeight(2),
                        fontWeight: 'bold',
                        fontSize: 14,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}>
                      -OR-{'\n'}Add New Card
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        marginTop: responsiveHeight(2),
                        alignItems: 'center',
                        width: '85%',
                        borderColor: 'white',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}>
                      <TouchableOpacity
                        style={{
                          width: '100%',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}
                        onPress={() => {
                          setSelected('new');
                        }}>
                        <View style={{flex: 1}}>
                          <Icon name="credit-card" type="font-awesome" />
                        </View>
                        <View style={{flex: 4}}>
                          <Text>Add New Card</Text>
                        </View>
                        <View style={{flex: 1}}>
                          <AntDesign
                            name={'checkcircle'}
                            size={responsiveFontSize(3.5)}
                            color={selected == 'new' ? '#e12c2c' : 'lightgray'}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{height: '90%', width: '90%'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: responsiveHeight(9),
                          width: '100%',
                          borderWidth: 1,
                          borderColor: 'black',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(214,207,199,0.1)',
                          borderRadius: 5,
                          marginTop: responsiveHeight(1),
                          marginTop: '5%',
                        }}>
                        <Icon name="map-marker" type={'material-community'} />
                        <TextInput
                          placeholder="Enter First Billing Address"
                          style={{
                            width: '85%',
                            textAlign: 'left',
                            letterSpacing: 1,
                            paddingHorizontal: responsiveHeight(2),
                          }}
                          placeholderTextColor={'#000'}
                          keyboardType="default"
                          maxLength={16}
                          value={address}
                          onChangeText={(text) => {
                            setaddress(text);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: responsiveHeight(9),
                          width: '100%',
                          borderWidth: 1,
                          borderColor: 'black',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(214,207,199,0.1)',
                          borderRadius: 5,
                          marginTop: responsiveHeight(1),
                          marginTop: '5%',
                        }}>
                        <Icon name="map-marker" type={'material-community'} />
                        <TextInput
                          placeholder="Enter Second Billing Address"
                          style={{
                            width: '85%',
                            textAlign: 'left',
                            letterSpacing: 1,
                            paddingHorizontal: responsiveHeight(2),
                          }}
                          placeholderTextColor={'#000'}
                          keyboardType="default"
                          maxLength={16}
                          value={address1}
                          onChangeText={(text) => {
                            setaddress1(text);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          height: responsiveHeight(9),
                          width: '100%',
                          borderWidth: 1,
                          borderColor: 'black',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(214,207,199,0.1)',
                          borderRadius: 5,
                          marginTop: responsiveHeight(1),
                          marginTop: '5%',
                        }}>
                        <Icon
                          name="credit-card-marker"
                          type={'material-community'}
                        />
                        <TextInput
                          placeholder="Please Enter Postal Code"
                          style={{
                            width: '85%',
                            textAlign: 'left',
                            letterSpacing: 1,
                            paddingHorizontal: responsiveHeight(2),
                          }}
                          placeholderTextColor={'#000'}
                          keyboardType="default"
                          maxLength={16}
                          value={postalCode}
                          onChangeText={(text) => {
                            setpostalCode(text);
                          }}
                        />
                      </View>

                      <TouchableOpacity
                        style={{
                          marginHorizontal: responsiveHeight(3),
                          height: responsiveHeight(8),
                          backgroundColor: '#e12c2c',
                          marginBottom: responsiveHeight(5),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: responsiveHeight(2),
                          marginTop: responsiveHeight(2),
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                          sendData();
                        }}>
                        {indicator ? (
                          <ActivityIndicator color={'white'} />
                        ) : (
                          <Text
                            style={{
                              fontSize: responsiveFontSize(2.5),
                              color: 'white',
                            }}>
                            Confirm
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <WebView
                  nestedScrollEnabled
                  overScrollMode={'content'}
                  source={{uri: webView}}
                  scrollEnabled={true}
                  scalesPageToFit={true}
                  style={{flex: 1}}
                  onNavigationStateChange={async (state) => {
                    console.log('check state change', state);
                    if (
                      state.url ==
                      'https://app.foodsafety.uk.com/api/order-response-success'
                    ) {
                      let dataa = await AsyncStorage.getItem('token');
                      var myHeaders = new Headers();
                      myHeaders.append('Authorization', `Bearer ${dataa}`);
                      var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow',
                      };
                      fetch(
                        `${myurl}/api/order-response-success`,
                        requestOptions,
                      )
                        .then((response) => response.text())
                        .then((result) => {
                          let dataa = JSON.parse(result);
                          console.log('thisis user cards details', dataa);
                          Toast.show('Order successfull');
                          props.navigation.navigate('Resturents');
                        })
                        .catch((error) => {
                          console.log('user card update eror', error);
                          Toast.show('Order Failed! Try Again');
                          props.navigation.navigate('Resturents');
                        });
                    } else if (
                      state.url ==
                      'https://app.foodsafety.uk.com/api/order-response-error'
                    ) {
                      setWebView('');
                      Alert.alert('Order Failed, Please Try Again');
                      // props.navigation.goBack();
                    }
                  }}
                />
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
  header: {
    height: responsiveHeight(25),
    backgroundColor: '#393b82',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconcontainer: {
    // flex: 1,
    height: responsiveHeight(15),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveWidth(8),
    flexDirection: 'row',
  },
  titlecontainer: {
    flex: 2,
  },
  body: {
    flex: 4,
    alignItems: 'center',
  },
  card: {
    height: responsiveHeight(85),
    width: responsiveWidth(90),
    marginTop: responsiveHeight(-7),
    marginBottom: responsiveHeight(5),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: colorWhite,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
