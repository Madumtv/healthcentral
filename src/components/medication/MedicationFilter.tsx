
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";

interface MedicationFilterProps {
  searchTerm: string;
  selectedDoctorId: string;
  onSearchChange: (term: string) => void;
  onDoctorChange: (doctorId: string) => void;
  onClearFilters: () => void;
}

export const MedicationFilter = ({
  searchTerm,
  selectedDoctorId,
  onSearchChange,
  onDoctorChange,
  onClearFilters
}: MedicationFilterProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoadingDoctors(true);
      const results = await supabaseDoctorsService.search("");
      setDoctors(results);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const hasActiveFilters = searchTerm || selectedDoctorId;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Filtres</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Recherche générale</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Nom du médicament, description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor">Médecin prescripteur</Label>
          <Select value={selectedDoctorId} onValueChange={onDoctorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les médecins" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les médecins</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  Dr {doctor.first_name} {doctor.last_name}
                  {doctor.specialty && ` (${doctor.specialty})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MedicationFilter;
