
import { supabase } from "@/integrations/supabase/client";
import { Medication } from "@/types";

export const supabaseMedicationService = {
  getAll: async (): Promise<Medication[]> => {
    const { data, error } = await supabase
      .from('medications')
      .select(`
        *,
        doctors (
          id,
          first_name,
          last_name,
          specialty,
          phone,
          email,
          city,
          inami_number
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(med => ({
      id: med.id,
      name: med.name,
      description: med.description,
      dosage: med.dosage,
      timeOfDay: med.time_of_day as any,
      daysOfWeek: med.days_of_week as any,
      notes: med.notes,
      prescribingDoctor: med.prescribing_doctor,
      doctorId: med.doctor_id,
      doctor: med.doctors ? {
        id: med.doctors.id,
        firstName: med.doctors.first_name,
        lastName: med.doctors.last_name,
        specialty: med.doctors.specialty,
        phone: med.doctors.phone,
        email: med.doctors.email,
        city: med.doctors.city,
        inamiNumber: med.doctors.inami_number,
      } : undefined,
      infoLink: med.info_link,
      createdAt: new Date(med.created_at),
      updatedAt: new Date(med.updated_at),
    }));
  },

  getById: async (id: string): Promise<Medication | undefined> => {
    const { data, error } = await supabase
      .from('medications')
      .select(`
        *,
        doctors (
          id,
          first_name,
          last_name,
          specialty,
          phone,
          email,
          city,
          inami_number
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      dosage: data.dosage,
      timeOfDay: data.time_of_day as any,
      daysOfWeek: data.days_of_week as any,
      notes: data.notes,
      prescribingDoctor: data.prescribing_doctor,
      doctorId: data.doctor_id,
      doctor: data.doctors ? {
        id: data.doctors.id,
        firstName: data.doctors.first_name,
        lastName: data.doctors.last_name,
        specialty: data.doctors.specialty,
        phone: data.doctors.phone,
        email: data.doctors.email,
        city: data.doctors.city,
        inamiNumber: data.doctors.inami_number,
      } : undefined,
      infoLink: data.info_link,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  create: async (medication: Omit<Medication, "id" | "createdAt" | "updatedAt">): Promise<Medication> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    const { data, error } = await supabase
      .from('medications')
      .insert({
        name: medication.name,
        description: medication.description,
        dosage: medication.dosage,
        time_of_day: medication.timeOfDay,
        days_of_week: medication.daysOfWeek,
        notes: medication.notes,
        prescribing_doctor: medication.prescribingDoctor,
        doctor_id: medication.doctorId,
        info_link: medication.infoLink,
        user_id: user.id,
      })
      .select(`
        *,
        doctors (
          id,
          first_name,
          last_name,
          specialty,
          phone,
          email,
          city,
          inami_number
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      dosage: data.dosage,
      timeOfDay: data.time_of_day as any,
      daysOfWeek: data.days_of_week as any,
      notes: data.notes,
      prescribingDoctor: data.prescribing_doctor,
      doctorId: data.doctor_id,
      doctor: data.doctors ? {
        id: data.doctors.id,
        firstName: data.doctors.first_name,
        lastName: data.doctors.last_name,
        specialty: data.doctors.specialty,
        phone: data.doctors.phone,
        email: data.doctors.email,
        city: data.doctors.city,
        inamiNumber: data.doctors.inami_number,
      } : undefined,
      infoLink: data.info_link,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  update: async (id: string, medication: Partial<Medication>): Promise<Medication> => {
    const updateData: any = {};
    
    if (medication.name !== undefined) updateData.name = medication.name;
    if (medication.description !== undefined) updateData.description = medication.description;
    if (medication.dosage !== undefined) updateData.dosage = medication.dosage;
    if (medication.timeOfDay !== undefined) updateData.time_of_day = medication.timeOfDay;
    if (medication.daysOfWeek !== undefined) updateData.days_of_week = medication.daysOfWeek;
    if (medication.notes !== undefined) updateData.notes = medication.notes;
    if (medication.prescribingDoctor !== undefined) updateData.prescribing_doctor = medication.prescribingDoctor;
    if (medication.doctorId !== undefined) updateData.doctor_id = medication.doctorId;
    if (medication.infoLink !== undefined) updateData.info_link = medication.infoLink;

    const { data, error } = await supabase
      .from('medications')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        doctors (
          id,
          first_name,
          last_name,
          specialty,
          phone,
          email,
          city,
          inami_number
        )
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      dosage: data.dosage,
      timeOfDay: data.time_of_day as any,
      daysOfWeek: data.days_of_week as any,
      notes: data.notes,
      prescribingDoctor: data.prescribing_doctor,
      doctorId: data.doctor_id,
      doctor: data.doctors ? {
        id: data.doctors.id,
        firstName: data.doctors.first_name,
        lastName: data.doctors.last_name,
        specialty: data.doctors.specialty,
        phone: data.doctors.phone,
        email: data.doctors.email,
        city: data.doctors.city,
        inamiNumber: data.doctors.inami_number,
      } : undefined,
      infoLink: data.info_link,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
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
