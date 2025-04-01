
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeOfDay = 'morning' | 'noon' | 'evening' | 'night' | 'custom';

export interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage: string;
  timeOfDay: TimeOfDay[];
  daysOfWeek: DayOfWeek[];
  notes?: string;
  prescribingDoctor?: string;
  infoLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  defaultMedications?: string[]; // IDs des médicaments par défaut à afficher
}
