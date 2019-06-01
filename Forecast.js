import React from 'react';
import { StyleSheet, ScrollView, Text, View, NetInfo, Linking, FlatList, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withNavigation } from 'react-navigation';
import { actions } from './store/duck';
import Autocomplete from 'react-native-autocomplete-input';
import { Icon, Header, Button } from 'react-native-elements';
console.disableYellowBox = true;

parseDate = (dateTimeISO, isWeek = false, isWeekDayName = false) => {
    if(!isWeek && !isWeekDayName){
        let data = new Date(Date.parse(dateTimeISO));
        let hour = data.getHours();
        let minutes = data.getMinutes();
        let parseHour = (hour.toString().length > 1) ? `${hour}` : `0${hour}`;
        let parseMinutes = (minutes.toString().length > 1) ? `${minutes}` : `0${minutes}`;

        return `${parseHour}:${parseMinutes}`
    } else 
    if (isWeek) {
        let data = new Date(Date.parse(dateTimeISO));
        let day = data.getDate();
        let parseDay = (day.toString().length > 1) ? `${day}` : `0${day}`;
        let weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        
        let weekdayName = weekday[data.getDay()];

        let month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        let monthName = month[data.getMonth()];
        return `${weekdayName}, ${parseDay} ${monthName}`
    } else 
    if (isWeekDayName) {
        let data = new Date(Date.parse(dateTimeISO));
        let weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        
        return weekday[data.getDay()];
    }
}

class Forecast extends React.Component {
  
    static navigationOptions = {
        header: null,
    };

    constructor(props){
        super(props);
        this.state = {

        }
    }
    componentWillMount() {
        // this.props.actions.fetchForecast(this.props.search);
    }

    componentWillUnmount(){
        this.props.actions.clean();
    }

