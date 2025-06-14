
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { useDoctorSearch } from "./doctor-selector/useDoctorSearch";
import { SelectedDoctorCard } from "./doctor-selector/SelectedDoctorCard";
import { DoctorSearchResults } from "./doctor-selector/DoctorSearchResults";
import { ManualDoctorInput } from "./doctor-selector/ManualDoctorInput";
import { DoctorSearchInput } from "./doctor-selector/DoctorSearchInput";

interface DoctorSelectorProps {
  selectedDoctorId?: string;
  prescribingDoctorText?: string;
  onDoctorSelect: (doctorId: string | null, doctorText: string) => void;
  className?: string;
}

export const DoctorSelector = ({ 
  selectedDoctorId, 
  prescribingDoctorText,
  onDoctorSelect, 
  className = "" 
}: DoctorSelectorProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch
  } = useDoctorSearch();

  // Load selected doctor on mount
  useEffect(() => {
    if (selectedDoctorId) {
      supabaseDoctorsService.getById(selectedDoctorId)
        .then(doctor => {
          if (doctor) {
            setSelectedDoctor(doctor);
          }
        })
        .catch(console.error);
    }
  }, [selectedDoctorId]);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    const doctorText = `Dr ${doctor.first_name} ${doctor.last_name}${doctor.specialty ? ` (${doctor.specialty})` : ''}`;
    onDoctorSelect(doctor.id, doctorText);
    clearSearch();
    setShowManualInput(false);
  };

  const handleManualInput = (doctorText: string) => {
    setSelectedDoctor(null);
    onDoctorSelect(null, doctorText);
    setShowManualInput(false);
  };

  const handleClearSelection = () => {
    setSelectedDoctor(null);
    onDoctorSelect(null, "");
  };

  const toggleInputMode = () => {
    setShowManualInput(!showManualInput);
    clearSearch();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <User className="h-4 w-4 text-medBlue" />
          Médecin prescripteur
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleInputMode}
          className="text-sm"
        >
          {showManualInput ? "Recherche officielle" : "Saisie manuelle"}
        </Button>
      </div>

      {selectedDoctor && (
        <SelectedDoctorCard 
          doctor={selectedDoctor} 
          onClear={handleClearSelection} 
        />
      )}

      {showManualInput && !selectedDoctor && (
        <ManualDoctorInput
          initialValue={prescribingDoctorText}
          onConfirm={handleManualInput}
        />
      )}

      {!showManualInput && !selectedDoctor && (
        <DoctorSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
        />
      )}

      <DoctorSearchResults
        doctors={searchResults}
        onSelectDoctor={handleSelectDoctor}
      />

      {isSearching && (
        <p className="text-sm text-gray-500">Recherche en cours...</p>
      )}
    </div>
  );
};

export default DoctorSelector;
