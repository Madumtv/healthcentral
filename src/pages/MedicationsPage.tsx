
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Pill, Plus } from "lucide-react";
import { Medication } from "@/types";
import { supabaseMedicationService } from "@/lib/supabase-medication-service";
import { MedicationFilter } from "@/components/medication/MedicationFilter";
import { MedicationsListTable } from "@/components/dashboard/MedicationsListTable";

const MedicationsPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchMedications = async () => {
    try {
      console.log("Fetching medications...");
      const data = await supabaseMedicationService.getAll();
      console.log("Fetched medications with doctor data:", data);
      setMedications(data);
      setFilteredMedications(data);
      setLastRefresh(Date.now());
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos médicaments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [toast]);

  // Actualiser les données quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      console.log("Window focused, refreshing medications");
      fetchMedications();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refreshing medications");
        fetchMedications();
      }
    };

    // Écouter quand la fenêtre reprend le focus
    window.addEventListener('focus', handleFocus);
    // Écouter quand la page redevient visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Force refresh when coming back from navigation
  useEffect(() => {
    const handlePopState = () => {
      console.log("Navigation back detected, refreshing medications");
      fetchMedications();
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = medications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (med.description && med.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (med.prescribingDoctor && med.prescribingDoctor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (med.doctor && `${med.doctor.firstName} ${med.doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected doctor (exclude "all" value)
    if (selectedDoctorId && selectedDoctorId !== "all") {
      filtered = filtered.filter(med => med.doctorId === selectedDoctorId);
    }

    setFilteredMedications(filtered);
  }, [searchTerm, selectedDoctorId, medications]);

  const handleEditMedication = (id: string) => {
    navigate(`/medications/edit/${id}`);
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      await supabaseMedicationService.delete(id);
      // Actualiser la liste après suppression
      await fetchMedications();
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDoctorId("");
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
            <MedicationFilter
              searchTerm={searchTerm}
              selectedDoctorId={selectedDoctorId}
              onSearchChange={setSearchTerm}
              onDoctorChange={setSelectedDoctorId}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Chargement...</p>
            </div>
          ) : filteredMedications.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Liste de vos médicaments ({filteredMedications.length})
                </h2>
              </div>
              <MedicationsListTable 
                key={lastRefresh}
                medications={filteredMedications} 
                onEdit={handleEditMedication} 
                onDelete={handleDeleteMedication} 
              />
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pill className="h-12 w-12 text-gray-300 mb-4" />
                {searchTerm || selectedDoctorId ? (
                  <>
                    <p className="text-xl font-medium text-gray-500 mb-2">Aucun résultat trouvé</p>
                    <p className="text-gray-400 mb-6">Aucun médicament ne correspond à vos filtres.</p>
                    <Button onClick={handleClearFilters} variant="outline">
                      Effacer les filtres
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-medium text-gray-500 mb-2">Aucun médicament</p>
                    <p className="text-gray-400 mb-6">Vous n'avez pas encore ajouté de médicaments.</p>
                    <Button 
                      onClick={() => navigate("/medications/add")} 
                      className="bg-medBlue hover:bg-blue-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un médicament
                    </Button>
                  </>
                )}
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
