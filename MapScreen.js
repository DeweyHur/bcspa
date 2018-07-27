import React from 'react';
import { map as _map, get as _get } from 'lodash';
import { Location, Permissions, AppLoading } from 'expo';
import { Dimensions, Text, View, Request, Picker } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Dropdown } from 'react-native-material-dropdown';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { searchSpot } from './query';

export default class extends React.Component {

  state = {}

  // static navigationOptions = ({ navigation }) => {
  //   const title = _get(navigation, 'state.params.title') || 'Nothing';
  //   return { title };
  // }

  static navigationOptions = { title: 'Your Bodywork' };

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
      </Marker>
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
    const { width: vw, height: vh } = Dimensions.get('window');

    const { type, coords, spots, message, region, selected } = { ...this.props.navigation.state.params, ...this.state };

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
          {selected == null && <View />}
        </PopupDialog>
        <Text>{message}</Text>
      </View>
    );
  }

  generateDescription = (spot) => {
    const { name, description, services } = spot;
    return `${description}: ${services.map(({ length, price, currency }) =>
      `${length}min - ${price}${currency}`
    ).join(', ')}`;
  }

  changeType = async (type) => {
    const spots = await searchSpot(type);
    this.setState({ ...this.state, spots, message: JSON.stringify(spots) });
  }
}