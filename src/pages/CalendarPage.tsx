
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isThisWeek, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { 
  supabase, 
  createMedicationDosesForDate, 
  markDoseAsTaken, 
  markMultipleDosesAsTaken 
} from "@/integrations/supabase/client";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { DayView } from "@/components/calendar/DayView";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [medicationDoses, setMedicationDoses] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Charger les doses de médicaments pour la date sélectionnée
  useEffect(() => {
    const loadDoses = async () => {
      try {
        setIsLoading(true);
        const doses = await createMedicationDosesForDate(selectedDate);
        setMedicationDoses(doses || []);
      } catch (error) {
        console.error("Erreur lors du chargement des doses:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les médicaments pour cette date.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Vérifier si l'utilisateur est authentifié
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      loadDoses();
    };

    checkAuth();
  }, [selectedDate, toast, navigate]);

  // Fonction pour marquer une dose comme prise ou non
  const handleToggleDose = async (doseId: string, currentStatus: boolean) => {
    try {
      await markDoseAsTaken(doseId, !currentStatus);
      // Mettre à jour l'état local
      setMedicationDoses(prevDoses => 
        prevDoses.map(dose => 
          dose.id === doseId 
            ? { ...dose, is_taken: !currentStatus, taken_at: !currentStatus ? new Date().toISOString() : null } 
            : dose
        )
      );
      
      toast({
        title: !currentStatus ? "Médicament pris" : "Médicament non pris",
        description: !currentStatus 
          ? "Le médicament a été marqué comme pris." 
          : "Le médicament a été marqué comme non pris.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du médicament.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour marquer toutes les doses d'une période comme prises ou non
  const handleMarkAllForPeriod = async (timeOfDay: string, markAsTaken: boolean) => {
    try {
      // Filtrer les doses pour cette période
      const dosesForPeriod = medicationDoses.filter(dose => dose.time_of_day === timeOfDay);
      
      // Si aucune dose, ne rien faire
      if (dosesForPeriod.length === 0) return;
      
      // Récupérer les IDs des doses
      const doseIds = dosesForPeriod.map(dose => dose.id);
      
      // Mettre à jour toutes les doses en une seule requête
      await markMultipleDosesAsTaken(doseIds, markAsTaken);
      
      // Mettre à jour l'état local
      setMedicationDoses(prevDoses => 
        prevDoses.map(dose => 
          dose.time_of_day === timeOfDay
            ? { 
                ...dose, 
                is_taken: markAsTaken, 
                taken_at: markAsTaken ? new Date().toISOString() : null 
              } 
            : dose
        )
      );
      
      // Notification
      toast({
        title: markAsTaken ? "Médicaments pris" : "Médicaments non pris",
        description: markAsTaken 
          ? `Tous les médicaments du ${timeOfDay.toLowerCase()} ont été marqués comme pris.` 
          : `Tous les médicaments du ${timeOfDay.toLowerCase()} ont été marqués comme non pris.`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des statuts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut des médicaments.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour marquer toutes les doses de la journée comme prises ou non
  const handleMarkAllDoses = async (markAsTaken: boolean) => {
    try {
      // Si aucune dose, ne rien faire
      if (medicationDoses.length === 0) return;
      
      // Récupérer les IDs de toutes les doses
      const allDoseIds = medicationDoses.map(dose => dose.id);
      
      // Mettre à jour toutes les doses en une seule requête
      await markMultipleDosesAsTaken(allDoseIds, markAsTaken);
      
      // Mettre à jour l'état local
      setMedicationDoses(prevDoses => 
        prevDoses.map(dose => ({ 
          ...dose, 
          is_taken: markAsTaken, 
          taken_at: markAsTaken ? new Date().toISOString() : null 
        }))
      );
      
      // Notification
      toast({
        title: markAsTaken ? "Tous les médicaments pris" : "Médicaments non pris",
        description: markAsTaken 
          ? "Tous les médicaments de la journée ont été marqués comme pris." 
          : "Tous les médicaments de la journée ont été marqués comme non pris.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des statuts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut des médicaments.",
        variant: "destructive",
      });
    }
  };

  // Navigation entre les jours
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

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
            <Card className="md:w-1/3">
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

            <Card className="md:w-2/3">
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
                    onToggleDose={handleToggleDose}
                    onMarkAllForPeriod={handleMarkAllForPeriod}
                    onMarkAllDoses={handleMarkAllDoses}
                    isToday={isToday(selectedDate)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CalendarPage;
