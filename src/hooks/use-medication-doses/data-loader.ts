
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
      // Filter out any invalid entries and ensure proper typing
      const validDoses = doses.filter((dose: any) => {
        return dose && typeof dose === 'object' && !('error' in dose) && isValidMedicationDose(dose);
      });
      
      const normalizedDoses: MedicationDose[] = validDoses.map((dose: any) => {
        // Ensure dose has time_of_day property and normalize it
        if (dose.time_of_day && typeof dose.time_of_day === 'string') {
          return {
            ...dose,
            time_of_day: normalizeTimeOfDay(dose.time_of_day)
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
