
import { MedicationDoseCard } from "./MedicationDoseCard";
import { PeriodHeader } from "./PeriodHeader";
import { timeOfDayLabels } from "@/lib/constants";

interface MedicationPeriodGroupProps {
  timeOfDay: string;
  doses: any[];
  onToggleDose: (doseId: string, isTaken: boolean) => void;
  onMarkAllForPeriod: (timeOfDay: string, isTaken: boolean) => void;
}

export const MedicationPeriodGroup = ({ 
  timeOfDay, 
  doses, 
  onToggleDose, 
  onMarkAllForPeriod 
}: MedicationPeriodGroupProps) => {
  // Skip rendering if no doses for this period
  if (doses.length === 0) return null;
  
  // Check if all doses in this period are taken
  const areAllTakenInPeriod = doses.length > 0 && doses.every(dose => dose.is_taken);
  
  // Get the label for this time of day
  const periodTitle = timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels];

  return (
    <div className="mb-6">
      <PeriodHeader 
        title={periodTitle} 
        isAllTaken={areAllTakenInPeriod}
        onMarkAll={(markAsTaken) => onMarkAllForPeriod(timeOfDay, markAsTaken)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doses.map((dose: any) => (
          <MedicationDoseCard
            key={dose.id}
            dose={dose}
            onToggle={() => onToggleDose(dose.id, dose.is_taken)}
          />
        ))}
      </div>
    </div>
  );
};
