import React from 'react';
import { Card, CardItem, Text } from 'native-base';

export default class extends React.Component {
  render() {
    const { description } = this.props;
    return (
      <Card>
        <CardItem>
          <Text>{description}</Text>
        </CardItem>
      </Card>
    );
  }

}