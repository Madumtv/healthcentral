
import { createMedicationDosesForDate } from "@/integrations/supabase/client";
import { MedicationDose, isValidMedicationDose } from "./types";
import { normalizeTimeOfDay } from "./utils";

export const loadMedicationDoses = async (
  selectedDate: Date,
  toast: any
): Promise<MedicationDose[]> => {
  try {
    const doses = await createMedicationDosesForDate(selectedDate);
    
    // Vérifier si doses est un array et contient des données valides
    if (Array.isArray(doses)) {
      const validDoses = doses.filter(isValidMedicationDose);
      
      const normalizedDoses: MedicationDose[] = validDoses.map(dose => ({
        ...dose,
        time_of_day: normalizeTimeOfDay(dose.time_of_day)
      }));
      
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
