
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

  // Initialiser les périodes personnalisées à partir du médicament
  useEffect(() => {
    if (initialMedication.timeOfDay && initialMedication.timeOfDay.length > 0) {
      // Filtrer pour enlever les périodes standard qui sont déjà dans les checkboxes
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const custom = initialMedication.timeOfDay.filter(
        period => !standardPeriods.includes(period)
      ) as TimeOfDay[];
      setCustomTimePeriods(custom);
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
    setMedication((prev) => {
      // Récupérer seulement les périodes standard du timeOfDay actuel
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const standardTimeOfDay = (prev.timeOfDay || [])
        .filter(period => standardPeriods.includes(period));
      
      if (checked) {
        if (!standardTimeOfDay.includes(time as any)) {
          standardTimeOfDay.push(time as any);
        }
      } else {
        const index = standardTimeOfDay.indexOf(time as any);
        if (index > -1) {
          standardTimeOfDay.splice(index, 1);
        }
      }
      
      // Combiner les périodes standard avec les périodes personnalisées
      return { 
        ...prev, 
        timeOfDay: [...standardTimeOfDay, ...customTimePeriods] as TimeOfDay[] 
      };
    });
  };
  
  // Gérer les changements dans les périodes personnalisées
  const handleCustomPeriodsChange = (periods: TimeOfDay[]) => {
    setCustomTimePeriods(periods);
    
    // Mettre à jour timeOfDay dans medication
    setMedication(prev => {
      // Récupérer les périodes standard sélectionnées
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const standardSelected = (prev.timeOfDay || [])
        .filter(period => standardPeriods.includes(period));
      
      return {
        ...prev,
        timeOfDay: [...standardSelected, ...periods] as TimeOfDay[]
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!medication.name || !medication.dosage || 
          !medication.timeOfDay?.length || !medication.daysOfWeek?.length) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }
      
      if (isEditing && id) {
        await supabaseMedicationService.update(id, medication);
        toast({
          title: "Succès",
          description: "Médicament mis à jour avec succès.",
        });
      } else {
        await supabaseMedicationService.create(medication as any);
        toast({
          title: "Succès",
          description: "Médicament ajouté avec succès.",
        });
      }
      
      navigate("/medications");
    } catch (error: any) {
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
