
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TimeOfDay } from "@/types";

interface StandardTimePeriodsProps {
  selectedTimes: TimeOfDay[];
  onChange: (time: string, checked: boolean) => void;
}

export const StandardTimePeriods = ({ 
  selectedTimes,
  onChange 
}: StandardTimePeriodsProps) => {
  // Standard time periods that are shown as checkboxes
  const standardPeriods = [
    { value: 'morning', label: 'Matin' },
    { value: 'noon', label: 'Midi' },
    { value: 'evening', label: 'Soir' },
    { value: 'night', label: 'Nuit' }
  ];

  return (
    <div className="space-y-2">
      <Label>Moments de prise standards *</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {standardPeriods.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`time-${option.value}`}
              checked={selectedTimes?.includes(option.value as any) || false}
              onCheckedChange={(checked) => 
                onChange(option.value, checked === true)
              }
            />
            <Label htmlFor={`time-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandardTimePeriods;
