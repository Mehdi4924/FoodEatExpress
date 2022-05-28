import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import {
  colorWhite,
  colorBlack,
  lightBlack,
  phColor,
  blue,
} from './../../../GlobalCons/colors';
import {Divider} from '../CustomComponents/CustomSafeAreaView';
import CustomModal from '../CustomComponents/CustomModal';
import {Button, Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {ActivityIndicator, Modal} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import {myurl} from '../../../GlobalCons/myurl';
import Back from 'react-native-vector-icons/FontAwesome';

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      texs: 0,
      addressdtl: '',
      isVisible: false,
      visa: true,
      card: false,
      visatext: '',
      cardText: '',
      loading: false,
      menu: [],
      item: this.props.navigation.state.params.item,
      comment: this.props.navigation.state.params.comment,
      total: this.props.navigation.state.params.total,
      subTotal: this.props.navigation.state.params.subTotal,
      deliveryCharges: this.props.navigation.state.params.deliveryCharges,
      tax: this.props.navigation.state.params.texs,
      orderarray: this.props.navigation.state.params.orderarray,
      userData: null,
      Loading: false,
      data: [],
      usercards: [],
      showicon: {},
      errormodalvisible: false,
      errormodalmessage: '',
      walletcheck: false,
      Payincash: false,
      cardPayment: false,
      phonecheck: false,
      pickUp: false,
      phoneloading: false,
      phonenumber: '',
      discount: this.props.navigation.state.params.discount,
      usercard: [],

      // naye usestates
      userPickUp: false,
      userDelivery: false,
      //idiotbranchid: this.props.navigation.state.params.idiotbranchid,
    };
  }
  componentDidMount = async () => {
    // console.log("i am", this.state.total, this.state.subTotal, this.state.deliveryCharges, this.state.comment, this.state.tax)
    // let dala = await AsyncStorage.getItem("data")
    // let v = JSON.parse(dala)
    // console.log('data',v)
    // console.log('iii', this.state.item)
    //this.setState({loadi})
    //alert(JSON.stringify(this.state.discount))
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        // alert('Error:Please connect to internet.')
      }
    });
    this._navListener = this.props.navigation.addListener(
      'willFocus',
      async () => {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('light-content');
        } else {
          StatusBar.setBarStyle('light-content');
          StatusBar.setBackgroundColor('transparent');
        }
        //const timeZone = await TimeZone.getTimeZone().then(zone => zone);
        let dataa = await AsyncStorage.getItem('token');
        console.log(dataa);
        var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${dataa}`);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        this.setState({loading: true});
        //'https://pizzakebab.ranglerztech.website/api/user-data'
        fetch(`${myurl}/api/user-data`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log('usersssssssss', result);
            let dataa = JSON.parse(result);
            if (dataa.status == 200) {
              this.setState({userData: dataa.successData});
            } else {
              this.setState({errormodalmessage: dataa.message});
              this.setState({errormodalvisible: true});
              //alert(dataa.message);
            }
          })
          .catch((error) => {
            this.setState({errormodalmessage: error});
            this.setState({errormodalvisible: true});
            //alert('error', error)
          });
        //'https://pizzakebab.ranglerztech.website/api/user-card'
        fetch(`${myurl}/api/user-card`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            //console.log("usersssssssss", result)
            let dataa = JSON.parse(result);
            if (dataa.status == 200) {
              this.setState({usercards: dataa.successData, loading: false});
              this.setState({showicon: dataa.successData[0]});
              //alert(this.state.usercards)
            } else {
              this.setState({errormodalmessage: dataa.message});
              this.setState({errormodalvisible: true});
              //alert(dataa.message);
            }
          })
          .catch((error) => {
            this.setState({errormodalmessage: error});
            this.setState({errormodalvisible: true});
            //alert('error', error)
          });
        //   this._navListener = this.props.navigation.addListener('willFocus', () => {
        //     StatusBar.setBarStyle('light-content');
        //     StatusBar.setBackgroundColor('transparent');
        //   });

        //   var formdata = new FormData();
        //   formdata.append('branch_id', this.state.item.item.branch_id);

        //   var requestOptions = {
        //     method: 'POST',
        //     headers: myHeaders,
        //     body: formdata,
        //     redirect: 'follow',
        //   };

        //   fetch('https://pizzakebab.ranglerztech.website/api/get-tax', requestOptions)
        //     .then(response => response.text())
        //     .then(result => {
        //       let dataa = JSON.parse(result);
        //       if (dataa.status == 200) {
        //         dataa.successData.map(item => {
        //           this.setState({ tex: item.percent });
        //         });
        //       } else {
        //         alert(dataa.message);
        //       }
        //     })
        //     .catch(error => alert('error', error.message));
        //   fetch(
        //     'https://pizzakebab.ranglerztech.website/api/get-delivery-charges',
        //     requestOptions,
        //   )
        //     .then(response => response.text())
        //     .then(result => {
        //       let dataa = JSON.parse(result);
        //       if (dataa.status == 200) {
        //         this.setState({
        //           deliveryCharges: dataa.successData.charges,
        //           loading: false,
        //         });
        //       } else {
        //         alert(dataa.message);
        //       }
        //     })
        //     .catch(error => alert('error', error));
      },
    );
  };
  mysave = async () => {
    let dataa = await AsyncStorage.getItem('token');
    console.log('mCONSOLE OF THE MY DATA FUNCTION', dataa);
    let idiotbranchid = await AsyncStorage.getItem('myidiotbranchid');
    this.setState({loading: true});
    console.log('check asyn id', idiotbranchid);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${dataa}`);

    let thesubtotal = this.state.subTotal.toString();
    let thetax = this.state.tax.toString();
    let thedeliverycharges = this.state.deliveryCharges;
    let thetotal = this.state.total;
    //is ma order ma double array ban rahe ha us ko sai karna , size pa click pa price add karne ha , data enter kar ka har kse pa loader lga
    //lena agr zrort mehsos hote ha to , mohib sa text poch ka add karna ha
    let theorderarray = JSON.stringify(this.state.orderarray);
    let finalorderarray = [];
    this.state.orderarray.map((order) => {
      order.orderdata.map((orderdetail) => {
        finalorderarray.push(orderdetail);
      });
    });
    let thebranchid = idiotbranchid;
    let thecomment = this.state.comment;
    var formdata = new FormData();
    formdata.append('subtotal', thesubtotal);
    formdata.append('tax', parseInt(thetax).toFixed(2));
    formdata.append(
      'delivery',
      this.state.userPickUp == true ? 0 : thedeliverycharges,
    );
    formdata.append(
      'total',
      this.state.userPickUp == true
        ? parseInt(this.state.total).toFixed(2) - this.state.deliveryCharges
        : parseInt(this.state.total).toFixed(2),
    );
    formdata.append('menu', JSON.stringify(finalorderarray));
    formdata.append('branch_id', thebranchid);
    formdata.append('feedback', thecomment);
    formdata.append('address_note', this.state.addressdtl);
    formdata.append('discount', parseInt(this.state.discount).toFixed(2));
    if (this.state.walletcheck == true) {
      formdata.append('wallet', true);
    } else if (this.state.phonecheck == true) {
      formdata.append('phone', this.state.phonenumber);
    } else {
      let thecard = this.state.showicon.id.toString();
      formdata.append('card', thecard);
    }
    if (this.state.cardPayment == true) {
      let previousData = {
        subtotal: thesubtotal,
        tax: parseInt(thetax).toFixed(2),
        delivery: this.state.userPickUp == true ? 0 : thedeliverycharges,
        total:
          this.state.userPickUp == true
            ? parseInt(this.state.total).toFixed(2) - this.state.deliveryCharges
            : parseInt(this.state.total).toFixed(2),
        menu: JSON.stringify(finalorderarray),
        branch_id: thebranchid,
        feedback: thecomment,
        address_note: this.state.addressdtl,
        discount: parseInt(this.state.discount).toFixed(2),
        wallet: this.state.walletcheck == true ? true : false,
        phone: this.state.phonenumber,
      };
      console.log('this is prev data to be sent', previousData);
      this.props.navigation.navigate('CardPayment', {
        previousData: previousData,
      });
      this.setState({phonecheck: false});
    } else {
      console.log('check form data ', formdata);
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };
      fetch(`${myurl}/api/save-order`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          console.log('error responce', result);
          let data = JSON.parse(result);
          console.log('responce', data);

          if (data.status == 200) {
            this.setState({phonecheck: false});
            this.setState({loading: false});
            this.setState({isVisible: true});
            this.setState({phoneloading: false});
            await AsyncStorage.removeItem('adeelarray');
          } else if (data.status == 400) {
            this.setState({phonecheck: false});
            this.setState({loading: false});
            this.setState({
              errormodalmessage:
                'Invalid payment detail , kinldy change your payment method to proceed the order.',
            });
            this.setState({errormodalvisible: true});
            this.setState({phoneloading: false});
          }
        })
        .catch((error) => {
          this.setState({phonecheck: false});
          this.setState({loading: false});
          this.setState({
            errormodalmessage:
              'Invalid payment detail , kinldy change your payment method to proceed the order.',
          });
          this.setState({errormodalvisible: true});
          this.setState({phoneloading: false});
        });
    }
  };

  render() {
    if (this.state.errormodalvisible == true) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <CustomModal isVisible={true}>
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
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.5),
                      fontWeight: 'bold',
                      color: '#e12c2c',
                      textAlign: 'center',
                      color: blue,
                    }}>
                    {this.state.errormodalmessage}
                  </Text>
                </View>
                {/*<TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    this.setState({ isVisible: false });
                    this.props.navigation.navigate('TrackOrder');
                  }}>
                  <Text style={styles.modalDecTextStyle}>
                    You can track the delivery in the{' '}
                    <Text style={{ color: '#393b82' }}>"Track Order"</Text>{' '}
                      section
                    </Text>
                </TouchableOpacity>*/}
                <TouchableOpacity
                  style={{
                    backgroundColor: blue,
                    height: '10%',
                    width: '90%',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({errormodalvisible: false});
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>OK</Text>
                </TouchableOpacity>
                {/*<Button
                  title="Ok"
                  onPress={() => {
                    //this.props.navigation.navigate('Resturents');
                    this.setState({ isVisible: false });
                  }}
                  titleStyle={styles.buttonTitleStyle}
                  buttonStyle={[
                    styles.buttonStyle,
                    { borderRadius: responsiveWidth(10) },
                  ]}
                  containerStyle={styles.modalButtonContainer}
                />*/}
              </View>
            </View>
          </CustomModal>
        </View>
      );
    } else if (Platform.OS === 'ios') {
      return (
        <View style={{flex: 1}}>
          <StatusBar translucent backgroundColor="transparent" />
          <SafeAreaView forceInset={{top: 'never'}} style={{flex: 1}}>
            <ScrollView>
              <CustomModal isVisible={this.state.isVisible}>
                <View style={{flex: 1}}>
                  <Divider height={responsiveHeight(15)} />
                  <View style={styles.modalMainContainer}>
                    <View style={styles.modalImageContainer}>
                      <Image
                        source={require('../../Assets/icon-check-alt2.png')}
                        style={styles.modalImageStyle}
                      />
                    </View>
                    <View style={styles.modalTextContainer}>
                      <Text style={styles.modalTextStyle}>
                        {'Your order is received! '}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({isVisible: false});
                        this.props.navigation.navigate('TrackOrder');
                      }}>
                      <Text style={styles.modalDecTextStyle}>
                        You can track the delivery in the{' '}
                        <Text style={{color: '#393b82'}}>"Track Order"</Text>{' '}
                        section
                      </Text>
                    </TouchableOpacity>
                    <Button
                      title="Continue Eating"
                      onPress={async () => {
                        this.props.navigation.navigate('Resturents');
                        this.setState({isVisible: false});
                        await AsyncStorage.removeItem('storeData');
                      }}
                      titleStyle={styles.buttonTitleStyle}
                      buttonStyle={[
                        styles.buttonStyle,
                        {borderRadius: responsiveWidth(10)},
                      ]}
                      containerStyle={styles.modalButtonContainer}
                    />
                  </View>
                </View>
              </CustomModal>

              <View
                style={{
                  height: responsiveHeight(25),
                  borderBottomLeftRadius: responsiveHeight(6.5),
                  borderBottomRightRadius: responsiveHeight(6.5),
                  backgroundColor: '#393b82',
                }}>
                <View
                  style={{
                    marginTop: responsiveHeight(5.5),
                    marginHorizontal: responsiveHeight(2.8),
                  }}>
                  {/* <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.props.navigation.openDrawer();
                    }}>
                    <Image
                      style={{
                        height: responsiveHeight(4),
                        width: responsiveWidth(7),
                      }}
                      source={require('../../Assets/icons-Menu-1.png')}
                    />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{marginTop: 55, marginLeft: 5}}
                    style={{
                      width: 20,
                      marginTop: 10,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}>
                    <Back
                      name={'chevron-left'}
                      type="font-awesome"
                      color={colorWhite}
                      size={responsiveFontSize(3.5)}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginHorizontal: responsiveHeight(3),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(4),
                      color: 'white',
                      marginTop: responsiveHeight(1),
                    }}>
                    Checkout
                  </Text>
                </View>
              </View>

              <View
                style={{
                  //height: responsiveHeight(75),
                  width: responsiveWidth(90),
                  top: responsiveHeight(-4.5),
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  borderRadius: responsiveWidth(2),
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{
                    marginHorizontal: responsiveHeight(3),
                    marginVertical: responsiveHeight(2.5),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontWeight: 'bold',
                    }}>
                    DELIVERY ADDRESS
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                    this.props.navigation.navigate('DeliveryAddress', {item: 0})
                  }
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(12.5),
                    alignItems: 'center',
                    width: '85%',
                    alignSelf: 'center',
                    borderColor: '#393b82',
                    borderWidth: 1,
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      marginHorizontal: responsiveHeight(2),
                      marginVertical: responsiveHeight(2),
                      width: responsiveWidth(55),
                    }}>
                    <Text
                      style={{
                        color: '#393b82',
                        fontSize: responsiveFontSize(1.9),
                      }}>
                      Address
                    </Text>
                    <Text
                      style={{fontSize: responsiveFontSize(1.9)}}
                      numberOfLines={3}>
                      {this.state.userData
                        ? this.state.userData.address
                          ? this.state.userData.address
                          : 'please set your address'
                        : 'please set your address'}
                    </Text>
                  </View>
                  <AntDesign
                    name="checkcircle"
                    size={responsiveFontSize(3.5)}
                    color={'#e12c2c'}
                    style={{
                      left: responsiveWidth(3),
                      // top: responsiveHeight(2.5),
                      // right: responsiveHeight(-6),
                      // position: 'absolute',
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '85%',
                    alignSelf: 'center',
                    marginVertical: 10,
                    height: 60,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: '#393b82',
                  }}>
                  <TextInput
                    value={this.state.addressdtl}
                    placeholder="Add address detail for delivery driver"
                    placeholderTextColor={'#393b82'}
                    numberOfLines={4}
                    style={{padding: 20}}
                    //onChangeText={text => onChangeText(text)}
                    onChangeText={(text) => {
                      this.setState({addressdtl: text});
                    }}
                  />
                </View>
                <View
                  style={{
                    marginHorizontal: responsiveHeight(3),
                    marginVertical: responsiveHeight(2.5),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontWeight: 'bold',
                    }}>
                    PAYMENT METHOD
                  </Text>
                </View>

                {this.state.usercards.map((value, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        alignItems: 'center',
                        // marginHorizontal: responsiveHeight(3),
                        width: '85%',
                        borderColor: this.state.visa ? '#393b82' : 'white',
                        //borderWidth: 1,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}>
                      <TouchableOpacity
                        style={{
                          // marginHorizontal: responsiveHeight(2),
                          // marginVertical: responsiveHeight(2),
                          width: '100%',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}
                        onPress={() => {
                          //this.setState({ visa: true, card: false })
                          this.setState({Payincash: false});
                          this.setState({walletcheck: false});
                          this.setState({pickUp: false});
                          this.setState({showicon: value});

                          //adeel
                        }}>
                        <View style={{flex: 1}}>
                          <Icon name="credit-card" type="font-awesome" />
                        </View>
                        <View style={{flex: 4}}>
                          <Text>{value.number}</Text>
                        </View>
                        <View style={{flex: 1}}>
                          {this.state.showicon &&
                          this.state.showicon.id == value.id ? (
                            <AntDesign
                              name="checkcircle"
                              size={responsiveFontSize(3.5)}
                              color={'#e12c2c'}
                              // style={{
                              //   right:
                              //     this.state.visatext.length <= 10
                              //       ? responsiveHeight(-3)
                              //       : responsiveHeight(0),
                              //   // position: 'absolute',
                              // }}
                            />
                          ) : (
                            <View width={responsiveFontSize(3.5)} />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(9.5),
                    alignItems: 'center',
                    marginHorizontal: responsiveHeight(3),
                    borderColor: 'white',
                    borderWidth: 1,
                    backgroundColor: 'rgba(214,207,199,0.1)',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({walletcheck: false});

                    this.setState({cardPayment: false});
                    this.setState({Payincash: true});
                    this.setState({showicon: {}});
                  }}>
                  <View
                    style={{
                      marginHorizontal: responsiveHeight(2),
                      flex: 4,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: responsiveFontSize(2)}}>
                      Cash Payment
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    {this.state.Payincash == true ? (
                      <AntDesign
                        name="checkcircle"
                        size={responsiveFontSize(3.5)}
                        color={'#e12c2c'}
                      />
                    ) : (
                      <View width={responsiveFontSize(3.5)} />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(9.5),
                    alignItems: 'center',
                    marginHorizontal: responsiveHeight(3),
                    borderColor: 'white',
                    borderWidth: 1,
                    backgroundColor: 'rgba(214,207,199,0.1)',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.setState({walletcheck: false});

                    this.setState({Payincash: false});
                    this.setState({cardPayment: true});
                    this.setState({showicon: {}});
                  }}>
                  <View
                    style={{
                      marginHorizontal: responsiveHeight(2),
                      flex: 4,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: responsiveFontSize(2)}}>
                      Card Payment
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    {this.state.cardPayment == true ? (
                      <AntDesign
                        name="checkcircle"
                        size={responsiveFontSize(3.5)}
                        color={'#e12c2c'}
                      />
                    ) : (
                      <View width={responsiveFontSize(3.5)} />
                    )}
                  </View>
                </TouchableOpacity>
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
                    marginVertical: responsiveHeight(6),
                  }}
                  onPress={async () => {
                    if (this.state.Payincash == true) {
                      this.setState({phonecheck: true});
                    } else if (this.state.cardPayment == true) {
                      this.setState({phonecheck: true});
                    } else if (this.state.walletcheck == true) {
                      this.setState({phonecheck: true});
                    } else {
                      Toast.show('Please Select One Option');
                    }
                  }}>
                  {this.state.loading ? (
                    <ActivityIndicator size={'small'} color="#fff" />
                  ) : (
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.5),
                        color: 'white',
                      }}>
                      Payment
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
            <CustomModal isVisible={this.state.phonecheck}>
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                {/* <Divider height={responsiveHeight(15)} /> */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                  style={styles.modalMainContainer}>
                  <View>
                    {/* filwaqt ismy changes chal rahy han ----------------->>>>>>>>>>>> */}
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.5),
                        fontWeight: 'bold',
                        color: '#e12c2c',
                        textAlign: 'center',
                        color: blue,
                        marginVertical: responsiveHeight(1),
                      }}>
                      Select Collection or Delivery
                    </Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        width: responsiveWidth(70),
                        alignItems: 'center',
                        marginHorizontal: responsiveHeight(3),
                        borderColor: 'white',
                        borderWidth: 1,
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        this.setState({userPickUp: true});
                        this.setState({userDelivery: false});
                      }}>
                      <View
                        style={{
                          marginHorizontal: responsiveHeight(2),
                          flex: 4,
                          flexDirection: 'row',
                        }}>
                        <Text style={{fontSize: responsiveFontSize(2)}}>
                          Collection
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        {this.state.userPickUp == true ? (
                          <AntDesign
                            name="checkcircle"
                            size={responsiveFontSize(3.5)}
                            color={'#e12c2c'}
                          />
                        ) : (
                          <View width={responsiveFontSize(3.5)} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        width: responsiveWidth(70),
                        alignItems: 'center',
                        marginHorizontal: responsiveHeight(3),
                        borderColor: 'white',
                        borderWidth: 1,
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        this.setState({userPickUp: false});
                        this.setState({userDelivery: true});
                      }}>
                      <View
                        style={{
                          marginHorizontal: responsiveHeight(2),
                          flex: 4,
                          flexDirection: 'row',
                        }}>
                        <Text style={{fontSize: responsiveFontSize(2)}}>
                          Delivery
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        {this.state.userDelivery == true ? (
                          <AntDesign
                            name="checkcircle"
                            size={responsiveFontSize(3.5)}
                            color={'#e12c2c'}
                          />
                        ) : (
                          <View width={responsiveFontSize(3.5)} />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{height: responsiveHeight(4)}}>
                    {this.state.userPickUp ? (
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2),
                          marginTop: responsiveHeight(1),
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        No delivery Charges On Collection
                      </Text>
                    ) : this.state.userDelivery ? (
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2),
                          marginTop: responsiveHeight(1),
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}
                        {this.state.deliveryCharges} delivery Charges
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.modalTextContainer}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2),
                        fontWeight: 'bold',
                        color: '#e12c2c',
                        textAlign: 'center',
                        color: blue,
                        width: responsiveWidth(80),
                      }}>
                      {this.state.codeavailable
                        ? 'We sent you a 4-digit code your number via sms.Please enter your code!'
                        : 'Please enter your phone number'}
                    </Text>
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
                      marginTop: responsiveHeight(4),
                    }}>
                    <TextInput
                      placeholder="Phone number"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        paddingHorizontal: responsiveHeight(2),
                      }}
                      placeholderTextColor={'#000'}
                      keyboardType="decimal-pad"
                      maxLength={14}
                      value={this.state.phone}
                      onChangeText={(text) => {
                        this.setState({phonenumber: text});
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: blue,
                      height: '10%',
                      width: '90%',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      if (
                        this.state.userDelivery == false &&
                        this.state.userPickUp == false
                      ) {
                        Toast.show(
                          'Please Select One Payment Method',
                          Toast.SHORT,
                        );
                      } else {
                        if (this.state.phonenumber.length < 10) {
                          Toast.show(
                            'Please enter the phone number again!',
                            Toast.SHORT,
                          );
                        } else {
                          this.setState({phoneloading: true});
                          this.mysave();
                        }
                      }
                    }}>
                    {this.state.phoneloading ? (
                      <ActivityIndicator size={'small'} color="#FFF" />
                    ) : (
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        OK
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'red',
                      height: '10%',
                      width: '90%',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.setState({phonecheck: false});
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </CustomModal>
            {/* </ScrollView> */}
          </SafeAreaView>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1}}>
          <StatusBar translucent backgroundColor="transparent" />
          <SafeAreaView forceInset={{top: 'never'}} style={{flex: 1}}>
            <ScrollView>
              <CustomModal isVisible={this.state.isVisible}>
                <View style={{flex: 1}}>
                  <Divider height={responsiveHeight(15)} />
                  <View style={styles.modalMainContainer}>
                    <View style={styles.modalImageContainer}>
                      <Image
                        source={require('../../Assets/icon-check-alt2.png')}
                        style={styles.modalImageStyle}
                      />
                    </View>
                    <View style={styles.modalTextContainer}>
                      <Text style={styles.modalTextStyle}>
                        {'Your order is received! '}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({isVisible: false});
                        this.props.navigation.navigate('TrackOrder');
                      }}>
                      <Text style={styles.modalDecTextStyle}>
                        You can track the delivery in the{' '}
                        <Text style={{color: '#393b82'}}>"Track Order"</Text>{' '}
                        section
                      </Text>
                    </TouchableOpacity>
                    <Button
                      title="Continue Eating"
                      onPress={async () => {
                        this.props.navigation.navigate('Resturents');
                        this.setState({isVisible: false});
                        await AsyncStorage.removeItem('storeData');
                      }}
                      titleStyle={styles.buttonTitleStyle}
                      buttonStyle={[
                        styles.buttonStyle,
                        {borderRadius: responsiveWidth(10)},
                      ]}
                      containerStyle={styles.modalButtonContainer}
                    />
                  </View>
                </View>
              </CustomModal>

              <View
                style={{
                  height: responsiveHeight(25),
                  borderBottomLeftRadius: responsiveHeight(6.5),
                  borderBottomRightRadius: responsiveHeight(6.5),
                  backgroundColor: '#393b82',
                }}>
                <View
                  style={{
                    marginTop: responsiveHeight(5.5),
                    marginHorizontal: responsiveHeight(2.8),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      this.props.navigation.openDrawer();
                    }}>
                    <Image
                      style={{
                        height: responsiveHeight(4),
                        width: responsiveWidth(7),
                      }}
                      source={require('../../Assets/icons-Menu-1.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginHorizontal: responsiveHeight(3),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(4),
                      color: 'white',
                      marginTop: responsiveHeight(1),
                    }}>
                    Checkout
                  </Text>
                </View>
              </View>

              <View
                style={{
                  //height: responsiveHeight(75),
                  width: responsiveWidth(90),
                  top: responsiveHeight(-7),
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  borderRadius: responsiveWidth(2),
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{
                    marginHorizontal: responsiveHeight(3),
                    marginVertical: responsiveHeight(2.5),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontWeight: 'bold',
                    }}>
                    DELIVERY ADDRESS
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() =>
                    this.props.navigation.navigate('DeliveryAddress', {item: 0})
                  }
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(12.5),
                    alignItems: 'center',
                    width: '85%',
                    alignSelf: 'center',
                    borderColor: '#393b82',
                    borderWidth: 1,
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      marginHorizontal: responsiveHeight(2),
                      marginVertical: responsiveHeight(2),
                      width: responsiveWidth(55),
                    }}>
                    <Text
                      style={{
                        color: '#393b82',
                        fontSize: responsiveFontSize(1.9),
                      }}>
                      Address
                    </Text>
                    <Text
                      style={{fontSize: responsiveFontSize(1.9)}}
                      numberOfLines={3}>
                      {this.state.userData
                        ? this.state.userData.address
                          ? this.state.userData.address
                          : 'please set your address'
                        : 'please set your address'}
                    </Text>
                  </View>
                  <AntDesign
                    name="checkcircle"
                    size={responsiveFontSize(3.5)}
                    color={'#e12c2c'}
                    style={{
                      left: responsiveWidth(3),
                      // top: responsiveHeight(2.5),
                      // right: responsiveHeight(-6),
                      // position: 'absolute',
                    }}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    marginHorizontal: responsiveHeight(3),
                    marginVertical: responsiveHeight(2.5),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontWeight: 'bold',
                    }}>
                    PAYMENT METHOD
                  </Text>
                </View>

                {this.state.usercards.map((value, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        alignItems: 'center',
                        // marginHorizontal: responsiveHeight(3),
                        width: '85%',
                        borderColor: this.state.visa ? '#393b82' : 'white',
                        //borderWidth: 1,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}>
                      <TouchableOpacity
                        style={{
                          // marginHorizontal: responsiveHeight(2),
                          // marginVertical: responsiveHeight(2),
                          width: '100%',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}
                        onPress={() => {
                          //this.setState({ visa: true, card: false })
                          this.setState({Payincash: false});
                          this.setState({walletcheck: false});
                          this.setState({showicon: value});

                          //adeel
                        }}>
                        <View style={{flex: 1}}>
                          <Icon name="credit-card" type="font-awesome" />
                        </View>
                        <View style={{flex: 4}}>
                          <Text>{value.number}</Text>
                        </View>
                        <View style={{flex: 1}}>
                          {this.state.showicon.id == value.id ? (
                            <AntDesign
                              name="checkcircle"
                              size={responsiveFontSize(3.5)}
                              color={'#e12c2c'}
                              // style={{
                              //   right:
                              //     this.state.visatext.length <= 10
                              //       ? responsiveHeight(-3)
                              //       : responsiveHeight(0),
                              //   // position: 'absolute',
                              // }}
                            />
                          ) : (
                            <View width={responsiveFontSize(3.5)} />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(9.5),
                    alignItems: 'center',
                    marginHorizontal: responsiveHeight(3),
                    borderColor: 'white',
                    borderWidth: 1,
                    backgroundColor: 'rgba(214,207,199,0.1)',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    //this.props.navigation.navigate('Topup')
                    this.setState({Payincash: false});
                    this.setState({walletcheck: true});
                    this.setState({showicon: {}});
                  }}>
                  <View
                    style={{
                      marginHorizontal: responsiveHeight(2),
                      //marginVertical: responsiveHeight(2),
                      flex: 4,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: responsiveFontSize(2)}}>
                      Wallet
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    {this.state.walletcheck == true ? (
                      <AntDesign
                        name="checkcircle"
                        size={responsiveFontSize(3.5)}
                        color={'#e12c2c'}
                        // style={{
                        //   right:
                        //     this.state.visatext.length <= 10
                        //       ? responsiveHeight(-3)
                        //       : responsiveHeight(0),
                        //   // position: 'absolute',
                        // }}
                      />
                    ) : (
                      <View width={responsiveFontSize(3.5)} />
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    height: responsiveHeight(9.5),
                    alignItems: 'center',
                    marginHorizontal: responsiveHeight(3),
                    borderColor: 'white',
                    borderWidth: 1,
                    backgroundColor: 'rgba(214,207,199,0.1)',
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    //this.props.navigation.navigate('Topup')
                    this.setState({walletcheck: false});
                    this.setState({Payincash: true});

                    this.setState({showicon: {}});
                  }}>
                  <View
                    style={{
                      marginHorizontal: responsiveHeight(2),
                      //marginVertical: responsiveHeight(2),
                      flex: 4,
                      flexDirection: 'row',
                    }}>
                    <Text style={{fontSize: responsiveFontSize(2)}}>
                      Cash on delivery
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    {this.state.Payincash == true ? (
                      <AntDesign
                        name="checkcircle"
                        size={responsiveFontSize(3.5)}
                        color={'#e12c2c'}
                        // style={{
                        //   right:
                        //     this.state.visatext.length <= 10
                        //       ? responsiveHeight(-3)
                        //       : responsiveHeight(0),
                        //   // position: 'absolute',
                        // }}
                      />
                    ) : (
                      <View width={responsiveFontSize(3.5)} />
                    )}
                  </View>
                </TouchableOpacity>
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
                    marginVertical: responsiveHeight(6),
                  }}
                  onPress={async () => {
                    if (this.state.Payincash == true) {
                      this.setState({phonecheck: true});
                    } else if (this.state.cardPayment == true) {
                      this.setState({phonecheck: true});
                    } else if (this.state.walletcheck == true) {
                      this.setState({phonecheck: true});
                    } else {
                      Toast.show('Please Select One Option');
                    }
                  }}>
                  {this.state.loading ? (
                    <ActivityIndicator size={'small'} color="#fff" />
                  ) : (
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.5),
                        color: 'white',
                      }}>
                      Payment
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
            <CustomModal isVisible={this.state.phonecheck}>
              <View
                style={{
                  flex: 1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                  style={styles.modalMainContainer}>
                  <View>
                    {/* filwaqt ismy changes chal rahy han ----------------->>>>>>>>>>>> */}
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.5),
                        fontWeight: 'bold',
                        color: '#e12c2c',
                        textAlign: 'center',
                        color: blue,
                        marginVertical: responsiveHeight(1),
                      }}>
                      Select Collection or Delivery
                    </Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        width: responsiveWidth(70),
                        alignItems: 'center',
                        marginHorizontal: responsiveHeight(3),
                        borderColor: 'white',
                        borderWidth: 1,
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        this.setState({userPickUp: true});
                        this.setState({userDelivery: false});
                      }}>
                      <View
                        style={{
                          marginHorizontal: responsiveHeight(2),
                          flex: 4,
                          flexDirection: 'row',
                        }}>
                        <Text style={{fontSize: responsiveFontSize(2)}}>
                          Collection
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        {this.state.userPickUp == true ? (
                          <AntDesign
                            name="checkcircle"
                            size={responsiveFontSize(3.5)}
                            color={'#e12c2c'}
                          />
                        ) : (
                          <View width={responsiveFontSize(3.5)} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        height: responsiveHeight(9.5),
                        width: responsiveWidth(70),
                        alignItems: 'center',
                        marginHorizontal: responsiveHeight(3),
                        borderColor: 'white',
                        borderWidth: 1,
                        backgroundColor: 'rgba(214,207,199,0.1)',
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        this.setState({userPickUp: false});
                        this.setState({userDelivery: true});
                      }}>
                      <View
                        style={{
                          marginHorizontal: responsiveHeight(2),
                          flex: 4,
                          flexDirection: 'row',
                        }}>
                        <Text style={{fontSize: responsiveFontSize(2)}}>
                          Delivery
                        </Text>
                      </View>
                      <View style={{flex: 1}}>
                        {this.state.userDelivery == true ? (
                          <AntDesign
                            name="checkcircle"
                            size={responsiveFontSize(3.5)}
                            color={'#e12c2c'}
                          />
                        ) : (
                          <View width={responsiveFontSize(3.5)} />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{height: responsiveHeight(3)}}>
                    {this.state.userPickUp ? (
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2),
                          marginTop: responsiveHeight(1),
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        No delivery Charges On Collection
                      </Text>
                    ) : this.state.userDelivery ? (
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2),
                          marginTop: responsiveHeight(1),
                          color: 'gray',
                          textAlign: 'center',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}
                        {this.state.deliveryCharges} delivery Charges
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.modalTextContainer}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2),
                        fontWeight: 'bold',
                        color: '#e12c2c',
                        textAlign: 'center',
                        color: blue,
                        width: responsiveWidth(80),
                      }}>
                      {this.state.codeavailable
                        ? 'We sent you a 4-digit code your number via sms.Please enter your code!'
                        : 'Please enter your phone number'}
                    </Text>
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
                      marginTop: responsiveHeight(5),
                    }}>
                    <TextInput
                      placeholder="Phone number"
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        paddingHorizontal: responsiveHeight(2),
                      }}
                      placeholderTextColor={'#000'}
                      keyboardType="decimal-pad"
                      maxLength={14}
                      value={this.state.phone}
                      onChangeText={(text) => {
                        this.setState({phonenumber: text});
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      backgroundColor: blue,
                      height: '10%',
                      width: '90%',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={async () => {
                      if (
                        this.state.userDelivery == false &&
                        this.state.userPickUp == false
                      ) {
                        Toast.show(
                          'Please Select One Payment Method',
                          Toast.SHORT,
                        );
                      } else {
                        if (this.state.phonenumber.length < 10) {
                          Toast.show(
                            'Please enter the phone number again!',
                            Toast.SHORT,
                          );
                        } else {
                          this.setState({phoneloading: true});
                          this.mysave();
                        }
                      }
                    }}>
                    {this.state.phoneloading ? (
                      <ActivityIndicator size={'small'} color="#FFF" />
                    ) : (
                      <Text style={{color: 'white', fontWeight: 'bold'}}>
                        OK
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'red',
                      height: '10%',
                      width: '90%',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      this.setState({phonecheck: false});
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </CustomModal>
            {/* </ScrollView> */}
          </SafeAreaView>
        </View>
      );
    }
  }
}

