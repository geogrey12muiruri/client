import { useEffect } from 'react';
import axios from 'axios';

const useFetchProfileImage = (userId: string, setProfileImage: (url: string) => void) => {
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`https://medplus-health.onrender.com/clinic-images/user/${userId}`);
        if (response.data.length > 0) {
          setProfileImage(response.data[0].url);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (userId) {
      fetchProfileImage(); 
    }
  }, [userId]);
};

export default useFetchProfileImage;
