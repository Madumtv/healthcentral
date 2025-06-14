
import { supabase } from "@/integrations/supabase/client";
import { ordomedicService } from "./ordomedic-service";

export interface Doctor {
  id: string;
  inami_number?: string;
  first_name: string;
  last_name: string;
  specialty?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const supabaseDoctorsService = {
  // Search doctors by name or specialty (hybride: local + ordomedic)
  search: async (query: string): Promise<Doctor[]> => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const results: Doctor[] = [];

    try {
      // 1. Recherche locale dans Supabase
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialty.ilike.%${query}%`)
        .eq('is_active', true)
        .order('last_name', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Erreur recherche locale:', error);
      } else if (data && data.length > 0) {
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
          is_active: doctor.is_active,
          created_at: new Date(doctor.created_at),
          updated_at: new Date(doctor.updated_at),
        }));
        results.push(...localDoctors);
      }

      // 2. Recherche sur ordomedic.be (toujours effectuer cette recherche pour avoir plus de résultats)
      console.log(`Recherche ordomedic pour: "${query}"`);
      const ordomedicDoctors = await ordomedicService.searchDoctors(query);
      console.log(`Trouvé ${ordomedicDoctors.length} médecins sur ordomedic`);
      
      if (ordomedicDoctors.length > 0) {
        results.push(...ordomedicDoctors);
      }

      // 3. Éliminer les doublons et limiter les résultats
      const uniqueDoctors = results.filter((doctor, index, self) => 
        index === self.findIndex(d => 
          d.first_name.toLowerCase() === doctor.first_name.toLowerCase() && 
          d.last_name.toLowerCase() === doctor.last_name.toLowerCase() && 
          (d.inami_number === doctor.inami_number || 
           (!d.inami_number && !doctor.inami_number))
        )
      );

      console.log(`Résultats finaux: ${uniqueDoctors.length} médecins trouvés`);
      return uniqueDoctors.slice(0, 20);
    } catch (error) {
      console.error('Erreur lors de la recherche hybride:', error);
      // En cas d'erreur, essayer au moins la recherche ordomedic
      try {
        const ordomedicDoctors = await ordomedicService.searchDoctors(query);
        return ordomedicDoctors.slice(0, 20);
      } catch (ordomedicError) {
        console.error('Erreur ordomedic de secours:', ordomedicError);
        return results;
      }
    }
  },

  // Get doctor by ID
  getById: async (id: string): Promise<Doctor | null> => {
    // Si l'ID commence par 'ordo_', c'est un médecin d'ordomedic
    if (id.startsWith('ordo_')) {
      // Rechercher dans ordomedic (pour l'instant via les données simulées)
      const ordomedicDoctors = await ordomedicService.searchDoctors('');
      return ordomedicDoctors.find(d => d.id === id) || null;
    }

    // Sinon, rechercher dans Supabase
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      inami_number: data.inami_number,
      first_name: data.first_name,
      last_name: data.last_name,
      specialty: data.specialty,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      phone: data.phone,
      email: data.email,
      is_active: data.is_active,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  },

  // Create a new doctor entry
  create: async (doctor: Omit<Doctor, "id" | "created_at" | "updated_at">): Promise<Doctor> => {
    const { data, error } = await supabase
      .from('doctors')
      .insert({
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
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      inami_number: data.inami_number,
      first_name: data.first_name,
      last_name: data.last_name,
      specialty: data.specialty,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      phone: data.phone,
      email: data.email,
      is_active: data.is_active,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }
};
