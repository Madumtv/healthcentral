
import { EmptyDosesState } from "./EmptyDosesState";
import { MedicationPeriodGroup } from "./MedicationPeriodGroup";
import { GlobalActionButton } from "./GlobalActionButton";
import { timeOfDayLabels } from "@/lib/constants";

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
  // Create an object to hold all possible time of day groups
  const dosesByTimeOfDay: Record<string, any[]> = {};
  
  // Initialize standard time periods
  Object.keys(timeOfDayLabels).forEach(key => {
    dosesByTimeOfDay[key] = [];
  });

  // Distribute doses into their respective time periods
  medicationDoses.forEach(dose => {
    const timeOfDay = dose.time_of_day;
    
    // If this is a new time period we haven't seen before, initialize its array
    if (!dosesByTimeOfDay[timeOfDay]) {
      dosesByTimeOfDay[timeOfDay] = [];
    }
    
    dosesByTimeOfDay[timeOfDay].push(dose);
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
      {Object.entries(dosesByTimeOfDay)
        .filter(([_, doses]) => doses.length > 0)  // Only show periods with medications
        .sort(([a], [b]) => {
          // Custom sorting function to prioritize standard periods and then sort others alphabetically
          const standardOrder = ['morning', 'noon', 'repas', 'avant_repas', 'apres_repas', 'evening', 'night', 'custom'];
          const aIndex = standardOrder.indexOf(a);
          const bIndex = standardOrder.indexOf(b);
          
          if (aIndex >= 0 && bIndex >= 0) {
            return aIndex - bIndex;
          } else if (aIndex >= 0) {
            return -1;
          } else if (bIndex >= 0) {
            return 1;
          } else {
            return a.localeCompare(b);
          }
        })
        .map(([timeOfDay, doses]) => (
          <MedicationPeriodGroup
            key={timeOfDay}
            timeOfDay={timeOfDay}
            doses={doses}
            onToggleDose={onToggleDose}
            onMarkAllForPeriod={onMarkAllForPeriod}
          />
        ))
      }
    </div>
  );
};
