
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pill, Plus, Clock, Calendar } from "lucide-react";
import { Medication } from "@/types";
import { medicationService } from "@/lib/mock-data";
import MedicationCard from "@/components/MedicationCard";
import { daysOfWeekLabels, timeOfDayLabels } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await medicationService.getAll();
        setMedications(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger vos médicaments.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [toast]);

  const handleEditMedication = (id: string) => {
    navigate(`/medications/edit/${id}`);
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      await medicationService.delete(id);
      setMedications(medications.filter(med => med.id !== id));
      toast({
        title: "Succès",
        description: "Médicament supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce médicament.",
        variant: "destructive",
      });
    }
  };

  // Créer des groupes par moment de prise
  const todayMedications = medications.filter(med => {
    const today = new Date().getDay();
    // Convertir jour JS (0=dim, 1=lun, ...) en notre format
    const daysMap: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return med.daysOfWeek.includes(daysMap[today] as any);
  });

  const medicationsByTime: Record<string, Medication[]> = {
    morning: todayMedications.filter(med => med.timeOfDay.includes("morning")),
    noon: todayMedications.filter(med => med.timeOfDay.includes("noon")),
    evening: todayMedications.filter(med => med.timeOfDay.includes("evening")),
    night: todayMedications.filter(med => med.timeOfDay.includes("night")),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-medBlue">Tableau de bord</h1>
              <p className="text-gray-600">Gérez vos médicaments et consultez votre programme</p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-medBlue hover:bg-blue-600"
              onClick={() => navigate("/medications/add")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un médicament
            </Button>
          </div>
          
          <Tabs defaultValue="today" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="today"><Clock className="h-4 w-4 mr-2" /> Aujourd'hui</TabsTrigger>
              <TabsTrigger value="all"><Calendar className="h-4 w-4 mr-2" /> Tous mes médicaments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today">
              <div className="space-y-8">
                {Object.entries(medicationsByTime).map(([time, meds]) => 
                  meds.length > 0 && (
                    <div key={time}>
                      <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="w-2 h-8 bg-medBlue rounded-full mr-3"></span>
                        {timeOfDayLabels[time as keyof typeof timeOfDayLabels]}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meds.map(medication => (
                          <MedicationCard
                            key={medication.id}
                            medication={medication}
                            onEdit={handleEditMedication}
                            onDelete={handleDeleteMedication}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )}
                
                {!isLoading && Object.values(medicationsByTime).every(meds => meds.length === 0) && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Pill className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-xl font-medium text-gray-500 mb-2">Aucun médicament aujourd'hui</p>
                      <p className="text-gray-400 mb-6">Vous n'avez pas de médicaments à prendre aujourd'hui.</p>
                      <Button 
                        onClick={() => navigate("/medications/add")} 
                        className="bg-medBlue hover:bg-blue-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un médicament
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              {medications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {medications.map(medication => (
                    <MedicationCard
                      key={medication.id}
                      medication={medication}
                      onEdit={handleEditMedication}
                      onDelete={handleDeleteMedication}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Pill className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-xl font-medium text-gray-500 mb-2">Aucun médicament</p>
                    <p className="text-gray-400 mb-6">Vous n'avez pas encore ajouté de médicaments.</p>
                    <Button 
                      onClick={() => navigate("/medications/add")} 
                      className="bg-medBlue hover:bg-blue-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un médicament
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
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

export default DashboardPage;
