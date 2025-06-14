
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

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
    console.log(`🌐 Recherche officielle désactivée - génération automatique supprimée`);

    try {
      // Plus de génération automatique - retourner un tableau vide
      const results: any[] = [];
      setOfficialResults(results);
      
      toast({
        title: "Recherche terminée",
        description: "La recherche officielle automatique a été désactivée. Seuls les vrais résultats de la base de données sont affichés.",
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
