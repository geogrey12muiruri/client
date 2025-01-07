import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Text,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import Colors from '../../components/Shared/Colors';
import useInsurance from '../../hooks/useInsurance';


const ClinicSearch = () => {
  const router = useRouter();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { insuranceProviders } = useInsurance(); // Use the insurance hook

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
            userId: clinic.user._id, // Extract userId from the user attribute
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
            name: clinic.practiceName, // Use practiceName for clinic name
            category: clinic.professionalDetails?.specialization || 'N/A',
            address: clinic.practiceLocation, // Use practiceLocation for clinic address
            clinicImages: clinic.clinic_images,
            profileImage: clinic.profileImage,
            insuranceProviders: insuranceNames, // Use mapped insurance names
            practiceLocation: clinic.practiceLocation,
            practiceName: clinic.practiceName,
            workingHours: clinic.workingHours,
            workingDays: clinic.workingDays,
            doctors: [doctorData], // Add the transformed doctors data
          };
        });
        console.log('Transformed clinic data:', transformedData); // Log the transformed data
        setClinics(transformedData); // Set the transformed data to the state
        setFilteredClinics(transformedData);
        setFilteredProfessionals(transformedData.flatMap(clinic => clinic.doctors));
        setLoading(false); // Set loading to false after data is fetched and transformed
      } catch (error) {
        setError(error.message || 'Failed to load clinics'); // Set error message if the fetch fails
        setLoading(false); // Set loading to false if there is an error
      }
    };

    fetchClinics();
  }, [insuranceProviders]);

  const resetFilters = () => {
    setSelectedLocation('');
    setSelectedSpecialty('');
    setSelectedInsurance('');
    setFilteredClinics(clinics);
    setFilteredProfessionals(clinics.flatMap(clinic => clinic.doctors));
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    const locationFilteredClinics = clinics.filter((clinic) =>
      clinic.address?.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredClinics(locationFilteredClinics);
    setFilteredProfessionals(locationFilteredClinics.flatMap(clinic => clinic.doctors));
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);
    const specialtyFilteredProfessionals = filteredProfessionals.filter(
      (professional) =>
        professional.specialty?.toLowerCase().includes(specialty.toLowerCase())
    );
    setFilteredProfessionals(specialtyFilteredProfessionals);
  };

  const handlePress = (item) => {
    console.log("Navigating to clinic with ID:", item._id);
    router.push({
      pathname: `/hospital/book-appointment/${item._id}`,
      params: { clinic: JSON.stringify(item), doctors: JSON.stringify(item.doctors) },
    });
  };

  const handleDoctorPress = (doctor) => {
    console.log("Navigating to doctor with ID:", doctor.id);
    router.push({
      pathname: `/doctors/${doctor.userId}`, // Pass userId as doctorId
      params: { doctor: JSON.stringify(doctor) },
    });
  };

  const handleInsuranceChange = (insurance) => {
    setSelectedInsurance(insurance);
    const insuranceFilteredClinics = filteredClinics.filter((clinic) =>
      clinic.insuranceProviders?.some((provider) =>
        provider?.toLowerCase().includes(insurance.toLowerCase())
      )
    );
    setFilteredProfessionals(insuranceFilteredClinics.flatMap(clinic => clinic.doctors));
  };

  const handleCombinedFilters = () => {
    const filtered = clinics.filter(
      (clinic) =>
        clinic.address?.toLowerCase().includes(selectedLocation.toLowerCase()) &&
        clinic.insuranceProviders.some((ins) =>
          ins.toLowerCase().includes(selectedInsurance.toLowerCase())
        ) &&
        clinic.doctors.some((prof) =>
          prof.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        )
    );
    setFilteredClinics(filtered);
    setFilteredProfessionals(filtered.flatMap(clinic => clinic.doctors));
  };

  const handleSearchChange = (text) => {
    const searchQuery = text.toLowerCase();
    const searchedClinics = clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(searchQuery) ||
      clinic.address.toLowerCase().includes(searchQuery) ||
      clinic.doctors.some((prof) =>
        prof.firstName.toLowerCase().includes(searchQuery) ||
        prof.lastName.toLowerCase().includes(searchQuery)
      )
    );
    setFilteredClinics(searchedClinics);
    setFilteredProfessionals(searchedClinics.flatMap(clinic => clinic.doctors));
  };

  const ClinicItem = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(null);
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
      <TouchableOpacity style={styles.cardContainer} onPress={() => handlePress(item)}>
        {currentImage ? (
          <Animated.Image
            source={{ uri: currentImage }}
            style={[styles.cardImage, { opacity: imageFadeAnim }]}
          />
        ) : (
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.cardImage}
          />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text>{item.address}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const uniqueLocations = [...new Set(clinics.map((clinic) => clinic.address?.split(',')[0] || ''))];
  const uniqueSpecialties = [
    ...new Set(
      clinics.flatMap((clinic) => clinic.doctors?.map((professional) => professional.specialty) || [])
    ),
  ];
  const uniqueInsurances = [
    ...new Set(clinics.flatMap((clinic) => clinic.insuranceProviders || [])),
  ];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (filteredClinics.length === 0 && filteredProfessionals.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text>No results found.</Text>
        <TouchableOpacity onPress={resetFilters} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={resetFilters} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#ccc" />
          <TextInput
            placeholder="Search clinics or professionals"
            style={styles.searchInput}
            onChangeText={handleSearchChange}
          />
        </View>
        <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Picker
          selectedValue={selectedLocation}
          onValueChange={(value) => {
            setSelectedLocation(value);
            handleCombinedFilters();
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Location" value="" />
          {uniqueLocations.map((location, index) => (
            <Picker.Item key={index} label={location} value={location} />
          ))}
        </Picker>
        {selectedLocation && (
          <Picker
            selectedValue={selectedSpecialty}
            onValueChange={(value) => {
              setSelectedSpecialty(value);
              handleCombinedFilters();
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Specialty" value="" />
            {uniqueSpecialties.map((specialty, index) => (
              <Picker.Item key={index} label={specialty} value={specialty} />
            ))}
          </Picker>
        )}
        {selectedSpecialty && (
          <Picker
            selectedValue={selectedInsurance}
            onValueChange={(value) => {
              setSelectedInsurance(value);
              handleCombinedFilters();
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Insurance" value="" />
            {uniqueInsurances.map((insurance, index) => (
              <Picker.Item key={index} label={insurance} value={insurance} />
            ))}
          </Picker>
        )}
        <View>
          <Text style={styles.sectionTitle}>Professionals</Text>
          <FlatList
            data={filteredProfessionals}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleDoctorPress(item)}
                style={styles.cardContainer}
              >
                <Image
                  source={{ uri: item.profileImage || 'https://via.placeholder.com/100' }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.firstName} {item.lastName}</Text>
                  <Text>{item.specialty}</Text>
                  <Text>{item.clinicName}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
          <Text style={styles.sectionTitle}>Clinics</Text>
          <FlatList
            data={filteredClinics}
            renderItem={({ item }) => <ClinicItem item={item} />}
            keyExtractor={(item) => item._id}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dfe4ea',
    borderRadius: 6,
    paddingHorizontal: 10,
    flex: 1,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  resetButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    marginLeft: 8,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
  },
  picker: {
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 40,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fafafa',
    margin: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 18,
    color: 'red',
  },
  refreshButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 10,
  },
});

export default ClinicSearch;
