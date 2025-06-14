
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, MapPin, Phone } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { useToast } from "@/components/ui/use-toast";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualDoctorText, setManualDoctorText] = useState(prescribingDoctorText || "");
  const { toast } = useToast();

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

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const results = await supabaseDoctorsService.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les médecins.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    const doctorText = `Dr ${doctor.first_name} ${doctor.last_name}${doctor.specialty ? ` (${doctor.specialty})` : ''}`;
    onDoctorSelect(doctor.id, doctorText);
    setSearchQuery("");
    setSearchResults([]);
    setShowManualInput(false);
  };

  const handleManualInput = () => {
    setSelectedDoctor(null);
    onDoctorSelect(null, manualDoctorText);
    setShowManualInput(false);
  };

  const handleClearSelection = () => {
    setSelectedDoctor(null);
    setManualDoctorText("");
    onDoctorSelect(null, "");
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
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-sm"
        >
          {showManualInput ? "Recherche officielle" : "Saisie manuelle"}
        </Button>
      </div>

      {/* Selected doctor display */}
      {selectedDoctor && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    Dr {selectedDoctor.first_name} {selectedDoctor.last_name}
                  </span>
                </div>
                {selectedDoctor.specialty && (
                  <Badge variant="outline" className="text-xs">
                    {selectedDoctor.specialty}
                  </Badge>
                )}
                {selectedDoctor.city && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {selectedDoctor.city}
                  </div>
                )}
                {selectedDoctor.inami_number && (
                  <p className="text-xs text-gray-500">INAMI: {selectedDoctor.inami_number}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
              >
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual input mode */}
      {showManualInput && !selectedDoctor && (
        <div className="space-y-2">
          <Input
            value={manualDoctorText}
            onChange={(e) => setManualDoctorText(e.target.value)}
            placeholder="Ex: Dr Martin Dubois"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleManualInput}
            disabled={!manualDoctorText.trim()}
          >
            Confirmer
          </Button>
        </div>
      )}

      {/* Search mode */}
      {!showManualInput && !selectedDoctor && (
        <div className="space-y-2">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un médecin (nom, prénom, spécialité)..."
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          
          <p className="text-xs text-gray-500">
            Tapez au moins 2 caractères pour rechercher dans la base de données belge
          </p>
        </div>
      )}

      {/* Search results */}
      {searchResults.length > 0 && !selectedDoctor && (
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium mb-3">Médecins trouvés</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {searchResults.map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectDoctor(doctor)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-sm">
                        Dr {doctor.first_name} {doctor.last_name}
                      </h5>
                      {doctor.specialty && (
                        <Badge variant="outline" className="text-xs">
                          {doctor.specialty}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      {doctor.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {doctor.city}
                        </div>
                      )}
                      {doctor.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {doctor.phone}
                        </div>
                      )}
                    </div>
                    
                    {doctor.inami_number && (
                      <p className="text-xs text-gray-500">INAMI: {doctor.inami_number}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isSearching && (
        <p className="text-sm text-gray-500">Recherche en cours...</p>
      )}
    </div>
  );
};

export default DoctorSelector;
