import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from 'react-native';
import {ListItem, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {additemtocart, deleteitemfromcart} from '../../Redux/Action/Action';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {ActivityIndicator} from 'react-native-paper';
import {myurl} from '../../../GlobalCons/myurl';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  colorWhite,
  colorBlack,
  lightBlack,
  phColor,
  blue,
} from './../../../GlobalCons/colors';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
let myarray = [];
let myarray2 = [];
let checktext = 'checktext';
let theitemname = 'Helloo';
let orderdata = '';
let theitemdescription = 'World';
let theitemimage = ' ';
let theprice;
let tempobj = {};
let menuarray = [];
let adeelextraid;
let globaldeliverycharges = 0;
let globaltaxes = 0;
let globaldiscount = 0;
let appstartchek = 'false';
//let checkforarraygettinglengthzero = true;
//let thefrom = '';

let country = '';

const mapStateToProps = (state) => {
  return {
    theitemsincart: state.itemsincart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    additemtocartthroughdispatch: (item, qty) =>
      dispatch(additemtocart(item, qty)),
  };
};

class Mycart extends Component {
  constructor(props) {
    super(props);
    //theitem = JSON.stringify(this.props.navigation.state.params.item);
    //theorder = JSON.stringify(this.props.navigation.state.params.order);
    this.state = {
      item: this.props.navigation.state.params.item,
      order: this.props.navigation.state.params.order,
      refersh: false,
      comment: '',
      texs: 0,
      deliveryCharges: 0,
      loading: false,
      totalprice: 0,
      subTotal: 0,
      refersh: false,
      notmyarray: [],
      data: null,
      loading: false,
    };
  }
  //old code

  //old code
  didmountsate = async () => {
    // myarray=[];
    console.log(
      'country value in useEffect',
      this.props.navigation.state.params,
    );
    let value = await AsyncStorage.getItem('country');
    console.log('check the country state', value);
    country = JSON.parse(value);
    if (this.state.subTotal == 0) {
      this.setState({loading: true});
    } else {
      this.setState({loading: false});
    }
    console.log(
      'CHECK THE PARAMS DATA ',
      this.props.navigation.state.params.item,
    );
    tempobj = {};
    if (this.props.navigation.state.params.from == 'stack') {
      theitemname = this.props.navigation.state.params.item.item.name;
      theitemdescription = this.props.navigation.state.params.item.item
        .description;
      theitemimage = this.props.navigation.state.params.item.item.image;
      theprice = this.props.navigation.state.params.price;
      orderdata = this.props.navigation.state.params.item.orderdata;
      // menuarray = this.props.navigation.state.params.item.menu;
      adeelextraid = this.props.navigation.state.params.item.item.id;

      let tempitemobj = this.props.navigation.state.params.item;

      tempobj = {
        name: theitemname,
        description: theitemdescription,
        image: theitemimage,
        orderdata: orderdata,
        price: this.props.navigation.state.params.price,
        // menu: menuarray,
        extraid: adeelextraid,
      };

      let found = myarray.some((value) => value.name == tempobj.name);
      let found2 = myarray2.some((value) => value.name == tempobj.name);
      let _Found = myarray.findIndex((value, index) => {
        if (value.name == theitemname) {
          return true;
        }
      });
      if (found == true && myarray.length != 0 && theprice != 0) {
        // myarray[_Found]=tempobj;
        let storeData = JSON.stringify(await AsyncStorage.getItem('storeData'));
        console.log('after deleting in cart pagr2', storeData);
        if (storeData === 'null') {
          myarray = [];
          // tempobj={};
          myarray.push(tempobj);
          console.log('after deleting in cart 1', myarray);
        } else {
          // myarray=[];
          let dat = JSON.parse(storeData);
          myarray.push(tempobj);
          console.log('after deleting in cart 2', JSON.parse(storeData));
        }
        // myarray[_Found].price = myarray[_Found].price
      }

      if (found == false && theprice != 0) {
        //Toast.show('The value is present', Toast.SHORT)
        this.props.additemtocartthroughdispatch(tempitemobj, 1);
        console.log(
          'after deleting in cart pagr',
          await AsyncStorage.getItem('storeData'),
        );
        let storeData = JSON.stringify(await AsyncStorage.getItem('storeData'));
        console.log('after deleting in cart pagr2', storeData);
        if (storeData === 'null') {
          myarray = [];
          // tempobj={};
          myarray.push(tempobj);
          console.log('after deleting in cart 1', myarray);
        } else {
          // myarray=[];
          let dat = JSON.parse(storeData);
          myarray.push(tempobj);
          console.log('after deleting in cart 2', JSON.parse(storeData));
        }
        //  this.refreshprices();
        myarray2.push(tempobj);
      }
      let idiotbranchid = 0;
      let idiotbranchname = '';
      await AsyncStorage.setItem(
        'myidiotbranchid',
        JSON.stringify(this.props.navigation.state.params.item.item.branch.id),
      );
      await AsyncStorage.setItem(
        'myidiotbranchname',
        this.props.navigation.state.params.item.item.branch.name,
      );
    } else {
      let savedarray = await AsyncStorage.getItem('storeData');
      savedarray != null ? JSON.parse(savedarray) : null;
      if (JSON.parse(savedarray) == null) {
        myarray = [];
      } else {
        myarray = JSON.parse(savedarray);
      }
    }
    // this.refreshprices();
  };

