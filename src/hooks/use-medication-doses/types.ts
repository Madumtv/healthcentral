
// Types pour les doses de médicaments
export interface MedicationDose {
  id: string;
  time_of_day: string;
  is_taken: boolean;
  taken_at?: string | null;
  medication_id: string;
  user_id: string;
  scheduled_date: string;
  created_at: string;
  updated_at: string;
  medications?: {
    id: string;
    name: string;
    dosage: string;
    description?: string;
  };
}

// Type guard pour vérifier si un objet est une dose valide
export const isValidMedicationDose = (item: any): item is MedicationDose => {
  return item && 
    typeof item === 'object' && 
    typeof item.id === 'string' &&
    typeof item.time_of_day === 'string' &&
    typeof item.is_taken === 'boolean' &&
    !('error' in item);
};
