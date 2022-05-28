import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
//import { white } from 'react-native-paper/lib/typescript/src/styles/colors';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import { colorWhite, colorBlack, lightBlack, blue, } from './../../../GlobalCons/colors';
import { Icon, Rating, Button, Avatar } from 'react-native-elements';
import { ActivityIndicator } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { myurl } from '../../../GlobalCons/myurl';
import CustomModal from '../CustomComponents/CustomModal';

const list = [
    {
        name: 'Pizza',
    },
    {
        name: 'Kebab',
    },
    {
        name: 'Food',
    },
    {
        name: 'Food',
    },
    {
        name: 'One',
    },
    {
        name: 'hello',
    },
    {
        name: 'World',
    },
    {
        name: 'Next',
    },
]

class Rate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screenloading: false,
            buttonloading: false,
            data: this.props.navigation.state.params.data,
            order_id: this.props.navigation.state.params.order_id,
            customerreview: [],
            refresh: false,
            errororsucces: false,
            errormodalmessage: '',
            error: false,

        }
    }

    async componentDidMount() {
        FontAwesome.loadFont();
        // setTimeout(() => {
        //     this.setState({ screenloading: false })
        // }, 3000)
        // let dataa = await AsyncStorage.getItem('token');
        // var myHeaders = new Headers();
        // myHeaders.append('Authorization', `Bearer ${dataa}`);

        // var requestOptions = {
        //     method: 'GET',
        //     headers: myHeaders,
        //     redirect: 'follow',
        // };
        //alert(JSON.stringify(this.state.data))
    }

    render() {
        if (this.state.errororsucces == true) {
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
                            <View style={styles.modalMainContainer}>
                                <View style={styles.modalImageContainer}>
                                    {
                                        this.state.error == true ? (
                                            <Image
                                                source={require('../../Assets/Group9564.png')}
                                                style={styles.modalImageStyle}
                                            />
                                        ) : (
                                                <Image
                                                    source={require('../../Assets/Group9562.png')}
                                                    style={styles.modalImageStyle}
                                                />
                                            )
                                    }

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
                                    style={{ backgroundColor: blue, height: '10%', width: '90%', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        //this.setState({ errormodalvisible: false })
                                        this.setState({
                                            errororsucces: false
                                        })
                                        this.props.navigation.goBack()
                                    }}>
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
        if (this.state.screenloading == true) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white'
                    }}>
                    <ActivityIndicator animating={true} color={blue} />
                </View>
            )
        } else {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        //alignItems: 'center',
                        backgroundColor: blue
                    }}>
                    <TouchableOpacity
                        //style={{ marginTop: 55, marginLeft: 5 }}
                        style={{
                            width: 50,
                            //marginTop: 10,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 4,
                            position: 'absolute',
                            left: responsiveWidth(1.5),
                            top: responsiveHeight(5)
                        }}
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                        <Icon
                            name={'chevron-left'}
                            type='font-awesome'
                            color={colorWhite}
                            size={responsiveHeight(3.5)}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleTextStyle1}>{'Rate our food!'}</Text>
                    <View
                        style={{
                            height: responsiveHeight(70),
                            //justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            width: responsiveWidth(100)
                        }}>

                        <View
                            style={{
                                maxHeight: responsiveHeight(60),
                                width: responsiveWidth(90),
                                backgroundColor: colorWhite,
                                marginTop: -responsiveHeight(10),
                                zIndex: 3,
                                elevation: 20,
                                shadowOpacity: 0.5,
                                shadowRadius: 2,
                                borderRadius: responsiveWidth(2),
                                //alignItems: 'center',
                                paddingVertical: '5%',
                                shadowOffset: { width: 0, height: 2 },
                            }}>
                            <FlatList
                                data={this.state.data}
                                keyExtractor={(item, index) => index.toString()}

                                renderItem={({ item, index }) => {
                                    return (
                                        <View
                                            style={{
                                                //height: '20%',
                                                alignSelf: 'center',
                                                width: '90%',
                                                //backgroundColor: 'red',
                                                //flexDirection: 'row',
                                                minHeight: responsiveHeight(12),
                                                borderBottomWidth: 1,
                                                borderColor: 'grey',
                                                //marginBottom:index==list.length-1 ? 300:0
                                                //marginTop: '5%',
                                                paddingVertical: '5%'
                                            }}>
                                            <View
                                                style={{
                                                    //flex: 1,
                                                    width: '100%',
                                                    //backgroundColor: 'green',
                                                    flexDirection: 'row'

                                                }}>
                                                <Avatar
                                                    rounded
                                                    size={responsiveHeight(8)}
                                                    source={{
                                                        uri:
                                                            item.image,
                                                    }}
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: responsiveHeight(2),
                                                        fontWeight: 'bold',
                                                        alignSelf: 'center',
                                                        marginLeft: '5%'

                                                    }}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    width: '100%',
                                                    //backgroundColor: 'blue',
                                                    //justifyContent:'center',
                                                    alignItems: 'center',
                                                    marginVertical: '5%'
                                                }}>
                                                <Rating
                                                    startingValue="{3.3}"
                                                    imageSize={responsiveHeight(3.5)}
                                                    onFinishRating={(rating) => {
                                                        const found = this.state.customerreview.some(el => el.id === item.id);
                                                        //alert(JSON.stringify(found))
                                                        if (found == false) {
                                                            this.setState({
                                                                customerreview: this.state.customerreview.concat({
                                                                    id: item.id,
                                                                    rate: rating
                                                                })
                                                            })
                                                        }

                                                        //console.log(this.state.data);
                                                        //alert(JSON.stringify(this.state.data))
                                                    }}
                                                // style={{
                                                //     height:'90%',
                                                //     width:'90%',
                                                //     backgroundColor:'red'
                                                // }}
                                                />
                                            </View>

                                        </View>
                                    )
                                }}
                            />
                            {/* <View
                                style={{
                                    height:'25%',
                                    width:'100%',
                                    backgroundColor:'white'
                                }}>

                            </View> */}
                        </View>
                        <Button
                            title="SUBMIT"
                            onPress={async () => {
                                //this.setState({ loading: true });
                                //this.login();
                                this.setState({ buttonloading: true })
                                // setTimeout(() => {
                                //     this.setState({ buttonloading: false });
                                //     this.props.navigation.goBack();
                                // }, 3000)
                                let dataa = await AsyncStorage.getItem('token');
                                var myHeaders = new Headers();
                                myHeaders.append('Authorization', `Bearer ${dataa}`);
                                var formdata = new FormData();
                                formdata.append('order_id', this.state.order_id);
                                formdata.append('menu', JSON.stringify(this.state.customerreview))
                                var requestOptions = {
                                    method: 'POST',
                                    headers: myHeaders,
                                    body: formdata,
                                    redirect: 'follow'
                                };
                                fetch(
                                    `${myurl}/api/save-review`,
                                    requestOptions,
                                )
                                    .then(response => response.text())
                                    .then(result => {
                                        //alert(result);
                                        //console.log(result)
                                        //this.setState({ buttonloading: false })
                                        let dataa = JSON.parse(result);
                                        if (dataa.status == 200) {
                                            //alert(JSON.stringify(dataa.successData))
                                            this.setState({ errororsucces: true });
                                            this.setState({ buttonloading: false });
                                            this.setState({ errormodalmessage: 'Congrats! You review has been submitted!' })
                                        } else {
                                            this.setState({ errororsucces: true });
                                            this.setState({ buttonloading: false });
                                            this.setState({error:true})
                                            this.setState({ errormodalmessage: 'Sorry! You review has been submitted!' })
                                            //alert(dataa.message);
                                        }
                                    })
                                    .catch(error => alert('error', error));
                                //alert(JSON.stringify(this.state.customerreview))
                            }}
                            loading={this.state.buttonloading}
                            titleStyle={styles.buttonTitleStyle}
                            buttonStyle={styles.buttonStyle}
                            containerStyle={styles.buttonContainer}
                        />
                    </View>

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    headerTitleTextStyle1: {
        fontSize: responsiveHeight(4),
        fontWeight: 'bold',
        color: colorWhite,
        marginLeft: responsiveWidth(5),
        position: 'absolute',
        left: responsiveWidth(10),
        top: responsiveHeight(10)
    },
    titleTextStyle3: {
        fontSize: responsiveHeight(1.8),
        fontWeight: '900',
        color: colorWhite,
    },
    buttonTitleStyle: {
        fontSize: responsiveHeight(2.2),
        fontWeight: '900',
        color: colorWhite,
    },
    buttonStyle: {
        height: '100%',
        width: '100%',
        backgroundColor: '#dc4b3e',
        borderRadius: responsiveWidth(2),
    },
    buttonContainer: {
        height: responsiveHeight(8),
        width: responsiveWidth(80),
        alignSelf: 'center',
        backgroundColor: '#dc4b3e',
        padding: 0,
        marginTop: responsiveHeight(3)
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
        width: '90%',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
})

export default Rate;