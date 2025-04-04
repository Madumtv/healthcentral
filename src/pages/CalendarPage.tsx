
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DateNavigation } from "@/components/calendar/DateNavigation";
import { MedicationsDisplay } from "@/components/calendar/MedicationsDisplay";
import { useMedicationDoses } from "@/hooks/use-medication-doses";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { 
    isLoading, 
    medicationDoses, 
    handleToggleDose, 
    handleMarkAllForPeriod, 
    handleMarkAllDoses 
  } = useMedicationDoses(selectedDate);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-medBlue">Calendrier des prises</h1>
            <p className="text-gray-600">Suivez vos prises de médicaments et marquez-les comme prises</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <DateNavigation 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
              />
            </div>

            <div className="md:w-2/3">
              <MedicationsDisplay
                selectedDate={selectedDate}
                medicationDoses={medicationDoses}
                isLoading={isLoading}
                onToggleDose={handleToggleDose}
                onMarkAllForPeriod={handleMarkAllForPeriod}
                onMarkAllDoses={handleMarkAllDoses}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CalendarPage;
