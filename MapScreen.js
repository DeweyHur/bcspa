import React from 'react';
import { map as _map, get as _get } from 'lodash';
import { Location, Permissions, AppLoading } from 'expo';
import { Dimensions, Text, View, Request, Picker } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { StackNavigator } from 'react-navigation';
import { Dropdown } from 'react-native-material-dropdown';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import ClusteredMapView from 'react-native-maps-super-cluster';
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

  // static navigationOptions = ({ navigation }) => {
  //   const title = _get(navigation, 'state.params.title') || 'Nothing';
  //   return { title };
  // }

  static navigationOptions = { title: 'SPA Seeker' };

  renderCluster({ pointCount, coordinate, clusterId }, onPress) {
    const points = this.map.getClusteringEngine().getLeaves(clusterId);
    const selected = points.map(x => _get(x, 'properties.item'));

    return (
      <Marker coordinate={coordinate} onPress={() => {
        this.popupDialog.show();
        this.setState({ ...this.state, selected });
      }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20 }}>
          <Text>{pointCount}</Text>
        </View>
      // </Marker>
    );
  }

  renderMarker = spot =>
    <Marker
      key={spot.name}
      coordinate={spot}
      onPress={() => {
        this.setState({ ...this.state, selected: [spot] });
        this.popupDialog.show();
      }}
    >
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20 }}>
        <Text>1</Text>
      </View>
    </Marker>

  convertData = (data) => {
    const { latitude, longitude } = data;
    return { ...data, location: { latitude, longitude }};
  }

  render() {
    const { loaded, message } = this.state;
    const { width: vw, height: vh } = Dimensions.get('window');

    if (!loaded) {
      return (
        <View style={{ flex: 1 }}>
          <Text>{message}</Text>
        </View>
      );

    } else {
      const { coords, spots, region, type, selected } = this.state;
      return (
        <View style={{ flex: 1 }}>
          <Dropdown
            label="Service Type"
            value={type}
            data={['Deep Tissue Massage', 'Shiatsu'].map(value => ({ value }))}
            onChangeText={type => (async () => await this.changeType(type))()}
          />
          <ClusteredMapView
            ref={ref => this.map = ref}
            style={{ flex: 1, zIndex: -1 }}
            initialRegion={coords}
            provider="google"
            data={spots.map(this.convertData)}
            renderMarker={this.renderMarker}
            renderCluster={this.renderCluster.bind(this)}
            region={region}
          />
          <PopupDialog
            ref={popupDialog => { this.popupDialog = popupDialog; }}
            onDismissed={() => this.setState({ ...this.state, selected: undefined })}
          >
            {selected != null && 
              <View>
                { selected.map(spot => 
                  <View key={spot.name} style={{ padding: 5, borderWidth: 1 }}>
                    <Text>{spot.name}</Text>
                    <Text>{this.generateDescription(spot)}</Text>
                  </View>
                ) }
              </View>
            }
          </PopupDialog>
          <Text>{message}</Text>
        </View>
      );
    }
  }

  generateDescription = (spot) => {
    const { name, description, services } = spot;
    return `${description}: ${services.map(({ length, price, currency }) =>
      `${length}min - ${price}${currency}`
    ).join(', ')}`;
  }

  changeType = async (type) => {
    try {
      const uri = `${config.server}/spot/search`;
      this.setState({ ...this.state, message: `Requesting to ${uri} ...` });

      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type })
      });
      const spots = await response.json();
      this.setState({ ...this.state, spots, loaded: true, message: JSON.stringify(spots) });

      // const { setParams } = this.props.navigation;
      // setParams({ title: type });  

    } catch (e) {
      this.setState({ ...this.state, message: e.message() });
    }
  }

  componentWillMount = () => {
    (async () => {
      try {
        const { coords, type } = this.state;

        this.setState({ ...this.state, message: 'asking Permission...' });
        await Permissions.askAsync(Permissions.LOCATION);
        this.setState({ ...this.state, message: 'completed asking Permission...' });
        coords = { ...coords, ...(await Location.getCurrentPositionAsync({})).coords };

        await this.changeType(type);

      } catch (e) {
        this.setState({ ...this.state, message: e.message() });
      }
    })();
  }
}