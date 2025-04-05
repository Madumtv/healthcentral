
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DayOfWeek } from "@/types";
import { daysOfWeekOptions } from "@/lib/constants";

interface DaysOfWeekFieldProps {
  selectedDays: DayOfWeek[];
  onChange: (day: string, checked: boolean) => void;
}

export const DaysOfWeekField = ({ 
  selectedDays,
  onChange 
}: DaysOfWeekFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>Jours de prise *</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {daysOfWeekOptions.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`day-${option.value}`}
              checked={selectedDays?.includes(option.value as any) || false}
              onCheckedChange={(checked) => 
                onChange(option.value, checked === true)
              }
            />
            <Label htmlFor={`day-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysOfWeekField;
