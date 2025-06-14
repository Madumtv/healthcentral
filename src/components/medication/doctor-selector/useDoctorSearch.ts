
import { useState, useEffect, useCallback } from "react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { useToast } from "@/hooks/use-toast";

export const useDoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { toast } = useToast();

  // Fonction de recherche mémorisée pour éviter les re-créations
  const performSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Éviter les recherches dupliquées
    if (trimmedQuery === lastSearchQuery && searchResults.length > 0) {
      return;
    }

    setIsSearching(true);
    setLastSearchQuery(trimmedQuery);
    
    try {
      console.log(`🔍 Recherche pour: "${trimmedQuery}"`);
      const results = await supabaseDoctorsService.search(trimmedQuery);
      console.log(`📋 Résultats reçus: ${results.length} médecins`);
      
      // Vérifier que le composant est toujours monté avant de mettre à jour l'état
      setSearchResults(results);
      
      if (results.length === 0) {
        console.log(`⚠️ Aucun résultat pour "${trimmedQuery}"`);
      }
    } catch (error) {
      console.error('❌ Erreur de recherche:', error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de rechercher les médecins. Veuillez réessayer.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [lastSearchQuery, searchResults.length, toast]);

  // Recherche avec debounce - plus réactif
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2 && searchQuery !== lastSearchQuery) {
        performSearch(searchQuery);
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        setLastSearchQuery("");
      }
    }, 100); // Encore plus réactif

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setLastSearchQuery("");
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch
  };
};
