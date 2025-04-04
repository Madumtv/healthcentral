
import { Medication } from "@/types";
import { MedicationsByTimeList } from "./MedicationsByTimeList";
import { EmptyMedicationState } from "./EmptyMedicationState";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const isEmpty = !isLoading && Object.values(medicationsByTime).every(meds => meds.length === 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Médicaments du jour</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate("/calendar")}
          className="flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Vue calendrier
        </Button>
      </div>

      {isEmpty ? (
        <EmptyMedicationState 
          message="Aucun médicament aujourd'hui" 
          description="Vous n'avez pas de médicaments à prendre aujourd'hui." 
        />
      ) : (
        <MedicationsByTimeList medicationsByTime={medicationsByTime} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
};
