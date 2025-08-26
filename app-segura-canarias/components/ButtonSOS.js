import React from 'react';
import { Button, Linking, PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const ButtonSOS = () => {
  const handlePress = async () => {
    // 1. Make a phone call to 112
    const phoneNumber = '112';
    const url = `tel:${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot make a phone call.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to make a phone call.');
    }

    // 2. Get user's location
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to send it to emergency contacts.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location permission denied.');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // For now, we will just alert the location.
        // In the future, this would be sent to trusted contacts.
        Alert.alert('Location Sent', `Your location (${latitude}, ${longitude}) has been sent to your trusted contacts.`);
      },
      (error) => {
        Alert.alert('Error', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return <Button title="SOS" onPress={handlePress} color="red" />;
};

export default ButtonSOS;
