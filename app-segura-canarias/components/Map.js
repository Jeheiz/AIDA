import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

const Map = ({ reports }) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 28.29156, // Canary Islands
        longitude: -16.62913,
        latitudeDelta: 2.0,
        longitudeDelta: 2.0,
      }}
    >
      {reports && reports.map(report => (
        <Marker
          key={report.id}
          coordinate={{
            latitude: report.location.latitude,
            longitude: report.location.longitude,
          }}
          title={report.incidentType}
          description={report.description}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
