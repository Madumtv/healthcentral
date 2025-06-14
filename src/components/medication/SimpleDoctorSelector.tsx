
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { AddDoctorForm } from "./doctor-selector/AddDoctorForm";

interface SimpleDoctorSelectorProps {
  selectedDoctorId?: string | null;
  selectedDoctorText?: string;
  onDoctorChange: (doctorId: string | null, doctorText: string) => void;
}

export const SimpleDoctorSelector = ({
  selectedDoctorId,
  selectedDoctorText,
  onDoctorChange
}: SimpleDoctorSelectorProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const results = await supabaseDoctorsService.search("");
      // Ne garder que les médecins de la base locale
      const localDoctors = results.filter(doctor => doctor.source === 'Base locale');
      setDoctors(localDoctors);
    } catch (error) {
      console.error("Erreur lors du chargement des médecins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleDoctorSelect = (doctorId: string) => {
    if (doctorId === "none") {
      onDoctorChange(null, "");
      return;
    }

    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      const doctorName = `Dr ${doctor.first_name} ${doctor.last_name}`;
      onDoctorChange(doctor.id, doctorName);
    }
  };

  const handleDoctorAdded = (doctor: Doctor) => {
    setShowAddModal(false);
    loadDoctors(); // Recharger la liste
    const doctorName = `Dr ${doctor.first_name} ${doctor.last_name}`;
    onDoctorChange(doctor.id, doctorName);
  };

  const handleCancelAddForm = () => {
    setShowAddModal(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="doctor">Médecin prescripteur (optionnel)</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Select value={selectedDoctorId || "none"} onValueChange={handleDoctorSelect}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un médecin"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun médecin</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <div>
                      <div>Dr {doctor.first_name} {doctor.last_name}</div>
                      {doctor.specialty && (
                        <div className="text-xs text-gray-500">{doctor.specialty}</div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" title="Ajouter un nouveau médecin">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau médecin</DialogTitle>
            </DialogHeader>
            <AddDoctorForm
              onDoctorAdded={handleDoctorAdded}
              onCancel={handleCancelAddForm}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {doctors.length === 0 && !isLoading && (
        <p className="text-sm text-gray-500">
          Aucun médecin dans votre base de données. 
          <Button 
            variant="link" 
            className="h-auto p-0 ml-1 text-sm"
            onClick={() => setShowAddModal(true)}
          >
            Ajouter le premier
          </Button>
        </p>
      )}
    </div>
  );
};

export default SimpleDoctorSelector;
