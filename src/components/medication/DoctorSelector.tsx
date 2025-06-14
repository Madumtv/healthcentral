
import { DoctorSearchInput } from "./doctor-selector/DoctorSearchInput";
import { SelectedDoctorCard } from "./doctor-selector/SelectedDoctorCard";
import { UnifiedSearchResults } from "./doctor-selector/UnifiedSearchResults";
import { useDoctorSearch } from "./doctor-selector/useDoctorSearch";
import { Doctor } from "@/lib/supabase-doctors-service";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

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
      onDoctorChange(null, searchQuery.trim());
      clearSearch();
    }
  };

  const handleClearSelection = () => {
    onDoctorChange(null, "");
  };

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
      <DoctorSearchInput
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Bouton de saisie manuelle si du texte est saisi */}
      {searchQuery.trim() && searchResults.length === 0 && suggestions.length === 0 && !isSearching && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Aucun médecin trouvé pour "{searchQuery}"
              </p>
              <p className="text-xs text-gray-500">
                Vous pouvez saisir manuellement ce médecin
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleManualSubmit}
              className="ml-3"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              Utiliser "{searchQuery}"
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
