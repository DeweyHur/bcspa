import React from 'react';
import { createStackNavigator } from 'react-navigation';
import MapScreen from './MapScreen';
import HelpScreen from './HelpScreen';

export default class extends React.Component {
  render() {
    return (
      <Navigator />
    );
  }
}

const Navigator = createStackNavigator(
  {
    Map: MapScreen,
    Help: HelpScreen
  },
  {
    initialRouteName: "Map"
  }
);