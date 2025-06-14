
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Pill, Plus, Search } from "lucide-react";
import { Medication } from "@/types";
import { supabaseMedicationService } from "@/lib/supabase-medication-service";
import MedicationCard from "@/components/MedicationCard";

const MedicationsPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await supabaseMedicationService.getAll();
        setMedications(data);
        setFilteredMedications(data);
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

  useEffect(() => {
    // Filtrer les médicaments en fonction du terme de recherche
    const filtered = medications.filter(med => 
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.description && med.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (med.prescribingDoctor && med.prescribingDoctor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredMedications(filtered);
  }, [searchTerm, medications]);

  const handleEditMedication = (id: string) => {
    navigate(`/medications/edit/${id}`);
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      await supabaseMedicationService.delete(id);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-medBlue">Mes médicaments</h1>
              <p className="text-gray-600">Consultez et gérez tous vos médicaments</p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-medBlue hover:bg-blue-600"
              onClick={() => navigate("/medications/add")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un médicament
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un médicament..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Chargement...</p>
            </div>
          ) : filteredMedications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedications.map(medication => (
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
                {searchTerm ? (
                  <>
                    <p className="text-xl font-medium text-gray-500 mb-2">Aucun résultat trouvé</p>
                    <p className="text-gray-400 mb-6">Aucun médicament ne correspond à votre recherche.</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-medium text-gray-500 mb-2">Aucun médicament</p>
                    <p className="text-gray-400 mb-6">Vous n'avez pas encore ajouté de médicaments.</p>
                  </>
                )}
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

export default MedicationsPage;
