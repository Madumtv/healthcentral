
import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/types";
import { transformMedicationFromDatabase } from "./medication-transformer";
import { MEDICATION_SELECT_QUERY_WITH_OPTIONAL_DOCTOR } from "./medication-queries";

export const medicationReadService = {
  getAll: async (): Promise<Medication[]> => {
    console.log("Reading all medications with doctor data...");
    
    const { data, error } = await supabase
      .from('medications')
      .select(MEDICATION_SELECT_QUERY_WITH_OPTIONAL_DOCTOR)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching medications:", error);
      throw error;
    }

    console.log("Raw medication data from database:", data);
    return (data || []).map(transformMedicationFromDatabase);
  },

  getById: async (id: string): Promise<Medication | undefined> => {
    console.log("Reading medication by ID with doctor data:", id);
    
    const { data, error } = await supabase
      .from('medications')
      .select(MEDICATION_SELECT_QUERY_WITH_OPTIONAL_DOCTOR)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      console.error("Error fetching medication by ID:", error);
      throw error;
    }

    console.log("Raw medication data by ID:", data);
    return transformMedicationFromDatabase(data);
  },
};
