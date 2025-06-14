
import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/types";
import { transformMedicationFromDatabase, transformMedicationToDatabase, transformMedicationUpdateToDatabase } from "./medication-transformer";
import { MEDICATION_SELECT_QUERY } from "./medication-queries";

export const medicationWriteService = {
  create: async (medication: Omit<Medication, "id" | "createdAt" | "updatedAt">): Promise<Medication> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const dbData = transformMedicationToDatabase(medication);
    console.log("Creating medication with data:", dbData);

    const { data, error } = await supabase
      .from('medications')
      .insert({
        ...dbData,
        user_id: user.id,
      })
      .select(MEDICATION_SELECT_QUERY)
      .single();

    if (error) {
      console.error("Error creating medication:", error);
      throw error;
    }

    console.log("Medication created successfully:", data);
    return transformMedicationFromDatabase(data);
  },

  update: async (id: string, medication: Partial<Medication>): Promise<Medication> => {
    console.log("Updating medication with ID:", id, "and data:", medication);
    
    const updateData = transformMedicationUpdateToDatabase(medication);
    console.log("Transformed update data:", updateData);

    const { data, error } = await supabase
      .from('medications')
      .update(updateData)
      .eq('id', id)
      .select(MEDICATION_SELECT_QUERY)
      .single();

    if (error) {
      console.error("Error updating medication:", error);
      throw error;
    }

    console.log("Medication updated successfully with doctor data:", data);
    return transformMedicationFromDatabase(data);
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};
