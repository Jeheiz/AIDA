import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { auth_, db } from '../services/firebase';
import firestore from '@react-native-firebase/firestore';

const INCIDENT_TYPES = ['Theft', 'Assault', 'Harassment', 'Vandalism', 'Other'];

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
    if (!incidentType) {
      Alert.alert('Validation Error', 'Please select an incident type.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please provide a description.');
      return;
    }

    if (!location || location.error) {
      Alert.alert('Location Error', 'Could not get location. Please ensure location is enabled and permissions are granted.');
      return;
    }

    const user = auth_.currentUser;
    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to submit a report.');
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

      Alert.alert('Success', 'Report submitted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Error submitting report: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Incident</Text>
      <Text style={styles.label}>Type of Incident</Text>
      <View style={styles.incidentTypeContainer}>
        {INCIDENT_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.incidentTypeButton, incidentType === type && styles.incidentTypeButtonSelected]}
            onPress={() => setIncidentType(type)}
          >
            <Text style={[styles.incidentTypeText, incidentType === type && styles.incidentTypeTextSelected]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Provide a detailed description of the incident"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <Text style={styles.location}>
        {location
          ? location.error
            ? `Error: ${location.error}`
            : `Your Location: Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  location: {
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  incidentTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  incidentTypeButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  incidentTypeButtonSelected: {
    backgroundColor: 'blue',
  },
  incidentTypeText: {
    color: '#333',
  },
  incidentTypeTextSelected: {
    color: '#fff',
  },
});

export default ReportScreen;
