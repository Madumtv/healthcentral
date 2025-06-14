
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateAutomaticSearchResults } from "./doctorSearchHelpers";

export const useOfficialSearch = () => {
  const [isOfficialSearching, setIsOfficialSearching] = useState(false);
  const { toast } = useToast();

  const performOfficialSearch = useCallback(async (searchQuery: string, setOfficialResults: (results: any[]) => void) => {
    if (!searchQuery || searchQuery.length < 3) {
      toast({
        title: "Recherche insuffisante",
        description: "Veuillez saisir au moins 3 caractères pour la recherche officielle.",
        variant: "destructive",
      });
      return;
    }

    setIsOfficialSearching(true);
    console.log(`🌐 Lancement recherche officielle manuelle pour: "${searchQuery}"`);

    try {
      const results = await generateAutomaticSearchResults(searchQuery);
      setOfficialResults(results);
      
      toast({
        title: "Recherche terminée",
        description: `${results.length} résultat(s) trouvé(s) via les sources officielles.`,
      });

    } catch (error) {
      console.error('❌ Erreur recherche officielle:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la recherche officielle.",
        variant: "destructive",
      });
    } finally {
      setIsOfficialSearching(false);
    }
  }, [toast]);

  return {
    isOfficialSearching,
    performOfficialSearch
  };
};
