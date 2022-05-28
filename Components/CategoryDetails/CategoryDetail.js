import React, {Component} from 'react';
import {Checkmodal} from '../checkmodal/Checkmodal';
import CustomModal from '../CustomComponents/CustomModal';
import {
  View,
  Text,
  Alert,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
} from 'react-native';
import {CheckBox} from 'react-native-elements';

import {
  colorWhite,
  colorBlack,
  lightBlack,
  phColor,
  blue,
} from './../../../GlobalCons/colors';
import axios from 'axios';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { blue, colorWhite, phColor } from '../../../GlobalCons/colors';
import LinearGradient from 'react-native-linear-gradient';
// import {SafeAreaView} from 'react-navigation';
import Toast from 'react-native-simple-toast';
import {Button, RadioButton} from 'react-native-paper';
import {NavigationEvents} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {myurl} from '../../../GlobalCons/myurl';

let Order = [];
let size = {};
let singalExtras = [];
let singalSize = [];

let MultipleExtras = [];
let sizeprice = 0;
let singalExtrasprice = 0;
let MultipleExtrasprice = 0;
let multiplePrice = 0;
let singlePrice = 0;
let Complete = [];
let country = '';
let UpdatedExtras = null;
// import useFloatingHeaderHeight from 'react-navigation-stack/lib/typescript/src/vendor/utils/useHeaderHeight';
// import { isEqualIcon } from 'react-native-paper/lib/typescript/src/components/Icon';
export default class CategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SmallFlag: 0,
      mediumFlag: 0,
      orderQuantity: 1,
      largeFlag: 0,
      canada: '',
      superFlag: 0,
      selectedsize: '',
      cheeseFlag: '',
      singlePrice: 0,
      OrderDataArray: '',
      mashroom_id: 0,
      olive_id: 0,
      cheese_id: 0,
      oliveflag: false,
      mashroomflag: false,
      quantity: 0,
      total: 0,
      check: 0,
      singalExtras: [],
      singal: false,
      signalmenu: false,
      cheesePrice: 0,
      item: this.props.navigation.state.params.item,
      menu: [],
      selectedextra_id: this.props.navigation.state.params.extra_id,
      extras: [],
      extra: [],
      from: this.props.navigation.state.params.from,
      isVisible: false,
      myextras: [],
      data: ['hamza', 'waseem'],
    };
    console.log(
      'here in the categoires detail check already selected extras',
      this.props.navigation.state.params.extra_id,
    );
  }
  checkCountry = async () => {
    let value = await AsyncStorage.getItem('country');
    console.log('check the country state', value);
    country = JSON.parse(value);
  };
  componentDidMount() {
    console.log(
      'check the country values comes from parms',
      this.props.navigation.state.params.country,
    );
    this.checkCountry();
    //FontAwesome.loadFont();
    // size=[];
    size = {};

    this.setState({price: 0});
    MultipleExtras = [];
    singalExtras = [];
    UpdatedExtras = null;
    MultipleExtrasprice = 0;
    multiplePrice = 0;
    singlePrice = 0;
    singalExtrasprice = 0;
    Complete = [];
    // console.log('check this is he cmponentDidMont final',final)
    console.log('componetwillmount state 1', MultipleExtras);
    Ionicons.loadFont();
    console.log('cehck size array', size);
    console.log(
      'check your itm value',
      this.props.navigation.state.params.item,
    );
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        alert('Error:Please connect to internet.');
      }
    });
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      this.setState({
        menu: this.state.item.menu_size['size_items'],
        extras: this.state.item['menu_extras'],
      });
      //  let data= this.state.item.menu_size.map((item, index) => this.state.item.menu_size[index].quantity=0);
      //   this.setState({item:data})
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('transparent');
      }
    });
  }
  onFocusFunction() {
    this._navListener = this.props.navigation.addListener('willFocus', () => {
      this.setState({
        menu: this.state.item.menu_size['size_items'],
        extras: this.state.item['menu_extras'],
      });
      //  let data= this.state.item.menu_size.map((item, index) => this.state.item.menu_size[index].quantity=0);
      //   this.setState({item:data})
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content');
      } else {
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor('transparent');
      }
    });
  }
  addFavorite = async (id) => {
    let data = await AsyncStorage.getItem('token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${data}`);

    var formdata = new FormData();
    formdata.append('menu_id', id);
    formdata.append('status', 'favourite');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    //'https://pizzakebab.ranglerztech.website/api/add-favorite'
    fetch(`${myurl}/api/add-favorite`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let dataa = JSON.parse(result);
        if (dataa.status == 200) {
          //alert(dataa.message);
          console.log('check add faviourate response', dataa);
          this.setState({isVisible: true});
        } else {
          //alert(dataa.message);
          ToastAndroid.show('item could not be added', ToastAndroid.SHORT);
        }
      })
      .catch((error) => {
        this.setState({loading: false});
        ToastAndroid.show('item could not be added', ToastAndroid.SHORT);
        //alert(error.message)
      });
  };
  selectSingalSize(menuId, item) {
    console.log('check the extra value', item);
    UpdatedExtras = null;
    MultipleExtrasprice = 0;
    multiplePrice = 0;
    MultipleExtras = [];
    singalExtras = [];
    singlePrice = 0;
    singalExtrasprice = 0;
    console.log('value for extras values ', multiplePrice);
    console.log('value for extras values ', MultipleExtrasprice);

    let data = new FormData();
    data.append('size_id', item.id);
    axios.post(myurl + '/api/size-extra', data).then(
      (response) => {
        console.log('sucess', response);
        if (response.data.successData.extras.length > 0) {
          UpdatedExtras = response.data.successData.extras;
        }
        this.setState({
          singal: !this.state.singal,
          OrderDataArray: response.data.successData.extras,
        });
        multiplePrice = 0;
      },
      (error) => {
        console.log('error', error);
      },
    );

    if (size != null) {
      // [{"menu_id":"7","detail":[{"size":"medium","quantity":"2","price":"150"}],"extra_id":[{"name":"olives","quantity":"4"}]}]
      console.log('check your size', item);
      let siz = {};
      sizeprice = 0;
      MultipleExtrasprice = 0;
      multiplePrice = 0;
      singlePrice = 0;
      singalExtrasprice = 0;
      siz.size = item.size;
      siz.quantity = 1;
      siz.price = item.price;
      sizeprice = JSON.parse(item.price);
      size = siz;
      this.setState({total: 0});
      MultipleExtrasprice = 0;
      multiplePrice = 0;
      singlePrice = 0;
      singalExtrasprice = 0;
    } else {
      if (size.item && size.item.id == item.id) {
        size = null;
        sizeprice = 0;
        this.setState({total: 0});
        MultipleExtrasprice = 0;
        multiplePrice = 0;
        singlePrice = 0;
        singalExtrasprice = 0;
      } else {
        MultipleExtrasprice = 0;
        multiplePrice = 0;
        singlePrice = 0;
        singalExtrasprice = 0;
        sizeprice = 0;
        let siz = {};
        siz.size = item.size;
        siz.quantity = 1;
        sizeprice = JSON.parse(item.price);
        this.setState({total: 0});
        siz.price = item.price;
        size = siz;
      }
    }
    // if(size.length==0){
    //   size.push({id:item.id})
    //   console.log("cejck thew item",item);
    // }else{
    //   size
    // }
    //     if(singalSize.length===0){
    //    singalSize.push({
    //      menu_id: menuId ,
    //      item_id: item.id,
    //      quantity:1,
    //      name:item.name,
    //      price:item.price
    //    });
    //          this.setState({singal:!this.state.singal})
    //   }
    //  else{
    //      if(singalSize.findIndex(val => (val.menu_id == menuId)) != -1){
    //      let obj = singalSize.find(val => (val.menu_id == menuId));
    //      obj.item_id = item.id;
    //      if(obj.item_id == item.id)
    //      {
    //             singalSize.splice(singalSize.findIndex(val => (val.id == item.id)),1);
    //      }
    //      else
    //      {
    //        console.log("16");
    //        singalSize.push({
    //        menu_id: menuId ,
    //        item_id: item.id,
    //        quantity:1,
    //        name:item.name,
    //        price:item.price
    //      });
    //   this.setState({singal:!this.state.singal})
    //      }

    //      this.setState({singal:!this.state.singal})
    //    }
    //    else{
    //      console.log("17");
    //      singalSize.push({
    //        menu_id: menuId ,
    //        item_id: item.id,
    //        name:item.name,
    //        quantity:1,
    //        price:item.price
    //      });
    //      this.setState({singal:!this.state.singal})
    //    }
    //    this.setState({singal:!this.state.singal})
    //     console.log('final array by taha', singalSize);
    //  }
    console.log('check your size ', size);
  }
  selectSingal(menuId, item, menu_index, item_index) {
    console.log('check the sinfal extras length', singalExtras);
    console.log('final PRICE sizez 1', menuId);
    console.log('check the sinfal extras length 2', item);
    console.log('check the sinfal extras length 3', menu_index);
    console.log('check the sinfal extras length 4', item_index);
    console.log('check the sinfal extras length', singalExtras.length);

    singlePrice = 0;
    singalExtrasprice = 0;

    console.log('1');
    let genral = {};
    if (singalExtras.length === 0) {
      singalExtras.push({
        menu_id: menuId,
        item_id: item.id,
        quantity: 1,
        name: item.name,
        price: item.price,
      });
      genral.id = item_index;
      console.log('12', this.state.OrderDataArray);
      let quantity = JSON.parse(
        this.state.OrderDataArray[menu_index].items[item_index].quantity,
      );
      console.log('check the quantity', quantity);
      console.log('1 pushed', quantity);
      this.state.OrderDataArray[menu_index].items[item_index].quantity =
        quantity + 1;
      this.setState({singal: !this.state.singal});
      console.log('2 pushed', quantity);
      this.setState({singal: !this.state.singal});
      // console.log("first singal",singalExtras)
      // console.log("15",this.state.item.menu_extras[menu_index].items[genral.id]);
    } else {
      console.log('13');
      if (singalExtras.findIndex((val) => val.menu_id == menuId) != -1) {
        console.log('14');
        let obj = singalExtras.find((val) => val.menu_id == menuId);
        obj.item_id = item.id;

        if (obj.item_id == item.id) {
          // this.state.OrderDataArray[menu_index].items[item_index].quantity = 0;
          console.log('158888', item);
          console.log(
            '15',
            this.state.OrderDataArray[menu_index].items[item_index].quantity,
          );

          this.state.OrderDataArray[menu_index].items[item_index].quantity = 0;

          this.state.OrderDataArray[menu_index].items.map((q, i) => {
            if (i !== item_index) {
              q.quantity = 0;
            }
          });

          singalExtras.splice(
            singalExtras.findIndex((val) => val.menu_id == menuId),
            1,
          );
          singalExtras.push({
            menu_id: menuId,
            item_id: item.id,
            quantity: 1,
            name: item.name,
            price: item.price,
          });
          let quantity = JSON.parse(
            this.state.OrderDataArray[menu_index].items[item_index].quantity,
          );
          this.state.OrderDataArray[menu_index].items[item_index].quantity =
            quantity + 1;
          // let quantity = JSON.parse(this.state.OrderDataArray[menu_index].items[item_index].quantity);
          // this.state.OrderDataArray[menu_index].items[item_index].quantity = 0;
          this.setState({singal: !this.state.singal});
        } else {
          console.log('16');
          singalExtras.push({
            menu_id: menuId,
            item_id: item.id,
            quantity: 1,
            name: item.name,
            price: item.price,
          });
          let quantity = JSON.parse(
            this.state.OrderDataArray[menu_index].items[item_index].quantity,
          );
          console.log('1 pushed', quantity);
          this.state.OrderDataArray[menu_index].items[item_index].quantity =
            quantity + 1;
          this.setState({singal: !this.state.singal});
        }

        this.setState({singal: !this.state.singal});
      } else {
        console.log('17');
        singalExtras.push({
          menu_id: menuId,
          item_id: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
        });
        let quantity = JSON.parse(
          this.state.OrderDataArray[menu_index].items[item_index].quantity,
        );
        console.log('1 pushed', quantity);
        this.state.OrderDataArray[menu_index].items[item_index].quantity =
          quantity + 1;
        this.setState({singal: !this.state.singal});
      }
      this.setState({singal: !this.state.singal});
      // console.log('final array by taha', singalExtras);
    }
    let prices = 0;
    // console.log("final PRICE before check",singalExtras)

    if (singalExtras.length > 0) {
      singalExtras.map((pri) => {
        prices = prices + JSON.parse(pri.price);
        this.setState({singal: !this.state.singal});
      });
      singalExtrasprice = prices;
      this.setState({singal: !this.state.singal});
    } else {
      singalExtrasprice = 0;
    }
    singlePrice = singalExtrasprice;
    console.log('our single exra price', singlePrice);
    this.setState({singal: !this.state.singal});
    console.log('final PRICE sizez', singalExtras);
  }
  selectmultiple(menuId, item, menu_index, item_index) {
    console.log('check multiple value', menu_index);

    console.log('check multiple index', item_index);
    console.log(
      'check the quntity',
      this.state.OrderDataArray[menu_index].items[item_index],
    );
    if (MultipleExtras.length === 0) {
      // let count = JSON.parse(this.state.item.menu_extras[0].items[index].quantity);
      // this.state.item.menu_extras[0].items[index].quantity = count + 1;
      MultipleExtras.push({
        menu_id: menuId,
        item_id: item.id,
        quantity: 1,
        name: item.name,
        price: item.price,
      });
      multiplePrice = 0;
      MultipleExtrasprice = JSON.parse(item.price);

      let quantity = JSON.parse(
        this.state.OrderDataArray[menu_index].items[item_index].quantity,
      );
      console.log('1 pushed', quantity);
      this.state.OrderDataArray[menu_index].items[item_index].quantity =
        quantity + 1;
      this.setState({singal: !this.state.singal});
      console.log('2 pushed', quantity);
      // console.log('3 pushed',this.state.item.menu_extras[0].items);

      this.setState({singal: !this.state.singal});
      // console.log("first",MultipleExtras)
    } else {
      if (MultipleExtras.findIndex((val) => val.menu_id == menuId) != -1) {
        let obj = MultipleExtras.find(
          (val) => val.menu_id == menuId && val.item_id == item.id,
        );
        // console.log("object mila b hai k nahi", obj);
        this.setState({singal: !this.state.singal});
        if (obj) {
          // console.log("han betay ki masla ay", MultipleExtras.indexOf(obj));
          MultipleExtras.splice(MultipleExtras.indexOf(obj), 1);
          let quantity = JSON.parse(
            this.state.OrderDataArray[menu_index].items[item_index].quantity,
          );
          this.state.OrderDataArray[menu_index].items[item_index].quantity = 0;
          this.setState({singal: !this.state.singal});
        } else {
          if (MultipleExtras.findIndex((val) => val.item_id == item.id) != -1) {
            let count =
              MultipleExtras[
                MultipleExtras.findIndex((val) => val.item_id == item.id)
              ].quantity;
            console.log('cehck the value', count);
            MultipleExtras[
              MultipleExtras.findIndex((val) => val.item_id == item.id)
            ].quantity = count + 1;
          }
          let quantity = JSON.parse(
            this.state.OrderDataArray[menu_index].items[item_index].quantity,
          );
          this.state.OrderDataArray[menu_index].items[item_index].quantity =
            quantity + 1;
          MultipleExtras.push({
            menu_id: menuId,
            item_id: item.id,
            quantity: 1,
            name: item.name,
            price: item.price,
          });
          // obj.item_id = item.id;

          this.setState({singal: !this.state.singal});
        }
      } else {
        let quantity = JSON.parse(
          this.state.OrderDataArray[menu_index].items[item_index].quantity,
        );
        this.state.OrderDataArray[menu_index].items[item_index].quantity =
          quantity + 1;
        MultipleExtras.push({
          menu_id: menuId,
          item_id: item.id,
          name: item.name,
          quantity: JSON.parse(item.quantity),
          price: item.price,
        });
        this.setState({singal: !this.state.singal});
      }
      console.log('final MultipleExtras array', MultipleExtras);

      this.setState({singal: !this.state.singal});
      // console.log("final PRICE MultipleExtrasz",MultipleExtrasprice)
    }
    console.log('final MultipleExtras array', MultipleExtras);
    let prices = 0;
    MultipleExtrasprice = 0;
    if (MultipleExtras.length > 0) {
      MultipleExtras.map((pri) => {
        prices = prices + JSON.parse(pri.price) * pri.quantity;
      });
      MultipleExtrasprice = prices;
    }
    multiplePrice = MultipleExtrasprice;
    this.setState({singal: !this.state.singal});
    console.log('check multiple price', multiplePrice);
  }

  navi = async () => {
    // console.log("check array in nav function",final)
    await AsyncStorage.setItem('branch_id', this.state.item.branch_id);
    if (this.state.from == 'categoryitems') {
      await AsyncStorage.setItem(
        'resturant',
        JSON.stringify(this.state.item.branch.id),
      );
    } else {
      await AsyncStorage.setItem('resturant', this.state.item.branch_id);
    }
    let singal_price = 0;
    let muliple_price = 0;
    console.log('check selected data size', size);
    console.log('check total price of singal price', singal_price);
    console.log('check total price of singal price', muliple_price);

    // let orderset = [];
    let order = [];
    let names = [];
    let menu_id = '';
    console.log('check complete ex', singalExtras);
    console.log('check complete si', MultipleExtras);
    Complete = singalExtras.concat(MultipleExtras);
    console.log('puri complete array yh hai', Complete);
    Complete = Complete.reduce((item_arr, item) => {
      item_arr.push({
        name: item.name,
        quantity: JSON.stringify(item.quantity),
        price: item.price,
      });
      return item_arr;
    }, []);
    console.log('puri complete array yh hai after reduceer', Complete);
    console.log('check selected data signal;', singalExtras);
    console.log('check selected data mulitple', MultipleExtras);
    console.log('check selected data size of item small , large', size); //sizes object
    console.log('check selected data name extras', names);
    console.log('check selected data complete', Complete); //extras_ids
    let finalobj = {};
    // size.push({extra_id:Complete});
    // size.map((obj)=>{
    //   console.log("check the ojbject",obj)
    //   obj['extra_id'] = Complete;
    // })
    let finalsize = [];
    let final = [];
    finalsize.push(size);
    finalsize.map((obj) => {
      obj['extra_id'] = Complete;
    });
    // size.extra_id = Complete
    console.log('check the finalsize array', finalsize);

    finalobj.menu_id = this.state.item.id;
    finalobj.detail = finalsize;
    final.map((itm) => {
      console.log('taha', itm);
    });
    let data = JSON.parse(await AsyncStorage.getItem('storeData'));
    console.log('array data comes from already selected items array', data);
    if (data != null) {
      if (data[data.findIndex((val) => val.extraid != this.state.item.id)]) {
        final = [];
      } else {
        final = [];
      }
    }
    final.push(finalobj);

    // final.map((item)=>{
    //   console.log('final fffffffffffff',item);
    //   item.detail[item.detail.findIndex(val => (val.size == size.size))] = finalobj;
    // })

    let item = {
      item: this.state.item,
      orderdata: final,
      total: this.state.total + multiplePrice + singlePrice + sizeprice,
      // extra_id: Complete,
    };

    // [{"menu_id":"7","detail":[{"size":"medium","quantity":"2","price":"150"}],"extra_id":[{"name":"olives","quantity":"4"}]}]

    console.log('check the ojbject', item);
    console.log('check the final final', final);
    console.log('check the ojbject', this.state.item);
    console.log('check the ojbject', finalobj);
    if (size.size != null) {
      // this.setState({menu: [] })
      console.log(
        'check the country state',
        this.props.navigation.state.params,
      );
      this.props.navigation.navigate('Mycart', {
        item: item,
        Order: Order,
        from: 'stack',
        price: this.state.total + multiplePrice + singlePrice + sizeprice,
        Phone: this.state.item.branch.phone,
        country: this.props.navigation.state.params.country,
      });
    } else {
      Toast.show('Please select any item', Toast.SHORT, ['UIAlertController']);
    }
  };
  MultipleExtrasCount = (index, item, flag, menu_index, item_index) => {
    console.log('check multiple value', MultipleExtras);
    //  let quantity = JSON.parse(this.state.item.menu_extras[0].items[index].quantity);
    if (MultipleExtras.length > 0) {
      let value = JSON.parse(item.price);
      if (flag) {
        if (MultipleExtras.findIndex((val) => val.item_id == item.id) != -1) {
          let count =
            MultipleExtras[
              MultipleExtras.findIndex((val) => val.item_id == item.id)
            ].quantity;
          console.log('cehck the value', count);
          MultipleExtras[
            MultipleExtras.findIndex((val) => val.item_id == item.id)
          ].quantity = count - 1;
        }
        let quantity = JSON.parse(
          this.state.OrderDataArray[menu_index].items[item_index].quantity,
        );
        this.state.OrderDataArray[menu_index].items[item_index].quantity =
          quantity - 1;

        console.log('check quantity value', quantity);
        console.log(
          'check reached to the quantity of dpecifuc item',
          this.state.OrderDataArray[menu_index].items[item_index],
        );
        this.setState({singal: !this.state.singal});
      } else {
        if (MultipleExtras.findIndex((val) => val.item_id == item.id) != -1) {
          let count =
            MultipleExtras[
              MultipleExtras.findIndex((val) => val.item_id == item.id)
            ].quantity;
          console.log('cehck the value', count);
          MultipleExtras[
            MultipleExtras.findIndex((val) => val.item_id == item.id)
          ].quantity = count + 1;
        }
        let quantity = JSON.parse(
          this.state.OrderDataArray[menu_index].items[item_index].quantity,
        );
        console.log('check quantity value', quantity);
        console.log(
          'check reached to the quantity of dpecifuc item',
          this.state.OrderDataArray[menu_index].items[item_index],
        );

        this.state.OrderDataArray[menu_index].items[item_index].quantity =
          quantity + 1;
        // console.log("check reached to the quantity of after setitem",this.state.item.menu_extras[menu_index].items[index]);

        // let data = this.state.total + value;
        this.setState({singal: !this.state.singal});
      }
    } else {
      console.log('title', item);
      Toast.show('Select ' + item.name + ' First', Toast.LONG);
    }
    let price = 0;
    MultipleExtras.map((itm) => {
      console.log('click on itm', itm.price);
      price = price + JSON.parse(itm.price) * itm.quantity;
    });
    // this.setState({multiplePrice:price});
    multiplePrice = price;
    console.log('check multiple price', multiplePrice);
  };
  SingalExtrasCount = (index, item, flag, menu_index, item_index) => {
    console.log('check sing value', singalExtras);
    //  let quantity = JSON.parse(this.state.item.menu_extras[0].items[index].quantity);
    if (singalExtras.length > 0) {
      let value = JSON.parse(item.price);
      if (flag) {
        if (singalExtras.findIndex((val) => val.item_id == item.id) != -1) {
          let count =
            singalExtras[
              singalExtras.findIndex((val) => val.item_id == item.id)
            ].quantity;
          console.log('cehck the value', count);
          singalExtras[
            singalExtras.findIndex((val) => val.item_id == item.id)
          ].quantity = count - 1;
        }
        let quantity = JSON.parse(
          this.state.OrderDataArray[menu_index].items[item_index].quantity,
        );
        this.state.OrderDataArray[menu_index].items[item_index].quantity =
          quantity - 1;
        this.setState({singal: !this.state.singal});
      } else {
        if (singalExtras.findIndex((val) => val.item_id == item.id) != -1) {
          let count =
            singalExtras[
              singalExtras.findIndex((val) => val.item_id == item.id)
            ].quantity;
          console.log('cehck the value', count);
          singalExtras[
            singalExtras.findIndex((val) => val.item_id == item.id)
          ].quantity = count + 1;
        }
        let quantity = JSON.parse(
          this.state.OrderDataArray[menu_index].items[item_index].quantity,
        );
        console.log('check quantity value', quantity);
        console.log(
          'check reached to the quantity of dpecifuc item',
          this.state.item.menu_extras[menu_index].items[item_index],
        );

        this.state.OrderDataArray[menu_index].items[item_index].quantity =
          quantity + 1;
        this.setState({singal: !this.state.singal});
      }
    } else {
      Toast.show('Select ' + item.name + ' First', Toast.LONG);
    }
    let price = 0;
    singalExtras.map((itm) => {
      console.log('click on itm', itm.price);
      price = price + JSON.parse(itm.price) * itm.quantity;
      console.log('price, porice', price);
    });
    singlePrice = price;
    console.log('check our single extra price', singlePrice);
  };
  calculateprice = (index, item, flag) => {
    let quantity = JSON.parse(this.state.menu[index].quantity);
    let value = JSON.parse(item.price);
    if (flag) {
      if (quantity > 0) {
        this.state.menu[index].quantity = quantity - 1;
        let data = this.state.total - value;
        this.setState({total: data, check: data});
      }
    } else {
      let quantity = JSON.parse(this.state.menu[index].quantity);
      this.state.menu[index].quantity = quantity + 1;
      let data = this.state.total + value;
      this.setState({total: data, check: data});
    }
  };

  render() {
    const {item} = this.state;
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
      return (
        <SafeAreaView
          forceInset={{top: 'never'}}
          style={{flex: 1, backgroundColor: colorWhite}}>
          <CustomModal isVisible={this.state.isVisible}>
            <View
              style={{
                height: '50%',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.modalMainContainer}>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={require('../../Assets/icon-check-alt2.png')}
                    style={styles.modalImageStyle}
                  />
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalTextStyle}>
                    {'Item added to favourites list'}
                  </Text>
                </View>

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
                    this.setState({isVisible: false});
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomModal>

          <StatusBar translucent backgroundColor="transparent" />
          <View style={{flex: 1}}>
            <NavigationEvents onWillFocus={() => this.onFocusFunction()} />
            <ImageBackground
              style={{
                height: responsiveHeight(30),
                width: responsiveWidth(100),
              }}
              resizeMode="cover"
              source={{uri: item.image ? item.image : item.image}}>
              <LinearGradient
                colors={['rgba(255,255,255,0) ', 'rgba(255,255,255,0.9)']}
                start={{x: -0.1, y: -0.19}}
                end={{x: -0.21, y: 0.9}}
                style={{
                  flex: 1,
                  // paddingLeft: 15,
                  // paddingRight: 15,
                  borderRadius: 5,
                  // zIndex:1
                }}>
                <View
                  style={{
                    marginVertical: responsiveHeight(5),
                    marginHorizontal: responsiveHeight(3),
                  }}>
                  <TouchableOpacity
                    // style={{ marginTop: 55, marginLeft: 5 }}
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
                      type="font-awesome"
                      color={blue}
                      size={responsiveFontSize(3.5)}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.addFavorite(item.id)}
                    style={{
                      height: responsiveHeight(5),
                      width: responsiveHeight(5),
                      borderRadius: responsiveHeight(5),
                      backgroundColor: 'white',
                      right: 5,
                      // top: responsiveHeight(-1),
                      position: 'absolute',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AntDesign
                      name="star"
                      size={responsiveFontSize(2)}
                      color={'#e12c2c'}
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
            <ScrollView
              style={{
                marginLeft: responsiveHeight(3),
                marginTop: responsiveHeight(1),
              }}>
              <View style={{height: responsiveHeight(3)}}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: 'bold',
                  }}>
                  {item.name ? item.name : item.name}
                </Text>
              </View>

              <View
                style={{
                  height: responsiveHeight(6),
                  marginVertical: responsiveHeight(2),
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: 'bold',
                  }}>
                  Description
                </Text>
                {/* <Text
                  style={{
                    fontSize: responsiveFontSize(1.5),
                    color: 'rgba(0,0,0,0.3)',
                    fontWeight: 'bold',
                    //marginBottom: 
                  }}>
                  {item.description ? item.description : item.description}
                </Text> */}
                <View
                  style={{width: '100%', height: 80, backgroundColor: 'white'}}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}>
                    <Text
                      // numberOfLines={5}
                      style={{
                        fontSize: responsiveFontSize(1.5),
                        color: 'rgba(0,0,0,0.3)',
                        fontWeight: 'bold',
                        // height:100,
                        textAlign: 'justify',
                        width: responsiveWidth(90),
                        backgroundColor: 'white',
                        marginBottom: 5,
                        marginTop: 10,
                      }}>
                      {item.description ? item.description : item.description}
                    </Text>
                  </ScrollView>
                </View>
              </View>
              {this.state.menu.length > 0 && (
                <View
                  style={{
                    height: responsiveHeight(5),
                    marginTop: responsiveHeight(8),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.5),
                      fontWeight: 'bold',
                    }}>
                    {this.state.item.menu_size.title}
                  </Text>
                </View>
              )}
              {/* {console.log('check your menu items in console ',this.state.item)} */}
              {this.state.menu.map((item, index) => {
                {
                  console.log('check this sizes array', item);
                }
                return (
                  <View
                    style={{
                      height: responsiveHeight(10),
                      borderBottomColor: 'rgba(0,0,0,0.3)',
                      borderBottomWidth: 0.71,
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                      alignItems: 'center',
                    }}>
                    <CheckBox
                      checked={
                        size &&
                        size.size != undefined &&
                        size.size === item.size
                          ? true
                          : false
                      }
                      checkedColor={'#e12c2c'}
                      onPress={() => this.selectSingalSize(item.id, item)}
                    />
                    {console.log('check your size ', size.size)}

                    <View
                      style={{
                        //height: responsiveWidth(15),
                        width: responsiveWidth(60),
                        // backgroundColor: 'orange',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flex: 3.5,
                          //backgroundColor:'green'
                        }}>
                        <Text
                          style={{
                            fontSize: responsiveFontSize(2),
                            fontWeight: 'bold',
                          }}>
                          {item.size}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: '3%',
                          flexDirection: 'row',
                          flex: 1,
                          marginRight: 20,
                          height: 20,
                          width: 100,
                          // backgroundColor:'red'
                        }}>
                        <Text style={styles.priceTextStyle}>
                          {this.props.navigation.state.params.country != null
                            ? this.props.navigation.state.params.country ==
                              'pakistan'
                              ? 'PKR'
                              : '£'
                            : '£'}{' '}
                          {item.price ? item.price : item.price}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.quantityMainContainer}>
                      <TouchableOpacity
                        disabled={size.size == null ? true : false}
                        style={styles.quantityContainerMinus}
                        onPress={() => {
                          this.calculateprice(index, item, true);
                          console.log('item size -', item);
                          console.log('item size -', size);
                          if (size.size != null) {
                            if (size.size == item.size) {
                              console.log('2 nnnn');
                              if (size.quantity > 0) {
                                console.log('2 nnnn', size.quantity);
                                size.quantity = size.quantity - 1;
                                console.log('2 nnnn', size.quantity);
                              } else {
                                size.quantity = 1;
                              }
                            }
                          } else {
                            Toast.show(
                              'please select size checkbox',
                              Toast.SHORT,
                            );
                          }
                        }}>
                        <Ionicons
                          name="remove"
                          size={responsiveFontSize(1.5)}
                          color={'#e12c2c'}
                        />
                      </TouchableOpacity>
                      <Text>{size.size == item.size ? size.quantity : 0}</Text>
                      <TouchableOpacity
                        disabled={size.size == null ? true : false}
                        onPress={() => {
                          //minus wwala ko sai karna ha or phr rder ka andar req chezen pore karne hen
                          this.calculateprice(index, item, false);
                          console.log('item size +', size);
                          if (size.size != null) {
                            if (size.size == item.size) {
                              console.log('2 nnnn');
                              if (size.quantity > 0) {
                                console.log('2 nnnn', size.quantity);
                                size.quantity = size.quantity + 1;
                                console.log('2 nnnn', size.quantity);
                              } else {
                                size.quantity = 1;
                              }
                            }
                          } else {
                            Toast.show(
                              'please select size checkbox',
                              Toast.SHORT,
                            );
                          }
                          // if(size.length==0){
                          //   size.push({
                          //     "size":item.size,
                          //     "price":item.price,
                          //     "quantity":JSON.stringify(item.quantity)
                          //   })
                          // }else{
                          //     if(size.findIndex(val => (val.size == item.size)) != -1)
                          //     {
                          //       size[size.findIndex(val => (val.size == item.size))].quantity = JSON.stringify(item.quantity);
                          //     }
                          //     else{
                          //       size.push({
                          //         "size":item.size,
                          //         "price":item.price,
                          //         "quantity":JSON.stringify(item.quantity)
                          //               })
                          //     }
                          // }
                        }}
                        style={styles.quantityContainerPlus}>
                        <Ionicons
                          name="add"
                          size={responsiveFontSize(1.5)}
                          color={colorWhite}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              {/* {console.log("check your extras state",this.state.extras)} */}
              {console.log('check updatd Extras status', UpdatedExtras)}

              {this.state.extras && this.state.extras.length > 0 ? (
                <View
                  style={{
                    height: responsiveHeight(5),
                    marginTop: responsiveHeight(6),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.5),
                      fontWeight: 'bold',
                    }}>
                    EXTRAS
                  </Text>
                </View>
              ) : null}
              {UpdatedExtras != null ? (
                UpdatedExtras.map((itm, indexx) => {
                  return (
                    <View>
                      {/* {console.log('check box check',itm)} */}
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '90%',
                          marginTop: 10,
                          marginBottom: 20,
                          alignSelf: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 5,
                          }}>
                          {itm.title != null
                            ? itm.extra_title.toUpperCase()
                            : itm.extra_title}
                        </Text>
                        <View
                          style={{
                            width: responsiveWidth(15),
                            top: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#D3D3D3',
                            height: responsiveHeight(3),
                            borderRadius: 5,
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#393b82',
                              textTransform: 'capitalize',
                            }}>
                            {itm.selection}
                          </Text>
                        </View>
                      </View>
                      {itm.items.map((item, index) => {
                        //  {console.log("ceck the usms item -------------->",item)}
                        //  {console.log("ceck the usms itm --------->",itm)}

                        return (
                          <View
                            style={{
                              marginLeft: 10,
                              flexDirection: 'row',
                              marginBottom: 2,
                            }}>
                            {itm.selection == 'multiple' ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  width: '100%',
                                  justifyContent: 'space-evenly',
                                }}>
                                {/* {console.log("multipleItem check array",MultipleExtras)} */}
                                <CheckBox
                                  size={22}
                                  onPress={() =>
                                    this.selectmultiple(
                                      itm.id,
                                      item,
                                      indexx,
                                      index,
                                    )
                                  }
                                  checkedColor={'#e12c2c'}
                                  checked={
                                    MultipleExtras.length > 0
                                      ? MultipleExtras.findIndex(
                                          (items) => items.item_id == item.id,
                                        ) != -1
                                        ? true
                                        : false
                                      : false
                                  }
                                />

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingTop: 13,
                                    backgroundColor: 'white',
                                    width: '95%',
                                    justifyContent: 'space-evenly',
                                  }}>
                                  <Text
                                    style={{width: responsiveWidth(40)}}
                                    numberOfLines={7}>
                                    {item.name}
                                  </Text>
                                  {console.log(
                                    'check the quantity console',
                                    item.quantity,
                                  )}
                                  {item.is_multiple === '1' ? (
                                    <View style={styles.quantityMainContainer}>
                                      <TouchableOpacity
                                        style={styles.quantityContainerMinus}
                                        onPress={() => {
                                          console.log(
                                            'quanity check',
                                            item.quantity,
                                          );
                                          if (item.quantity >= 1) {
                                            this.MultipleExtrasCount(
                                              index,
                                              item,
                                              true,
                                              indexx,
                                              index,
                                            );
                                          }
                                          // else{
                                          // this.MultipleExtrasCount(index, item, true,indexx,index);

                                          // }
                                        }}>
                                        <Ionicons
                                          name="remove"
                                          size={responsiveFontSize(1.5)}
                                          color={'#e12c2c'}
                                        />
                                      </TouchableOpacity>
                                      <Text>{item.quantity}</Text>
                                      <TouchableOpacity
                                        disabled={
                                          item.quantity > 0 ? false : true
                                        }
                                        onPress={() => {
                                          this.MultipleExtrasCount(
                                            index,
                                            item,
                                            false,
                                            indexx,
                                            index,
                                          );
                                        }}
                                        style={styles.quantityContainerPlus}>
                                        <Ionicons
                                          name="add"
                                          size={responsiveFontSize(1.5)}
                                          color={colorWhite}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  ) : (
                                    <View
                                      style={styles.quantityMainSample}></View>
                                  )}

                                  <Text style={{width: responsiveWidth(10)}}>
                                    {item.price}
                                  </Text>
                                </View>
                              </View>
                            ) : (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-around',
                                }}>
                                {console.log('check the values', singalExtras)}

                                <CheckBox
                                  checked={
                                    singalExtras.length > 0
                                      ? singalExtras.findIndex(
                                          (items) => items.item_id == item.id,
                                        ) != -1
                                        ? true
                                        : false
                                      : false
                                  }
                                  checkedColor={'#e12c2c'}
                                  onPress={() =>
                                    this.selectSingal(
                                      itm.id,
                                      item,
                                      indexx,
                                      index,
                                      UpdatedExtras,
                                    )
                                  }
                                />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    paddingTop: 13,
                                    backgroundColor: 'white',
                                    marginLeft: 10,
                                    width: '90%',
                                    justifyContent: 'space-evenly',
                                  }}>
                                  <Text
                                    style={{width: responsiveWidth(35)}}
                                    numberOfLines={5}>
                                    {item.name}
                                  </Text>
                                  {itm.is_multiple == '1' ? (
                                    <View style={styles.quantityMainContainer}>
                                      <TouchableOpacity
                                        style={styles.quantityContainerMinus}
                                        onPress={() => {
                                          if (item.quantity >= 1) {
                                            this.SingalExtrasCount(
                                              index,
                                              item,
                                              true,
                                              indexx,
                                              index,
                                            );
                                          }
                                        }}>
                                        <Ionicons
                                          name="remove"
                                          size={responsiveFontSize(1.5)}
                                          color={'#e12c2c'}
                                        />
                                      </TouchableOpacity>
                                      <Text>{item.quantity}</Text>
                                      <TouchableOpacity
                                        disabled={
                                          item.quantity > 0 ? false : true
                                        }
                                        onPress={() => {
                                          this.SingalExtrasCount(
                                            index,
                                            item,
                                            false,
                                            indexx,
                                            index,
                                          );
                                        }}
                                        style={styles.quantityContainerPlus}>
                                        <Ionicons
                                          name="add"
                                          size={responsiveFontSize(1.5)}
                                          color={colorWhite}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  ) : (
                                    <View
                                      style={styles.quantityMainSample}></View>
                                  )}
                                  <Text style={{width: responsiveWidth(10)}}>
                                    {item.price}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  );
                })
              ) : (
                <Text style={{alignSelf: 'center', top: 20, color: '#e12c2c'}}>
                  Select Your Size First
                </Text>
              )}
              {UpdatedExtras != null ? (
                <Text
                  style={{
                    width: responsiveWidth(100),
                    textAlign: 'center',
                    color: '#e12c2c',
                  }}>
                  Select Your Extra If You Want
                </Text>
              ) : null}
              <View style={{flexDirection: 'row', width: '90%', marginTop: 40}}>
                <Ionicons
                  name="alert-circle-outline"
                  color={'#393b82'}
                  style={{marginTop: 10, marginLeft: 0, marginRight: 5}}
                  size={responsiveHeight(3)}
                />
                <Text
                  style={{
                    textAlign: 'justify',
                    marginRight: 15,
                    lineHeight: 18,
                  }}>
                  To get same size with different extras, Tap on "Continue
                  Eating" from cart and select the different extras for same
                  size.
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  marginRight: responsiveHeight(3),
                  height: responsiveHeight(9),
                  backgroundColor: '#e12c2c',
                  marginBottom: responsiveHeight(5),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: responsiveHeight(2),
                  marginTop: responsiveHeight(8),
                }}
                onPress={() => {
                  this.navi();
                }}
                activeOpacity={0.7}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    fontWeight: 'bold',
                    marginRight: 50,
                    color: 'white',
                  }}>
                  Add to Cart
                </Text>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2),
                    color: 'white',
                    marginLeft: 5,
                    right: responsiveWidth(8),
                    position: 'absolute',
                  }}>
                  {console.log('check the price', this.state.total)}
                  {console.log('check the price', multiplePrice)}
                  {console.log('check the price', singlePrice)}
                  {console.log('check the price', sizeprice)}
                  {this.props.navigation.state.params.country != null
                    ? this.props.navigation.state.params.country == 'pakistan'
                      ? 'PKR'
                      : '£'
                    : '£'}{' '}
                  {(
                    this.state.total +
                    multiplePrice +
                    singlePrice +
                    sizeprice
                  ).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
  }
}
const styles = StyleSheet.create({
  priceTextStyle: {
    width: 100,
    fontSize: responsiveFontSize(1.6),
    color: 'rgba(0,0,0,0.3)',
    paddingTop: 5,
    // marginRight:16,
    fontWeight: 'bold',
  },
  quantityMainContainer: {
    // marginTop: responsiveHeight(0.45),
    // right: responsiveHeight(3),
    // position: 'absolute',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e12c2c',
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    height: responsiveHeight(2.5),
    width: responsiveWidth(15),
    borderRadius: responsiveHeight(2),
  },
  quantityMainSample: {
    // marginTop: responsiveHeight(0.45),
    // right: responsiveHeight(3),
    // position: 'absolute',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // borderColor: '#e12c2c',
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    height: responsiveHeight(2.5),
    width: responsiveWidth(15),
    borderRadius: responsiveHeight(2),
  },
  quantityContainerPlus: {
    // flex: 0.5,
    backgroundColor: '#e12c2c',
    height: '100%',
    width: '35%',
    borderBottomRightRadius: responsiveHeight(2.5),
    borderTopRightRadius: responsiveHeight(2.5),
    // marginBottom: responsiveHeight(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainerMinus: {
    // flex: 0.5,
    borderRightWidth: 1,
    borderColor: '#e12c2c',
    height: '100%',
    width: '35%',
    borderBottomLeftRadius: responsiveHeight(2.5),
    borderTopLeftRadius: responsiveHeight(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMainContainer: {
    height: responsiveHeight(50),
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
