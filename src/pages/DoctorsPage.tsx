
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { AddDoctorForm } from "@/components/medication/doctor-selector/AddDoctorForm";
import { EditDoctorModal } from "@/components/doctors/EditDoctorModal";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleCancelAddForm = () => {
    setShowAddForm(false);
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.inami_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showAddForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AddDoctorForm
              onDoctorAdded={handleDoctorAdded}
              onCancel={handleCancelAddForm}
            />
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-medBlue flex items-center">
                <Users className="mr-3 h-8 w-8" />
                Gestion des médecins
              </h1>
              <p className="text-gray-600">Ajoutez et gérez vos médecins</p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-medBlue hover:bg-blue-600"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un médecin
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Liste des médecins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Rechercher un médecin par nom, spécialité, ville ou numéro INAMI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isLoading ? (
                  <p className="text-center py-8 text-gray-500">Chargement...</p>
                ) : filteredDoctors.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {filteredDoctors.length} médecin(s) trouvé(s)
                    </p>
                    {filteredDoctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="font-medium text-lg">
                              Dr {doctor.first_name} {doctor.last_name}
                            </h3>
                            {doctor.specialty && (
                              <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
                            )}
                            <div className="space-y-1">
                              {doctor.address && (
                                <p className="text-sm text-gray-600">{doctor.address}</p>
                              )}
                              {doctor.city && (
                                <p className="text-sm text-gray-600">{doctor.city} {doctor.postal_code}</p>
                              )}
                              {doctor.phone && (
                                <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
                              )}
                              {doctor.email && (
                                <p className="text-sm text-gray-600">✉️ {doctor.email}</p>
                              )}
                              {doctor.inami_number && (
                                <p className="text-xs text-gray-400">INAMI: {doctor.inami_number}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                doctor.source === 'Base locale' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {doctor.source || 'Externe'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              title="Modifier"
                              onClick={() => setEditingDoctor(doctor)}
                              disabled={doctor.source !== 'Base locale'}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-destructive" 
                              title="Supprimer"
                              onClick={() => setDoctorToDelete(doctor)}
                              disabled={doctor.source !== 'Base locale'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    {searchTerm ? (
                      <>
                        <p className="text-gray-500 mb-4">Aucun médecin trouvé pour "{searchTerm}"</p>
                        <Button onClick={() => setSearchTerm("")} variant="outline">
                          Effacer la recherche
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 mb-4">Aucun médecin dans votre base de données</p>
                        <Button onClick={() => setShowAddForm(true)} className="bg-medBlue hover:bg-blue-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter votre premier médecin
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />

      {/* Modal d'édition */}
      <EditDoctorModal
        doctor={editingDoctor}
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSave={handleDoctorUpdated}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!doctorToDelete} onOpenChange={() => setDoctorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer Dr {doctorToDelete?.first_name} {doctorToDelete?.last_name} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDoctor}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DoctorsPage;
