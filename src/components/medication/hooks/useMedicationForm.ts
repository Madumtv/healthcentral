
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Medication, TimeOfDay } from "@/types";
import { supabaseMedicationService } from "@/lib/supabase-medication-service";

interface UseMedicationFormProps {
  initialMedication: Partial<Medication>;
  isEditing: boolean;
  id?: string;
}

export const useMedicationForm = ({ initialMedication, isEditing, id }: UseMedicationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medication, setMedication] = useState<Partial<Medication>>(initialMedication);
  const [isSaving, setIsSaving] = useState(false);
  const [customTimePeriods, setCustomTimePeriods] = useState<TimeOfDay[]>([]);

  // Fonction pour nettoyer les doublons entre périodes standards et françaises
  const cleanTimeOfDayDuplicates = (timeOfDay: TimeOfDay[]): TimeOfDay[] => {
    const standardPeriods = ['morning', 'noon', 'evening', 'night'];
    const frenchToEnglish = {
      'matin': 'morning',
      'midi': 'noon',
      'soir': 'evening', 
      'nuit': 'night'
    };
    
    const cleaned: TimeOfDay[] = [];
    const seenStandards = new Set<string>();
    
    timeOfDay.forEach(period => {
      // Si c'est une période standard, l'ajouter directement
      if (standardPeriods.includes(period)) {
        if (!seenStandards.has(period)) {
          cleaned.push(period);
          seenStandards.add(period);
        }
      }
      // Si c'est un équivalent français, convertir vers l'anglais
      else if (period in frenchToEnglish) {
        const englishEquivalent = frenchToEnglish[period as keyof typeof frenchToEnglish];
        if (!seenStandards.has(englishEquivalent)) {
          cleaned.push(englishEquivalent as TimeOfDay);
          seenStandards.add(englishEquivalent);
        }
      }
      // Sinon, c'est une période personnalisée
      else {
        cleaned.push(period);
      }
    });
    
    return cleaned;
  };

  // Initialiser les périodes personnalisées à partir du médicament
  useEffect(() => {
    console.log("Initializing medication data:", initialMedication);
    
    if (initialMedication.timeOfDay && initialMedication.timeOfDay.length > 0) {
      // Nettoyer les doublons d'abord
      const cleanedTimeOfDay = cleanTimeOfDayDuplicates(initialMedication.timeOfDay);
      
      // Filtrer pour enlever les périodes standard qui sont déjà dans les checkboxes
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const custom = cleanedTimeOfDay.filter(
        period => !standardPeriods.includes(period)
      ) as TimeOfDay[];
      
      console.log("Custom periods extracted:", custom);
      setCustomTimePeriods(custom);
      
      // Mettre à jour le medication avec les données nettoyées
      setMedication(prev => ({
        ...initialMedication,
        timeOfDay: cleanedTimeOfDay
      }));
    } else {
      // S'assurer que medication est bien synchronisé avec initialMedication
      setMedication(initialMedication);
    }
  }, [initialMedication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      console.log("Submitting medication:", medication);
      
      if (!medication.name || !medication.dosage || 
          !medication.timeOfDay?.length || !medication.daysOfWeek?.length) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }
      
      // Nettoyer les doublons avant la sauvegarde
      const cleanedMedication = {
        ...medication,
        timeOfDay: cleanTimeOfDayDuplicates(medication.timeOfDay || [])
      };
      
      if (isEditing && id) {
        await supabaseMedicationService.update(id, cleanedMedication);
        toast({
          title: "Succès",
          description: "Médicament mis à jour avec succès.",
        });
      } else {
        await supabaseMedicationService.create(cleanedMedication as any);
        toast({
          title: "Succès",
          description: "Médicament ajouté avec succès.",
        });
      }
      
      navigate("/medications");
    } catch (error: any) {
      console.error("Error saving medication:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    medication,
    setMedication,
    customTimePeriods,
    setCustomTimePeriods,
    isSaving,
    handleSubmit,
    cleanTimeOfDayDuplicates
  };
};
