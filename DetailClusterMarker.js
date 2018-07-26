import React from 'react';
import ClusterMarker from 'react-native-maps-super-cluster/ClusterMarker';

export default class DetailClusterMarker extends ClusterMarker {
  render() {
    if (this.props.renderCluster) {
      return this.props.renderCluster(this.props, this.onPress);
    }
  }
}