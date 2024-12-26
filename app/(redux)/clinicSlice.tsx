import { createSlice, PayloadAction, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  user: string;
  profession: string;
  title: string;
  consultationFee: number;
  certifications: string[];
  createdAt: string;
  updatedAt: string;
  attachedToClinic: boolean;
  attachedToPharmacy: boolean;
  clinic_images?: string[];
}

interface Clinic {
  _id: string;
  name: string;
  address: string;
  category: string;
  clinicImages?: string[]; // Use clinicImages instead of images
  contactInfo: string;
  referenceCode: string;
  professionals: Professional[];
  insuranceCompanies: string[];
  specialties: string;
  experiences: string[];
  languages: string;
  assistantName: string;
  assistantPhone: string;
  bio: string;
  education: {
    course: string;
    university: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ClinicsState {
  clinicList: Clinic[];
  filteredClinicList: Clinic[];
  selectedClinic: Clinic | null;
  clinicImages: { [key: string]: string[] };
  loading: boolean;
  error: string | null;
}

const initialState: ClinicsState = {
  clinicList: [],
  filteredClinicList: [],
  selectedClinic: null,
  clinicImages: {},
  loading: false,
  error: null,
};

const fetchFreshClinics = async () => {
  try {
    const response = await axios.get('https://medplus-health.onrender.com/api/clinics');
    const clinics = response.data.map((clinic: Clinic) => ({
      ...clinic,
      clinicImages: clinic.clinicImages?.map(image => image.urls[0]) || [],
    }));
    await AsyncStorage.setItem('clinicList', JSON.stringify(clinics));
    return clinics;
  } catch (error) {
    console.error('Failed to fetch fresh clinics', error);
    return [];
  }
};

export const fetchClinics = createAsyncThunk(
  'clinics/fetchClinics',
  async (_, { dispatch }) => {
    const cachedClinics = await AsyncStorage.getItem('clinicList');
    if (cachedClinics) {
      const parsedClinics = JSON.parse(cachedClinics);
      // Fetch fresh data and update AsyncStorage and Redux store
      const freshClinics = await fetchFreshClinics();
      dispatch(setClinics(freshClinics));
      return freshClinics;
    }
    const clinics = await fetchFreshClinics();
    return clinics;
  }
);

export const fetchClinicById = createAsyncThunk(
  'clinics/fetchClinicById',
  async (clinicId: string, { dispatch }) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/clinics/${clinicId}`);
      const clinic = response.data;

      // Ensure clinicImages is populated
      clinic.clinicImages = clinic.clinicImages?.map(image => image.urls[0]) || [];

      // Convert dob to string if it exists
      if (clinic.dob) {
        clinic.dob = new Date(clinic.dob).toISOString();
      }

      // Update the Redux state with the fetched clinic data
      dispatch(setSelectedClinic(clinic));
      return clinic;
    } catch (error) {
      console.error('Failed to fetch clinic by ID', error);
      return null;
    }
  }
);

const clinicsSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setClinics: (state, action: PayloadAction<Clinic[]>) => {
      state.clinicList = action.payload;
      state.filteredClinicList = action.payload;
    },
    setSelectedClinic: (state, action: PayloadAction<Clinic>) => {
      state.selectedClinic = action.payload;
    },
    setClinicImages: (state, action: PayloadAction<{ clinicId: string; images: string[] }>) => {
      state.clinicImages[action.payload.clinicId] = action.payload.images;
    },
    filterClinics: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.filteredClinicList = state.clinicList.filter((clinic) =>
        clinic.name.toLowerCase().includes(query)
      );
    },
    resetClinics: (state) => {
      state.clinicList = [];
      state.filteredClinicList = [];
      state.selectedClinic = null;
      state.clinicImages = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClinics.fulfilled, (state, action: PayloadAction<Clinic[]>) => {
        state.clinicList = action.payload;
        state.filteredClinicList = action.payload;
        state.loading = false;
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clinics';
      })
      .addCase(fetchClinicById.fulfilled, (state, action: PayloadAction<Clinic | null>) => {
        state.selectedClinic = action.payload;
        state.loading = false;
      });
  },
});

export const { setClinics, setSelectedClinic, setClinicImages, filterClinics, resetClinics, setLoading, setError } = clinicsSlice.actions;

// Update selectors to use the correct state structure
export const selectClinics = (state: any) => state.clinics.filteredClinicList;
export const selectClinicImages = (state: any, clinicId: string) => state.clinics.clinicImages[clinicId] || [];
export const selectSelectedClinic = (state: any) => state.clinics.selectedClinic;
export const selectClinicDetails = (state: any) => state.clinics.selectedClinic;
export const selectClinicLoading = (state: any) => state.clinics.loading;
export const selectClinicError = (state: any) => state.clinics.error;

export default clinicsSlice.reducer;
