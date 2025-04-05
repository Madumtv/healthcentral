
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Medication, TimeOfDay } from "@/types";
import { medicationService } from "@/lib/mock-data";
import { daysOfWeekOptions, timeOfDayOptions } from "@/lib/constants";
import { Save } from "lucide-react";
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
        await medicationService.update(id, medication);
        toast({
          title: "Succès",
          description: "Médicament mis à jour avec succès.",
        });
      } else {
        await medicationService.create(medication as any);
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

  // Extraire uniquement les périodes standard dans les options de checkbox
  const standardTimeOptions = timeOfDayOptions.filter(
    option => ['morning', 'noon', 'evening', 'night'].includes(option.value)
  );

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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du médicament *</Label>
                <Input
                  id="name"
                  name="name"
                  value={medication.name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={medication.dosage || ""}
                  onChange={handleInputChange}
                  placeholder="Ex: 500mg, 10ml..."
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={medication.description || ""}
                onChange={handleInputChange}
                placeholder="Ex: Antidouleur, antibiotique..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Moments de prise standards *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {standardTimeOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`time-${option.value}`}
                      checked={medication.timeOfDay?.includes(option.value as any) || false}
                      onCheckedChange={(checked) => 
                        handleTimeChange(option.value, checked === true)
                      }
                    />
                    <Label htmlFor={`time-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Section pour les périodes personnalisées */}
            <CustomTimePeriodsSection
              selectedPeriods={customTimePeriods}
              onChange={handleCustomPeriodsChange}
            />
            
            <div className="space-y-2">
              <Label>Jours de prise *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {daysOfWeekOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${option.value}`}
                      checked={medication.daysOfWeek?.includes(option.value as any) || false}
                      onCheckedChange={(checked) => 
                        handleDayChange(option.value, checked === true)
                      }
                    />
                    <Label htmlFor={`day-${option.value}`} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes personnelles</Label>
              <Textarea
                id="notes"
                name="notes"
                value={medication.notes || ""}
                onChange={handleInputChange}
                placeholder="Informations complémentaires, effets secondaires..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prescribingDoctor">Médecin prescripteur</Label>
              <Input
                id="prescribingDoctor"
                name="prescribingDoctor"
                value={medication.prescribingDoctor || ""}
                onChange={handleInputChange}
                placeholder="Dr. Dupont"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="infoLink">Lien vers des informations</Label>
              <Input
                id="infoLink"
                name="infoLink"
                value={medication.infoLink || ""}
                onChange={handleInputChange}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-medBlue hover:bg-blue-600"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicationForm;
