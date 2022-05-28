import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  //SafeAreaView,
  StatusBar,
  TextInput,
  ToastAndroid,
  Image,
  Platform,
  ScrollView,
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
  headerColor,
  Pink,
} from '../../../GlobalCons/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CategoryItemsFlatList from './CategoryItemsFlatList';
import {SafeAreaView, NavigationEvents} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {ActivityIndicator} from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import NetInfo from '@react-native-community/netinfo';
import {Icon, Rating} from 'react-native-elements';
import {myurl} from '../../../GlobalCons/myurl';
import Back from 'react-native-vector-icons/FontAwesome';

export default class Categories extends Component {
  constructor(props) {
    super(props);
    Ionicons.loadFont();
    this.state = {
      loading: true,
      data: [],
      oldData: [],
      searchText: '',
    };
  }
  componentDidMount = async () => {
    console.log(
      'check the country values comes from parms',
      this.props.navigation.state.params.country,
    );

    FontAwesome.loadFont();
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.');
      }
    });
    const {params} = this.props.navigation.state;
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
    });
    let data = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);

    var formdata = new FormData();
    formdata.append('category_id', params.id);
    formdata.append('branch_id', params.branch_id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/get-category-items'
    fetch(`${myurl}/api/get-category-items`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let dataa = JSON.parse(result);
        if (dataa.successData) {
          this.setState({
            data: dataa.successData,
            loading: false,
            oldData: dataa.successData,
          });

          console.log(result, 'te');
        } else {
          this.setState({loading: false});
          alert(dataa.message);
          console.log(result, 'te');
        }
      })
      .catch((error) => alert('error', error));
  };

  onFocusFunction = async () => {
    const {params} = this.props.navigation.state;
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
    });
    let data = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);

    var formdata = new FormData();
    formdata.append('category_id', params.id);
    formdata.append('branch_id', params.branch_id);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/get-category-items'
    fetch(`${myurl}/api/get-category-items`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let dataa = JSON.parse(result);
        if (dataa.successData) {
          this.setState({data: dataa.successData, loading: false});
          console.log(result, 'te');
        } else {
          this.setState({loading: false});
          alert(dataa.message);
          console.log(result, 'te');
        }
      })
      .catch((error) => alert('error', error));
  };

  PrintCards = (post) => {
    const {params} = this.props.navigation.state;
    console.log('check the country state', this.props.navigation.state.params);
    let item = post.item;
    let index = post.index;
    return (
      <TouchableOpacity
        onPress={() => {
          // this.props.navigation.navigate('Details');
          //ToastAndroid.show('Navigating to category details page!',ToastAndroid.SHORT)
          this.props.navigation.navigate('CategoryDetail', {
            item: item,
            from: 'categoryitems',
            country: params.country,
          });
        }}
        activeOpacity={0.7}
        style={Styles.MainCard}>
        {console.log('item', item)}
        <Image
          borderTopLeftRadius={8}
          borderTopRightRadius={8}
          source={{uri: item.image}}
          style={{width: responsiveWidth(45), height: responsiveHeight(17)}}
        />
        <View style={Styles.contentView}>
          <View style={Styles.Left}>
            <Text style={Styles.SmallText}>{item.name}</Text>
            {item ? (
              <View style={{width: '80%'}}>
                {/* <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={0}
                  emptyStar={'ios-star-outline'}
                  fullStar={'ios-star'}
                  halfStar={'ios-star-half'}
                  iconSet={'Ionicons'}
                  fullStarColor={'rgb(253,194,40)'}
                  starSize={responsiveFontSize(2.5)}
                /> */}
                <Rating
                  imageSize={20}
                  readonly
                  startingValue={item.rating}
                  //fractions="{1}"
                  //startingValue="{3.3}"
                />
              </View>
            ) : null}
          </View>
          <View style={Styles.Right}>
            {console.log('sibghaaa', item)}
            <TouchableOpacity activeOpacity={0.7}>
              <Icon type="font-awesome" name="opencart" color="red" />
            </TouchableOpacity>
            {item.small_price ? (
              <Text
                style={[Styles.SmallText, {marginTop: responsiveHeight(1)}]}>
                £{item.small_price}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  SearchFilterFunction = async (text) => {
    this.setState({searchText: text});
    let data = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);
    const {params} = this.props.navigation.state;
    var formdata = new FormData();
    formdata.append('category_id', params.id);
    formdata.append('branch_id', JSON.parse(params.branch_id));
    formdata.append('item', text);

    console.log('this is form data', formdata);
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };
    fetch(`${myurl}api/search-categories-items`, requestOptions)
      .then((response) => response.text())
      .then((response) => {
        console.log(
          'is response ko chk kro":::::::::::::::',
          JSON.parse(response),
        );
        const newdata = JSON.parse(response);
        console.log('new data formed is this one', newdata);
        if (this.state.searchText.trim().length == 0) {
          this.setState({
            data: this.state.oldData,
          });
        } else {
          this.setState({
            data: newdata.successData,
          });
        }
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log('error log for search text', JSON.parse(error));
      });
  };

  render() {
    const {params} = this.props.navigation.state;
    console.log('params', params);
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
      return (
        <SafeAreaView forceInset={{top: 'never'}} style={Styles.container}>
          <ScrollView>
            <View style={Styles.Header}>
              <View style={Styles.ArrowView}>
                {/* <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                    // this.props.navigation.goBack();
                  }}>
                  {/* <Image
                    source={require('../../Assets/icons-Menu-2.png')}
                    style={Styles.headerImageStyle}
                  /> */}
                {/* <Ionicons
                name={"chevron-back-outline"}
                color={blue}
                size={responsiveFontSize(3.5)}
              /> */}
                {/* </TouchableOpacity> */}
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
                  <Back
                    name={'chevron-left'}
                    type="font-awesome"
                    color={blue}
                    size={responsiveFontSize(3.5)}
                  />
                </TouchableOpacity>

                <NavigationEvents onWillFocus={() => this.onFocusFunction()} />
              </View>
              <View style={Styles.HeaderTextView}>
                <Text style={Styles.HeaderLargeText}>{'Category Items'}</Text>
                <Text style={Styles.HeaderSmallText}>{params.branch_name}</Text>
                <TextInput
                  placeholder={'Search...'}
                  placeholderTextColor={'black'}
                  style={Styles.Textinput}
                  onChangeText={(text) => {
                    //this.setState({ searchtext: text })
                    this.SearchFilterFunction(text);
                    //alert(this.state.data[0].name);
                  }}
                />
              </View>
            </View>
            <ScrollView>
              {this.state.loading ? (
                <View
                  style={{
                    height: responsiveHeight(80),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator
                    color="#303f88"
                    size={'large'}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                </View>
              ) : this.state.data.length > 0 ? (
                <FlatList
                  data={this.state.data}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={Styles.contentContainerStyle}
                  ItemSeparatorComponent={() => (
                    <View style={Styles.Seprator} />
                  )}
                  renderItem={(item) => this.PrintCards(item)}
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
                      fontSize: responsiveFontSize(3),
                      letterSpacing: 1,
                      alignSelf: 'center',
                      marginTop: responsiveHeight(32),
                    }}>
                    {'No Item Found'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      );
    } else if (Platform.OS === 'android') {
      return (
        <SafeAreaView forceInset={{top: 'never'}} style={Styles.container}>
          <ScrollView>
            <View style={Styles.Header}>
              <View style={Styles.ArrowView}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                    // this.props.navigation.goBack();
                  }}>
                  <Image
                    source={require('../../Assets/icons-Menu-2.png')}
                    style={Styles.headerImageStyle}
                  />
                  {/* <Ionicons
                name={'ios-arrow-back'}
                color={blue}
                size={responsiveFontSize(3.5)}
              /> */}
                </TouchableOpacity>

                <NavigationEvents onWillFocus={() => this.onFocusFunction()} />
              </View>
              <View style={Styles.HeaderTextView}>
                <Text style={Styles.HeaderLargeText}>{'Category Items'}</Text>
                <Text style={Styles.HeaderSmallText}>{params.branch_name}</Text>
              </View>
            </View>
            <ScrollView>
              {this.state.loading ? (
                <View
                  style={{
                    height: responsiveHeight(80),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator
                    color="#303f88"
                    size={'large'}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                </View>
              ) : this.state.data.length > 0 ? (
                <FlatList
                  data={this.state.data}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={Styles.contentContainerStyle}
                  ItemSeparatorComponent={() => (
                    <View style={Styles.Seprator} />
                  )}
                  renderItem={(item) => this.PrintCards(item)}
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
                      fontSize: responsiveFontSize(3),
                      letterSpacing: 1,
                      alignSelf: 'center',
                      marginTop: responsiveHeight(32),
                    }}>
                    {'No Item Found'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
const Styles = StyleSheet.create({
  contentContainerStyle: {
    paddingVertical: responsiveHeight(2),
    // width: '100%',
    // alignSelf: 'center',
    // flex:1
  },
  Seprator: {
    marginBottom: responsiveHeight(2),
  },
  MainCard: {
    width: '45%',
    marginLeft: '3.3%',
    backgroundColor: colorWhite,
    elevation: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  contentView: {
    paddingVertical: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
  },
  Left: {
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  Right: {
    width: '20%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SmallText: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: responsiveFontSize(1.4),
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },
  Header: {
    height: responsiveHeight(24),
    width: '100%',
    backgroundColor: headerColor,
    // backgroundColor:'red'
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
  Textinput: {
    width: responsiveWidth(90),
    height: responsiveHeight(4),
    marginTop: responsiveHeight(1),
    borderRadius: 5,
    // backgroundColor:'red',
    backgroundColor: 'lightgray',
    paddingHorizontal: 10,
    marginRight: 0,
    fontSize: responsiveFontSize(2),
  },
});
