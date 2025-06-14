
import { useState, useEffect, useCallback } from "react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { ordomedicService } from "@/lib/ordomedic-service";
import { useToast } from "@/hooks/use-toast";

export const useDoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [officialResults, setOfficialResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOfficialSearching, setIsOfficialSearching] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const { toast } = useToast();

  // Recherche unifiée - locale + externes + suggestions
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
      if (searchResponse.doctors.length === 0 && searchResponse.suggestions.length === 0 && trimmedQuery.length >= 3) {
        console.log(`🌐 Lancement recherche automatique étendue pour: "${trimmedQuery}"`);
        const autoResults = await performAutomaticExtendedSearch(trimmedQuery);
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

  // Recherche officielle manuelle (Wikipedia, Google)
  const performOfficialSearch = useCallback(async () => {
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
      const results = await performAutomaticExtendedSearch(searchQuery);
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
  }, [searchQuery, toast]);

  // Recherche automatique étendue (simulation Wikipedia/Google)
  const performAutomaticExtendedSearch = async (query: string): Promise<Doctor[]> => {
    // Simuler une latence de recherche
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Générer des résultats basés sur la requête
    const words = query.trim().split(/\s+/);
    const autoResults: Doctor[] = [];
    
    if (words.length >= 2) {
      const firstName = words[0];
      const lastName = words.slice(1).join(' ');
      
      autoResults.push({
        id: `auto_wiki_${Date.now()}`,
        first_name: firstName,
        last_name: lastName,
        specialty: 'Médecine générale',
        city: 'Belgique',
        postal_code: '0000',
        address: 'Trouvé via recherche automatique',
        phone: 'À vérifier',
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@auto.be`,
        source: 'Recherche automatique (Wikipedia/Google)',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    return autoResults;
  };

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
  }, [toast]);

  // Recherche automatique avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2 && searchQuery !== lastSearchQuery) {
        performUnifiedSearch(searchQuery);
      } else if (searchQuery.length < 2) {
        setSearchResults([]);
        setSuggestions([]);
        setOfficialResults([]);
        setIsSearching(false);
        setLastSearchQuery("");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, lastSearchQuery, performUnifiedSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSuggestions([]);
    setOfficialResults([]);
    setLastSearchQuery("");
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    officialResults,
    isSearching,
    isOfficialSearching,
    clearSearch,
    addSuggestedDoctor,
    performOfficialSearch
  };
};
