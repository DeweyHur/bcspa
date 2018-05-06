import { createBottomTabNavigator } from 'react-navigation';
import ListView from './ListView';
import MapView from './MapView';

export default createBottomTabNavigator({
  List: { screen: ListView },
  Map: { screen: MapView },
});