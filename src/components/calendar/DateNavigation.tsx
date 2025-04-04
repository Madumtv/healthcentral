
import { useState, useEffect } from "react";
import { isToday, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateNavigationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const DateNavigation = ({ selectedDate, setSelectedDate }: DateNavigationProps) => {
  // Navigation functions
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <Card className="md:w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "d MMMM yyyy", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <div className="flex space-x-2">
            <Button onClick={goToPreviousDay} variant="outline" className="flex-1">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Jour précédent
            </Button>
            <Button onClick={goToNextDay} variant="outline" className="flex-1">
              Jour suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <Button onClick={goToToday} disabled={isToday(selectedDate)}>
            Aujourd'hui
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
