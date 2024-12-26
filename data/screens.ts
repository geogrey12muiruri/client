export type Data = {
    id: number;
    image: any;
    title: string;
    text: string;
  };
  
  export const data: Data[] = [
    {
      id: 1,
      image: require('../assets/images/onboarding/1.png'),
      title: 'Supat Health',
      text: 'Embark on a journey to wellness with access to top-tier health professionals at your fingertips.',
    },
    {
      id: 2,
      image: require('../assets/images/onboarding/2.png'),
      title: 'Easy Schedule',
      text: 'Access flexible appointment scheduling to effortlessly set up consultations with qualified professionals.',
    },
    {
      id: 3,
      image: require('../assets/images/onboarding/3.png'),
      title: 'Your Health Journey',
      text: 'Keep your health records close and your care personalized as you navigate your path to better health with MedPlus.',
    },
  ];