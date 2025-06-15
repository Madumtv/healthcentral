
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DoctorsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const DoctorsSearchBar = ({ searchTerm, onSearchChange }: DoctorsSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Rechercher un médecin par nom, spécialité, ville ou numéro INAMI..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
