import { Medication } from "@/types";

// Fonction pour normaliser les valeurs de time_of_day
const normalizeTimeOfDay = (timeOfDay: string[]): string[] => {
  const frenchToEnglish = {
    'matin': 'morning',
    'midi': 'noon', 
    'soir': 'evening',
    'nuit': 'night',
    'repas': 'repas',
    'avant_repas': 'avant_repas',
    'apres_repas': 'apres_repas'
  };
  
  return timeOfDay.map(time => {
    // Si c'est déjà en anglais, on garde tel quel
    if (['morning', 'noon', 'evening', 'night', 'repas', 'avant_repas', 'apres_repas', 'custom'].includes(time)) {
      return time;
    }
    // Sinon on convertit du français vers l'anglais
    return frenchToEnglish[time as keyof typeof frenchToEnglish] || time;
  });
};

export const transformMedicationFromDatabase = (dbMedication: any): Medication => {
  console.log("Transforming medication from database:", dbMedication);
  console.log("Doctor data in transformation:", dbMedication.doctors);
  
  const medication: Medication = {
    id: dbMedication.id,
    name: dbMedication.name,
    description: dbMedication.description,
    dosage: dbMedication.dosage,
    timeOfDay: normalizeTimeOfDay(dbMedication.time_of_day || []) as any,
    daysOfWeek: dbMedication.days_of_week as any,
    notes: dbMedication.notes,
    prescribingDoctor: dbMedication.prescribing_doctor,
    doctorId: dbMedication.doctor_id,
    doctor: undefined, // Par défaut
    infoLink: dbMedication.info_link,
    createdAt: new Date(dbMedication.created_at),
    updatedAt: new Date(dbMedication.updated_at),
  };

  // Gestion des données du docteur avec logging détaillé
  if (dbMedication.doctors) {
    console.log("Doctor object found:", dbMedication.doctors);
    if (typeof dbMedication.doctors === 'object' && dbMedication.doctors.id) {
      medication.doctor = {
        id: dbMedication.doctors.id,
        firstName: dbMedication.doctors.first_name,
        lastName: dbMedication.doctors.last_name,
        specialty: dbMedication.doctors.specialty,
        phone: dbMedication.doctors.phone,
        email: dbMedication.doctors.email,
        city: dbMedication.doctors.city,
        inamiNumber: dbMedication.doctors.inami_number,
      };
      console.log("Doctor data transformed successfully:", medication.doctor);
    } else {
      console.log("Doctor object exists but no valid ID found");
    }
  } else if (dbMedication.doctor_id) {
    console.log("Doctor ID exists but no doctor object found, doctor_id:", dbMedication.doctor_id);
  } else {
    console.log("No doctor data available for this medication");
  }

  console.log("Final transformed medication:", medication);
  return medication;
};

export const transformMedicationToDatabase = (medication: Omit<Medication, "id" | "createdAt" | "updatedAt">) => {
  return {
    name: medication.name,
    description: medication.description,
    dosage: medication.dosage,
    time_of_day: normalizeTimeOfDay(medication.timeOfDay || []),
    days_of_week: medication.daysOfWeek,
    notes: medication.notes,
    prescribing_doctor: medication.prescribingDoctor,
    doctor_id: medication.doctorId,
    info_link: medication.infoLink,
  };
};

export const transformMedicationUpdateToDatabase = (medication: Partial<Medication>) => {
  const updateData: any = {};
  
  if (medication.name !== undefined) updateData.name = medication.name;
  if (medication.description !== undefined) updateData.description = medication.description;
  if (medication.dosage !== undefined) updateData.dosage = medication.dosage;
  if (medication.timeOfDay !== undefined) updateData.time_of_day = normalizeTimeOfDay(medication.timeOfDay || []);
  if (medication.daysOfWeek !== undefined) updateData.days_of_week = medication.daysOfWeek;
  if (medication.notes !== undefined) updateData.notes = medication.notes;
  if (medication.prescribingDoctor !== undefined) updateData.prescribing_doctor = medication.prescribingDoctor;
  if (medication.doctorId !== undefined) updateData.doctor_id = medication.doctorId;
  if (medication.infoLink !== undefined) updateData.info_link = medication.infoLink;

  console.log("Update data prepared:", updateData);
  return updateData;
};
