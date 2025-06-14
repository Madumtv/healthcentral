
import { useState, useEffect, useCallback } from "react";
import { Doctor } from "@/lib/supabase-doctors-service";
import { ordomedicService } from "@/lib/ordomedic-service";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedSearch } from "./useUnifiedSearch";
import { useOfficialSearch } from "./useOfficialSearch";
import { validateSearchQuery } from "./doctorSearchHelpers";
import { DoctorSearchHook } from "./doctorSearchTypes";

export const useDoctorSearch = (): DoctorSearchHook => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const {
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
  } = useUnifiedSearch();

  const { isOfficialSearching, performOfficialSearch: performOfficialSearchBase } = useOfficialSearch();

  // Ajouter un médecin suggéré
  const addSuggestedDoctor = useCallback(async (doctor: Doctor): Promise<Doctor | null> => {
    try {
      const addedDoctor = await ordomedicService.addSuggestedDoctor(doctor);
      
      if (addedDoctor) {
        toast({
          title: "Médecin ajouté",
          description: `Dr ${doctor.first_name} ${doctor.last_name} a été ajouté à la base de données.`,
        });
        
        // Retirer de toutes les listes de suggestions
        setSuggestions(prev => prev.filter(s => s.id !== doctor.id));
        setOfficialResults(prev => prev.filter(s => s.id !== doctor.id));
        
        // Ajouter aux résultats de recherche
        setSearchResults(prev => [addedDoctor, ...prev]);
        
        return addedDoctor;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le médecin. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    }
  }, [toast, setSuggestions, setOfficialResults, setSearchResults]);

  const performOfficialSearch = useCallback(async () => {
    await performOfficialSearchBase(searchQuery, setOfficialResults);
  }, [searchQuery, performOfficialSearchBase, setOfficialResults]);

  // Recherche automatique avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (validateSearchQuery(searchQuery) && searchQuery !== lastSearchQuery) {
        performUnifiedSearch(searchQuery);
      } else if (!validateSearchQuery(searchQuery)) {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery, performUnifiedSearch, clearResults]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    clearResults();
  }, [clearResults]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    officialResults,
    isSearching,
    isOfficialSearching,
    lastSearchQuery,
    clearSearch,
    addSuggestedDoctor,
    performOfficialSearch
  };
};
