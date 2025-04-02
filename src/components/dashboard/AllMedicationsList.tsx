
import { Medication } from "@/types";
import MedicationCard from "@/components/MedicationCard";
import { EmptyMedicationState } from "./EmptyMedicationState";

interface AllMedicationsListProps {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AllMedicationsList = ({ medications, onEdit, onDelete }: AllMedicationsListProps) => {
  if (medications.length === 0) {
    return (
      <EmptyMedicationState 
        message="Aucun médicament" 
        description="Vous n'avez pas encore ajouté de médicaments." 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {medications.map(medication => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
