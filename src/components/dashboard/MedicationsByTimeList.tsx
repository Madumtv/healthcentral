
import { Medication } from "@/types";
import { timeOfDayLabels } from "@/lib/constants";
import MedicationCard from "@/components/MedicationCard";

interface MedicationsByTimeListProps {
  medicationsByTime: Record<string, Medication[]>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MedicationsByTimeList = ({ 
  medicationsByTime, 
  onEdit, 
  onDelete 
}: MedicationsByTimeListProps) => {
  return (
    <div className="space-y-8">
      {Object.entries(medicationsByTime).map(([time, meds]) => 
        meds.length > 0 && (
          <div key={time}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-8 bg-medBlue rounded-full mr-3"></span>
              {timeOfDayLabels[time as keyof typeof timeOfDayLabels]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meds.map(medication => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};
