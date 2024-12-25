import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clinicsReducer from './clinicSlice';
import doctorsReducer from './doctorSlice';
import appointmentReducer from './appointmentSlice';
import prescriptionReducer from './prescriptionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    clinics: clinicsReducer,
    doctors: doctorsReducer,
    appointments: appointmentReducer,
    prescriptions: prescriptionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // Export AppDispatch
export default store;