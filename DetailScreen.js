import React from 'react';
import { get as _get } from 'lodash';
import { ScrollView, Text } from 'react-native';
import HTML from 'react-native-render-html';

export default class extends React.Component {
  state = {}

  static navigationOptions = ({ navigation }) => {
    const title = _get(navigation, 'state.params.name') || 'Unknown';
    return { title };
  }

  render() {
    const { name, description, services } = this.props.navigation.state.params;
    const html = `
      <p>
        ${description}
      </p>
      <ul>
        ${services.map(({ length, price, currency }) => {
          return `<li>${length} min - ${currency} ${price}</li>`;
        }).join('')}
      </ul>
    `;
    return (
      <ScrollView>
        <HTML
          html={html}
        />
      </ScrollView>
    );
  }
}