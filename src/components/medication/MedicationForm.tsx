import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Medication, TimeOfDay } from "@/types";
import { supabaseMedicationService } from "@/lib/supabase-medication-service";
import BasicInfoFields from "./form-fields/BasicInfoFields";
import StandardTimePeriods from "./form-fields/StandardTimePeriods";
import DaysOfWeekField from "./form-fields/DaysOfWeekField";
import AdditionalInfoFields from "./form-fields/AdditionalInfoFields";
import SubmitButton from "./form-fields/SubmitButton";
import { CustomTimePeriodsSection } from "./CustomTimePeriodsSection";

interface MedicationFormProps {
  medication: Partial<Medication>;
  isEditing: boolean;
  id?: string;
}

const MedicationForm = ({ medication: initialMedication, isEditing, id }: MedicationFormProps) => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMedication((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDayChange = (day: string, checked: boolean) => {
    setMedication((prev) => {
      const daysOfWeek = [...(prev.daysOfWeek || [])];
      
      if (checked) {
        if (!daysOfWeek.includes(day as any)) {
          daysOfWeek.push(day as any);
        }
      } else {
        const index = daysOfWeek.indexOf(day as any);
        if (index > -1) {
          daysOfWeek.splice(index, 1);
        }
      }
      
      return { ...prev, daysOfWeek };
    });
  };
  
  const handleTimeChange = (time: string, checked: boolean) => {
    console.log("Time change:", time, checked);
    
    setMedication((prev) => {
      // Récupérer seulement les périodes standard du timeOfDay actuel
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const currentTimeOfDay = prev.timeOfDay || [];
      
      // Séparer les périodes standard des périodes personnalisées
      const standardSelected = currentTimeOfDay.filter(period => standardPeriods.includes(period));
      const customSelected = currentTimeOfDay.filter(period => !standardPeriods.includes(period));
      
      let newStandardSelected = [...standardSelected];
      
      if (checked) {
        if (!newStandardSelected.includes(time as any)) {
          newStandardSelected.push(time as any);
        }
      } else {
        const index = newStandardSelected.indexOf(time as any);
        if (index > -1) {
          newStandardSelected.splice(index, 1);
        }
      }
      
      // Combiner les périodes standard avec les périodes personnalisées
      const newTimeOfDay = [...newStandardSelected, ...customSelected] as TimeOfDay[];
      
      console.log("New timeOfDay:", newTimeOfDay);
      
      return { 
        ...prev, 
        timeOfDay: newTimeOfDay
      };
    });
  };
  
  // Gérer les changements dans les périodes personnalisées
  const handleCustomPeriodsChange = (periods: TimeOfDay[]) => {
    console.log("Custom periods change:", periods);
    setCustomTimePeriods(periods);
    
    // Mettre à jour timeOfDay dans medication
    setMedication(prev => {
      // Récupérer les périodes standard sélectionnées
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const standardSelected = (prev.timeOfDay || [])
        .filter(period => standardPeriods.includes(period));
      
      const newTimeOfDay = [...standardSelected, ...periods] as TimeOfDay[];
      console.log("Updated timeOfDay with custom periods:", newTimeOfDay);
      
      return {
        ...prev,
        timeOfDay: newTimeOfDay
      };
    });
  };
  
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

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier" : "Ajouter"} un médicament</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Modifiez les informations de votre médicament" 
            : "Renseignez les informations de votre médicament"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInfoFields
            name={medication.name || ""}
            dosage={medication.dosage || ""}
            description={medication.description}
            onChange={handleInputChange}
          />
          
          <StandardTimePeriods
            selectedTimes={medication.timeOfDay || []}
            onChange={handleTimeChange}
          />
          
          {/* Section pour les périodes personnalisées */}
          <CustomTimePeriodsSection
            selectedPeriods={customTimePeriods}
            onChange={handleCustomPeriodsChange}
          />
          
          <DaysOfWeekField
            selectedDays={medication.daysOfWeek || []}
            onChange={handleDayChange}
          />
          
          <AdditionalInfoFields
            notes={medication.notes}
            prescribingDoctor={medication.prescribingDoctor}
            infoLink={medication.infoLink}
            onChange={handleInputChange}
          />
          
          <SubmitButton isSaving={isSaving} />
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicationForm;
