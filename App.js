import React from 'react';
import { MapView, Permissions, Location } from 'expo';
import { View, Text, TextInput, Dimensions } from 'react-native';
import { Icon, Container, Header, Button, Body, Left, Right, Title } from 'native-base';
import styles from './styles';

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

  handleSubmit(e) {
    alert(e.nativeEvent.text);
  }

  render() {
    if (this.state && this.state.permission) {
      const { coords, type } = this.state;
      const { width: vw, height: vh } = Dimensions.get('window');

      return (
        <Container>
          <Header>
            <Left>
              <Button transparent>
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
