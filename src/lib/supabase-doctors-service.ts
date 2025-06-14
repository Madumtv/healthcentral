
import { supabase } from "@/integrations/supabase/client";

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
  // Search doctors by name or specialty
  search: async (query: string): Promise<Doctor[]> => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialty.ilike.%${query}%`)
      .eq('is_active', true)
      .order('last_name', { ascending: true })
      .limit(20);

    if (error) throw error;

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
  },

  // Get doctor by ID
  getById: async (id: string): Promise<Doctor | null> => {
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
