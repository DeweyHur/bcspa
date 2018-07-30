import React from 'react';
import { Container, Header, Body, Text, Title, Content, List, ListItem } from 'native-base';
import { MassageType } from './data';
import { searchSpot } from './query';

export default class extends React.Component {

  state = {}

  static navigationOptions = { header: null }

  goToNextScreen = (type) => {
    const { navigate, state: { params } } = this.props.navigation;
    (async () => {

      this.setState({ ...this.state, message: 'querying spots...' });
      const spots = await searchSpot(type);
      this.setState({ ...this.state, ready: true, message: 'Moving to map screen...' });
      navigate('Map', { ...params, type, spots });
    })();
  }


  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Select a Service</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataArray={MassageType}
            renderRow={type => (
              <ListItem key={type} button onPress={() => { this.goToNextScreen(type); }}>
                <Body>
                  <Text>{type}</Text>
                  <Text note>{type}</Text>
                </Body>
              </ListItem>
            )}>
          </List>
        </Content>
      </Container>
    );
  }
}