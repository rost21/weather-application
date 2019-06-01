import React, {Component} from 'react';
import { StyleSheet, Text, View, NetInfo } from 'react-native';
import Main from './Main';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { reducer, saga } from './store/duck';
import MainApp from './AppNavigator';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(saga);

export default class App extends Component{

  constructor(){
    super();
    this.state = {
      connection : false,
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'connectionChange',
        this.handleConnectivityChange
    );
   
    NetInfo.isConnected.fetch().done((isConnected) => {
      this.setState({connection : isConnected})
    });
  }
  

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this.handleConnectivityChange
    );
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({connection : isConnected})
  };

  render() {
    return (
        // this.state.connection ? (
          <Provider store={store}>
            <MainApp/>
          </Provider>
          // ) : (
          // <View style={styles.MainContainer}>
          //   <Text style={styles.TextStyle}> You are offline </Text>
          // </View>
          // )
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    padding: 20
  },
  TextStyle: {
    fontSize: 20,
    textAlign: 'center',

  }
});
