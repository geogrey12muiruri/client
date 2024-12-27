import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors, setSelectedDoctor, clearSelectedDoctor, selectSelectedDoctor } from '../(redux)/doctorSlice';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { RootState } from '../../app/(redux)/store';
import Colors from '../../components/Shared/Colors';

import BookingSection from '../../components/BookingSection';
import HorizontalLine from '../../components/common/HorizontalLine';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';

const DoctorProfile: React.FC = () => {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams();

  const dispatch = useDispatch();
  const doctor = useSelector(selectSelectedDoctor);
  const loading = useSelector((state: RootState) => state.doctors.loading);
  const error = useSelector((state: RootState) => state.doctors.error);
  const doctors = useSelector((state: RootState) => state.doctors.doctorList);
  const otherDoctors = doctors.filter((doc) => doc._id !== doctorId);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (doctorId) {
      dispatch(setSelectedDoctor(doctorId));
    }
    return () => {
      dispatch(clearSelectedDoctor());
    };
  }, [dispatch, doctorId]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (doctor) {
      console.log('Doctor data:', doctor);
    }
  }, [doctor]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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

  if (!doctor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Doctor information not found.</Text>
      </View>
    );
  }

  const profileImageUri =
    doctor.profileImage ||
    'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';

  const insuranceProviders = doctor.clinic?.insuranceCompanies || [];
  const specialties = doctor.specialty || 'N/A';
  const clinicName = doctor.clinic?.name || 'Unknown Clinic';
  const title = doctor.title || 'N/A';
  const profession = doctor.profession || 'N/A';

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

      {/* Title, Profession, Specialty and Clinic */}
      <View style={[styles.section, styles.horizontalSection]}>
        <View style={styles.infoCard}>
          <Ionicons name="ribbon" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{title}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="briefcase" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{profession}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="medkit" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{specialties}</Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="business" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>{clinicName}</Text>
        </View>
      </View>

      {/* Booking Section */}
      <BookingSection
        doctorId={doctor._id}
        consultationFee={doctor.consultationFee || 'N/A'}
        insurances={insuranceProviders}
      />
      <HorizontalLine />

      {/* Other Doctors */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Other Doctors" />
        <FlatList
          data={otherDoctors}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.doctorItem}>
              <Image source={{ uri: item.profileImage || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg' }} style={styles.otherDoctorImage} />
              <Text style={styles.otherDoctorName}>{`${item.firstName} ${item.lastName}`}</Text>
              <TouchableOpacity style={styles.viewButton} onPress={() => router.push(`/doctors/${item._id}`)}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  heroContainer: { position: 'relative', height: 250 },
  heroImage: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
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
  doctorItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  otherDoctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  otherDoctorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
