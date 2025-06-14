
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  supabase, 
  createMedicationDosesForDate, 
  markDoseAsTaken, 
  markMultipleDosesAsTaken 
} from "@/integrations/supabase/client";

// Fonction pour normaliser les valeurs de time_of_day
const normalizeTimeOfDay = (timeOfDay: string): string => {
  const frenchToEnglish = {
    'matin': 'morning',
    'midi': 'noon', 
    'soir': 'evening',
    'nuit': 'night'
  };
  
  return frenchToEnglish[timeOfDay as keyof typeof frenchToEnglish] || timeOfDay;
};

export const useMedicationDoses = (selectedDate: Date) => {
  const [isLoading, setIsLoading] = useState(true);
  const [medicationDoses, setMedicationDoses] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoses = async () => {
      try {
        setIsLoading(true);
        const doses = await createMedicationDosesForDate(selectedDate);
        
        // Normaliser les valeurs time_of_day dans les doses si elles existent
        const normalizedDoses = Array.isArray(doses) ? doses
          .filter((dose): dose is NonNullable<typeof dose> => dose !== null && dose !== undefined)
          .map(dose => {
            if (dose && typeof dose === 'object' && 'time_of_day' in dose && dose.time_of_day) {
              return {
                ...dose,
                time_of_day: normalizeTimeOfDay(dose.time_of_day)
              };
            }
            return dose;
          }) : [];
        
        setMedicationDoses(normalizedDoses);
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

  return {
    isLoading,
    medicationDoses,
    handleToggleDose,
    handleMarkAllForPeriod,
    handleMarkAllDoses
  };
};
