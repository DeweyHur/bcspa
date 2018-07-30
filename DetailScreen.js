import React from 'react';
import { get as _get } from 'lodash';
import { Container, Header, Left, Icon, Title, Content, Tabs, Tab, Body, Right } from 'native-base';
import { NavigationActions } from 'react-navigation';
import DetailInfoTab from './DetailInfoTab';
import DetailServicesTab from './DetailServicesTab';

export default class extends React.Component {
  state = {}

  static navigationOptions = { header: null }
  
  render() {
    const { goBack, state: { params: { name, description, services } } } = this.props.navigation;
    return (
      <Container>
        <Header>
          <Left>
            <Icon name='arrow-round-back' onPress={() => goBack()} />
          </Left>
          <Body>
            <Title>{name}</Title>
          </Body>
          <Right />
        </Header>
        <Tabs>
          <Tab heading="INFO">
            <DetailInfoTab description={description} />
          </Tab>
          <Tab heading="SERVICES">
            <DetailServicesTab services={services} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}