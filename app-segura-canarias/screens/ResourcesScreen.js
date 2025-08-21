import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ResourcesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resources</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal Information</Text>
        <Text>Information about laws and regulations related to harassment and abuse.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        <Text>Police: 112</Text>
        <Text>Domestic Violence Hotline: 016</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Tips</Text>
        <Text>Some useful safety tips to prevent and handle harassment.</Text>
      </View>
    </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ResourcesScreen;
