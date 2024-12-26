import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setClinics, selectClinics, setLoading, setError, setClinicImages } from '../app/(redux)/clinicSlice';

interface Clinic {
  _id: string;
  name: string;
  address: string;
  images: string[];
}

interface ClinicImageResponse {
  urls: string[];
}

const fetchFreshClinics = async (): Promise<Clinic[]> => {
  try {
    const response = await axios.get('https://medplus-health.onrender.com/api/clinics');
    return response.data.map((clinic: Clinic) => ({
      ...clinic,
      images: clinic.images || [],
    }));
  } catch (error) {
    console.error('Failed to fetch fresh clinics', error);
    throw error;
  }
};

const fetchClinicImages = async (clinicId: string): Promise<string[]> => {
  try {
    const response = await axios.get(`https://medplus-health.onrender.com/api/images/clinic/${clinicId}`);
    if (response.data && Array.isArray(response.data)) {
      return response.data.flatMap((image: ClinicImageResponse) => image.urls);
    } else {
      console.error('Invalid response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

const useFetchClinics = () => {
  const dispatch = useDispatch();
  const clinics = useSelector(selectClinics);
  const clinicImages = useSelector((state: any) => state.clinics.clinicImages);

  useEffect(() => {
    const fetchClinics = async () => {
      dispatch(setLoading(true));
      try {
        const cachedClinics = await AsyncStorage.getItem('clinicList');
        if (cachedClinics) {
          dispatch(setClinics(JSON.parse(cachedClinics)));
        } else {
          const freshClinics = await fetchFreshClinics();
          dispatch(setClinics(freshClinics));
          await AsyncStorage.setItem('clinicList', JSON.stringify(freshClinics));
        }
      } catch (error) {
        console.error('Failed to fetch clinics:', error);
        dispatch(setError('Failed to load clinics'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (clinics.length === 0) {
      fetchClinics();
    }
  }, [clinics.length, dispatch]);

  const getClinicImages = useCallback(
    async (clinicId: string): Promise<string[]> => {
      if (clinicImages[clinicId]) {
        return clinicImages[clinicId];
      }
      const images = await fetchClinicImages(clinicId);
      dispatch(setClinicImages({ clinicId, images }));
      return images;
    },
    [clinicImages, dispatch]
  );

  return { clinics, getClinicImages };
};

export default useFetchClinics;
