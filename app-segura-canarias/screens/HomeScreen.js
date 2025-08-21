import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Map from '../components/Map';
import ButtonSOS from '../components/ButtonSOS';
import { db } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('reports').onSnapshot(snapshot => {
      const fetchedReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(fetchedReports);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Map reports={reports} />
      <View style={styles.buttonsContainer}>
        <Button
          title="Report Incident"
          onPress={() => navigation.navigate('Report')}
        />
        <ButtonSOS />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default HomeScreen;
