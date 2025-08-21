import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

const ProfileScreen = () => {
  const [contact, setContact] = useState('');
  const [contacts, setContacts] = useState([]);

  const handleAddContact = () => {
    if (contact.trim() !== '') {
      setContacts([...contacts, { id: Math.random().toString(), name: contact }]);
      setContact('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      <View style={styles.addContactContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add emergency contact"
          value={contact}
          onChangeText={setContact}
        />
        <Button title="Add" onPress={handleAddContact} />
      </View>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.contactItem}>{item.name}</Text>}
      />
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
  addContactContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  contactItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ProfileScreen;
