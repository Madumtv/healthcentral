
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { sampleBelgianDoctors } from "@/lib/sample-doctors-data";

export const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPopulating, setIsPopulating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const results = await supabaseDoctorsService.search("");
      setDoctors(results);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des médecins.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const populateWithSampleData = async () => {
    try {
      setIsPopulating(true);
      
      for (const doctorData of sampleBelgianDoctors) {
        await supabaseDoctorsService.create({
          ...doctorData,
          is_active: true,
        } as any);
      }
      
      await loadDoctors();
      toast({
        title: "Succès",
        description: `${sampleBelgianDoctors.length} médecins ajoutés avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout des médecins d'exemple.",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des médecins</CardTitle>
            <Button 
              onClick={populateWithSampleData}
              disabled={isPopulating}
              className="bg-medBlue hover:bg-blue-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isPopulating ? "Ajout en cours..." : "Ajouter des exemples"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un médecin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <p className="text-center py-8 text-gray-500">Chargement...</p>
            ) : filteredDoctors.length > 0 ? (
              <div className="space-y-3">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          Dr {doctor.first_name} {doctor.last_name}
                        </h3>
                        {doctor.specialty && (
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        )}
                        {doctor.city && (
                          <p className="text-sm text-gray-500">{doctor.city}</p>
                        )}
                        {doctor.inami_number && (
                          <p className="text-xs text-gray-400">INAMI: {doctor.inami_number}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucun médecin trouvé</p>
                <Button onClick={populateWithSampleData} disabled={isPopulating}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des médecins d'exemple
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsManagement;
