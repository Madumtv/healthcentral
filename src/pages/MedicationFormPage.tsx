
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { Medication } from "@/types";
import { supabaseMedicationService } from "@/lib/supabase-medication-service";
import MedicationForm from "@/components/medication/MedicationForm";
import MedicationFormHeader from "@/components/medication/MedicationFormHeader";

const MedicationFormPage = () => {
  const { id } = useParams<{ id: string }>();
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
  
  useEffect(() => {
    const fetchMedication = async () => {
      if (isEditing) {
        try {
          const data = await supabaseMedicationService.getById(id);
          if (data) {
            setMedication(data);
          } else {
            toast({
              title: "Erreur",
              description: "Médicament non trouvé.",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails du médicament.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchMedication();
  }, [id, isEditing, toast]);
  
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
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MedicationFormHeader isEditing={isEditing} />
          <MedicationForm 
            medication={medication} 
            isEditing={isEditing}
            id={id}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MedicationFormPage;
