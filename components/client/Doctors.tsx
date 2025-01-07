import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import axios from 'axios';
import SubHeading from '../client/SubHeading';
import Colors from '../../components/Shared/Colors';
import useInsurance from '../../hooks/useInsurance';

interface Doctor {
  id: string;
  userId: string; // Add userId to the Doctor interface
  firstName: string;
  lastName: string;
  specialty: string;
  profileImage?: string;
  clinicAddress?: string;
  clinicName?: string; // Ensure clinicName is included
  bio?: string;
  title?: string;
  profession?: string;
  consultationFee?: string;
  clinic?: { insuranceCompanies: string[] };
  insuranceProviders: string[];
  yearsOfExperience?: string;
  specializedTreatment?: string;
  certifications?: string[];
}

interface DoctorsProps {
  searchQuery: string;
  excludeDoctorId?: string; // Optional prop to exclude a specific doctor
}

const Doctors: React.FC<DoctorsProps> = ({ searchQuery, excludeDoctorId }) => {
  const router = useRouter();
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation value
  const { insuranceProviders } = useInsurance(); // Use the insurance hook

  const handleConsult = (doctor: Doctor) => {
    console.log('Consulting doctor:', doctor);
    router.push({
      pathname: `/doctors/${doctor.id}`,
      params: { doctor: JSON.stringify(doctor) },
    });
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
        console.log('Fetched doctors raw data:', response.data); // Log the raw fetched data
        const transformedData = response.data.map((doctor) => {
          const insuranceNames = doctor.insuranceProviders.map(id => {
            const provider = insuranceProviders.find(provider => provider._id === id);
            return provider ? provider.name : 'Unknown';
          });
          return {
            id: doctor._id, // Unique identifier for the doctor
            userId: doctor.user._id, // Extract userId from the user attribute
            firstName: doctor.firstName, // Doctor's first name
            lastName: doctor.lastName, // Doctor's last name
            specialty: doctor.professionalDetails.specialization, // Doctor's specialty
            profileImage: doctor.user.profileImage, // URL to the doctor's profile image
            clinicAddress: doctor.practiceLocation, // Address of the clinic where the doctor practices
            clinicName: doctor.practiceName || 'Unknown Clinic', // Name of the clinic, with a default value if not provided
            bio: doctor.bio || 'No bio available', // Doctor's biography, with a default value if not provided
            title: doctor.title || 'N/A', // Doctor's title, with a default value if not provided
            profession: doctor.profession || 'N/A', // Doctor's profession, with a default value if not provided
            consultationFee: doctor.consultationFee || 'N/A', // Consultation fee, with a default value if not provided
            clinic: doctor.clinic || { insuranceCompanies: [] }, // Clinic information, with a default value if not provided
            insuranceProviders: insuranceNames, // List of insurance providers the doctor accepts, mapped from IDs to names
            yearsOfExperience: doctor.professionalDetails.yearsOfExperience || 'N/A', // Years of experience
            specializedTreatment: doctor.professionalDetails.specializedTreatment || 'N/A', // Specialized treatment
            certifications: doctor.professionalDetails.certifications || [], // Certifications
          };
        });
        setDoctorList(transformedData); // Set the transformed data to the state
        setLoading(false); // Set loading to false after data is fetched and transformed
      } catch (error) {
        setError(error.message || 'Failed to load doctors'); // Set error message if the fetch fails
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchDoctors();
  }, [insuranceProviders]);

  useEffect(() => {
    // Trigger the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const filteredDoctors = doctorList.filter(doctor =>
    ((doctor.firstName && doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (doctor.specialty && doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    doctor.id !== excludeDoctorId // Exclude the doctor with the given ID
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return <Text>Error loading doctors: {error}</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      <SubHeading subHeadingTitle="Discover Doctors Near You" />
      {filteredDoctors.length === 0 && searchQuery ? (
        <Text>No results found</Text>
      ) : (
        <FlatList
          data={filteredDoctors.length > 0 ? filteredDoctors : doctorList}
          horizontal
          renderItem={({ item }) => {
            console.log('Doctor item:', item);
            return (
              <Animated.View style={[styles.doctorItem, { opacity: fadeAnim }]}>
                <TouchableOpacity onPress={() => handleConsult(item)}>
                  <Image
                    source={{
                      uri:
                        item.profileImage ||
                        'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg',
                    }}
                    style={styles.doctorImage}
                  />
                </TouchableOpacity>
                <View style={styles.nameCategoryContainer}>
                  <Text style={styles.doctorName}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.doctorName}>{item.specialty}</Text>
                </View>
              </Animated.View>
            );
          }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doctorItem: {
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    width: 240,
  },
  doctorImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  nameCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  doctorName: {
    fontFamily: 'SourceSans3-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Doctors;
