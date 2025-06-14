
import { Medication } from "@/types";
import { EmptyMedicationState } from "./EmptyMedicationState";
import { MedicationsListTable } from "./MedicationsListTable";

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Liste complète de vos médicaments ({medications.length})
        </h2>
      </div>
      <MedicationsListTable 
        medications={medications} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
    </div>
  );
};
