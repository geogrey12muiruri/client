import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

const Health = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Health Summary */}
      <View style={styles.section}>
        <Text style={styles.title}>Health Summary</Text>
        <Text style={styles.content}>BMI: 22.5 | Weight: 70kg | Height: 170cm</Text>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <Text style={styles.title}>Upcoming Appointments</Text>
        <Text style={styles.content}>Dr. Smith - Cardiologist - Dec 28, 10:00 AM</Text>
      </View>

      {/* Personalized Health Goals */}
      <View style={styles.section}>
        <Text style={styles.title}>Health Goals</Text>
        <Text style={styles.content}>Steps Today: 7,000 / 10,000</Text>
      </View>

      {/* Add more sections as needed */}
    </ScrollView>
  );
};

export default Health;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#666',
  },
});
