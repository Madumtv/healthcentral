
import { timeOfDayLabels } from "@/lib/constants";
import { MedicationDoseCard } from "./MedicationDoseCard";
import { EmptyDosesState } from "./EmptyDosesState";

interface DayViewProps {
  medicationDoses: any[];
  onToggleDose: (doseId: string, isTaken: boolean) => void;
  isToday: boolean;
}

export const DayView = ({ medicationDoses, onToggleDose, isToday }: DayViewProps) => {
  // Regrouper les doses par moment de la journée
  const dosesByTimeOfDay: Record<string, any[]> = {
    morning: [],
    noon: [],
    evening: [],
    night: [],
    custom: []
  };

  medicationDoses.forEach(dose => {
    if (dosesByTimeOfDay[dose.time_of_day]) {
      dosesByTimeOfDay[dose.time_of_day].push(dose);
    } else {
      dosesByTimeOfDay.custom.push(dose);
    }
  });

  // Vérifier s'il y a des doses à afficher
  const isEmpty = Object.values(dosesByTimeOfDay).every(doses => doses.length === 0);

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
      {Object.entries(dosesByTimeOfDay).map(([timeOfDay, doses]) => 
        doses.length > 0 && (
          <div key={timeOfDay} className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-8 bg-medBlue rounded-full mr-3"></span>
              {timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}
            </h3>
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
        )
      )}
    </div>
  );
};
