
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Medication } from "@/types";
import { medicationService } from "@/lib/mock-data";
import { daysOfWeekOptions, timeOfDayOptions } from "@/lib/constants";
import { ArrowLeft, Save } from "lucide-react";

const MedicationFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const [medication, setMedication] = useState<Partial<Medication>>({
    name: "",
    description: "",
    dosage: "",
    timeOfDay: [],
    daysOfWeek: [],
    notes: "",
    prescribingDoctor: "",
    infoLink: "",
  });
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchMedication = async () => {
      if (isEditing) {
        try {
          const data = await medicationService.getById(id);
          if (data) {
            setMedication(data);
          } else {
            toast({
              title: "Erreur",
              description: "Médicament non trouvé.",
              variant: "destructive",
            });
            navigate("/dashboard");
          }
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails du médicament.",
            variant: "destructive",
          });
          navigate("/dashboard");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchMedication();
  }, [id, isEditing, navigate, toast]);
  
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
      const timeOfDay = [...(prev.timeOfDay || [])];
      
      if (checked) {
        if (!timeOfDay.includes(time as any)) {
          timeOfDay.push(time as any);
        }
      } else {
        const index = timeOfDay.indexOf(time as any);
        if (index > -1) {
          timeOfDay.splice(index, 1);
        }
      }
      
      return { ...prev, timeOfDay };
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
      
      if (isEditing) {
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
      
      navigate("/dashboard");
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Chargement...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold text-medBlue">
              {isEditing ? "Modifier un médicament" : "Ajouter un médicament"}
            </h1>
          </div>
          
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
                        value={medication.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        name="dosage"
                        value={medication.dosage}
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
                    <Label>Moments de prise *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {timeOfDayOptions.map(option => (
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
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Pill className="h-6 w-6 text-white mr-2" />
              <span className="text-lg font-semibold">PilulePal</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PilulePal. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MedicationFormPage;
