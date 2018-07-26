import React from 'react';
import MapView from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import SuperCluster from 'supercluster';
import DetailClusterMarker from './DetailClusterMarker';

export default class DetailClusteredMapView extends ClusteredMapView {

  clusterize = (dataset) => {
    this.index = SuperCluster({
      extent: this.props.extent,
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      radius: this.props.radius || (this.dimensions[0] * .045), // 4.5% of screen width
    });

    // get formatted GeoPoints for cluster
    const rawData = dataset.map((item) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [item.longitude, item.latitude]
      },
      properties: { point_count: 0, item }
    }));

    // load geopoints into SuperCluster
    this.index.load(rawData);

    const data = this.getClusters(this.state.region);
    this.setState({ data });
  }

  render() {
    return <MapView
      {...this.props}
      ref={this.mapRef}
      onRegionChangeComplete={this.onRegionChangeComplete}>
      {
        this.props.clusteringEnabled && this.state.data.map((d) => {
          if (d.properties.point_count === 0)
            return this.props.renderMarker(d.properties.item);

          return <DetailClusterMarker
            {...d}
            onPress={this.onClusterPress}
            textStyle={this.props.textStyle}
            scaleUpRatio={this.props.scaleUpRatio}
            renderCluster={this.props.renderCluster}
            key={`cluster-${d.properties.cluster_id}`}
            containerStyle={this.props.containerStyle}
            clusterInitialFontSize={this.props.clusterInitialFontSize}
            clusterInitialDimension={this.props.clusterInitialDimension} />;
        })
      }
      {
        !this.props.clusteringEnabled && this.props.data.map(d => this.props.renderMarker(d))
      }
      {this.props.children}
    </MapView>;
  }
}