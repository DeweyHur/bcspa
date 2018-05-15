import React from 'react';
import { Location, MapView, Permissions } from 'expo';
import { Body, Button, Container, Drawer, Header, Icon, Left, Right, Title } from 'native-base';
import { Dimensions, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SideBar from './SideBar';

export default class extends React.Component {
  state = {
    coords: {
      latitude: 49.2641022,
      longitude: -122.9505321,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    type: 'Swedish Massage',
    loading: true
  };

  constructor() {
    super();
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.onSideBarPress = this.onSideBarPress.bind(this);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
    });
    await Permissions.askAsync(Permissions.LOCATION);
    const { coords } = await Location.getCurrentPositionAsync({});
    this.setState({ ...this.state, coords, loading: false });
  }

  closeDrawer() {
    this.drawer._root.close();
  }

  openDrawer() {
    this.drawer._root.open();
  }

  onSideBarPress(type) {
    this.setState({ ...this.state, type });
    this.closeDrawer();
  }

  render() {
    const { loading, coords, type } = this.state;
    const { width: vw, height: vh } = Dimensions.get('window');

    if (loading) {
      return (
        <Expo.Loading />
      );

    } else {
      return (
        <Drawer ref={ref => { this.drawer = ref; }} content={<SideBar onPress={this.onSideBarPress} />}  >
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.openDrawer}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>
                  {type}
                </Title>
              </Body>
              <Right>
                <Button transparent onPress={this.openDrawer}>
                  <Icon name='help' />
                </Button>
              </Right>
            </Header>
            <MapView style={{ flex: 1 }} initialRegion={coords}>
              <MapView.Marker coordinate={coords} title="Sweet" description="Home" />
            </MapView>
          </Container>
        </Drawer>
      );
    }
  }
}
