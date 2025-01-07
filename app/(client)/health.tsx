import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Button, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const Health = () => {
  const [medication, setMedication] = useState('');
  const [allergies, setAllergies] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const storedMedication = await AsyncStorage.getItem('medication');
      const storedAllergies = await AsyncStorage.getItem('allergies');
      const storedDiagnosis = await AsyncStorage.getItem('diagnosis');
      if (storedMedication) setMedication(storedMedication);
      if (storedAllergies) setAllergies(storedAllergies);
      if (storedDiagnosis) setDiagnosis(storedDiagnosis);
    };
    loadData();
  }, []);

  const saveData = async () => {
    await AsyncStorage.setItem('medication', medication);
    await AsyncStorage.setItem('allergies', allergies);
    await AsyncStorage.setItem('diagnosis', diagnosis);
  };

  const uploadPrescription = async () => {
    let result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.type === 'success') {
      console.log(result.uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Health Summary */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="heart" size={24} color="red" /> Health Summary</Text>
        <Text style={styles.content}>BMI: 22.5 | Weight: 70kg | Height: 170cm</Text>
      </View>

     
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="calendar" size={24} color="blue" />Consultations</Text>
        <Text style={styles.content}>Dr. Smith - Cardiologist - Dec 28, 10:00 AM</Text>
      </View>

      {/* Personalized Health Goals */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="walk" size={24} color="green" /> insights</Text>
        <Text style={styles.content}>Steps Today: 7,000 / 10,000</Text>
      </View>

      {/* Upload Prescription */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="cloud-upload" size={24} color="purple" /> Upload Prescription</Text>
        <Button title="Upload" onPress={uploadPrescription} />
      </View>

      {/* Lab Test Results */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="flask" size={24} color="orange" /> Lab Test Results</Text>
        <Text style={styles.content}>Blood Test: Normal | Cholesterol: High</Text>
      </View>

      {/* Diagnosis */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="medkit" size={24} color="red" /> Diagnosis</Text>
        <Text style={styles.content}>Hypertension</Text>
      </View>

      {/* Blood Pressure Tracking */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="pulse" size={24} color="pink" /> Blood Pressure Tracking</Text>
        <Text style={styles.content}>Systolic: 120 mmHg | Diastolic: 80 mmHg</Text>
      </View>

      {/* Future Integration with Wearables */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="watch" size={24} color="black" /> Wearable Integration</Text>
        <Text style={styles.content}>Coming Soon: Sync with your smartwatch for real-time health data.</Text>
      </View>

      {/* Current Medication */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="medkit" size={24} color="red" /> Current Medication</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your current medication"
          value={medication}
          onChangeText={setMedication}
          onBlur={saveData}
        />
      </View>

      {/* Allergies */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="alert" size={24} color="yellow" /> Allergies</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your allergies"
          value={allergies}
          onChangeText={setAllergies}
          onBlur={saveData}
        />
      </View>

      {/* Previous Diagnosis */}
      <View style={styles.section}>
        <Text style={styles.title}><Ionicons name="clipboard" size={24} color="blue" /> Previous Diagnosis</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your previous diagnosis"
          value={diagnosis}
          onChangeText={setDiagnosis}
          onBlur={saveData}
        />
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
    backgroundColor: theme.colors.backgroundColor,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#333',
  },
});