    render() {
        // console.log(this.props, 'props');
        const { forecastNow, forecastWeek, forecastHour, search } = this.props;
        // const city = this.props.navigation.getParam('city', 'default-city'); 
        return (
            <View style={{ height: '100%' }}>
                <Header
                    centerComponent={{ text: search, style: { color: '#fff', fontSize: 20 } }}
                    rightComponent={
                        <Button
                            onPress={() => this.props.navigation.navigate('Main')}
                            icon={
                                <Icon
                                    name='home'
                                    color='white'
                                />
                            }
                        />
                    }
                />
                <ScrollView
                    style={{ flexDirection: 'column', backgroundColor: '#1f4d7a' }}
                >
                    <View style={styles.detailsContainer}>
                        <View style={{ flexDirection: 'column', width: '40%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 17 }}>{parseDate(forecastNow.dateTimeISO, true)}</Text>
                            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                <Text style={styles.temperatureNow}>{Math.round(forecastNow.tempC)}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 45, color: 'white', marginRight: 10 }}>&deg;C</Text>
                            </View>
                            <Image
                                source={{uri: `https://cdn.aerisapi.com/wxblox/icons/${forecastNow.icon}`}}
                                style={{width: 60, height: 60, alignSelf: 'center'}}
                            />
                            <Text 
                                style={styles.temperatureNowDescription}
                                numberOfLines={1}
                            >
                                {forecastNow.weatherPrimary}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: '#478cd1', width: '55%', flexDirection: 'column', marginLeft: 10, borderRadius: 15 }}>
                            <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'white' }}>
                                <Text style={{ color: 'white', fontSize: 15, padding: 8, paddingLeft: 15, paddingTop: 10 }}>Details</Text>
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 0.5, borderBottomColor: 'white' }}>
                                <View style={{ flexDirection: 'column', width: '50%', borderRightWidth: 0.5, borderRightColor: 'white', paddingLeft: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, paddingTop: 4 }}>Sunrise</Text>
                                    <Text style={{ color: 'white', fontSize: 16 }}>{parseDate(forecastNow.sunriseISO)} </Text>
                                </View>
                                <View style={{ flexDirection: 'column', width: '50%', paddingLeft: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, paddingTop: 4  }}>Sunset</Text>
                                    <Text style={{ color: 'white', fontSize: 16 }}>{parseDate(forecastNow.sunsetISO)}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', height: 50, borderBottomWidth: 0.5, borderBottomColor: 'white' }}>
                                <View style={{ flexDirection: 'column', width: '50%',  borderRightWidth: 0.5, borderRightColor: 'white', paddingLeft: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, paddingTop: 4  }}>Wind</Text>
                                    <Text style={{ color: 'white', fontSize: 16 }}>{(0.5144444*forecastNow.windSpeedKTS).toFixed(1)} m/s</Text>
                                </View>
                                <View style={{ flexDirection: 'column', width: '50%', paddingLeft: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, paddingTop: 4  }}>Feels like</Text>
                                    <Text style={{ color: 'white', fontSize: 16 }}>{forecastNow.feelslikeC}&deg;C</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', height: 60, borderBottomColor: 'white' }}>
                                <View style={{ flexDirection: 'column', width: '50%', borderRightWidth: 0.5, borderRightColor: 'white', paddingLeft: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, paddingTop: 4  }}>Humidity</Text>
                                    <Text style={{ color: 'white', fontSize: 16 }}>{forecastNow.humidity}%</Text>
                                </View>
                                <View style={{ flexDirection: 'column', width: '50%', paddingLeft: 10 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13, paddingTop: 4  }}>Pressure</Text>
                                    <Text style={{ color: 'white', fontSize: 14 }}>{forecastNow.pressureMB} mbar</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.sevenDaysForecastContainer}>
                        <Text style={{ color: 'white', fontSize: 18, marginTop: 5 }}>Forecast for 7 days</Text>
                        <View
                            style={{ height: 'auto', width: '80%', marginBottom: 10}}
                        >
                            {forecastWeek.map(i => (
                                <View style={styles.sevenDaysForecast} key={i}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '50%', overflow: 'hidden' }}>
                                        <Text style={{ color: 'white', fontSize: 14}}>{parseDate(i.dateTimeISO, false, true)} </Text>
                                        <Text numberOfLines={1} style={{ color: 'white', fontSize: 14, overflow: 'hidden' }}>&bull; {i.weatherPrimary}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ paddingRight: 5, paddingTop: 4}}>
                                            <Image
                                                style={{width: 30, height: 30}}
                                                source={{uri: `https://cdn.aerisapi.com/wxblox/icons/${i.icon}`}}
                                            />
                                        </View>
                                        <Text style={{ color: 'white', fontSize: 18 }}>{i.maxTempC} / </Text>
                                        <Text style={{ color: 'white', fontSize: 18 }}>{i.minTempC}</Text>
                                        <Text style={{ color: 'white', lineHeight: 30, fontSize: 18 }}>&deg;</Text>
                                        <Text style={{ color: 'white', fontSize: 18 }}>C  </Text>
                                    </View>
                                </View>
                            ))}
                            
                               
                        </View> 
                    </View>


                    <View style={{ backgroundColor: '#478cd1', width: '95%', height: 150, borderRadius: 15, alignItems: 'center', alignSelf: 'center', marginTop: 20 }}>
                        <Text style={{ color: 'white', fontSize: 18, marginTop: 5, alignSelf: 'center' }}>Forecast for 24 hours</Text>
                        <FlatList
                            data={forecastHour}
                            horizontal={true}
                            renderItem={({item}) => (
                                    <View style={styles.list}>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: 18 }}>{`   ${item.avgTempC}`}</Text>
                                            <Text style={{ color: 'white', lineHeight: 23, fontSize: 16 }}>&deg;</Text>
                                            <Text style={{ color: 'white', fontSize: 18 }}>C  </Text>
                                        </View>
                                            
                                        <View>
                                            <Image
                                                style={{width: 35, height: 35}}
                                                source={{uri: `https://cdn.aerisapi.com/wxblox/icons/${item.icon}`}}
                                            />
                                        </View>
                                        <Text style={{ color: 'white', fontSize: 14 }}> {parseDate(item.dateTimeISO)} </Text>
                                    </View>
                                )
                            }
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, marginTop: 5}}>
                        <Text style={{ fontSize: 12, color: 'white'}}>Data provided by </Text>
                        <TouchableOpacity
                            onPress={()=> Linking.openURL('https://www.aerisweather.com')}
                            style={{ marginTop: 5, marginBottom: 5 }}
                        >
                            <Image
                                source={{uri: `https://beta.aerisweather.com/img/logos/AerisWeather-logo-dark.png`}}
                                style={{width: 80, height: 30}}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    // backgroundColor: 'gray',
    height: '100%',
  },
  detailsContainer: {
    flexDirection: 'row',
    width: '95%',
    height: 200,
    // backgroundColor: 'green',
    margin: 10,
  },
  temperatureNow: {
    fontSize: 70,
    color: 'white',
    lineHeight: 70,
    fontWeight: '300',
    paddingLeft: 20,
    marginTop: 15,
  },
  temperatureNowDescription: {
    color: 'white',
    fontSize: 20,
    overflow: 'hidden',
  },
  sevenDaysForecastContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '95%',
    height: 'auto',
    backgroundColor: '#478cd1',
    marginTop: 20,
    borderRadius: 15,
    alignSelf: 'center',
  },
  sevenDaysForecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    // backgroundColor: '#478cd1',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
  },
  hoursForecastContainer: {
    flexDirection: 'row',
    width: 'auto',
    backgroundColor: 'red',
  },
  list: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    // backgroundColor: 'blue',
    width: 70,
    height: 100,
    alignItems: 'center',
    marginRight: 5,
    marginTop: 5,
  },
});

const mapStateToProps = state => ({
    search: state.search,
    forecastNow: state.forecastNow,
    forecastWeek: state.forecastWeek,
    forecastHour: state.forecastHour,
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        search: actions.search,
        fetchForecast: actions.fetchForecast,
        fetchCitiesSearch: actions.fetchCitiesSearch,
        clean: actions.clean,
    }, dispatch)
});
  
export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Forecast));
