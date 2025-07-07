
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeOfDay = 'morning' | 'noon' | 'evening' | 'night' | 'custom' | 'repas' | 'avant_repas' | 'apres_repas' | string;

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
  email?: string;
  city?: string;
  inamiNumber?: string;
}

export interface Medication {
  id: string;
  name: string;
  description?: string;
  dosage: string;
  timeOfDay: TimeOfDay[];
  daysOfWeek: DayOfWeek[];
  notes?: string;
  prescribingDoctor?: string;
  doctorId?: string;
  doctor?: Doctor;
  infoLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationFormData {
  name: string;
  description?: string;
  dosage: string;
  timeOfDay: TimeOfDay[];
  daysOfWeek: DayOfWeek[];
  notes?: string;
  prescribingDoctor?: string;
  doctorId?: string;
  infoLink?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  defaultMedications?: string[]; // IDs des médicaments par défaut à afficher
}
