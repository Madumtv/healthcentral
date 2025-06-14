
import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/lib/supabase-doctors-service";

/**
 * Recherche des médecins dans la base de données locale
 */
export const searchLocalDoctors = async (query: string): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialty.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la recherche locale de médecins:', error);
    return [];
  }

  return (data || []).map(doctor => ({
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
    is_active: doctor.is_active,
    created_at: new Date(doctor.created_at),
    updated_at: new Date(doctor.updated_at),
  }));
};