  componentDidMount = () => {
    // this.dummystate();
    this.getTax_Delivery();
    this.didmountsate();
  };
  getTax_Delivery = async () => {
    globaldeliverycharges = 0;
    globaltaxes = 0;
    globaldiscount = 0;
    console.log('Tax Delivery Csll');
    let dataa = await AsyncStorage.getItem('token');
    let branch = await AsyncStorage.getItem('branch_id');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${dataa}`);
    var formdata = new FormData();
    formdata.append(
      'branch_id',
      branch && branch !== undefined
        ? branch
        : Array.isArray(this.state.item)
        ? this.state.item[0].item.branch_id
        : this.state.item.item.branch_id,
    );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    await fetch(`${myurl}/api/get-tax`, requestOptions)
      .then((Response) => Response.text())
      .then((result) => {
        //alert(result)
        let dataa = JSON.parse(result);
        console.log('getTax responce sucess', dataa);

        if (
          dataa.status == 200 &&
          dataa.successData &&
          dataa.successData.length > 0
        ) {
          dataa.successData.map(async (item) => {
            let thesubtotalingprice = 0;
            myarray.map((value) => {
              thesubtotalingprice = value.price + thesubtotalingprice;
            });
            let actualtax = (item.percent * thesubtotalingprice) / 100;
            this.setState({texs: actualtax});
            globaltaxes = actualtax;

            if (thesubtotalingprice >= parseInt(item.min_spend)) {
              let actualdiscount =
                (item.percentage_off * thesubtotalingprice) / 100;
              //this.setState({ texs: actualtax })
              globaldiscount = actualdiscount;
              //Toast.show(JSON.stringify(globaldiscount),Toast.SHORT)
            }
          });
        } else {
          this.setState({texs: 0});
          globaltaxes = 0;
        }
      })
      .catch((error) => {
        globaltaxes = 0;
      });
    await fetch(`${myurl}/api/get-delivery-charges`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let dataa = JSON.parse(result);
        console.log('get delivery tax info ', dataa);
        if (dataa.status == 200) {
          this.setState({
            deliveryCharges: dataa.successData
              ? dataa.successData.charges
              : '0',
            loading: false,
          });
          globaldeliverycharges = dataa.successData.charges;
        } else {
          globaldeliverycharges = 0;
        }
      })
      .catch((error) => {
        globaldeliverycharges = 0;
      });
    //old code
    let thesubtotalingprice = 0;
    let thedeliverycharges = globaldeliverycharges;
    let thetax = globaltaxes;
    let thediscount = globaldiscount;
    myarray.map((value) => {
      thesubtotalingprice = value.price + thesubtotalingprice;
      console.log('price in myarray functon', value.price);
      this.setState({refersh: !this.state.refersh});
    });
    let thetotalprice = 0;

    console.log('subtotalprice>>>>>>>', thesubtotalingprice);
    console.log('delivery>>>>>>>', thedeliverycharges);
    console.log('tax>>>>>>>', thetax);
    console.log('discount>>>>>>>', thediscount);

    // Toast.show(JSON.stringify(thediscount),Toast.SHORT)
    // old line thetotalprice = parseInt(thedeliverycharges) + (thetax) + parseInt(thesubtotalingprice) -(thediscount)
    thetotalprice =
      JSON.parse(thedeliverycharges) +
      thetax +
      thesubtotalingprice -
      thediscount;

    console.log('thetotalprice>>>>>>>', thetotalprice);

    this.setState({subTotal: thesubtotalingprice});
    this.setState({totalprice: thetotalprice});
  };
  refreshprices = () => {
    console.log('refresh');
    if (myarray.length == 0) {
      this.setState({deliveryCharges: 0});
      this.setState({texs: 0});
      this.setState({totalprice: 0});
      this.setState({subTotal: 0});
    } else {
      let thesubtotalingprice = 0;
      let thedeliverycharges = JSON.parse(globaldeliverycharges);
      let thetax = globaltaxes;
      myarray.map((value) => {
        thesubtotalingprice = value.price + thesubtotalingprice;
      });
      let thetotalprice = 0;

      // old line thetotalprice = parseInt(thedeliverycharges) + parseInt(thetax) + parseInt(thesubtotalingprice)
      thetotalprice = thedeliverycharges + thetax + thesubtotalingprice;
      console.log('refresh', thedeliverycharges);
      console.log('refresh', thetax);
      console.log('refresh', thesubtotalingprice);
      console.log('refresh', thetotalprice);
      this.setState({subTotal: thesubtotalingprice});
      this.setState({totalprice: thetotalprice});
      console.log('carttt>>>> Calculator', totalprice);
    }
  };
  storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(myarray);
      await AsyncStorage.setItem('mydata', jsonValue);
    } catch (e) {
      Alert.alert('Error', e.toString());
      //Toast.show('Nope',Toast.SHORT);
    }
  };
  getData = async () => {
    try {
      const myvalue = await AsyncStorage.getItem('mydata');
      Alert.alert('The stored value is', myvalue);
      //return myvalue != null ? JSON.parse(myvalue) : null;
    } catch (e) {
      // error reading value
      Alert.alert('Error', e.toString());
    }
  };
  keyExtractor = (item, index) => {
    index.toString();
  };
  render() {
    let atheitem = '';
    let atheorder = '';
    console.log('44444444444444', this.props.navigation.state.params.item);
    //if (this.props.navigation.state.params.item) {
    //atheitem = JSON.stringify(this.props.navigation.state.params.item.item);
    //atheorder = JSON.stringify(this.props.navigation.state.params.order);
    let theitem = this.props.theitemsincart;

    if (myarray.length == 0) {
      return (
        <View style={{flex: 1}}>
          <StatusBar
            barStyle={'light-content'}
            translucent
            backgroundColor="transparent"
          />
          <View
            style={{
              height: responsiveHeight(15),
              backgroundColor: '#393b82',
              flexDirection: 'row',
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
                                        width: responsiveWidth(8),
                                    }}
                                    source={require('../../Assets/icons-Menu-1.png')}
                                />
                            </TouchableOpacity> */}
              <TouchableOpacity
                style={{marginTop: 55, marginLeft: 5}}
                style={{
                  width: 50,
                  marginTop: 10,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Icon
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
                  fontSize: responsiveFontSize(3.8),
                  color: 'white',
                  marginTop: responsiveHeight(6.6),
                }}>
                Cart
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#393b82',
                fontSize: responsiveFontSize(4),
                marginTop: responsiveHeight(5),
              }}>
              No item in cart.
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <ScrollView style={{paddingBottom: 170}}>
          <View style={{flex: 1}}>
            <View
              style={{
                height: responsiveHeight(25),
                borderBottomLeftRadius: responsiveHeight(6.5),
                borderBottomRightRadius: responsiveHeight(6.5),
                backgroundColor: '#393b82',
                zIndex: 0,
              }}>
              <View
                style={{
                  marginTop: responsiveHeight(5.5),
                  marginHorizontal: responsiveHeight(2.8),
                }}>
                {/* <TouchableOpacity
                  style={{ marginTop: 55, marginLeft: 5 }}
                  style={{
                    width: 50,
                    marginTop: 10,
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Icon
                    name={'chevron-left'}
                    type='font-awesome'
                    color={colorWhite}
                    size={responsiveFontSize(3.5)}
                  />
                </TouchableOpacity> */}
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
                  Cart
                </Text>
              </View>
            </View>
            <ScrollView
              style={{
                marginTop: '-15%',
                // width: responsiveWidth(100),
                // height: responsiveHeight(100),
              }}>
              <View
                style={{
                  //height: responsiveHeight(25),
                  width: responsiveWidth(90),
                  // top: responsiveHeight(-5),
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  borderRadius: responsiveWidth(2),
                  backgroundColor: '#fff',
                  zIndex: 1,
                }}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: responsiveHeight(5),
                      alignItems: 'center',
                      marginHorizontal: responsiveHeight(3),
                    }}>
                    <Text style={{fontSize: responsiveFontSize(1.5)}}>
                      Subtotal
                    </Text>
                    <View
                      style={{
                        marginLeft: responsiveHeight(3),
                        flexDirection: 'row',
                        right: 0,
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          color: 'rgba(0,0,0,0.3)',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}{' '}
                        {this.state.subTotal.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: responsiveHeight(5),
                      alignItems: 'center',
                      marginHorizontal: responsiveHeight(3),
                    }}>
                    <Text style={{fontSize: responsiveFontSize(1.5)}}>
                      Tax & Fees
                    </Text>
                    <View
                      style={{
                        marginLeft: responsiveHeight(3),
                        flexDirection: 'row',
                        right: 0,
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          color: 'rgba(0,0,0,0.3)',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}{' '}
                        {this.state.texs.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: responsiveHeight(5),
                      alignItems: 'center',
                      marginHorizontal: responsiveHeight(3),
                    }}>
                    <Text style={{fontSize: responsiveFontSize(1.5)}}>
                      Delivery
                    </Text>
                    <View
                      style={{
                        marginLeft: responsiveHeight(3),
                        flexDirection: 'row',
                        right: 0,
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          color: 'rgba(0,0,0,0.3)',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}{' '}
                        {JSON.parse(this.state.deliveryCharges).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: responsiveHeight(5),
                      alignItems: 'center',
                      marginHorizontal: responsiveHeight(3),
                    }}>
                    <Text style={{fontSize: responsiveFontSize(1.5)}}>
                      Discount
                    </Text>
                    <View
                      style={{
                        marginLeft: responsiveHeight(3),
                        flexDirection: 'row',
                        right: 0,
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.7),
                          color: 'rgba(0,0,0,0.3)',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}{' '}
                        {globaldiscount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: responsiveHeight(2.5),
                      alignItems: 'center',
                      marginHorizontal: responsiveHeight(3),
                      borderColor: '#0D0d0d',
                      borderBottomWidth: 0.71,
                    }}
                  />
                  <View
                    style={{
                      //top: responsiveHeight(1.5),
                      flexDirection: 'row',
                      height: responsiveHeight(5),
                      alignItems: 'center',
                      marginHorizontal: responsiveHeight(3),
                    }}>
                    <Text
                      style={{
                        fontSize: responsiveFontSize(2.5),
                        color: '#e12c2c',
                      }}>
                      Total
                    </Text>
                    <View
                      style={{
                        marginLeft: responsiveHeight(3),
                        flexDirection: 'row',
                        right: 0,
                        position: 'absolute',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2.5),
                          color: '#e12c2c',
                        }}>
                        {this.props.navigation.state.params.country != null
                          ? this.props.navigation.state.params.country ==
                            'pakistan'
                            ? 'PKR'
                            : '£'
                          : '£'}{' '}
                        {
                          //parseInt(this.state.subTotal)+parseInt(this.state.deliveryCharges)+parseInt(this.state.texs)
                          this.state.totalprice.toFixed(2)
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: responsiveWidth(90),
                  top: responsiveHeight(2),
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  borderRadius: responsiveWidth(2),
                  //marginBottom: '20%',
                  backgroundColor: '#fff',
                }}>
                {console.log('myarray in return of cart', myarray)}
                {myarray.map((value, index) => {
                  console.log('check myarray map', value);
                  return (
                    <View
                      style={{
                        marginHorizontal: responsiveHeight(2),
                        marginVertical: responsiveHeight(1.5),
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          height: responsiveHeight(8),
                          width: responsiveWidth(15),
                          resizeMode: 'cover',
                          borderRadius: 5,
                        }}
                        source={{uri: value.image}}
                      />
                      <View style={{marginHorizontal: responsiveHeight(1)}}>
                        <View style={{width: responsiveWidth(60)}}>
                          <Text
                            numberOfLines={1}
                            style={{fontSize: 16, fontWeight: 'bold'}}
                            ellipsizeMode="tail">
                            {value.name}
                          </Text>
                        </View>
                        {console.log('check menu in myarray map ', value.menu)}

                        {value.orderdata.map((nextvalue) => {
                          return nextvalue.detail.map((nextvalue) => {
                            return (
                              <View style={{width: responsiveWidth(60)}}>
                                {console.log('nextvalue', nextvalue)}
                                <Text
                                  style={{
                                    color: 'grey',
                                    marginTop: 3,
                                    width: '85%',
                                  }}
                                  numberOfLines={1}
                                  ellipsizeMode="tail">
                                  {nextvalue.quantity} x {nextvalue.size}{' '}
                                  {value.name}
                                </Text>
                              </View>
                            );
                          });
                        })}
                        <Text style={{fontSize: 16, marginTop: 5}}>
                          {' '}
                          {this.props.navigation.state.params.country != null
                            ? this.props.navigation.state.params.country ==
                              'pakistan'
                              ? 'PKR'
                              : '£'
                            : '£'}{' '}
                          {value.price.toFixed(2)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{position: 'absolute', right: 0}}
                        onPress={async () => {
                          // this.setState({loading:true})
                          let temparray = myarray;
                          myarray = temparray.filter(
                            (thevalue, indexccc) => index != indexccc,
                          );
                          await AsyncStorage.setItem(
                            'adeelarray',
                            JSON.stringify(myarray),
                          );
                          myarray = myarray;
                          Toast.show(
                            'Item was removed from the cart',
                            Toast.SHORT,
                          );
                          // this.setState({ refersh: !this.state.refersh })
                          // this.refreshprices();
                          this.getTax_Delivery();
                          // this.setState({loading:false})
                        }}>
                        <Icon name="trash-o" color="#e12c2c" size={26} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              <View
                style={{
                  // height: responsiveHeight(11),
                  //marginTop: '100%',
                  width: responsiveWidth(90),
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  marginBottom: 10,
                  shadowRadius: 2,
                  elevation: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: responsiveHeight(3.5),
                  borderRadius: responsiveWidth(2),
                  backgroundColor: '#fff',
                  paddingVertical:responsiveHeight(2),
                }}>
                <View style={{flexDirection: 'row'}}>
                  {/* <ion-icon name="alert-circle-outline"></ion-icon> */}
                  <Ionicons
                    name="alert-circle-outline"
                    color={'#393b82'}
                    style={{marginTop: 10, marginRight: 5}}
                    size={responsiveHeight(3)}
                  />
                  <Text
                    style={{
                      width: responsiveWidth(75),
                      textAlign: 'justify',
                      lineHeight: 16,
                    }}>
                    If you have a food allergy or intolerance (or someone
                    your're ordering for has) phone the restaurant or store on{' '}
                    <Text style={{color: '#393b82', fontWeight: 'bold'}}>
                      {this.props.navigation.state.params.Phone}
                    </Text>{' '}
                    before placing your order
                  </Text>
                </View>
                {/* <View
                                style={{
                                    height: responsiveHeight(10),
                                    flexDirection: 'row',
                                    marginHorizontal: responsiveHeight(3),
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 0.71,
                                    alignItems: 'flex-end',
                                }}>
                                    
                                <TextInput
                                    placeholder="Add Special Instruction"
                                    value={this.state.comment}
                                    onChangeText={text => {
                                        this.setState({ comment: text });
                                    }}
                                    // style={{flex:1,backgroundColor:"red",height:50}}
                                    placeholderTextColor="rbga(0,0,0,0.3)"
                                />
                            </View> */}
              </View>
              <View
                style={{
                  height: responsiveHeight(8),
                  width: responsiveWidth(90),
                  //marginTop: '100%',
                  alignSelf: 'center',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  elevation: 10,
                  top: responsiveHeight(4.5),
                  borderRadius: responsiveWidth(2),
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{
                    height: responsiveHeight(6),
                    flexDirection: 'row',
                    marginHorizontal: responsiveHeight(3),
                    // borderBottomColor: 'black',
                    borderBottomWidth: 0.71,
                    alignItems: 'flex-end',
                  }}>
                  <TextInput
                    placeholder="Add Special Instruction"
                    value={this.state.comment}
                    numberOfLines={4}
                    underlineColorAndroid="grey"
                    onChangeText={(text) => {
                      this.setState({comment: text});
                    }}
                    // style={{flex:1,backgroundColor:"red",height:50}}
                    placeholderTextColor="rbga(0,0,0,0.3)"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{
                  marginHorizontal: responsiveHeight(3),
                  height: responsiveHeight(8),
                  backgroundColor: '#e12c2c',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: responsiveHeight(2),
                  marginTop: responsiveHeight(8),
                  marginVertical: responsiveHeight(6),
                  zIndex: 0,
                }}
                activeOpacity={0.7}
                onPress={async () => {
                  // this.save();
                  //let branch = await AsyncStorage.getItem('branch_id');
                  //Alert.alert(
                  //'BRANCH',
                  //branch
                  //)

                  if (this.state.totalprice == 0) {
                    Toast.show(
                      'Your cart is empty.Please place some items in cart!',
                      Toast.SHORT,
                    );
                  } else {
                    if (this.state.loading == true) {
                      Toast.show('Please wait while we calculate', Toast.SHORT);
                    } else {
                      let dataa = await AsyncStorage.getItem('token');
                      console.log('this is console of dataa', dataa);
                      if (dataa == null) {
                        console.log('hello');
                        this.props.navigation.navigate('Login');
                      } else {
                        let orderarray = [];
                        myarray.map((item) => {
                          console.log('check menu in checkout', item.orderdata);
                          orderarray.push(item.orderdata);
                        });
                        console.log('check orderarray', orderarray);
                        console.log('check myArray', myarray);

                        // console.log('check order array 1',this.state.comment)
                        // console.log('check order array 2',this.state.subTotal)
                        // console.log('check order array 3',this.state.texs)
                        // console.log('check order array 4',this.state.deliveryCharges)
                        // console.log('check order array 5',globaldiscount)
                        // console.log('check order array 6',orderarray)

                        this.props.navigation.navigate('Checkout', {
                          item: this.state.item,
                          comment: this.state.comment,
                          total: this.state.totalprice,
                          subTotal: this.state.subTotal,
                          texs: this.state.texs,
                          deliveryCharges: this.state.deliveryCharges,
                          orderarray: myarray,
                          discount: globaldiscount,
                          country: country,
                        });
                      }
                    }

                    /*Alert.alert(
                                            'Data',
                                            `comment: ${this.state.comment}, total: ${this.state.totalprice}, subtotal: ${this.state.subTotal}, taxes: ${this.state.texs},deliverycharges: ${this.state.deliveryCharges}`
                                        )*/
                  }
                  // this.review();
                }}>
                {this.state.loading ? (
                  <ActivityIndicator size={'small'} color="#fff" />
                ) : (
                  <Text
                    style={{fontSize: responsiveFontSize(2.5), color: 'white'}}>
                    Checkout
                  </Text>
                )}
              </TouchableOpacity>
              {this.props.navigation.state.params.from !== 'drawer' && (
                <TouchableOpacity
                  style={{
                    marginHorizontal: responsiveHeight(3),
                    height: responsiveHeight(8),
                    backgroundColor: '#393b82',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: responsiveHeight(2),
                    zIndex: 0,
                    marginTop: responsiveHeight(-3),
                    marginBottom: responsiveHeight(6),
                  }}
                  activeOpacity={0.7}
                  onPress={async () => {
                    if (this.state.loading == true) {
                      Toast.show('Please wait while we calculate', Toast.SHORT);
                    } else {
                      await AsyncStorage.setItem(
                        'storeData',
                        JSON.stringify(myarray),
                      );
                      await AsyncStorage.setItem(
                        'cartValues',
                        JSON.stringify(this.props.navigation.state.params),
                      );
                      let idiotbranchid = await AsyncStorage.getItem(
                        'myidiotbranchid',
                      );
                      let idiotbranchname = await AsyncStorage.getItem(
                        'myidiotbranchname',
                      );
                      console.log(
                        'check the country state',
                        this.props.navigation.state,
                      );
                      // await AsyncStorage.setItem('myidiotbranchid', JSON.stringify(this.props.navigation.state.params.item.item.branch.id));
                      // await AsyncStorage.setItem('myidiotbranchname', this.props.navigation.state.params.item.item.branch.name);
                      this.props.navigation.navigate('Categories', {
                        id: this.props.navigation.state.params.item.item.branch
                          .id,
                        name: this.props.navigation.state.params.item.item
                          .branch.name,
                        country: this.props.navigation.state.params.country,
                      });
                      AsyncStorage.setItem(
                        'Currency',
                        this.props.navigation.state.params.country,
                      );
                      AsyncStorage.setItem(
                        'phone',
                        this.props.navigation.state.params.Phone,
                      );
                      //Alert.alert(
                      //'i got the branch id',
                      //JSON.stringify(idiotbranchid)
                      //)
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
                      Add More Order{' '}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  maincontainer: {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Mycart);
