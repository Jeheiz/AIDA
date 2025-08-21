import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { auth_, db } from '../services/firebase';
import firestore from '@react-native-firebase/firestore';

const ReportScreen = ({ navigation }) => {
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'AIDA needs access to your location to report incidents.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setLocation({ error: 'Location permission denied' });
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        setLocation({ error: error.message });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleSubmit = async () => {
    if (!location || location.error) {
      alert('Could not get location. Please ensure location is enabled and permissions are granted.');
      return;
    }

    const user = auth_.currentUser;
    if (!user) {
      alert('You must be logged in to submit a report.');
      return;
    }

    try {
      await db.collection('reports').add({
        userId: user.uid,
        incidentType: incidentType,
        description: description,
        location: new firestore.GeoPoint(location.latitude, location.longitude),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      alert('Report submitted successfully!');
      navigation.goBack();
    } catch (error) {
      alert('Error submitting report: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Incident</Text>
      <TextInput
        style={styles.input}
        placeholder="Type of incident"
        value={incidentType}
        onChangeText={setIncidentType}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.location}>
        {location
          ? location.error
            ? `Error: ${location.error}`
            : `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`
          : 'Fetching location...'}
      </Text>
      <Button title="Submit Report" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  location: {
    marginBottom: 20,
    fontStyle: 'italic',
  },
});

export default ReportScreen;
