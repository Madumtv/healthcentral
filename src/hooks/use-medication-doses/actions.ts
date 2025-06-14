
import { markDoseAsTaken, markMultipleDosesAsTaken } from "@/integrations/supabase/client";
import { MedicationDose } from "./types";

export const createDoseActions = (
  setMedicationDoses: React.Dispatch<React.SetStateAction<MedicationDose[]>>,
  toast: any
) => {
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
      setMedicationDoses(prevDoses => {
        const dosesForPeriod = prevDoses.filter(dose => dose.time_of_day === timeOfDay);
        
        // Si aucune dose, ne rien faire
        if (dosesForPeriod.length === 0) return prevDoses;
        
        // Récupérer les IDs des doses
        const doseIds = dosesForPeriod.map(dose => dose.id);
        
        // Mettre à jour toutes les doses en une seule requête
        markMultipleDosesAsTaken(doseIds, markAsTaken);
        
        // Mettre à jour l'état local
        return prevDoses.map(dose => 
          dose.time_of_day === timeOfDay
            ? { 
                ...dose, 
                is_taken: markAsTaken, 
                taken_at: markAsTaken ? new Date().toISOString() : null 
              } 
            : dose
        );
      });
      
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
      setMedicationDoses(prevDoses => {
        // Si aucune dose, ne rien faire
        if (prevDoses.length === 0) return prevDoses;
        
        // Récupérer les IDs de toutes les doses
        const allDoseIds = prevDoses.map(dose => dose.id);
        
        // Mettre à jour toutes les doses en une seule requête
        markMultipleDosesAsTaken(allDoseIds, markAsTaken);
        
        // Mettre à jour l'état local
        return prevDoses.map(dose => ({ 
          ...dose, 
          is_taken: markAsTaken, 
          taken_at: markAsTaken ? new Date().toISOString() : null 
        }));
      });
      
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
    handleToggleDose,
    handleMarkAllForPeriod,
    handleMarkAllDoses
  };
};
