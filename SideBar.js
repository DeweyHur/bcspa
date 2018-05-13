import React from 'react';
import { Container, Content, List, Header, Image, ListItem, Text, Thumbnail, Left, Body } from 'native-base';

const TYPES = ["Swedish Massage", "Deep Tissue Massage", "Hot Stone", "Sports Massage", "Reflexology", "Shiatsu"]

export default class extends React.Component {
  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Content>
          <Content>
            <Body>
              <Thumbnail source={{ uri: 'https://www.shareicon.net/download/128x128//2015/12/04/682066_people_512x512.png' }} />
              <Text>Spa Map</Text>
              <Text note>© Digitz</Text>
            </Body>
          </Content>
          <List dataArray={TYPES} renderRow={data => {
            return (
              <ListItem button onPress={() => this.props.onPress(data)}>
                <Text>{data}</Text>
              </ListItem>
            );
          }} />
        </Content>
      </Container>
    );
  }
}