
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddDoctorForm } from "@/components/medication/doctor-selector/AddDoctorForm";
import { EditDoctorModal } from "@/components/doctors/EditDoctorModal";
import { DoctorsPageHeader } from "@/components/doctors/DoctorsPageHeader";
import { DoctorsSearchBar } from "@/components/doctors/DoctorsSearchBar";
import { DoctorsList } from "@/components/doctors/DoctorsList";
import { DeleteDoctorDialog } from "@/components/doctors/DeleteDoctorDialog";
import { useDoctorsPage } from "@/hooks/useDoctorsPage";

const DoctorsPage = () => {
  const {
    doctors,
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
  } = useDoctorsPage();

  if (showAddForm) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AddDoctorForm
              onDoctorAdded={handleDoctorAdded}
              onCancel={() => setShowAddForm(false)}
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
          <DoctorsPageHeader onAddDoctor={() => setShowAddForm(true)} />
          
          <Card>
            <CardHeader>
              <CardTitle>Liste des médecins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DoctorsSearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />

                <DoctorsList
                  doctors={doctors}
                  searchTerm={searchTerm}
                  isLoading={isLoading}
                  onEdit={setEditingDoctor}
                  onDelete={setDoctorToDelete}
                  onClearSearch={() => setSearchTerm("")}
                  onAddDoctor={() => setShowAddForm(true)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />

      <EditDoctorModal
        doctor={editingDoctor}
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSave={handleDoctorUpdated}
      />

      <DeleteDoctorDialog
        doctor={doctorToDelete}
        isDeleting={isDeleting}
        onConfirm={handleDeleteDoctor}
        onCancel={() => setDoctorToDelete(null)}
      />
    </div>
  );
};

export default DoctorsPage;
