
import { Doctor } from "@/lib/supabase-doctors-service";

export interface DoctorSearchState {
  searchQuery: string;
  searchResults: Doctor[];
  suggestions: Doctor[];
  officialResults: Doctor[];
  isSearching: boolean;
  isOfficialSearching: boolean;
  lastSearchQuery: string;
}

export interface DoctorSearchActions {
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  addSuggestedDoctor: (doctor: Doctor) => Promise<Doctor | null>;
  performOfficialSearch: () => Promise<void>;
}

export type DoctorSearchHook = DoctorSearchState & DoctorSearchActions;
