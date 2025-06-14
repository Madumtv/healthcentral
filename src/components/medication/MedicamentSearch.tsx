
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Info, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { medicamentsApi, MedicamentInfo } from "@/lib/medicaments-api";
import { useToast } from "@/components/ui/use-toast";

interface MedicamentSearchProps {
  onMedicamentSelect: (medicament: MedicamentInfo & { dosage?: string }) => void;
  className?: string;
}

export const MedicamentSearch = ({ onMedicamentSelect, className = "" }: MedicamentSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedicamentInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState<MedicamentInfo | null>(null);
  const [apiError, setApiError] = useState(false);
  const { toast } = useToast();

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 3) {
        handleSearch();
      } else {
        setSearchResults([]);
        setApiError(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 3) return;

    setIsSearching(true);
    setApiError(false);
    
    try {
      const results = await medicamentsApi.searchMedicaments(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun médicament trouvé pour cette recherche.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de médicaments:", error);
      setApiError(true);
      setSearchResults([]);
      
      toast({
        title: "Service temporairement indisponible",
        description: "La recherche officielle de médicaments n'est pas disponible. Veuillez utiliser la saisie manuelle.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedicament = async (medicament: MedicamentInfo) => {
    setSelectedMedicament(medicament);
    
    try {
      // Récupérer la composition pour obtenir le dosage
      const composition = await medicamentsApi.getMedicamentComposition(medicament.cnk);
      const dosage = medicamentsApi.formatDosage(composition);
      
      onMedicamentSelect({
        ...medicament,
        dosage: dosage || medicament.category
      });

      toast({
        title: "Médicament sélectionné",
        description: `${medicament.name} a été ajouté au formulaire.`,
      });

      // Réinitialiser la recherche
      setSearchQuery("");
      setSearchResults([]);
      setApiError(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du médicament.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (statut: string) => {
    if (statut.includes("Disponible")) return "default";
    if (statut.includes("Retiré") || statut.includes("Suspendu")) return "destructive";
    return "secondary";
  };

  const getReimbursementBadgeVariant = (code: string) => {
    if (code === "A") return "default";
    if (code === "B") return "secondary";
    return "outline";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="medicament-search" className="flex items-center gap-1.5">
          <Search className="h-4 w-4 text-medBlue" />
          Rechercher un médicament officiel
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="medicament-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tapez le nom d'un médicament (min. 3 caractères)..."
              className="pr-12"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Button 
            type="button" 
            onClick={handleSearch}
            disabled={isSearching || searchQuery.length < 3}
            size="sm"
            className="shrink-0"
          >
            {isSearching ? "..." : "Rechercher"}
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Info className="h-3 w-3" />
          Données officielles de l'AFMPS (Agence fédérale des médicaments belges)
        </p>

        {/* Message d'erreur API */}
        {apiError && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div className="text-sm">
              <p className="text-orange-800 font-medium">Service temporairement indisponible</p>
              <p className="text-orange-700">La recherche officielle ne fonctionne pas actuellement. Veuillez utiliser la saisie manuelle ci-dessous.</p>
            </div>
          </div>
        )}
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
                <p className="text-xs text-gray-600">{selectedMedicament.company}</p>
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
            <h4 className="font-medium mb-3">Résultats de recherche</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {searchResults.map((medicament) => (
                <div
                  key={medicament.cnk}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSelectMedicament(medicament)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm leading-tight">
                          {medicament.name}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">
                          {medicament.company} • {medicament.category}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <Badge 
                          variant={getStatusBadgeVariant(medicament.deliveryStatus)}
                          className="text-xs"
                        >
                          {medicament.deliveryStatus}
                        </Badge>
                        {medicament.reimbursementCode && (
                          <Badge 
                            variant={getReimbursementBadgeVariant(medicament.reimbursementCode)}
                            className="text-xs"
                          >
                            Cat. {medicament.reimbursementCode}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        <p className="text-gray-500">CNK: {medicament.cnk}</p>
                        {medicament.publicPrice && (
                          <p className="text-gray-600">
                            Prix: {medicament.publicPrice}€
                            {medicament.reimbursementRate && ` (Remb. ${medicament.reimbursementRate})`}
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
    </div>
  );
};

export default MedicamentSearch;
