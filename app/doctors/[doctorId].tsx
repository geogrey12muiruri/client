import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '../../components/Shared/Colors';

import BookingSection from '../../components/BookingSection';
import HorizontalLine from '../../components/common/HorizontalLine';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import { theme } from '@/constants/theme';
import useInsurance from '../../hooks/useInsurance';
import Doctors from '../../components/client/Doctors'; // Ensure this import is correct

const DoctorProfile: React.FC = () => {
  const router = useRouter();
  const { doctorId, doctor: doctorParam } = useLocalSearchParams();
  const doctor = doctorParam ? JSON.parse(decodeURIComponent(doctorParam as string)) : null;
  const { insuranceProviders } = useInsurance(); // Use the insurance hook

  console.log('Doctor data:', doctor); // Log the doctor data

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (doctor) {
      setLoading(false);
    } else {
      setError('Doctor information not found.');
      setLoading(false);
    }
  }, [doctor]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  console.log('Doctor clinicName:', doctor.clinicName); // Log clinicName

  const profileImageUri =
    doctor.profileImage ||
    'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';

  const specialties = doctor.specialty || 'N/A';
  const clinicName = doctor.clinicName || 'Unknown Clinic';
  const title = doctor.title || 'N/A';
  const profession = doctor.profession || 'N/A';
  const yearsOfExperience = doctor.yearsOfExperience || 'N/A';
  const specializedTreatment = doctor.specializedTreatment || 'N/A';
  const certifications = doctor.certifications.join(', ') || 'N/A';

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: profileImageUri }} style={styles.heroImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{`${doctor.firstName} ${doctor.lastName}`}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle={`${doctor.firstName} ${doctor.lastName}`} />
        <Text style={styles.descriptionText}>
          {doctor.bio || 'No description available'}
        </Text>
      </View>

      {/* Title, Profession, Specialty, Clinic, Experience, Treatment, and Certifications */}
      <View style={[styles.section, styles.horizontalSection]}>
        <View style={styles.infoCard}>
          <Ionicons name="medkit" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{specialties}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="business" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{clinicName}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="calendar" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{yearsOfExperience} years of experience</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="medkit" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{specializedTreatment}</Text>
        </View>
      </View>

      {/* Booking Section */}
      <BookingSection
        doctorId={doctor.userId} // Pass userId as doctorId
        userId={doctor.id} // Pass actual doctorId as userId
        consultationFee={doctor.consultationFee || 'N/A'}
        insurances={doctor.insuranceProviders}
      />
      <HorizontalLine />

      {/* Doctors List Section */}
      <View style={styles.section}>
        
        <Doctors searchQuery="" excludeDoctorId={doctor.id} />
      </View>
    </ScrollView>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundColor },
  heroContainer: { position: 'relative', height: 250 },
  heroImage: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  section: { marginVertical: 15, paddingHorizontal: 15 },
  horizontalSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  descriptionText: { fontSize: 16, color: '#333' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  infoText: { marginLeft: 8, fontSize: 14, color: Colors.text },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
