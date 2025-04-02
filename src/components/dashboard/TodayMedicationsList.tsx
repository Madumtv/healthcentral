
import { Medication } from "@/types";
import { MedicationsByTimeList } from "./MedicationsByTimeList";
import { EmptyMedicationState } from "./EmptyMedicationState";

interface TodayMedicationsListProps {
  medicationsByTime: Record<string, Medication[]>;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodayMedicationsList = ({ 
  medicationsByTime, 
  isLoading, 
  onEdit, 
  onDelete 
}: TodayMedicationsListProps) => {
  const isEmpty = !isLoading && Object.values(medicationsByTime).every(meds => meds.length === 0);

  if (isEmpty) {
    return (
      <EmptyMedicationState 
        message="Aucun médicament aujourd'hui" 
        description="Vous n'avez pas de médicaments à prendre aujourd'hui." 
      />
    );
  }

  return <MedicationsByTimeList medicationsByTime={medicationsByTime} onEdit={onEdit} onDelete={onDelete} />;
};
