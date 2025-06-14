
import { useState, useEffect } from "react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { useToast } from "@/components/ui/use-toast";

export const useDoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const results = await supabaseDoctorsService.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les médecins.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    clearSearch
  };
};
