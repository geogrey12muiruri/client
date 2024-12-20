import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Picker } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import FeatherIcon from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";

interface User {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  insuranceProvider: string;
  token: string;
  userId: string;
}

interface PatientProfile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  insuranceProvider: string;
}

interface Props {
  styles: any;
  profileCompletion: number;
  setProfileCompletion: (completion: number) => void;
}

export default function InsuranceProvider({ styles, profileCompletion, setProfileCompletion }: Props) {
  const user = useSelector((state: any) => state.auth.user) as User;
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    insuranceProvider: user?.insuranceProvider || "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user) {
      setPatientProfile({
        fullName: `${user.firstName} ${user.lastName}`,
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        insuranceProvider: user.insuranceProvider || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/updatePatientProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId: user.userId, ...patientProfile }),
      });

      const data = await response.json();
      if (response.ok) {
        setProfileCompletion(data.profileCompletion);
        console.log("Patient profile saved:", patientProfile);
      } else {
        console.error("Error saving profile:", data.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date(patientProfile.dateOfBirth);
    setShowDatePicker(false);
    setPatientProfile({ ...patientProfile, dateOfBirth: currentDate.toISOString() });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Patient Profile</Text>
      <View style={styles.sectionBody}>
        <Text style={styles.progressText}>{profileCompletion}% Complete</Text>
        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Full Name</Text>
            <View style={styles.rowSpacer} />
            <TextInput
              style={styles.rowValue}
              value={patientProfile.fullName}
              onChangeText={(text) => setPatientProfile({ ...patientProfile, fullName: text })}
            />
          </View>
        </View>
        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date of Birth</Text>
            <View style={styles.rowSpacer} />
            <View style={styles.datePickerContainer}>
              <TextInput
                style={styles.rowValue}
                value={patientProfile.dateOfBirth}
                editable={false}
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <FeatherIcon color="#f95959" name="calendar" size={28} />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(patientProfile.dateOfBirth)}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        </View>
        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Gender</Text>
            <View style={styles.rowSpacer} />
            <Picker
              selectedValue={patientProfile.gender}
              style={styles.rowValue}
              onValueChange={(itemValue) => setPatientProfile({ ...patientProfile, gender: itemValue })}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
