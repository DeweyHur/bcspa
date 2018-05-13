import React from 'react';
import { MapView, Permissions, Location } from 'expo';
import { Header, View, Text, TextInput, Button, Dimensions } from 'react-native';
import styles from './styles';

export default class extends React.Component {
  state = {
    coords: {
      latitude: 49.2641022,
      longitude: -122.9505321,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    type: 'Swedish Massage'
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
      const { coords, type } = this.state;

      const { width: vw, height: vh } = Dimensions.get('window');

      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Header leftComponent={{ icon: 'menu', color: '#fff' }} centerComponent={{ text: 'HELLO', style: { color: '#fff' } }} rightComponent={{ icon: 'home', color: '#fff' }} />
          <MapView style={{ flex: 1 }} initialRegion={coords}>
            <MapView.Marker coordinate={coords} title="Sweet" description="Home" />
          </MapView>
          <View style={{ position: 'absolute', top: 50, left: 0.03*vw, width: 0.95*vw, borderRadius: 10, overflow: 'hidden' }}>
            <Button style={{ margin: 20 }} title={type} onPress={()=>alert(vw.toString())} />
          </View>
        </View>
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
