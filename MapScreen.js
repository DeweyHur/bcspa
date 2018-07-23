import React from 'react';
import { map as _map } from 'lodash';
import { Location, MapView, Permissions, AppLoading } from 'expo';
import { Dimensions, Text, View, Request } from 'react-native';
import { StackNavigator } from 'react-navigation';
import config from './config/local.js';

export default class extends React.Component {
  state = {
    coords: {
      latitude: 49.2641022,
      longitude: -122.9505321,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    type: 'Deep Tissue Massage',
    message: 'Initializing...'
  };

  render = () => {
    const { loaded, message } = this.state;
    // const { width: vw, height: vh } = Dimensions.get('window');

    if (!loaded) {
      return (
        <View style={{ flex: 1 }}>
          <Text>{message}</Text>
        </View>
      );

    } else {
      const { coords, spots, region, type } = this.state;
      return (
        <View style={{ flex: 1 }}>
          <Text>{message}</Text>
          <MapView
            style={{ flex: 1, zIndex: -1 }}
            initialRegion={coords}
            provider="google"
            region={region}
            onRegionChange={(region) => this.setState({ ...this.state, message: _map(region, (value, key) => `${key}:${value}`).join(', ') })}
          >
            {spots.map(spot => {
              const { latitude, longitude, name, description, services } = spot;
              const fullDescription = `${description}\n${services.map(({ length, price, currency }) =>
                `${length} min - ${price}${currency}`
              ).join('\n')}`;

              return <MapView.Marker
                key={name}
                coordinate={{ latitude, longitude }}
                title={name}
                description={fullDescription}
              />;
            })}

          </MapView>
        </View>
      );
    }
  }

  componentWillMount = () => {
    (async () => {
      try {
        let { coords } = this.state;
        this.setState({ ...this.state, message: 'asking Permission...' });
        await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ ...this.state, message: 'completed asking Permission...' });
        coords = { ...coords, ...(await Location.getCurrentPositionAsync({})).coords };

        const uri = `${config.server}/spot/search`;
        this.setState({ ...this.state, coords, message: `Requesting to ${uri} ...` });

        const response = await fetch(uri, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'Deep Tissue Massage'
          })
        });
        const spots = await response.json();
        this.setState({ ...this.state, spots, loaded: true, message: JSON.stringify(coords) });

      } catch (e) {
        this.setState({ ...this.state, message: e.message() });
      }
    })();
  }
}
