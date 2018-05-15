import React from 'react';
import { Location, Permissions } from 'expo';
import { Body, Button, Container, Drawer, Header, Icon, Left, Right, Title } from 'native-base';
import { Dimensions, Text } from 'react-native';
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

  }
);