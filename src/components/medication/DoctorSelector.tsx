
import { DoctorSearchInput } from "./doctor-selector/DoctorSearchInput";
import { DoctorSearchResults } from "./doctor-selector/DoctorSearchResults";
import { DoctorSuggestions } from "./doctor-selector/DoctorSuggestions";
import { SelectedDoctorCard } from "./doctor-selector/SelectedDoctorCard";
import { ManualDoctorInput } from "./doctor-selector/ManualDoctorInput";
import { UnifiedSearchResults } from "./doctor-selector/UnifiedSearchResults";
import { useDoctorSearch } from "./doctor-selector/useDoctorSearch";
import { Doctor } from "@/lib/supabase-doctors-service";

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

  const handleManualDoctorSubmit = (doctorName: string) => {
    onDoctorChange(null, doctorName);
    clearSearch();
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

      {/* Saisie manuelle */}
      <ManualDoctorInput onSubmit={handleManualDoctorSubmit} />
    </div>
  );
};

export default DoctorSelector;
