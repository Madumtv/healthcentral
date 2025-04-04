
import { useState } from "react";
import { isToday } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader } from "./CalendarHeader";
import { DayView } from "./DayView";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MedicationsDisplayProps {
  selectedDate: Date;
  medicationDoses: any[];
  isLoading: boolean;
  onToggleDose: (doseId: string, currentStatus: boolean) => void;
  onMarkAllForPeriod: (timeOfDay: string, markAsTaken: boolean) => void;
  onMarkAllDoses: (markAsTaken: boolean) => void;
}

export const MedicationsDisplay = ({ 
  selectedDate, 
  medicationDoses, 
  isLoading,
  onToggleDose,
  onMarkAllForPeriod,
  onMarkAllDoses
}: MedicationsDisplayProps) => {
  return (
    <Card className="md:w-full">
      <CardContent className="pt-6">
        <CalendarHeader 
          date={selectedDate}
          title={isToday(selectedDate) ? "Aujourd'hui" : format(selectedDate, "EEEE d MMMM", { locale: fr })}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Chargement...</p>
          </div>
        ) : (
          <DayView 
            medicationDoses={medicationDoses} 
            onToggleDose={onToggleDose}
            onMarkAllForPeriod={onMarkAllForPeriod}
            onMarkAllDoses={onMarkAllDoses}
            isToday={isToday(selectedDate)}
          />
        )}
      </CardContent>
    </Card>
  );
};
