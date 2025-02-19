import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from '../app/(redux)/doctorSlice';

const useDoctors = () => {
  const dispatch = useDispatch();
  const rawDoctorList = useSelector((state) => state.doctors?.doctorList || []);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    console.log('Raw Doctor List:', rawDoctorList);
  }, [rawDoctorList]);

  const doctorList = rawDoctorList.map(doctor => {
    const doctorData = {
      id: doctor._id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.specialty || 'General',
      experience: doctor.clinicId?.experiences || [],
      profileImage: doctor.profileImage,
      clinicAddress: doctor.clinicId?.address,
      insuranceCompanies: doctor.clinicId?.insuranceCompanies || [],
      userId: doctor.user?._id || doctor._id, // Ensure userId is correctly mapped
    };
    console.log('Doctor Data:', doctorData);
    return doctorData;
  });

  const loading = useSelector((state) => state.doctors?.loading);
  const error = useSelector((state) => state.doctors?.error);

  return { doctorList, loading, error };
};

export default useDoctors;
