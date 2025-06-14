
import { Doctor } from "@/lib/supabase-doctors-service";

export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length >= 2;
};

export const shouldPerformAutoSearch = (
  searchResults: Doctor[], 
  suggestions: Doctor[], 
  query: string
): boolean => {
  // Ne plus déclencher de recherche automatique fictive
  return false;
};
