import React from 'react';
import { StyleSheet, Text, View, NetInfo, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SQLite } from 'expo';
import { actions } from './store/duck';
import Autocomplete from 'react-native-autocomplete-input';
import { Icon, Header, Button } from 'react-native-elements';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

class Main extends React.Component {
  
    static navigationOptions = {
        header: null,
    };

    constructor(){
        super();
        this.state = {
            query: '',
            hideResults: true,
            showButton: false,
        }
    }
    componentWillMount() {
        //this.props.actions.fetchForecast();
    }

    handleChangeSearch = (e) => {

        this.setState({ query: e, hideResults: true });

        if(e.length > 1) {
            this.setState({ hideResults: false });
            this.props.actions.fetchCitiesSearch(e);
        } else if (e.length > 0){
            this.setState({ showButton: true });
        } else {
            this.setState({ showButton: false });
            this.props.actions.fetchCitiesSearch('');
        }
    }

    handleClearClick = () => {
        this.setState({ query: '', hideResults: true })
    }

    handleAddClick = () => {
        const { query } = this.state;
        this.props.actions.search(query);
        this.props.navigation.navigate("Preloader", {
            city: this.state.query,
        });
    }

    render() {
        // console.log(this.props, 'props'); 
        const { query, hideResults } = this.state;
        const { cities } = this.props;
        return (
        <View style={styles.container}>
            <Header
                centerComponent={{ text: 'Home', style: { color: '#fff', fontSize: 20 } }}
            />
            <View style={styles.search}>
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    //data to show in suggestion
                    data={cities}
                    //default value if you want to set something in input
                    defaultValue={query}
                    onChangeText={this.handleChangeSearch}
                    placeholder="Enter city"
                    hideResults={hideResults}
                    renderItem={({ item, i }) => (
                        //you can change the view you want to show in suggestion from here
                        <TouchableOpacity
                            onPress={() => this.setState({ query: (item.state ? `${item.name}, ${item.state}, ${item.country}` : `${item.name}, ${item.country}`) , hideResults: true})}
                        >
                            <Text style={styles.itemText}>
                                {item.name},{item.state ? ` ${item.state},` : null } {item.country} 
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={( item, i) => `${item.name}, ${item.state}, ${item.country}`}
                />
                {this.state.showButton ? (
                    <Icon
                        containerStyle={{ padding: 5 }}
                        name='close'
                        onPress={this.handleClearClick}
                    />
                ) : null}
                
            </View>
            <Button
                title="Add" 
                containerStyle={{ width: 200, alignSelf: 'center' }}
                onPress={this.handleAddClick}
            />
            <View style={styles.descriptionContainer}>
                {cities.length > 0 ? (
                    <Text style={styles.infoText}>{this.state.query}</Text>
                ) : (
                    <Text style={styles.infoText}>Enter city</Text>
                )}
            </View>

        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f4d7a',
    flex: 1,
    // padding: 16,
    //marginTop: 40,
  },
  autocompleteContainer: {
    borderWidth: 0,
    width: 50,
  },
  descriptionContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white'
  },
  search: {
    flexDirection: 'row',
    padding: 16,
  },
});

const mapStateToProps = state => ({
    search: state.search,
    cities: state.cities,
    forecastNow: state.forecastNow,
    forecastWeek: state.forecastWeek,
    forecastHour: state.forecastHour,
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        search: actions.search,
        fetchForecast: actions.fetchForecast,
        fetchCitiesSearch: actions.fetchCitiesSearch,
    }, dispatch)
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Main);
