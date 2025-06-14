
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DoctorSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DoctorSearchInput = ({ value, onChange }: DoctorSearchInputProps) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher un médecin (nom, prénom, spécialité)..."
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      
      <p className="text-xs text-gray-500">
        Tapez au moins 2 caractères pour rechercher dans la base de données belge
      </p>
    </div>
  );
};
