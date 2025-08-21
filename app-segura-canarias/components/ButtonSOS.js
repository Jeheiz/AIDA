import React from 'react';
import { Button } from 'react-native';

const ButtonSOS = () => {
  const handlePress = () => {
    // Logic to call police or send location to trusted contact
    alert('SOS button pressed!');
  };

  return <Button title="SOS" onPress={handlePress} color="red" />;
};

export default ButtonSOS;
