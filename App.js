import React from 'react';
import { Location, MapView, Permissions } from 'expo';
import { Body, Button, Container, Drawer, Header, Icon, Left, Title } from 'native-base';
import { Dimensions, Text } from 'react-native';
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
    loading: true,
  };

  constructor () {
    super ();
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.onSideBarPress = this.onSideBarPress.bind(this);
  }

  async grantLocation() {
    try {
      await Permissions.askAsync(Permissions.LOCATION);
      this.setState({
        ...this.state,
        permission: true,
      });
      const { coords } = await Location.getCurrentPositionAsync({});
      this.setState({
        ...this.state,
        coords,
      });
    } catch (e) {
      alert(e.toString());
      this.setState({ ...this.state, permission: false });
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
    });
    this.setState({ ...this.state, loading: false });
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
    if (this.state && this.state.permission) {
      const { coords, type } = this.state;
      const { width: vw, height: vh } = Dimensions.get('window');

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
            </Header>
            <MapView style={{ flex: 1 }} initialRegion={coords}>
              <MapView.Marker coordinate={coords} title="Sweet" description="Home" />
            </MapView>
          </Container>
        </Drawer>
      );
      {/* <TextInput
            style={{
              position: 'absolute',
              top: 50,
              left: 12,
              padding: 12,
              borderRadius: 20,
              width: 340,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            placeholder=" Where to?"
            onSubmitEditing={this.handleSubmit.bind(this)}
          /> */}
    } else if (!this.state.loading) {
      return (
        <Container>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
          <Button full onPress={async () => this.grantLocation()}>
            <Icon name="home" />
            <Text white>Grant Location</Text>
          </Button>
        </Container>
      );
    } else {
      return (
        <Expo.AppLoading />
      );
    }
  }
}
