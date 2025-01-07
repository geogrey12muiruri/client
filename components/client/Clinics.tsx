import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import axios from 'axios';
import SubHeading from '../../components/client/SubHeading';
import Colors from '../Shared/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import {
  Poppins_600SemiBold,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import useInsurance from '../../hooks/useInsurance'; // Import the insurance hook

SplashScreen.preventAutoHideAsync();

interface Clinic {
  _id: string;
  name: string;
  category: string;
  address: string;
  clinicImages?: string[];
}

interface ClinicsProps {
  searchQuery: string;
  onViewAll: () => void;
}

const Clinics: React.FC<ClinicsProps> = ({ searchQuery, onViewAll }) => {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { insuranceProviders } = useInsurance(); // Use the insurance hook

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
        console.log('Fetched clinics raw data:', response.data); // Log the raw fetched data
        const transformedData = response.data.map((clinic) => {
          const insuranceNames = clinic.insuranceProviders.map(id => {
            const provider = insuranceProviders.find(provider => provider._id === id);
            return provider ? provider.name : 'Unknown';
          });
          const doctorData = {
            id: clinic._id, // Unique identifier for the doctor
            firstName: clinic.firstName, // Doctor's first name
            lastName: clinic.lastName, // Doctor's last name
            specialty: clinic.professionalDetails?.specialization || 'N/A', // Doctor's specialty
            profileImage: clinic.profileImage, // URL to the doctor's profile image
            clinicAddress: clinic.practiceLocation, // Address of the clinic where the doctor practices
            clinicName: clinic.practiceName || 'Unknown Clinic', // Name of the clinic, with a default value if not provided
            bio: clinic.bio || 'No bio available', // Doctor's biography, with a default value if not provided
            title: clinic.title || 'N/A', // Doctor's title, with a default value if not provided
            profession: clinic.profession || 'N/A', // Doctor's profession, with a default value if not provided
            consultationFee: clinic.consultationFee || 'N/A', // Consultation fee, with a default value if not provided
            clinic: clinic.clinic || { insuranceCompanies: [] }, // Clinic information, with a default value if not provided
            insuranceProviders: insuranceNames, // List of insurance providers the doctor accepts, mapped from IDs to names
            yearsOfExperience: clinic.professionalDetails?.yearsOfExperience || 'N/A', // Years of experience
            specializedTreatment: clinic.professionalDetails?.specializedTreatment || 'N/A', // Specialized treatment
            certifications: clinic.professionalDetails?.certifications || [], // Certifications
          };
          console.log('Transformed doctor data:', doctorData); // Log the transformed doctor data
          return {
            _id: clinic._id,
            name: `${clinic.firstName} ${clinic.lastName}`,
            category: clinic.professionalDetails?.specialization || 'N/A',
            address: clinic.practiceLocation,
            clinicImages: clinic.clinic_images,
            profileImage: clinic.profileImage,
            insuranceProviders: clinic.insuranceProviders,
            practiceLocation: clinic.practiceLocation,
            practiceName: clinic.practiceName,
            workingHours: clinic.workingHours,
            workingDays: clinic.workingDays,
            doctors: [doctorData], // Add the transformed doctors data
          };
        });
        console.log('Transformed clinic data:', transformedData); // Log the transformed data
        setClinics(transformedData); // Set the transformed data to the state
        setLoading(false); // Set loading to false after data is fetched and transformed
      } catch (error) {
        setError(error.message || 'Failed to load clinics'); // Set error message if the fetch fails
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchClinics();
  }, [insuranceProviders]);

  useEffect(() => {
    if (!loading && clinics.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, clinics]);

  const handlePress = (item: Clinic) => {
    const doctorData = item.doctors.map((doctor) => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialty: doctor.specialty,
      profileImage: doctor.profileImage,
      clinicAddress: doctor.clinicAddress,
      clinicName: doctor.clinicName || 'Unknown Clinic',
      bio: doctor.bio || 'No bio available',
      title: doctor.title || 'N/A',
      profession: doctor.profession || 'N/A',
      consultationFee: doctor.consultationFee || 'N/A',
      clinic: doctor.clinic || { insuranceCompanies: [] },
      insuranceProviders: doctor.insuranceProviders,
      yearsOfExperience: doctor.yearsOfExperience || 'N/A',
      specializedTreatment: doctor.specializedTreatment || 'N/A',
      certifications: doctor.certifications || [],
    }));

    console.log("Navigating to clinic with ID:", item._id);
    router.push({
      pathname: `/hospital/book-appointment/${item._id}`,
      params: { clinic: JSON.stringify(item), doctors: JSON.stringify(doctorData) },
    });
  };

  const ClinicItem: React.FC<{ item: Clinic }> = ({ item }) => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const imageFadeAnim = useRef(new Animated.Value(1)).current;
    const clinicImages = item.clinicImages || [];

    useEffect(() => {
      if (clinicImages.length > 0) {
        setCurrentImage(clinicImages[0]);

        if (clinicImages.length > 1) {
          let imageIndex = 0;
          const interval = setInterval(() => {
            imageIndex = (imageIndex + 1) % clinicImages.length;

            Animated.timing(imageFadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setCurrentImage(clinicImages[imageIndex]);
              Animated.timing(imageFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }).start();
            });
          }, 10000);

          return () => clearInterval(interval);
        }
      }
    }, [clinicImages, imageFadeAnim]);

    return (
      <TouchableOpacity style={styles.clinicItem} onPress={() => handlePress(item)}>
        {currentImage ? (
          <Animated.Image
            source={{ uri: currentImage }}
            style={[styles.clinicImage, { opacity: imageFadeAnim }]}
          />
        ) : (
          <Image
            source={item.profileImage ? { uri: item.profileImage } : 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1734385887/loginp_ovgecg.png'}
            style={styles.clinicImage}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.clinicName} numberOfLines={1}>
            {item.practiceName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredClinics = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.GRAY} />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <Animated.View style={{ marginTop: 10, opacity: fadeAnim }}>
      <SubHeading subHeadingTitle={'Discover Clinics Near You'} onViewAll={onViewAll} />
      {filteredClinics.length === 0 && searchQuery ? (
        <Text>No results found</Text>
      ) : (
        <FlatList
          data={filteredClinics.length > 0 ? filteredClinics : clinics}
          horizontal={true}
          renderItem={({ item }) => <ClinicItem item={item} />}
          keyExtractor={(item) => item._id?.toString() || `temp-${Math.random()}`}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  clinicItem: {
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    width: 200,
  },
  clinicImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 5,
  },
  clinicName: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  clinicAddress: {
    color: Colors.primary,
    fontFamily: 'Poppins_400Regular',
  },
  clinicCategory: {
    color: Colors.primary,
    marginTop: 5,
    fontFamily: 'Poppins_500Medium',
  },
});

export default Clinics;
