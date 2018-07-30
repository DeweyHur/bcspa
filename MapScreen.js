import React from 'react';
import { map as _map, get as _get } from 'lodash';
import { Dimensions, Text, View, Request, Picker, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Container, Header, Left, Body, Right, Button as BaseButton, Text as BaseText, Icon as BaseIcon, Title } from 'native-base';
import { Marker, Callout } from 'react-native-maps';
import { Dropdown } from 'react-native-material-dropdown';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { searchSpot } from './query';
import { MassageType } from './data';

export default class extends React.Component {

  state = {}

  static navigationOptions = { header: null }

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
    return { ...data, location: { latitude, longitude } };
  }

  render() {
    const { width: vw, height: vh } = Dimensions.get('window');
    const { type, coords, spots, message, region, selected } = { ...this.props.navigation.state.params, ...this.state };
    const { navigation } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Icon name='arrow-round-back' onPress={() => navigation.goBack()} />
          </Left>
          <Body>
            <Title>{type}</Title>
          </Body>
          <Right>
            <Icon name='options' />
          </Right>
        </Header>
        <Dropdown
          label="Service Type"
          value={type}
          data={MassageType.map(value => ({ value }))}
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
          <FlatList
            data={selected || []}
            renderItem={({ item }) =>
              <TouchableOpacity
                key={item.name}
                onPress={() => navigation.navigate('Detail', item)}
                style={{ padding: 5, borderWidth: 1, borderRadius: 3 }}
              >
                <Text key="name" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text key="description">{item.description}</Text>
                <Text key="services">{this.generateDescription(item)}</Text>
              </TouchableOpacity>
            }
          />
        </PopupDialog>
        <Text>{message}</Text>
      </Container>
    );
  }

  generateDescription = ({ services }) => {
    return `${services.map(({ length, price, currency }) =>
      `${price}${currency}(${length}min)`
    ).join(', ')}`;
  }

  changeType = async (type) => {
    const spots = await searchSpot(type);
    this.setState({ ...this.state, spots, message: JSON.stringify(spots) });
  }
}