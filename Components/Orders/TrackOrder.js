import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Alert
} from 'react-native';
import { getDistance } from 'geolib';
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
  phColor,
  headerColor,
  Pink,
} from '../../../GlobalCons/colors';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { ActivityIndicator } from 'react-native-paper';
import MapViewDirections from 'react-native-maps-directions';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = responsiveWidth(100) / responsiveHeight(100);
const LATITUDE = 37.785834;
const LONGITUDE = -122.406417;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyA59B7OZipRRUyYv4YSgJmOdC1ItwGdqt8';
import CustomModal from '../CustomComponents/CustomModal';
import { Divider } from '../CustomComponents/CustomSafeAreaView';
import { Button, ListItem, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import { myurl } from '../../../GlobalCons/myurl';

export default class TrackOrder extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      distance: '',
      currentlatitude: 0,
      currentlongitute: 0,
      coordinates: [
        {
          latitude: 37.3318456,
          longitude: -122.0296002,
        },
        {
          latitude: 37.771707,
          longitude: -122.4053769,
        },
      ],
      lat: 37.785834,
      long: -122.406417,
      isVisible: false,
      distance: 0,
      time: 0,
      data: null,
      currentTime: moment(new Date()).format('hh:mm:s'),
      mydebugnumber: 0,
      errormodalvisible: false,
      errormodalmessage: ''
    };
    Geolocation.getCurrentPosition((value) => {
      console.log('current location value is', value);
      this.setState({ currentlatitude: value.coords.latitude })
      this.setState({ currentlongitute: value.coords.longitude })
    })
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.')
        //this.setState({ errormodalmessage: 'Please connect to Internet' })
        //this.setState({ errormodalvisible: true })
      }
    });
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
    });
    let data = await AsyncStorage.getItem('token');
    console.log(data)
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/order-track'
    fetch(
      `${myurl}/api/order-track`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        //alert(result)
        console.log('track order', JSON.parse(result));
        let dataa = JSON.parse(result);
        if (dataa.successData) {
          let cor = [
            {
              latitude: JSON.parse(dataa.successData.user.latitude),
              longitude: JSON.parse(dataa.successData.user.longitude),
            },
            {
              latitude: JSON.parse(dataa.successData.branch.latitude),
              longitude: JSON.parse(dataa.successData.branch.longitude),
            },
          ];
          this.setState({ data: dataa.successData, coordinates: cor }, () => {
            console.log('track order details', this.state.data.user);
            this.setState({ loading: false })
          });
        } else {
          //this.setState({ errormodalmessage: dataa.message })
          //this.setState({ errormodalvisible: true })
          alert('erre', dataa.message);
        }
      })
      .catch(error => {
        //alert(JSON.stringify(error))
        this.setState({ loading: false });
        this.setState({ errormodalmessage: 'You probably dont have any orders to track.Make some orders!' })
        //this.setState({errormodalvisible:true})
        //console.log('error', error)
      });
    // console.log(' responsiveWidth(100)', responsiveWidth(100))
    this.trackmyorder();

  };


  async trackmyorder() {
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.')
        //this.setState({ errormodalmessage: 'Please connect to the internet!' })
        //this.setState({ errormodalvisible: true })
      }
    });
    setInterval(async () => {
      let data = await AsyncStorage.getItem('token');
      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${data}`);
      // console.log("check usesr token in tracak order",data)
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };
      //'https://pizzakebab.ranglerztech.website/api/order-track'
      fetch(
        `${myurl}/api/order-track`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          console.log('track order after intervals', JSON.parse(result));
          let dataa = JSON.parse(result);
          if (dataa.successData) {
            this.setState({ mydebugnumber: this.state.mydebugnumber + 1 })
            if (dataa.successData.rider == null || dataa.successData.rider == undefined) {
              let cor = [
                {
                  latitude: JSON.parse(dataa.successData.user.latitude),
                  longitude: JSON.parse(dataa.successData.user.longitude),
                },
                {
                  latitude: JSON.parse(dataa.successData.branch.latitude),
                  longitude: JSON.parse(dataa.successData.branch.longitude),
                },
              ];
              this.setState({ data: dataa.successData, coordinates: cor }, () => {
                console.log('track order', this.state.data.user);
                this.setState({ loading: false })
              });
            } else {
              let cor = [
                {
                  latitude: JSON.parse(dataa.successData.user.latitude),
                  longitude: JSON.parse(dataa.successData.user.longitude),
                },
                {
                  latitude: JSON.parse(dataa.successData.rider.latitude),
                  longitude: JSON.parse(dataa.successData.rider.longitude),
                },
              ];
              this.setState({ data: dataa.successData, coordinates: cor }, () => {
                console.log('track order', this.state.data.user);
                this.setState({ loading: false })
              });
            }

          } else {
            //this.setState({ errormodalmessage: 'Please connect to the internet!' })
            //this.setState({ errormodalvisible: true })
            //alert('erre', dataa.message);
          }
        })
        .catch(error => console.log('error', error));

    }, 4000);
  }


  renderRatings = rating => {
    const stars = new Array(5).fill(0);
    return stars.map((_, index) => {
      const activeStar = Math.floor(rating) >= index + 1;
      return (
        <FontAwesome
          name="star"
          key={`star-${index}`}
          size={responsiveWidth(3.5)}
          color={activeStar ? '#ffd523' : 'gray'}
          style={{ marginRight: 4 }}
        />
      );
    });
  };
  onMapPress = e => {
    this.setState({
      coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    });
  };
  render() {
    if (this.state.loading == true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={Styles.Header}>
            <View style={Styles.ArrowView}>
              {/* <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                  // this.props.navigation.goBack();
                }}>
                <Image
                  source={require('../../Assets/icons-Menu-2.png')}
                  style={Styles.headerImageStyle}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{ marginTop: 55, marginLeft: 5 }}
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
                <Icon
                  name={'chevron-left'}
                  type='font-awesome'
                  color={blue}
                  size={responsiveFontSize(3.5)}
                />
              </TouchableOpacity>
            </View>
            <View style={Styles.HeaderTextView}>
              <Text style={Styles.HeaderLargeText}>{'Track Order'}</Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={'rgb(57,59,130)'} />
          </View>
        </View>
      )
    } else if (this.state.errormodalvisible == true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CustomModal isVisible={true}>
            <View
              style={{
                flex: 1,
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              {/* <Divider height={responsiveHeight(15)} /> */}
              <View style={Styles.modalMainContainer}>
                {/*<View style={Styles.modalImageContainer}>
                  <Image
                    source={require('../../Assets/icon-check-alt2.png')}
                    style={styles.modalImageStyle}
                  />
                </View>*/}
                <View style={Styles.modalTextContainer}>
                  <Text style={Styles.modalTextStyle}>
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
                  style={{ backgroundColor: 'red', height: '10%', width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => {
                    this.setState({ errormodalvisible: false })
                    this.navigation.goBack();
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    OK
                  </Text>
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
      )
    }
    else {
      if (Platform.OS === 'ios') {
        return (
          <SafeAreaView forceInset={{ top: 'never' }} style={Styles.container}>
            <View style={Styles.Header}>
              {console.log('current longitude and lat', this.state.currentlatitude, this.state.currentlongitute)}
              <View style={Styles.ArrowView}>
                {/* <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                    // this.props.navigation.goBack();
                  }}>
                  <Image
                    source={require('../../Assets/icons-Menu-2.png')}
                    style={Styles.headerImageStyle}
                  />
                  
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={{ marginTop: 55, marginLeft: 5 }}
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
                  <Icon
                    name={'chevron-left'}
                    type='font-awesome'
                    color={blue}
                    size={responsiveFontSize(3.5)}
                  />
                </TouchableOpacity>
              </View>
              <View style={Styles.HeaderTextView}>
                <Text style={Styles.HeaderLargeText}>{'Track Order'}</Text>
              </View>
            </View>
            {this.state.data && this.state.data.user ? (
              <View style={Styles.mapcon}>
                {/* <MapView
                  style={StyleSheet.absoluteFill}
                  //ref={c => (this.mapView = c)}

                  initialRegion={{
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                >

                  <Marker
                    coordinate={{
                      latitude: this.state.mycodelat,
                      longitude: this.state.mycodelong
                    }}
                  >
                    <Image
source={cust}
style={{
height: 30,
width: 30,
borderRadius: 50
}}
/>
                  </Marker>
                  <Marker
                    coordinate={{
                      latitude: this.state.currentlatitude,
                      longitude: this.state.currentlongitute
                    }}
                  >
                    <Icon
name='silverware-variant'
type='material-community'
reverse={true}
reverseColor={'white'}
color={'#901145'}
size={16}
// style={{

// }}
/>
                  </Marker>

                  <MapViewDirections
                    origin={{
                      latitude: this.state.mycodelat,
                      longitude: this.state.mycodelong,
                    }}
                    destination={{
                      latitude: this.state.destinationlatitude,
                      longitude: this.state.destinationlongitude
                    }}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    strokeColor={'#901145'}
                    optimizeWaypoints={true}
                    onStart={(params) => {
                      console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                      console.log(`Distance: ${result.distance} km`)
                      console.log(`Duration: ${result.duration} min.`)
                      this.setState({ timearrival: result.duration })
                      this.setState({ distance: result.distance })

                    }}
                    onError={(errorMessage) => {
                      // console.log('GOT AN ERROR');
                    }}
                  />
                </MapView> */}
                <MapView
                  initialRegion={{
                    latitude: this.state.currentlatitude,
                    longitude: this.state.currentlongitute,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}

                  // region={this.state.region}
                  style={StyleSheet.absoluteFill}
                  ref={c => (this.mapView = c)}>

                  {/* {this.state.coordinates.map((coordinate, index) => {
                    return (
                      <MapView.Marker
                        key={`coordinate_${index}`}
                        coordinate={coordinate}
                      />
                    );
                  })} */}
                  <MapView.Marker
                    key={`coordinate_${0}`}
                    coordinate={this.state.coordinates[0]}
                  />
                  <MapView.Marker
                    key={`coordinate_${1}`}
                    coordinate={this.state.coordinates[1]}
                  >
                    <Image source={require('../../Assets/riderpic.png')} resizeMode={'contain'} style={{ height: 30, width: 30 }} />
                  </MapView.Marker>
                  {this.state.coordinates.length >= 2 && (
                    <MapViewDirections
                      origin={this.state.coordinates[0]}
                      // waypoints={
                      //   this.state.coordinates.length > 2
                      //     ? this.state.coordinates.slice(1, -1)
                      //     : []
                      // }
                      destination={
                        this.state.coordinates[this.state.coordinates.length - 1]
                      }
                      apikey={GOOGLE_MAPS_APIKEY}
                      strokeWidth={2}
                      strokeColor={'red'}
                      optimizeWaypoints={true}
                      // mode={'BICYCLING'}
                      onStart={params => { }}
                      onReady={result => {
                        console.log("Check REsult of MApViewDirection", result)
                        this.setState({
                          distance: result.distance,
                          time: result.duration,
                        });
                        this.mapView.fitToCoordinates(result.coordinates, {
                          edgePadding: {
                            right: width / 20,
                            bottom: height / 20,
                            left: width / 20,
                            top: height / 20,
                          },
                        });
                      }}
                      onError={errorMessage => { }}
                    />
                  )}
                </MapView>
                <View style={Styles.mapModalContainer}>
                  {/* <Divider height={responsiveHeight(2)} /> */}
                  <ListItem
                    leftIcon={
                      <Icon
                        name='clock-o'
                        type='font-awesome'
                        color='red'
                      />
                    }
                    title={
                      // moment
                      // .utc()
                      // .startOf('day')
                      // .add({ minutes: this.state.time.toFixed(0) })
                      // .format('hh:mm a')
                      this.state.time.toFixed(0) + ' Min'
                      // this.state.data.delivery_date_time !== null ||
                      //     this.state.data.delivery_date_time != undefined
                      //     ? moment(
                      //       this.state.data.delivery_date_time,
                      //       ' hh:mm a',
                      //     ).format(' hh:mm a')
                      //     : 'N/A'
                    }
                    subtitle={'Estimated Arival'}
                    rightTitle={
                      <Text
                        style={[
                          Styles.rightTitleStyle,
                          {
                            //backgroundColor:'blue',
                            width: responsiveWidth(30),
                            justifyContent: 'space-between',
                            alignSelf: 'flex-end',
                            //backgroundColor:'blue'
                          },
                        ]}>
                        <Icon
                          name='map-marker'
                          type='font-awesome'
                          size={20}
                          color='red'
                          style={{ marginTop: 5 }}
                        />{' '}
                        {((this.state.distance / 8) * 5).toFixed(1)} {'miles'}
                      </Text>
                    }

                    rightSubtitle={'Distance'}
                    titleStyle={Styles.leftTitleStyles}
                    subtitleStyle={Styles.leftSubtitleStyles}
                    rightTitleStyle={Styles.rightTitleStyle}
                    rightSubtitleStyle={Styles.rightSubtitleStyle}
                    containerStyle={Styles.listContainer}
                    chevron={
                      {/*<View
                        style={{
                          height: responsiveHeight(4),
                          width: responsiveHeight(4),
                          borderRadius: responsiveHeight(2),
                          backgroundColor: 'rgba(255, 0, 0, 0.6)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <FontAwesome5
                          name="location-arrow"
                          color="#fff"
                          size={responsiveFontSize(1.4)}
                          onPress={async () => {
                            //let currentlatitude = 0
                            //let currentlongitute = 0
                            let destinationlatitude = this.state.coordinates[0].latitude
                            let destinationlongitute = this.state.coordinates[0].longitude
                            //Geolocation.getCurrentPosition((value) => {
                              //currentlatitude = parseFloat(value.coords.latitude)
                              //this.setState({ currentlatitude: parseFloat(value.coords.latitude) })
                              //this.setState({ currentlongitute: parseFloat(value.coords.longitude) })
                              //Alert.alert(
                              //'current position',
                              //JSON.stringify(currentlatitude)
                              //)
                            //})
                            //Alert.alert(
                              //'current coordinates',
                              //JSON.stringify(this.state.currentlatitude)
                            //)

                            let myurl = `https://www.google.com/maps/dir/${this.state.currentlatitude},${this.state.currentlongitute}/${destinationlatitude},${destinationlongitute}`
                            //Alert.alert(
                              //'The coordinates are',
                              //myurl
                            //let myurl = `https://www.google.com/maps/dir/${this.state.coordinates[0].latitude},${this.state.coordinates[0].longitude}/${this.state.coordinates[this.state.coordinates.length-1].latitude},${this.state.coordinates[this.state.coordinates.length-1].longitude}`
                            //)
                            const supported = await Linking.canOpenURL(myurl);
                            if (supported) {
                              await Linking.openURL(myurl)
                            } else {
                              Alert.alert(
                                'Sorry',
                                'An error occured!'
                              )

                            }
                          }}
                        />
                        </View>*/}
                    }
                  />
                  <View style={Styles.progressContainer}>
                    <View
                      style={{
                        height: '100%',
                        width: '60%',
                        backgroundColor: 'rgb(233,81,73)',
                        borderRadius: responsiveWidth(4),
                      }}
                    />
                  </View>
                  <Divider height={responsiveHeight(1)} />
                  {this.state.data && (
                    <ListItem
                      leftIcon={
                        <Ionicons
                          name={'ios-checkbox'}
                          color={'rgb(233,81,73)'}
                          size={responsiveFontSize(2.5)}
                          style={{ marginLeft: responsiveWidth(3) }}
                        />
                      }
                      title={'Order Delivery'}
                      rightTitle={
                        this.state.data.delivery_date_time !== null ||
                          this.state.data.delivery_date_time != undefined
                          ? moment(
                            this.state.data.delivery_date_time,
                            ' hh:mm a',
                          ).format(' hh:mm a')
                          : 'N/A'
                      }
                      titleStyle={Styles.leftTitleStyles2}
                      rightTitleStyle={Styles.rightTitleStyle2}
                      containerStyle={Styles.listContainer2}
                    />
                  )}
                  {this.state.data && (
                    <ListItem
                      leftIcon={
                        <Ionicons
                          name={'ios-checkbox'}
                          color={'rgb(233,81,73)'}
                          size={responsiveFontSize(2.5)}
                          style={{ marginLeft: responsiveWidth(3) }}
                        />
                      }
                      title={'On the Way!'}
                      rightTitle={
                        this.state.data.on_way !== null || undefined
                          ? moment(
                            this.state.data.on_way.trim(),
                            ' hh:mm: a',
                          ).format(' hh:mm a')
                          : 'N/A'
                        // moment
                        // .utc(
                        //   moment(new Date(), 'hh:mm a').diff(
                        //     moment(
                        //       moment
                        //         .utc()
                        //         .startOf('day')
                        //         .add({ minutes: this.state.time.toFixed(0) })
                        //         .format('hh:mm a'),
                        //       'hh:mm a',
                        //     ),
                        //   ),
                        // )
                        // .format('hh:mm a')

                      }
                      // this.state.currentTime-this.state.time}
                      titleStyle={Styles.leftTitleStyles2}
                      rightTitleStyle={Styles.rightTitleStyle2}
                      containerStyle={Styles.listContainer2}
                    />
                  )}
                  {this.state.data && (
                    <ListItem
                      leftIcon={
                        <Ionicons
                          name={'ios-checkbox'}
                          color={'rgb(233,81,73)'}
                          size={responsiveFontSize(2.5)}
                          style={{ marginLeft: responsiveWidth(3) }}
                        />
                      }
                      title={'Food Ready'}
                      rightTitle={
                        this.state.data.food_ready !== null || undefined
                          ? moment(
                            this.state.data.food_ready.trim(),
                            ' hh:mm: a',
                          ).format(' hh:mm a')
                          : 'N/A'
                      }
                      titleStyle={Styles.leftTitleStyles2}
                      rightTitleStyle={Styles.rightTitleStyle2}
                      containerStyle={Styles.listContainer2}
                    />
                  )}
                  {this.state.data && (
                    <ListItem
                      leftIcon={
                        <Ionicons
                          name={'ios-checkbox'}
                          color={'rgb(233,81,73)'}
                          size={responsiveFontSize(2.5)}
                          style={{ marginLeft: responsiveWidth(3) }}
                        />
                      }
                      title={'Food Ordered'}
                      rightTitle={moment(
                        this.state.data.created_at.trim(),
                        ' hh:mm a',
                      ).format(' hh:mm a')}
                      titleStyle={Styles.leftTitleStyles2}
                      rightTitleStyle={Styles.rightTitleStyle2}
                      containerStyle={Styles.listContainer2}
                    />
                  )}
                  {/*<Text>{JSON.stringify(this.state.mydebugnumber)}</Text>*/}
                  <Divider height={responsiveHeight(1)} />
                  {/*<TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      marginRight: responsiveWidth(9),
                    }}
                    onPress={() => { }}
                    activeOpacity={0.7}>
                    <Text style={Styles.dTextStyle}>{'Add New Order'}</Text>
                  </TouchableOpacity>*/}
                  <Divider height={responsiveHeight(1)} />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#393b82',
                    fontSize: responsiveFontSize(3),
                    marginTop: responsiveHeight(5),
                    textAlign: "center"
                  }}>
                  Currently no order is in process.
                </Text>
              </View>
            )}
          </SafeAreaView>
        );
      }
    }
  }
}
const blueBG = '#393b82';
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },
  Header: {
    height: responsiveHeight(19),
    width: '100%',
    backgroundColor: headerColor,
  },
  ArrowView: {
    height: responsiveHeight(10),
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  HeaderTextView: {
    paddingTop: responsiveHeight(1),
    width: '90%',
    alignSelf: 'center',
  },
  HeaderLargeText: {
    color: blue,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(4),
    letterSpacing: 1,
  },
  HeaderSmallText: {
    color: blue,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
    letterSpacing: 1,
  },
  headerImageStyle: {
    width: responsiveWidth(8),
    height: responsiveHeight(5),
    resizeMode: 'contain',
  },
  mapcon: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    backgroundColor: 'red',
    height: responsiveHeight(80),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapcon: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: responsiveHeight(88),
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalMainContainer: {
    height: responsiveHeight(70),
    width: responsiveWidth(85),
    alignSelf: 'center',
    backgroundColor: colorWhite,
    borderRadius: responsiveWidth(2),
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
  buttonStyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#dc4b3e',
    borderRadius: responsiveWidth(10),
  },
  modalButtonContainer: {
    height: responsiveHeight(7.5),
    width: responsiveWidth(70),
    alignSelf: 'center',
    borderRadius: responsiveWidth(10),
    backgroundColor: 'red',
    //  backgroundColor: 'red',
    padding: 0,
  },
  mapModalContainer: {
    height: responsiveHeight(44),
    width: responsiveWidth(100),
    borderTopRightRadius: responsiveWidth(10),
    borderTopLeftRadius: responsiveWidth(10),
    backgroundColor: colorWhite,
    bottom: 0,
  },
  leftTitleStyles: {
    // color: blue,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.9),
    // letterSpacing: 1,
  },
  leftSubtitleStyles: {
    // color: 'rgb(66, 69, 150)',
    fontWeight: '900',
    fontSize: responsiveFontSize(1.6),
    // letterSpacing: 1,
  },
  rightSubtitleStyle: {
    // color: blue,
    fontWeight: '900',
    // textDecorationLine: 'line-through',
    fontSize: responsiveFontSize(1.6),
    // letterSpacing: 1
  },
  rightTitleStyle: {
    color: colorBlack,
    fontWeight: 'bold',
    width: 150, backgroundColor: 'white', paddingLeft: '5%',
    fontSize: responsiveFontSize(1.7),
    // letterSpacing: 1
  },
  listContainer: {
    padding: 0,
    height: responsiveHeight(10),
    width: responsiveWidth(85),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  listContainer2: {
    padding: 0,
    height: responsiveHeight(5),
    width: responsiveWidth(82),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  rightTitleStyle2: {
    color: colorBlack,
    // fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    // letterSpacing: 1
  },
  leftTitleStyles2: {
    // color: blue,
    // fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    // letterSpacing: 1,
  },
  progressContainer: {
    height: responsiveHeight(0.9),
    width: responsiveWidth(78),
    backgroundColor: phColor,
    borderRadius: responsiveWidth(2),
    alignSelf: 'center',
  },
  dTextStyle: {
    color: Pink,
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
});
