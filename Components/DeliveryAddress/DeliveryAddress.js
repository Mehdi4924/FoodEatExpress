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
  Modal,
  Dimensions,
  Alert,
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
  phColor,
} from '../../../GlobalCons/colors';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MapView, { PROVIDER_GOOGLE, Marker, PROVIDER_APPLE } from 'react-native-maps';
import { SafeAreaView } from 'react-navigation';
import CustomModal from '../CustomComponents/CustomModal';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-community/async-storage';
import Geocoder from 'react-native-geocoding';
import { ActivityIndicator } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo'
import { Value } from 'react-native-reanimated';
import { myurl } from '../../../GlobalCons/myurl';

const window = Dimensions.get('window');
const { width, height } = window;
const LATITUDE_DELTA = 0.004;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};
export default class DeliveryAddress extends Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      Lat: 0,
      mylat: 0,
      Long: 0,
      mylong: 0,
      datasource: [1, 2, 4, 5, 6],
      data: [],
      Visible: false,
      data: [],
      sL_long: 'Address',
      loading: false,
      loader: false,
      item: this.props.navigation.state.params.item,
      region: null,
      refresh: false,
      newadress: false,
      custommodalvisiblility: false
    }
    /*Geolocation.getCurrentPosition((Value)=>{
      Alert.alert(
        'The location is',
        JSON.stringify(Value)
      )s
    })*/
  }

  componentDidMount() {
    console.log('i am there', new Date().getTimezoneOffset() / 60);
    Geocoder.init('AIzaSyDYDxMDR6_NTCfynYvm6V1YvhiNbHt6uV4');
    NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.')
      }
    });
    Geolocation.getCurrentPosition(
      info => {
        /*Alert.alert(
          'Geolocation',
          JSON.stringify(info)
        )*/
        Geocoder.from(info.coords.latitude, info.coords.longitude)
          .then(json => {
            var addressComponent = json.results[0].formatted_address;
            console.log('address component232323', json.results[0].address_components);
            this.setState({ sL_long: addressComponent });
          })
          .catch(error => {
            Alert.alert(
              'Please turn on location',
              JSON.stringify(error)
            )
          })
        let region = {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        // console.log('location', info);
        this.setState({
          region: region,
          Lat: info.coords.latitude,
          Long: info.coords.longitude,
          loading: true,
        });

      },

      error => {
        this.setState({ custommodalvisiblility: true })
        //if (this.state.Lat == 0 && this.state.Long == 0) {
        //Alert.alert(
        //'LOCATION ERROR',
        //'Please turn on your location',
        //[
        //{ text: 'OK', onPress: () => this.props.navigation.navigate('Checkout') }
        //],
        //{ cancelable: false }
        //)
      }
      //}
      ,
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
    //setTimeout(() => {

    //}, 5000)

    this._navListener = this.props.navigation.addListener('willFocus', () => {
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('light-content');
      } else {
        console.log('i am here');
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('transparent');
      }
    });
  }

  searchUpdated = async () => {
    this.setState({ loader: true });
    /*Geocoder.from(this.state.Lat, this.state.Long)
      .then(json => {
        var address_component = json.results[0].formatted_address;
        this.setState({ sL_long: address_component });
      }).error(error => {
        Alert.alert(
          'Error',
          JSON.stringify(error)
        )
      })*/
    let data = await AsyncStorage.getItem('token');
    console.log(this.state.sL_long, this.state.Long, data);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);
      let country=''
    console.log('address', this.state.sL_long);
    console.log('latitude', this.state.Lat);
    console.log('Longitude', this.state.Long);
    if (this.state.sL_long.indexOf('Pakistan') > -1) {
      country='pakistan'
    } else {
      country='UK'
    }
    var formdata = new FormData();
    formdata.append('latitude', `${this.state.Lat}`);
    formdata.append('longitude', `${this.state.Long}`);
    formdata.append('address', `${this.state.sL_long}`);
    formdata.append('country', `${country}`);
      console.log('check post address formdata',formdata);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/update-address'
    fetch(
      `${myurl}/api/update-address`,
      requestOptions,
    )
      .then(response => response.text())
      .then(result => {
        this.setState({ loader: false });
        console.log('dataaa>>>>>>><<<<<<', this.state.Long);
        console.log('dataaa update responce<',result);

        let dataa = JSON.parse(result);
        console.log(dataa);
        if (this.state.item == 1) {
          this.props.navigation.navigate('Profile');
        } else {
          this.props.navigation.navigate('Checkout');
          /*Alert.alert(
            'The lat and long',
            JSON.stringify(this.state.Lat + ' ' + this.state.Long)
          )*/
        }
        this.setState({ Visible: true });
      })
      .catch(error => {
        this.setState({ loading: false });
        alert('Error:Please connect to internet.', error)
      });
  };
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
  onRegionChange(region) {
    /*Alert.alert(
      'The region values',
      JSON.stringify(region)
    )*/
    this.setState({
      region: region,
      Lat: region.latitude,
      Long: region.longitude,
      loading: true,
    });
    Geocoder.from(region.latitude, region.longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        console.log('address component232323', json.results[1], json.results[2], json.results[0]);
        this.setState({ sL_long: addressComponent });
      })
      //onRegionChange={this.onRegionChange.bind(this)}
      .catch(error => console.warn(error));

  }

  render() {
    console.log(this.state.region);
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
      this.navigationOptions = ({ navigation }) => ({
        swipeEnabled: false,
      });
      return (
        <>
          <View
            style={{ backgroundColor: '#f6f6f6', height: 0.5, marginTop: -1 }}>
            <StatusBar
              barStyle={'light-content'}
              translucent
              backgroundColor={'#f6f6f6'}
            />
          </View>
          <SafeAreaView style={Styles.container}>

            <View
              style={[
                Styles.Header,
                {
                  height: this.state.Visible
                    ? responsiveHeight(30)
                    : responsiveHeight(30),
                },
              ]}>
              <View style={Styles.topHeader}>
                {console.log('log', this.state.Visible)}
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}>
                  {/* <Ionicons
                              size={responsiveFontSize(4)}
                              color={colorWhite}
                              name={'ios-menu'}
                          /> */}
                  <Image
                    style={{
                      height: responsiveHeight(4),
                      width: responsiveWidth(8),
                      marginTop: responsiveHeight(6),
                    }}
                    source={require('../../Assets/icons-Menu-1.png')}
                  />
                </TouchableOpacity>
              </View>

              {/* <View style={Styles.SearchHeader}>
             <View style={Styles.SearchView}>
              <View style={Styles.Right}> */}
              {/* <TextInput
                  placeholder={'Your Address'}
                  placeholderTextColor={'#D5D5D5'}
                  style={Styles.Textinput}
                  value={this.state.search}
                  onChangeText={text => this.searchUpdated(text)}
                /> */}
              {/* <View
             style={{marginHorizontal:responsiveWidth(2),borderBottomColor:blue,marginTop:responsiveHeight(1)}}> */}
              <GooglePlacesAutocomplete
                placeholder={this.state.sL_long ? this.state.sL_long : 'Address'}
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed="false" // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => {
                  /*Alert.alert(
                    'This is what i got',
                    JSON.stringify(details.geometry.location.lat)
                  )*/
                  this.setState({ Lat: details.geometry.location.lat });
                  this.setState({ Long: details.geometry.location.lng });
                  this.setState({ newadress: true })

                  // 'details' is provided when fetchDetails = true
                  /*Geocoder.from(
                    details.geometry.location.lat,
                    details.geometry.location.lng,
                  )
                    .then(json => {
                      var addressComponent = json.results[0].formatted_address;
                      console.log('address component', addressComponent);
                      this.setState({ sL_long: addressComponent });
                    })
                    .catch(error => console.warn(error));
                  this.setState({
                    Visible: true,
                    Lat: details.geometry.location.lat,
                    sL_long: details.formatted_address,
                    Long: details.geometry.location.lng,
                  });
                  console.log(
                    this.state.Lat,
                    this.state.Long,
                    this.state.sL_long,
                  );*/
                }}
                getDefaultValue={() => ''}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: 'AIzaSyDYDxMDR6_NTCfynYvm6V1YvhiNbHt6uV4',
                  language: 'en', // language of the results
                  types: ['address'], // default: 'geocode'
                }}
                styles={{
                  textInputContainer: {
                    height: 50,
                    backgroundColor: blue,
                    borderBottomColor: blue,
                    borderTopColor: blue,
                    marginHorizontal: responsiveWidth(2),
                    marginTop: responsiveHeight(1),
                    multiline: false,
                    numberOfLines: 1,
                  },
                  textInput: {
                    height: 50,
                    multiline: false,
                    numberOfLines: 1,
                  },
                  predefinedPlacesDescription: {
                    color: '#fbecec',
                  },
                  description: {
                    color: '#fbecec'
                  }
                }}
                //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={
                  {
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }
                }
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  types: '',
                }}
                filterReverseGeocodingByTypes={[
                  'locality',
                  'administrative_area_level_3',
                ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                debounce={200}
              />
            </View>

            <View style={Styles.mapcon}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={Styles.map}
                // initialRegion={{
                //   latitude: 31.452934072495673,
                //   longitude: 74.29991768673062,
                //   latitudeDelta: 0.0922 / 10,
                //   longitudeDelta: 0.0421 / 10,
                //   }}
                initialRegion={{
                  latitude: 10,
                  longitude: 10,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                region={{
                  latitude: this.state.Lat,
                  longitude: this.state.Long,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LATITUDE_DELTA,
                }}
                >
                <MapView.Marker
                  coordinate={{
                    latitude: this.state.Lat,
                    longitude: this.state.Long,
                  }}
                  address={'H#352 est Hall, california'}>
                </MapView.Marker>
              </MapView>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: responsiveWidth(85),
                alignSelf: 'center',
                position: 'absolute',
                height: responsiveHeight(8),
                backgroundColor: '#e12c2c',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: responsiveHeight(2),
                top: responsiveHeight(88),
              }}
              onPress={() => this.searchUpdated()}>
              <Text style={{ fontSize: responsiveFontSize(2.5), color: 'white' }}>
                Done
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      );
    }
  }
}
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },
  Header: {
    height: responsiveHeight(30),
    width: '100%',
    backgroundColor: blue,
  },
  topHeader: {
    height: responsiveHeight(11),
    width: responsiveWidth(92),
    // backgroundColor:'red',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // alignItems: 'flex-end',

    // paddingHorizontal: responsiveWidth(4),
  },
  HeaderText: {
    color: colorWhite,
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveWidth(2),
  },
  SearchHeader: {
    height: responsiveHeight(8),
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
    marginLeft: responsiveWidth(4),
  },
  mapcon: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: responsiveHeight(80),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
  },
  profileLeftContainer: {
    // left:responsiveWidth(35),
    // top: responsiveHeight(-10),
    height: responsiveHeight(8),
    width: responsiveHeight(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(5),
    backgroundColor: '#eaeaea',
    borderWidth: 1.5,
    borderColor: colorBlack,
  },
  profileImageStyle: {
    height: '60%',
    width: '60%',
    resizeMode: 'contain',
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
    color: blue,
    textAlign: 'center',
  },
});
