
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Plus, Loader2 } from "lucide-react";
import { vidalApi, VidalMedicamentInfo } from "@/lib/vidal-api";
import { MedicamentInfo } from "@/lib/medicaments-api";
import { useToast } from "@/hooks/use-toast";

interface VidalSearchProps {
  onMedicamentSelect: (medicament: MedicamentInfo & { dosage?: string }) => void;
}

export const VidalSearch = ({ onMedicamentSelect }: VidalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [vidalResults, setVidalResults] = useState<VidalMedicamentInfo[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      toast({
        title: "Recherche insuffisante",
        description: "Veuillez saisir au moins 2 caractères pour la recherche Vidal.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log(`🇫🇷 Lancement recherche Vidal pour: "${searchQuery}"`);

    try {
      const results = await vidalApi.searchMedicaments(searchQuery);
      setVidalResults(results);
      
      toast({
        title: "Recherche terminée",
        description: `${results.length} médicament(s) trouvé(s) sur Vidal.fr.`,
      });

    } catch (error) {
      console.error('❌ Erreur recherche Vidal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la recherche sur Vidal.fr.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedicament = (vidalData: VidalMedicamentInfo) => {
    const medicamentInfo = vidalApi.convertToMedicamentInfo(vidalData);
    onMedicamentSelect({
      ...medicamentInfo,
      dosage: vidalData.dosage
    });

    toast({
      title: "Médicament sélectionné",
      description: `${vidalData.name} a été ajouté depuis Vidal.fr.`,
    });

    // Réinitialiser la recherche
    setSearchQuery("");
    setVidalResults([]);
  };

  return (
    <div className="space-y-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
            <span className="text-lg">🇫🇷</span>
            Recherche Vidal.fr (France)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-blue-600">
            Rechercher dans la base de données française Vidal - médicaments disponibles en France
          </p>
          
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: Doliprane, Advil, Metformine..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery || searchQuery.length < 2}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              {isSearching ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : (
                <Search className="h-3 w-3 mr-2" />
              )}
              {isSearching ? "Recherche..." : "Rechercher"}
            </Button>
          </div>

          {vidalResults.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium text-sm text-blue-700">
                Résultats Vidal.fr ({vidalResults.length}) :
              </h4>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {vidalResults.map((medicament) => (
                  <div
                    key={medicament.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-gray-900">
                          {medicament.name}
                        </h5>
                        <Badge variant="secondary" className="text-xs">
                          {medicament.classification}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">{medicament.laboratoire}</span>
                          {medicament.prix && <span> • {medicament.prix}</span>}
                        </div>
                        <div className="text-blue-600">
                          {medicament.composition}
                        </div>
                        {medicament.indications && (
                          <div className="text-gray-500">
                            {medicament.indications}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs bg-blue-100">
                          <ExternalLink className="h-2 w-2 mr-1" />
                          Vidal.fr
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleSelectMedicament(medicament)}
                      className="ml-3 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
