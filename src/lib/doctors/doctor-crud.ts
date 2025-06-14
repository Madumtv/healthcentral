
import { supabase } from "@/integrations/supabase/client";
import { ordomedicService } from "../ordomedic-service";
import { Doctor, DoctorCreateData } from "./types";

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  // Si l'ID commence par un préfixe externe, c'est un médecin d'une source externe
  if (id.startsWith('ordo_') || id.startsWith('doctoralia_') || 
      id.startsWith('doctoranytime_') || id.startsWith('qare_') || 
      id.startsWith('specialist_')) {
    // Rechercher dans les sources externes
    const searchResults = await ordomedicService.searchDoctors('');
    const externalDoctors = searchResults.doctors;
    return externalDoctors.find(d => d.id === id) || null;
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
    source: 'Base locale',
    is_active: data.is_active,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};

export const createDoctor = async (doctor: DoctorCreateData): Promise<Doctor> => {
  console.log("Creating doctor with data:", doctor);
  
  const { data, error } = await supabase
    .from('doctors')
    .insert({
      inami_number: doctor.inami_number || null,
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      specialty: doctor.specialty || null,
      address: doctor.address || null,
      city: doctor.city || null,
      postal_code: doctor.postal_code || null,
      phone: doctor.phone || null,
      email: doctor.email || null,
      is_active: doctor.is_active,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating doctor:", error);
    throw error;
  }

  console.log("Doctor created successfully:", data);

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
    source: 'Base locale',
    is_active: data.is_active,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};
