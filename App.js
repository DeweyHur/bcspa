import React from 'react';
import Navigator, { createStackNavigator } from 'react-navigation';
import { Dimensions, View, Text, Image } from 'react-native';
import { Location, Permissions } from 'expo';
import MapScreen from './MapScreen';
import { searchSpot } from './query';

global.__old_console_warn = global.__old_console_warn || console.warn;
global.console.warn = str => {
  let tst = (str || '') + '';
  if (tst.startsWith('Warning: isMounted(...) is deprecated')) {
    return;
  }
  return global.__old_console_warn.apply(console, [str]);
};

export default class extends React.Component {

  state = {
    type: 'Deep Tissue Massage'
  }

  componentWillMount = () => {
    (async () => {
      try {
        const { type } = this.state;

        this.setState({ ...this.state, message: 'asking Permission...' });
        await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ ...this.state, message: 'getting current location...' });
        coords = (await Location.getCurrentPositionAsync({})).coords;
        this.setState({ ...this.state, message: 'querying spots...' });
        spots = await searchSpot('Deep Tissue Massage');
        this.setState({ ...this.state, spots, ready: true, message: 'Done' });

      } catch (e) {
        this.setState({ ...this.state, message: e.message() });
      }
    })();
  }

  render() {
    const { width: vw, height: vh } = Dimensions.get('window');
    const { ready, message, coords, spots, type } = this.state;

    if (ready) {
      this.navigator = this.navigator || createStackNavigator(
        {
          Map: MapScreen
        },
        {
          initialRouteName: "Map",
          initialRouteParams: {
            coords: { 
              latitude: 49.2641022,
              longitude: -122.9505321,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
            spots,
            type
          }
        }
      );
      return (
        <this.navigator />
      );

    } else {
      return (
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: 'center',
          paddingLeft: 0.1 * vw,
          paddingRight: 0.1 * vw,
          paddingTop: 0.2 * vh,
          paddingBottom: 0.2 * vh,
        }}>
          <Text style={{ fontSize: 40 }}>Your Bodyworker</Text>
          <Image
            style={{ width: 0.7 * vw, height: 0.4 * vh, resizeMode: Image.resizeMode.contain }}
            source={{ uri: 'data:image/png;base64,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' }}
          />
          <Text style={{ textAlign: 'center' }}>{ message || '' }</Text>
        </View>
      );
    }
  }
}
