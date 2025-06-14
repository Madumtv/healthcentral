
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Database, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  MapPin
} from "lucide-react";
import { hybridMedicationSearch, HybridSearchResult } from "@/lib/hybrid-medication-search";
import { useToast } from "@/components/ui/use-toast";
import { MedicamentInfo } from "@/lib/medicaments-api";

interface HybridMedicationSearchProps {
  onMedicamentSelect: (medicament: MedicamentInfo & { dosage?: string }) => void;
  className?: string;
}

export const HybridMedicationSearch = ({ 
  onMedicamentSelect, 
  className = "" 
}: HybridMedicationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HybridSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState<HybridSearchResult | null>(null);
  const { toast } = useToast();

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    
    try {
      const results = await hybridMedicationSearch.searchMedications(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun médicament trouvé pour cette recherche.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche hybride:", error);
      
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedicament = async (result: HybridSearchResult) => {
    setSelectedMedicament(result);
    
    try {
      if (result.type === 'local' && result.medication) {
        // Médicament existant - pré-remplir avec les données locales
        onMedicamentSelect({
          cnk: result.id,
          name: result.medication.name,
          company: result.medication.prescribingDoctor || 'Non spécifié',
          category: result.medication.dosage,
          atc: '',
          deliveryStatus: 'Disponible',
          prescriptionType: 'Variable',
          packSize: 'Variable',
          dosage: result.medication.dosage
        });
      } else if (result.medicamentInfo) {
        // Médicament externe - utiliser les données de l'API/site
        const details = await hybridMedicationSearch.getMedicationDetails(result);
        
        onMedicamentSelect({
          ...result.medicamentInfo,
          dosage: result.dosage || result.medicamentInfo.category
        });
      }

      toast({
        title: "Médicament sélectionné",
        description: `${result.name} a été ajouté au formulaire.`,
      });

      // Réinitialiser la recherche
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du médicament.",
        variant: "destructive",
      });
    }
  };

  const getSourceIcon = (source: string) => {
    if (source === 'Mes médicaments') return <Database className="h-4 w-4 text-blue-600" />;
    if (source === 'Pharmacie.be') return <ExternalLink className="h-4 w-4 text-green-600" />;
    return <MapPin className="h-4 w-4 text-purple-600" />;
  };

  const getSourceBadgeVariant = (type: string) => {
    if (type === 'local') return "default";
    return "secondary";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="hybrid-search" className="flex items-center gap-1.5">
          <Search className="h-4 w-4 text-medBlue" />
          Recherche hybride de médicaments
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="hybrid-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans vos médicaments et la base officielle..."
              className="pr-12"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Button 
            type="button" 
            onClick={handleSearch}
            disabled={isSearching || searchQuery.length < 2}
            size="sm"
            className="shrink-0"
          >
            {isSearching ? "..." : "Rechercher"}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span>Mes médicaments</span>
          </div>
          <div className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <span>Pharmacie.be</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Base officielle AFMPS</span>
          </div>
        </div>
      </div>

      {/* Médicament sélectionné */}
      {selectedMedicament && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Médicament sélectionné</span>
                </div>
                <p className="text-sm font-medium">{selectedMedicament.name}</p>
                <div className="flex items-center gap-2">
                  {getSourceIcon(selectedMedicament.source)}
                  <span className="text-xs text-gray-600">{selectedMedicament.source}</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMedicament(null)}
              >
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats de recherche */}
      {searchResults.length > 0 && !selectedMedicament && (
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium mb-3">
              Résultats de recherche ({searchResults.length})
            </h4>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectMedicament(result)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm leading-tight">
                          {result.name}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">
                          {result.dosage && `${result.dosage} • `}
                          {result.description || result.company}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <Badge 
                          variant={getSourceBadgeVariant(result.type)}
                          className="text-xs flex items-center gap-1"
                        >
                          {getSourceIcon(result.source)}
                          {result.source}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        {result.type === 'local' ? (
                          <p className="text-blue-600">
                            Déjà dans vos médicaments
                          </p>
                        ) : (
                          <p className="text-gray-500">
                            {result.company && `${result.company} • `}
                            {result.category}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-xs h-6"
                      >
                        Sélectionner
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length === 0 && searchQuery.length >= 2 && !isSearching && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Aucun résultat trouvé pour "{searchQuery}"
              </span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Essayez avec un autre terme ou utilisez la saisie manuelle ci-dessous.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HybridMedicationSearch;
