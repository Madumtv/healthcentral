
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "./types";

export const searchLocalDoctors = async (): Promise<Doctor[]> => {
  console.log('Recherche dans la base locale...');
  
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('is_active', true)
    .order('last_name', { ascending: true });

  if (error) {
    console.error('Erreur recherche locale:', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.log('Aucun médecin trouvé dans la base locale');
    return [];
  }

  const localDoctors = data.map(doctor => ({
    id: doctor.id,
    inami_number: doctor.inami_number,
    first_name: doctor.first_name,
    last_name: doctor.last_name,
    specialty: doctor.specialty,
    address: doctor.address,
    city: doctor.city,
    postal_code: doctor.postal_code,
    phone: doctor.phone,
    email: doctor.email,
    source: 'Base locale',
    is_active: doctor.is_active,
    created_at: new Date(doctor.created_at),
    updated_at: new Date(doctor.updated_at),
  }));

  console.log(`Trouvé ${localDoctors.length} médecins dans la base locale`);
  return localDoctors;
};

export const filterLocalDoctors = (doctors: Doctor[], query: string): Doctor[] => {
  if (!query || query.trim().length === 0) {
    return doctors;
  }

  const queryLower = query.toLowerCase();
  return doctors.filter(doctor => 
    doctor.first_name.toLowerCase().includes(queryLower) ||
    doctor.last_name.toLowerCase().includes(queryLower) ||
    doctor.specialty?.toLowerCase().includes(queryLower) ||
    doctor.city?.toLowerCase().includes(queryLower) ||
    doctor.inami_number?.toLowerCase().includes(queryLower)
  );
};
