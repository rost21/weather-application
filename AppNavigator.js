import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import Forecast from './Forecast';
import Preloader from './Preloader';

const AppNavigator = createStackNavigator({
  Main: { screen: Main },
  Forecast: { screen: Forecast },
  Preloader: { screen: Preloader }
}, { initialRouteName: 'Main' });

const MainApp = createAppContainer(AppNavigator);

export default MainApp;