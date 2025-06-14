
import { DoctorSearchInput } from "./doctor-selector/DoctorSearchInput";
import { SelectedDoctorCard } from "./doctor-selector/SelectedDoctorCard";
import { UnifiedSearchResults } from "./doctor-selector/UnifiedSearchResults";
import { AddDoctorForm } from "./doctor-selector/AddDoctorForm";
import { useDoctorSearch } from "./doctor-selector/useDoctorSearch";
import { Doctor } from "@/lib/supabase-doctors-service";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus } from "lucide-react";
import { useState } from "react";

interface DoctorSelectorProps {
  selectedDoctorId?: string | null;
  selectedDoctorText?: string;
  onDoctorChange: (doctorId: string | null, doctorText: string) => void;
}

export const DoctorSelector = ({
  selectedDoctorId,
  selectedDoctorText,
  onDoctorChange
}: DoctorSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    officialResults,
    isSearching,
    isOfficialSearching,
    clearSearch,
    addSuggestedDoctor,
    performOfficialSearch
  } = useDoctorSearch();

  const handleDoctorSelect = (doctor: Doctor) => {
    const doctorName = `Dr ${doctor.first_name} ${doctor.last_name}`;
    onDoctorChange(doctor.id, doctorName);
    clearSearch();
  };

  const handleSuggestionAdd = async (doctor: Doctor) => {
    const addedDoctor = await addSuggestedDoctor(doctor);
    if (addedDoctor) {
      handleDoctorSelect(addedDoctor);
    }
  };

  const handleManualSubmit = () => {
    if (searchQuery.trim()) {
      // Afficher le formulaire d'ajout avec le nom pré-rempli
      setShowAddForm(true);
    }
  };

  const handleDoctorAdded = (doctor: Doctor) => {
    handleDoctorSelect(doctor);
    setShowAddForm(false);
    setSearchQuery("");
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
  };

  const handleClearSelection = () => {
    onDoctorChange(null, "");
  };

  // Si on affiche le formulaire d'ajout
  if (showAddForm) {
    return (
      <AddDoctorForm
        onDoctorAdded={handleDoctorAdded}
        onCancel={handleCancelAddForm}
        initialSearchQuery={searchQuery}
      />
    );
  }

  // Si un médecin est sélectionné, afficher la carte
  if (selectedDoctorText) {
    return (
      <SelectedDoctorCard
        doctorText={selectedDoctorText}
        doctorId={selectedDoctorId}
        onClear={handleClearSelection}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <DoctorSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowAddForm(true)}
          title="Ajouter un nouveau médecin"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Bouton de saisie manuelle si du texte est saisi */}
      {searchQuery.trim() && searchResults.length === 0 && suggestions.length === 0 && !isSearching && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Aucun médecin trouvé pour "{searchQuery}"
              </p>
              <p className="text-xs text-gray-500">
                Vous pouvez ajouter ce médecin à la base de données
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleManualSubmit}
              className="ml-3"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Ajouter "{searchQuery}"
            </Button>
          </div>
        </div>
      )}

      {/* Résultats unifiés */}
      <UnifiedSearchResults
        searchResults={searchResults}
        suggestions={suggestions}
        officialResults={officialResults}
        isSearching={isSearching}
        isOfficialSearching={isOfficialSearching}
        searchQuery={searchQuery}
        onSelectDoctor={handleDoctorSelect}
        onAddDoctor={handleSuggestionAdd}
        onOfficialSearch={performOfficialSearch}
      />
    </div>
  );
};

export default DoctorSelector;
