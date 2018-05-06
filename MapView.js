import React from 'react';
import { MapView, Permissions, Location } from 'expo';
import { View, Text, TextInput, Button } from 'react-native';
import styles from './styles';

export default class extends React.Component {
  state = {
    coords: {
      latitude: 49.2641022,
      longitude: -122.9505321,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
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
  
  handleSubmit(e) {
    alert(e.nativeEvent.text);
  }

  render() {
    if (this.state && this.state.permission) {
      const coords = this.state.coords;
      return (
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1 }} initialRegion={coords}>
            <MapView.Marker
              coordinate={coords}
              title="Sweet"
              description="Home"
            />
          </MapView>
          <TextInput
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
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
          <Button onPress={async () => this.grantLocation()} title="a" />
        </View>
      );
    }
  }
}
