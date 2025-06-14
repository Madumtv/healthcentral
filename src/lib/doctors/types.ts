
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
  source?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DoctorCreateData extends Omit<Doctor, "id" | "created_at" | "updated_at"> {}
