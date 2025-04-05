
import { EmptyDosesState } from "./EmptyDosesState";
import { MedicationPeriodGroup } from "./MedicationPeriodGroup";
import { GlobalActionButton } from "./GlobalActionButton";

interface DayViewProps {
  medicationDoses: any[];
  onToggleDose: (doseId: string, isTaken: boolean) => void;
  isToday: boolean;
  onMarkAllForPeriod: (timeOfDay: string, isTaken: boolean) => void;
  onMarkAllDoses: (isTaken: boolean) => void;
}

export const DayView = ({ 
  medicationDoses, 
  onToggleDose, 
  isToday,
  onMarkAllForPeriod,
  onMarkAllDoses
}: DayViewProps) => {
  // Group doses by time of day
  const dosesByTimeOfDay: Record<string, any[]> = {
    morning: [],
    noon: [],
    evening: [],
    night: [],
    custom: []
  };

  // Distribute doses into their respective time periods
  medicationDoses.forEach(dose => {
    if (dosesByTimeOfDay[dose.time_of_day]) {
      dosesByTimeOfDay[dose.time_of_day].push(dose);
    } else {
      dosesByTimeOfDay.custom.push(dose);
    }
  });

  // Check if there are any doses to display
  const isEmpty = Object.values(dosesByTimeOfDay).every(doses => doses.length === 0);

  // Check if all doses for the day are taken
  const areAllDosesTaken = medicationDoses.length > 0 && medicationDoses.every(dose => dose.is_taken);

  // If no doses, show empty state
  if (isEmpty) {
    return (
      <EmptyDosesState 
        message="Aucun médicament prévu" 
        description={isToday 
          ? "Vous n'avez pas de médicaments à prendre aujourd'hui." 
          : "Vous n'avez pas de médicaments à prendre ce jour-là."
        } 
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Global button to mark all medications for the day */}
      <GlobalActionButton 
        isAllTaken={areAllDosesTaken} 
        onMarkAll={onMarkAllDoses} 
      />

      {/* Display medication groups by period */}
      {Object.entries(dosesByTimeOfDay).map(([timeOfDay, doses]) => (
        <MedicationPeriodGroup
          key={timeOfDay}
          timeOfDay={timeOfDay}
          doses={doses}
          onToggleDose={onToggleDose}
          onMarkAllForPeriod={onMarkAllForPeriod}
        />
      ))}
    </div>
  );
};
