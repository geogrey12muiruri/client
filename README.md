import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';

const InsuranceScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    insuranceProvider: 'HealthPlus',
    insuranceNumber: '123-456-789',
    policyholderName: 'John Doe',
    effectiveDate: '2024-01s-01',
    expirationDate: '2025-01-01',
  });

  const handleUpdate = (field, value) => {
    setInsuranceData({ ...insuranceData, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Insurance Information</Text>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Provider:</Text>
          <Text style={styles.cardValue}>{insuranceData.insuranceProvider}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Policy Number:</Text>
          <Text style={styles.cardValue}>{insuranceData.insuranceNumber}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Policyholder:</Text>
          <Text style={styles.cardValue}>{insuranceData.policyholderName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.updateButton}
        >
          <Text style={styles.updateButtonText}>
            {isEditing ? 'Save Changes' : 'Update Provider'}
          </Text>
        </TouchableOpacity>
        {isEditing && (
          <ScrollView style={styles.editSection}>
            <EditableField
              label="Insurance Provider"
              value={insuranceData.insuranceProvider}
              onChangeText={(value) => handleUpdate('insuranceProvider', value)}
            />
            <EditableField
              label="Insurance Number"
              value={insuranceData.insuranceNumber}
              onChangeText={(value) => handleUpdate('insuranceNumber', value)}
            />
            <EditableField
              label="Policyholder Name"
              value={insuranceData.policyholderName}
              onChangeText={(value) => handleUpdate('policyholderName', value)}
            />
            <EditableField
              label="Effective Date"
              value={insuranceData.effectiveDate}
              onChangeText={(value) => handleUpdate('effectiveDate', value)}
            />
            <EditableField
              label="Expiration Date"
              value={insuranceData.expirationDate}
              onChangeText={(value) => handleUpdate('expirationDate', value)}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const EditableField = ({ label, value, onChangeText }) => (
  <View style={styles.editableField}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles.fieldInput}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editSection: {
    marginTop: 16,
  },
  editableField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
});

export default InsuranceScreen;
