
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
      const validDoses = doses.filter((dose): dose is MedicationDose => {
        return dose !== null && typeof dose === 'object' && isValidMedicationDose(dose);
      });
      
      const normalizedDoses: MedicationDose[] = validDoses.map(dose => {
        // Ensure dose has time_of_day property
        if ('time_of_day' in dose && typeof dose.time_of_day === 'string') {
          return {
            ...dose,
            time_of_day: normalizeTimeOfDay(dose.time_of_day)
          };
        }
        return dose;
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
