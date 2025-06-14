
import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/types";
import { transformMedicationFromDatabase } from "./medication-transformer";
import { MEDICATION_SELECT_QUERY } from "./medication-queries";

export const medicationReadService = {
  getAll: async (): Promise<Medication[]> => {
    const { data, error } = await supabase
      .from('medications')
      .select(MEDICATION_SELECT_QUERY)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(transformMedicationFromDatabase);
  },

  getById: async (id: string): Promise<Medication | undefined> => {
    const { data, error } = await supabase
      .from('medications')
      .select(MEDICATION_SELECT_QUERY)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }

    return transformMedicationFromDatabase(data);
  },
};
