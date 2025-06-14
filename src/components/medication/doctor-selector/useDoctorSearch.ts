
import { useState, useEffect } from "react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { useToast } from "@/components/ui/use-toast";

export const useDoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { toast } = useToast();

  // Search with debounce - réduit le délai pour plus de réactivité
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2 && searchQuery !== lastSearchQuery) {
        handleSearch();
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 150); // Réduit de 300ms à 150ms pour plus de réactivité

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery]);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();
    
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
      console.log(`🔍 Recherche adaptative: "${trimmedQuery}"`);
      const results = await supabaseDoctorsService.search(trimmedQuery);
      console.log(`📋 Résultats reçus: ${results.length} médecins`);
      
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
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setLastSearchQuery("");
    setIsSearching(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch
  };
};
