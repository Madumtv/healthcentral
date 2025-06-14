
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Database, ExternalLink, Plus, MapPin, Phone, User } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";

interface UnifiedSearchResultsProps {
  searchResults: Doctor[];
  suggestions: Doctor[];
  officialResults: Doctor[];
  isSearching: boolean;
  isOfficialSearching: boolean;
  searchQuery: string;
  onSelectDoctor: (doctor: Doctor) => void;
  onAddDoctor: (doctor: Doctor) => void;
  onOfficialSearch: () => void;
}

export const UnifiedSearchResults = ({
  searchResults,
  suggestions,
  officialResults,
  isSearching,
  isOfficialSearching,
  searchQuery,
  onSelectDoctor,
  onAddDoctor,
  onOfficialSearch
}: UnifiedSearchResultsProps) => {
  
  const getExternalLink = (doctor: Doctor): string | null => {
    if (!doctor.source) return null;
    
    const firstName = doctor.first_name.toLowerCase();
    const lastName = doctor.last_name.toLowerCase();
    
    if (doctor.source.includes('ordomedic')) {
      return `https://www.ordomedic.be/fr/medecins/${firstName}-${lastName}`;
    }
    
    if (doctor.source.includes('Doctoralia')) {
      return `https://www.doctoralia.be/medecin/${firstName}-${lastName}`;
    }
    
    if (doctor.source.includes('DoctorAnytime')) {
      return `https://www.doctoranytime.be/fr/medecin/${firstName}-${lastName}`;
    }
    
    return null;
  };
  
  const renderDoctorCard = (doctor: Doctor, onAction: (doctor: Doctor) => void, actionLabel: string, cardColor: string) => (
    <div
      key={doctor.id}
      className={`flex items-center justify-between p-3 bg-white rounded-lg border ${cardColor}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-gray-600" />
          <h4 className="font-medium text-gray-900">
            Dr {doctor.first_name} {doctor.last_name}
          </h4>
          {doctor.specialty && (
            <Badge variant="secondary" className="text-xs">
              {doctor.specialty}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-1">
          {doctor.city && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{doctor.city}</span>
            </div>
          )}
          {doctor.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{doctor.phone}</span>
            </div>
          )}
        </div>

        {doctor.address && (
          <div className="flex items-start gap-1 text-xs text-gray-600 mb-2">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{doctor.address}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {doctor.source || 'Base locale'}
          </Badge>

          {(() => {
            const externalLink = getExternalLink(doctor);
            if (externalLink) {
              return (
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Voir la source
                </a>
              );
            }
            return null;
          })()}
        </div>
      </div>
      
      <Button
        size="sm"
        onClick={() => onAction(doctor)}
        className="ml-3"
      >
        {actionLabel === 'Sélectionner' ? (
          <User className="h-3 w-3 mr-1" />
        ) : (
          <Plus className="h-3 w-3 mr-1" />
        )}
        {actionLabel}
      </Button>
    </div>
  );

  if (isSearching) {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Recherche en cours...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Résultats de recherche locale/externe */}
      {searchResults.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <Database className="h-4 w-4" />
              Médecins trouvés ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.map((doctor) => 
              renderDoctorCard(doctor, onSelectDoctor, "Sélectionner", "border-green-200")
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggestions de médecins externes */}
      {suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <ExternalLink className="h-4 w-4" />
              Suggestions de sites médicaux ({suggestions.length})
            </CardTitle>
            <p className="text-xs text-blue-600">
              Ces médecins ont été trouvés sur les sites médicaux belges
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((doctor) => 
              renderDoctorCard(doctor, onAddDoctor, "Ajouter", "border-blue-200")
            )}
          </CardContent>
        </Card>
      )}

      {/* Message informatif si aucun résultat */}
      {searchQuery.length >= 3 && searchResults.length === 0 && suggestions.length === 0 && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-4">
            <div className="text-center py-4">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                Aucun médecin trouvé pour "{searchQuery}"
              </p>
              <p className="text-xs text-gray-500">
                Essayez avec un nom différent ou utilisez la saisie manuelle
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