const blueBG = '#393b82';
const red = '#eb3f3f';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },

  headerContainer: {
    height: responsiveHeight(10),
    width: responsiveWidth(100),
    backgroundColor: '#f6f6f6',
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf:'flex-end'
  },
  headerleftContainer: {
    height: '100%',
    width: '80%',
    // backgroundColor: 'green',
    justifyContent: 'center',
    // alignItems: 'center'
  },
  headerImageStyle: {
    marginTop: responsiveHeight(0.7),
    height: '80%',
    width: '20%',
    resizeMode: 'contain',
  },
  titleContainer: {
    height: responsiveHeight(10),
    width: responsiveWidth(90),
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTextStyle: {
    fontSize: responsiveFontSize(4),
    fontWeight: 'bold',
    color: blueBG,
  },
  inputContainer: {
    height: responsiveHeight(9),
    width: responsiveWidth(90),
    alignSelf: 'center',
    // backgroundColor: 'green',
    justifyContent: 'center',
  },
  buttonContainer: {
    height: responsiveHeight(8),
    width: responsiveWidth(80),
    alignSelf: 'center',
    // backgroundColor:red,
    //  backgroundColor: 'red',
    padding: 0,
  },
  buttonStyle: {
    height: '100%',
    width: '100%',
    // backgroundColor: '#303f88',
    backgroundColor: red,
    borderRadius: responsiveWidth(2),
  },
  buttonTitleStyle: {
    fontSize: responsiveFontSize(2.2),
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
    height: responsiveHeight(7),
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

export default Checkout;
