
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}


// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Fonction pour obtenir les médicaments à prendre
export async function getMedicationDoses(date: Date) {
  const { data, error } = await supabase
    .from('medication_doses' as any)
    .select(`
      *,
      medications (
        id,
        name,
        dosage,
        time_of_day,
        description
      )
    `)
    .eq('scheduled_date', date.toISOString().split('T')[0]);

  if (error) {
    throw error;
  }

  return data;
}

// Fonction pour créer des doses de médicaments pour une date donnée
export async function createMedicationDosesForDate(date: Date) {
  // 1. Obtenir les médicaments de l'utilisateur
  const { data: medications, error: medError } = await supabase
    .from('medications')
    .select('*');

  if (medError) {
    throw medError;
  }

  if (!medications || medications.length === 0) {
    return [];
  }

  // 2. Vérifier quels médicaments doivent être pris ce jour-là (jour de la semaine)
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  
  const medicationsForDay = medications.filter(med => 
    med.days_of_week.includes(dayOfWeek)
  );

  if (medicationsForDay.length === 0) {
    return [];
  }

  // 3. Vérifier si des doses existent déjà pour cette date
  const { data: existingDoses, error: doseError } = await supabase
    .from('medication_doses' as any)
    .select('medication_id, time_of_day')
    .eq('scheduled_date', date.toISOString().split('T')[0]);

  if (doseError) {
    throw doseError;
  }

  // 4. Créer les doses manquantes
  const dosesToCreate = [];
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non authentifié");
  }

  for (const med of medicationsForDay) {
    for (const timeOfDay of med.time_of_day) {
      // Vérifier si cette dose existe déjà
      const doseExists = existingDoses?.some(
        (dose: any) => dose.medication_id === med.id && dose.time_of_day === timeOfDay
      );

      if (!doseExists) {
        dosesToCreate.push({
          medication_id: med.id,
          user_id: user.id,
          scheduled_date: date.toISOString().split('T')[0],
          time_of_day: timeOfDay,
          is_taken: false
        });
      }
    }
  }

  // 5. Insérer les doses si nécessaire
  if (dosesToCreate.length > 0) {
    const { data: newDoses, error: insertError } = await supabase
      .from('medication_doses' as any)
      .insert(dosesToCreate)
      .select(`
        *,
        medications (
          id,
          name,
          dosage,
          time_of_day,
          description
        )
      `);

    if (insertError) {
      throw insertError;
    }

    return newDoses;
  }

  // 6. Renvoyer toutes les doses pour cette date
  return getMedicationDoses(date);
}

// Marquer une dose comme prise
export async function markDoseAsTaken(doseId: string, isTaken: boolean) {
  const updateData: any = {
    is_taken: isTaken,
    updated_at: new Date().toISOString()
  };

  // Ajouter l'horodatage uniquement si la dose est marquée comme prise
  if (isTaken) {
    updateData.taken_at = new Date().toISOString();
  } else {
    updateData.taken_at = null;
  }

  const { data, error } = await supabase
    .from('medication_doses' as any)
    .update(updateData)
    .eq('id', doseId)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// Fonction pour marquer plusieurs doses comme prises en une seule fois
export async function markMultipleDosesAsTaken(doseIds: string[], isTaken: boolean) {
  if (doseIds.length === 0) return [];

  const updateData: any = {
    is_taken: isTaken,
    updated_at: new Date().toISOString()
  };

  // Ajouter l'horodatage uniquement si les doses sont marquées comme prises
  if (isTaken) {
    updateData.taken_at = new Date().toISOString();
  } else {
    updateData.taken_at = null;
  }

  const { data, error } = await supabase
    .from('medication_doses' as any)
    .update(updateData)
    .in('id', doseIds)
    .select();

  if (error) {
    throw error;
  }

  return data;
}
