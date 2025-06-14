
import { useState, useEffect, useCallback } from "react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { ordomedicService } from "@/lib/ordomedic-service";
import { useToast } from "@/hooks/use-toast";

export const useDoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { toast } = useToast();

  // Fonction de recherche mémorisée pour éviter les re-créations
  const performSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setSearchResults([]);
      setSuggestions([]);
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
      console.log(`🔍 Recherche hybride pour: "${trimmedQuery}"`);
      
      // Utiliser le service hybride qui gère local + suggestions
      const searchResponse = await ordomedicService.searchDoctors(trimmedQuery);
      
      console.log(`📋 Résultats reçus: ${searchResponse.doctors.length} médecins, ${searchResponse.suggestions.length} suggestions`);
      
      setSearchResults(searchResponse.doctors);
      setSuggestions(searchResponse.suggestions);
      
      if (searchResponse.doctors.length === 0 && searchResponse.suggestions.length === 0) {
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
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [lastSearchQuery, searchResults.length, toast]);

  // Fonction pour ajouter un médecin suggéré
  const addSuggestedDoctor = useCallback(async (doctor: Doctor): Promise<Doctor | null> => {
    try {
      const addedDoctor = await ordomedicService.addSuggestedDoctor(doctor);
      
      if (addedDoctor) {
        toast({
          title: "Médecin ajouté",
          description: `Dr ${doctor.first_name} ${doctor.last_name} a été ajouté à la base de données.`,
        });
        
        // Retirer de la liste des suggestions
        setSuggestions(prev => prev.filter(s => s.id !== doctor.id));
        
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
  }, [toast]);

  // Recherche avec debounce - plus réactif
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2 && searchQuery !== lastSearchQuery) {
        performSearch(searchQuery);
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
        setSuggestions([]);
        setIsSearching(false);
        setLastSearchQuery("");
      }
    }, 300); // Délai un peu plus long pour les suggestions

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSuggestions([]);
    setLastSearchQuery("");
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    clearSearch,
    addSuggestedDoctor
  };
};
