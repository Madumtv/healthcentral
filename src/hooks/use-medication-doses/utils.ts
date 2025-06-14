
// Fonction pour normaliser les valeurs de time_of_day
export const normalizeTimeOfDay = (timeOfDay: string): string => {
  const frenchToEnglish = {
    'matin': 'morning',
    'midi': 'noon', 
    'soir': 'evening',
    'nuit': 'night'
  };
  
  return frenchToEnglish[timeOfDay as keyof typeof frenchToEnglish] || timeOfDay;
};
