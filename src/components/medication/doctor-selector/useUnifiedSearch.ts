
import { useState, useCallback } from "react";
import { Doctor } from "@/lib/supabase-doctors-service";
import { ordomedicService } from "@/lib/ordomedic-service";
import { useToast } from "@/hooks/use-toast";
import { generateAutomaticSearchResults, shouldPerformAutoSearch } from "./doctorSearchHelpers";

export const useUnifiedSearch = () => {
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [officialResults, setOfficialResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { toast } = useToast();

  const performUnifiedSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setSearchResults([]);
      setSuggestions([]);
      setOfficialResults([]);
      setIsSearching(false);
      return;
    }

    if (trimmedQuery === lastSearchQuery && searchResults.length > 0) {
      return;
    }

    setIsSearching(true);
    setLastSearchQuery(trimmedQuery);
    
    try {
      console.log(`🔍 Recherche unifiée pour: "${trimmedQuery}"`);
      
      // Recherche hybride via ordomedic service
      const searchResponse = await ordomedicService.searchDoctors(trimmedQuery);
      
      console.log(`📋 Résultats unifiés: ${searchResponse.doctors.length} médecins, ${searchResponse.suggestions.length} suggestions`);
      
      setSearchResults(searchResponse.doctors);
      setSuggestions(searchResponse.suggestions);
      
      // Si aucun résultat et requête >= 3 caractères, recherche automatique étendue
      if (shouldPerformAutoSearch(searchResponse.doctors, searchResponse.suggestions, trimmedQuery)) {
        console.log(`🌐 Lancement recherche automatique étendue pour: "${trimmedQuery}"`);
        const autoResults = await generateAutomaticSearchResults(trimmedQuery);
        setOfficialResults(autoResults);
      } else {
        setOfficialResults([]);
      }
      
    } catch (error) {
      console.error('❌ Erreur de recherche unifiée:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de rechercher les médecins. Veuillez réessayer.",
        variant: "destructive",
      });
      setSearchResults([]);
      setSuggestions([]);
      setOfficialResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [lastSearchQuery, searchResults.length, toast]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSuggestions([]);
    setOfficialResults([]);
    setLastSearchQuery("");
    setIsSearching(false);
  }, []);

  return {
    searchResults,
    suggestions,
    officialResults,
    isSearching,
    lastSearchQuery,
    performUnifiedSearch,
    clearResults,
    setSearchResults,
    setSuggestions,
    setOfficialResults
  };
};
