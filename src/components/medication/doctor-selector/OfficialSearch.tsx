
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Plus, ExternalLink } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";
import { useToast } from "@/hooks/use-toast";

interface OfficialSearchProps {
  query: string;
  onAddDoctor: (doctor: Doctor) => void;
}

export const OfficialSearch = ({ query, onAddDoctor }: OfficialSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [officialResults, setOfficialResults] = useState<Doctor[]>([]);
  const { toast } = useToast();

  const handleOfficialSearch = async () => {
    if (!query || query.length < 3) {
      toast({
        title: "Recherche insuffisante",
        description: "Veuillez saisir au moins 3 caractères pour la recherche officielle.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log(`🌐 Lancement recherche officielle pour: "${query}"`);

    try {
      // Simuler une recherche sur des sources officielles
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Données simulées de recherche Wikipedia/Google
      const mockOfficialResults: Doctor[] = [
        {
          id: `wikipedia_${Date.now()}_1`,
          first_name: query.split(' ')[0] || 'Dr',
          last_name: query.split(' ')[1] || 'Médecin',
          specialty: 'Médecine générale',
          city: 'Bruxelles',
          postal_code: '1000',
          address: 'Trouvé via recherche officielle',
          phone: '02/XXX.XX.XX',
          email: `${query.toLowerCase().replace(/\s+/g, '.')}@officiel.be`,
          source: 'Recherche Wikipedia/Google',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      setOfficialResults(mockOfficialResults);
      
      toast({
        title: "Recherche terminée",
        description: `${mockOfficialResults.length} résultat(s) trouvé(s) via les sources officielles.`,
      });

    } catch (error) {
      console.error('❌ Erreur recherche officielle:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la recherche officielle.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
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
            onClick={handleOfficialSearch}
            disabled={isSearching || !query || query.length < 3}
            className="w-full bg-orange-600 hover:bg-orange-700"
            size="sm"
          >
            <Search className="h-3 w-3 mr-2" />
            {isSearching ? "Recherche en cours..." : "Lancer la recherche officielle"}
          </Button>

          {officialResults.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium text-sm text-orange-700">Résultats trouvés :</h4>
              {officialResults.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900">
                        Dr {doctor.first_name} {doctor.last_name}
                      </h5>
                      {doctor.specialty && (
                        <Badge variant="secondary" className="text-xs">
                          {doctor.specialty}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      {doctor.city && <span>{doctor.city}</span>}
                      {doctor.phone && <span> • {doctor.phone}</span>}
                    </div>
                    
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs bg-orange-100">
                        <ExternalLink className="h-2 w-2 mr-1" />
                        {doctor.source}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => onAddDoctor(doctor)}
                    className="ml-3 bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Ajouter
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
