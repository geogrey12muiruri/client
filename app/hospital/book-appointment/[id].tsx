import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../../components/common/ActionButton';
import Colors from '../../../components/Shared/Colors';
import {
  fetchClinicById,
  selectClinicDetails,
  selectClinicLoading,
  selectClinicError,
} from '../../(redux)/clinicSlice';
import ClinicSubHeading from '../../../components/clinics/ClinicSubHeading';
import { theme } from '@/constants/theme';

const ClinicProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const clinicId = Array.isArray(id) ? id[0] : id;
  const dispatch = useDispatch();
  const router = useRouter();

  const clinic = useSelector(selectClinicDetails);
  const clinicImages = clinic?.clinicImages || [];
  const loading = useSelector(selectClinicLoading);
  const error = useSelector(selectClinicError);

  const [currentImage, setCurrentImage] = useState(null);
  const imageFadeAnim = useRef(new Animated.Value(1)).current;
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    if (clinicId) {
      dispatch(fetchClinicById(clinicId));
    }
  }, [clinicId, dispatch]);

  useEffect(() => {
    if (clinicImages.length) {
      setCurrentImage(clinicImages[0]);
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % clinicImages.length;
        Animated.timing(imageFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentImage(clinicImages[index]);
          Animated.timing(imageFadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [clinicImages, imageFadeAnim]);

  useEffect(() => {
    console.log('Clinic Data:', clinic);
    console.log('Doctors Data:', doctorsData);
  }, [clinic]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text>Loading Clinic Information...</Text>
      </View>
    );
  }

  if (error || !clinic) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error ? 'Failed to load clinic data' : 'No clinic found'}
        </Text>
      </View>
    );
  }

  const doctorsData = [
    ...(clinic.professionals || []).map(professional => ({
      _id: professional._id,
      name: `${professional.firstName} ${professional.lastName}`,
      specialties: [professional.category || professional.profession],
      profileImage: professional.profileImage,
      consultationFee: professional.consultationFee || 0,
    })),
    ...(clinic.doctors || []).map(doctor => ({
      _id: doctor._id,
      name: doctor.name,
      specialties: doctor.specialties || [],
      profileImage: doctor.profileImage,
      consultationFee: doctor.consultationFee || 0,
    }))
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        {currentImage && (
          <Animated.Image
            source={{ uri: currentImage }}
            style={[styles.heroImage, { opacity: imageFadeAnim }]}
          />
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroText}>{clinic.name}</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="About Us" />
        <Text style={styles.descriptionText}>
          {showFullDesc ? clinic.bio : clinic.bio?.slice(0, 100) || 'No description available'}
        </Text>
        {clinic.bio && (
          <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
            <Text style={styles.showMoreText}>{showFullDesc ? 'Show Less' : 'Show More'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Specialties */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Specialties" />
        <FlatList
          data={clinic.specialties.split(',')}
          renderItem={({ item }) => (
            <View style={styles.specialtyCard}>
              <Text style={styles.specialtyText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Insurance Providers */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Insurance Providers" />
        <FlatList
          data={clinic.insuranceCompanies}
          renderItem={({ item }) => (
            <View style={styles.insuranceCard}>
              <Text style={styles.insuranceText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Doctors */}
      <View style={styles.section}>
        <ClinicSubHeading subHeadingTitle="Our Doctors" />
        <FlatList
          data={doctorsData}
          renderItem={({ item }) => (
            <View style={styles.doctorCard}>
              <Image source={{ uri: item.profileImage }} style={styles.doctorImage} />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorSpecialty}>{item.specialties.join(', ')}</Text>
                <TouchableOpacity
                  style={styles.consultButton}
                  onPress={() => router.push(`/doctors/${item._id}`)}
                >
                  <Text style={styles.consultButtonText}>Consult</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.doctorsList}
        />
      </View>
    </ScrollView>
  );
};

export default ClinicProfileScreen;

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
  descriptionText: { fontSize: 16, color: '#333' },
  showMoreText: { color: Colors.PRIMARY, marginTop: 10 },
  specialtyCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  specialtyText: { fontSize: 14, color: '#555' },
  insuranceCard: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  insuranceText: { fontSize: 14, color: '#555' },
  doctorCard: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  doctorImage: { width: 100, height: 100, borderRadius: 50, marginRight: 15 },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  doctorSpecialty: { fontSize: 14, color: '#777', marginBottom: 10 },
  consultButton: { backgroundColor: Colors.PRIMARY, borderRadius: 5, paddingVertical: 8, paddingHorizontal: 15 },
  consultButtonText: { color: '#fff', fontWeight: 'bold' },
  doctorsList: { paddingBottom: 15 },
});
