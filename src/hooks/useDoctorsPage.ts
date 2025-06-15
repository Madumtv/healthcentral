
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";

export const useDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      console.log("Loading doctors from database...");
      const results = await supabaseDoctorsService.search("");
      console.log("Loaded doctors:", results);
      setDoctors(results);
    } catch (error) {
      console.error("Error loading doctors:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des médecins.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleDoctorAdded = (doctor: Doctor) => {
    console.log("Doctor added, refreshing list:", doctor);
    setShowAddForm(false);
    loadDoctors();
    toast({
      title: "Succès",
      description: `Dr ${doctor.first_name} ${doctor.last_name} a été ajouté avec succès.`,
    });
  };

  const handleDoctorUpdated = async (updatedDoctor: Doctor) => {
    try {
      if (updatedDoctor.source !== 'Base locale') {
        toast({
          title: "Erreur",
          description: "Seuls les médecins de votre base locale peuvent être modifiés.",
          variant: "destructive",
        });
        return;
      }

      await supabaseDoctorsService.update(updatedDoctor.id, updatedDoctor);
      await loadDoctors();
      setEditingDoctor(null);
      
      toast({
        title: "Succès",
        description: `Dr ${updatedDoctor.first_name} ${updatedDoctor.last_name} a été modifié avec succès.`,
      });
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le médecin.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;

    try {
      if (doctorToDelete.source !== 'Base locale') {
        toast({
          title: "Erreur",
          description: "Seuls les médecins de votre base locale peuvent être supprimés.",
          variant: "destructive",
        });
        return;
      }

      setIsDeleting(true);
      await supabaseDoctorsService.delete(doctorToDelete.id);
      await loadDoctors();
      setDoctorToDelete(null);
      
      toast({
        title: "Succès",
        description: `Dr ${doctorToDelete.first_name} ${doctorToDelete.last_name} a été supprimé avec succès.`,
      });
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le médecin.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.inami_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    doctors: filteredDoctors,
    searchTerm,
    setSearchTerm,
    isLoading,
    showAddForm,
    setShowAddForm,
    editingDoctor,
    setEditingDoctor,
    doctorToDelete,
    setDoctorToDelete,
    isDeleting,
    handleDoctorAdded,
    handleDoctorUpdated,
    handleDeleteDoctor,
  };
};
