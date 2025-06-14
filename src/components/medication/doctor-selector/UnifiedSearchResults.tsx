import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Database, ExternalLink, Plus, MapPin, Phone, User, link } from "lucide-react";
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

        {/* Affichage de l'adresse complète si disponible */}
        {doctor.address && (
          <div className="flex items-start gap-1 text-xs text-gray-600 mb-1">
            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{doctor.address}</span>
            {doctor.postal_code && doctor.city && (
              <span>, {doctor.postal_code} {doctor.city}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {doctor.source || 'Base locale'}
          </Badge>

          {/* Lien externe si le docteur provient d'une source externe */}
          {doctor.source && doctor.source.includes('ordomedic.be') && (
            <a
              href={`https://www.ordomedic.be/fr/medecins/${doctor.first_name.toLowerCase()}-${doctor.last_name.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Voir sur ordomedic.be
            </a>
          )}

          {doctor.source && doctor.source.includes('Doctoralia') && (
            <a
              href={`https://www.doctoralia.be/medecin/${doctor.first_name.toLowerCase()}-${doctor.last_name.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Voir sur Doctoralia
            </a>
          )}

          {doctor.source && doctor.source.includes('DoctorAnytime') && (
            <a
              href={`https://www.doctoranytime.be/fr/medecin/${doctor.first_name.toLowerCase()}-${doctor.last_name.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Voir sur DoctorAnytime
            </a>
          )}
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

      {/* Recherche officielle étendue */}
      {searchQuery.length >= 3 && searchResults.length === 0 && suggestions.length === 0 && officialResults.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <Globe className="h-4 w-4" />
              Recherche officielle étendue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-orange-600">
              Rechercher sur Wikipedia, Google et autres sources officielles
            </p>
            
            <Button
              onClick={onOfficialSearch}
              disabled={isOfficialSearching}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              <Search className="h-3 w-3 mr-2" />
              {isOfficialSearching ? "Recherche en cours..." : "Lancer la recherche officielle"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Résultats de recherche officielle */}
      {officialResults.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <Globe className="h-4 w-4" />
              Résultats recherche officielle ({officialResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {officialResults.map((doctor) => 
              renderDoctorCard(doctor, onAddDoctor, "Ajouter", "border-orange-200")
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
