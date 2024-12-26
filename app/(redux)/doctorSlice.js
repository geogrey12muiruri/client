import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch doctors
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async () => {
    const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
    const doctorsWithInsurance = response.data.map((doctor) => ({
      ...doctor,
      clinic: doctor.clinicId,
    }));
    return doctorsWithInsurance;
  }
);

// Initial state
const initialState = {
  doctorList: [],
  selectedDoctor: null,
  loading: false,
  error: null,
};

// Doctor slice
const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setSelectedDoctor(state, action) {
      state.selectedDoctor = state.doctorList.find((doctor) => doctor._id === action.payload) || null;
    },
    clearSelectedDoctor(state) {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctorList = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load doctors';
      });
  },
});

// Action exports
export const { setSelectedDoctor, clearSelectedDoctor } = doctorsSlice.actions;

// Selector to select all doctors
export const selectDoctors = (state) => state.doctors.doctorList;

// Selector to select the current selected doctor
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;

export default doctorsSlice.reducer;
