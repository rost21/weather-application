import React from 'react';
import { StyleSheet, Text, View, NetInfo, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from './store/duck';
import Autocomplete from 'react-native-autocomplete-input';
import { Icon, Header, Button } from 'react-native-elements';
import { YellowBox } from 'react-native';
import Forecast from './Forecast';
YellowBox.ignoreWarnings(['Remote debugger']);

class Preloader extends React.Component {
  
    static navigationOptions = {
        header: null,
    };

    constructor(){
        super();
        this.state = {

        }
    }
    componentWillMount() {
        this.props.actions.fetchForecast(this.props.navigation.getParam('city', 'default-city'));
    }



    render() {
        // console.log(this.props, 'props');
        const { successforecastNow, successforecastWeek, successforecastHour } = this.props;
        const city = this.props.navigation.getParam('city', 'default-city'); 

        return (
        <View style={styles.container}>

            
            {(successforecastNow && successforecastWeek && successforecastHour) ? (
                <Forecast/>
            ) : <ActivityIndicator size="large" color="#0000ff" />}

            
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  }
});

const mapStateToProps = state => ({
    search: state.search,
    forecastNow: state.forecastNow,
    successforecastNow: state.successforecastNow,
    forecastWeek: state.forecastWeek,
    successforecastWeek: state.successforecastWeek,
    forecastHour: state.forecastHour,
    successforecastHour: state.successforecastHour,
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        search: actions.search,
        fetchForecast: actions.fetchForecast,
        fetchCitiesSearch: actions.fetchCitiesSearch,
    }, dispatch)
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Preloader);
