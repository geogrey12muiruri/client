import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  appointmentId?: string | null;
}

interface UseScheduleHook {
  schedule: Slot[];
  fetchSchedule: (professionalId: string) => Promise<void>;
  updateSlot: (slotId: string, updates: Partial<Slot>) => void;
  loading: boolean;
  error: string | null;
}

const useSchedule = (doctorId: string): UseScheduleHook => {
  const [schedule, setSchedule] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (doctorId) {
      fetchSchedule(doctorId);
    }
  }, [doctorId]);

  const generateSlots = (startTime: string, endTime: string) => {
    const slots = [];
    const consultationDuration = 60; // 60 minutes
    const waitingTime = 10; // 10 minutes

    let start = moment(startTime, 'h:mm A');
    const end = moment(endTime, 'h:mm A');

    while (start.add(consultationDuration + waitingTime, 'minutes').isBefore(end) || start.isSame(end)) {
      const slotStart = start.clone().subtract(consultationDuration + waitingTime, 'minutes');
      const slotEnd = slotStart.clone().add(consultationDuration, 'minutes');
      slots.push({
        startTime: slotStart.format('h:mm A'),
        endTime: slotEnd.format('h:mm A'),
        isBooked: false,
        _id: `${slotStart.format('HHmm')}-${slotEnd.format('HHmm')}`,
      });
    }

    return slots;
  };

  const fetchSchedule = async (doctorId: string) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/schedule/${doctorId}`);
      console.log('Fetched schedule data:', response.data); // Log the fetched schedule data
      if (response.status === 200 && response.data.availability) {
        const transformedSchedule = Object.entries(response.data.availability).flatMap(([date, shifts]: [string, any[]]) => {
          return shifts.flatMap(shift => generateSlots(shift.startTime, shift.endTime).map(slot => ({
            ...slot,
            date,
            _id: `${date}-${slot._id}`,
          })));
        });
        setSchedule(transformedSchedule);
      }
      setLoading(false);
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.message : 'Failed to load schedule');
      setLoading(false);
    }
  };

  const updateSlot = (slotId: string, updates: Partial<Slot>) => {
    setSchedule(prevSchedule =>
      prevSchedule.map(slot =>
        slot._id === slotId ? { ...slot, ...updates } : slot
      )
    );
  };

  return {
    schedule,
    fetchSchedule,
    updateSlot,
    loading,
    error,
  };
};

export default useSchedule;
