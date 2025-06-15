
import { Doctor } from "@/lib/supabase-doctors-service";
import { DoctorCard } from "./DoctorCard";
import { EmptyDoctorsState } from "./EmptyDoctorsState";

interface DoctorsListProps {
  doctors: Doctor[];
  searchTerm: string;
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
  onClearSearch: () => void;
  onAddDoctor: () => void;
}

export const DoctorsList = ({ 
  doctors, 
  searchTerm, 
  isLoading, 
  onEdit, 
  onDelete, 
  onClearSearch, 
  onAddDoctor 
}: DoctorsListProps) => {
  if (isLoading) {
    return <p className="text-center py-8 text-gray-500">Chargement...</p>;
  }

  if (doctors.length === 0) {
    return (
      <EmptyDoctorsState 
        searchTerm={searchTerm}
        onClearSearch={onClearSearch}
        onAddDoctor={onAddDoctor}
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        {doctors.length} médecin(s) trouvé(s)
      </p>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
