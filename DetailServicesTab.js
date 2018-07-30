import React from 'react';
import { Card, CardItem, Text, List, ListItem, Left, Right } from 'native-base';

export default class extends React.Component {

  render() {
    const { services } = this.props;
    return (
      <Card>
        <CardItem>
          <List
            dataArray={services}
            renderRow={({ length, price, currency }) => (
              <ListItem key={length}>
                <Left>
                  <Text>{length} minutes</Text>
                </Left>
                <Right>
                  <Text>{currency} {price}</Text>
                </Right>
              </ListItem>
            )}
          />
        </CardItem>
      </Card>
    );
  }
}