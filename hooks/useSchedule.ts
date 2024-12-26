import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/(redux)/authSlice';

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
  createOrUpdateSchedule: (professionalId: string, availability: Slot[]) => Promise<void>;
  createRecurringSlots: (professionalId: string, slot: Slot, recurrence: string) => Promise<void>;
  subscribeToScheduleUpdates: (professionalId: string) => void;
  updateSlot: (slotId: string, updates: Partial<Slot>) => Promise<void>;
  fetchScheduleForDate: (professionalId: string, date: string) => Promise<Slot[]>;
}

const useSchedule = (): UseScheduleHook => {
  const [schedule, setSchedule] = useState<Slot[]>([]);
  const user = useSelector(selectUser);
  const professionalId = user.professional?._id;

  useEffect(() => {
    if (professionalId) {
      fetchSchedule(professionalId);
    }
  }, [professionalId]);

  const fetchSchedule = async (professionalId: string) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/schedule/${professionalId}`);
      if (response.status === 200 && response.data.slots) {
        setSchedule(response.data.slots);
      }
    } catch (error) {
      console.error('Error fetching schedule:', axios.isAxiosError(error) ? error.message : error);
    }
  };

  const createOrUpdateSchedule = async (professionalId: string, availability: Slot[]) => {
    try {
      const response = await axios.put(`https://medplus-health.onrender.com/api/schedule`, {
        professionalId,
        availability,
      });
      if (response.status === 200) {
        fetchSchedule(professionalId);
      }
    } catch (error) {
      console.error('Error creating or updating schedule:', axios.isAxiosError(error) ? error.message : error);
    }
  };

  const createRecurringSlots = async (professionalId: string, slots: Slot[], recurrence: string) => {
    try {
      const response = await axios.post(`https://medplus-health.onrender.com/api/schedule/createRecurringSlots`, {
        professionalId,
        slots,
        recurrence,
      });
      if (response.status === 200) {
        fetchSchedule(professionalId);
      }
    } catch (error) {
      console.error('Error creating recurring slots:', axios.isAxiosError(error) ? error.message : error);
    }
  };

  const subscribeToScheduleUpdates = (professionalId: string) => {
    const socket = new WebSocket(`wss://medplus-health.onrender.com/schedule/${professionalId}`);
    socket.onmessage = (event) => {
      const updatedSchedule = JSON.parse(event.data);
      setSchedule(updatedSchedule);
    };
  };

  const updateSlot = async (slotId: string, updates: Partial<Slot>) => {
    try {
      const updatedSchedule = schedule.map(slot =>
        slot._id === slotId ? { ...slot, ...updates } : slot
      );
      setSchedule(updatedSchedule);
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  };

  const fetchScheduleForDate = async (professionalId: string, date: string) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/schedule/${professionalId}/${date}`);
      if (response.status === 200 && response.data.slots) {
        return response.data.slots;
      }
      return [];
    } catch (error) {
      console.error('Error fetching schedule for date:', axios.isAxiosError(error) ? error.message : error);
      return [];
    }
  };

  return {
    schedule,
    fetchSchedule,
    createOrUpdateSchedule,
    createRecurringSlots,
    subscribeToScheduleUpdates,
    updateSlot,
    fetchScheduleForDate,
  };
};

export default useSchedule;
