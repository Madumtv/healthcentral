
import { timeOfDayLabels } from "@/lib/constants";
import { MedicationDoseCard } from "./MedicationDoseCard";
import { EmptyDosesState } from "./EmptyDosesState";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface DayViewProps {
  medicationDoses: any[];
  onToggleDose: (doseId: string, isTaken: boolean) => void;
  isToday: boolean;
  onMarkAllForPeriod: (timeOfDay: string, isTaken: boolean) => void;
}

export const DayView = ({ 
  medicationDoses, 
  onToggleDose, 
  isToday,
  onMarkAllForPeriod 
}: DayViewProps) => {
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

  // Vérifier si tous les médicaments d'une période sont pris
  const areAllTakenInPeriod = (timeOfDay: string) => {
    const doses = dosesByTimeOfDay[timeOfDay];
    return doses.length > 0 && doses.every(dose => dose.is_taken);
  };

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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="w-2 h-8 bg-medBlue rounded-full mr-3"></span>
                {timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}
              </h3>
              <Button
                onClick={() => onMarkAllForPeriod(timeOfDay, !areAllTakenInPeriod(timeOfDay))}
                variant={areAllTakenInPeriod(timeOfDay) ? "outline" : "default"}
                className={areAllTakenInPeriod(timeOfDay) 
                  ? "border-green-500 text-green-600 hover:bg-green-50" 
                  : "bg-medBlue hover:bg-medBlue/90"
                }
              >
                {areAllTakenInPeriod(timeOfDay) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Tous pris
                  </>
                ) : (
                  "Tout prendre"
                )}
              </Button>
            </div>
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
