
import { createMedicationDosesForDate } from "@/integrations/supabase/client";
import { MedicationDose, isValidMedicationDose } from "./types";
import { normalizeTimeOfDay } from "./utils";

export const loadMedicationDoses = async (
  selectedDate: Date,
  toast: any
): Promise<MedicationDose[]> => {
  try {
    const doses = await createMedicationDosesForDate(selectedDate);
    
    // Ensure doses is an array and contains valid data
    if (Array.isArray(doses) && doses.length > 0) {
      const validDoses = doses.filter(isValidMedicationDose);
      
      const normalizedDoses: MedicationDose[] = validDoses.map(dose => {
        // Ensure dose is an object before spreading
        if (typeof dose === 'object' && dose !== null && 'time_of_day' in dose) {
          return {
            ...dose,
            time_of_day: normalizeTimeOfDay(dose.time_of_day as string)
          } as MedicationDose;
        }
        return dose as MedicationDose;
      });
      
      return normalizedDoses;
    } else {
      console.error("Expected array but got:", doses);
      return [];
    }
  } catch (error) {
    console.error("Erreur lors du chargement des doses:", error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les médicaments pour cette date.",
      variant: "destructive",
    });
    return [];
  }
};
