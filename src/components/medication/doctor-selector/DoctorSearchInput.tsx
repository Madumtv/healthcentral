
import { Input } from "@/components/ui/input";
import { Search, Database, Globe, Zap } from "lucide-react";

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
          placeholder="Rechercher un médecin (nom, prénom, spécialité, ville)..."
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
          <Database className="h-3 w-3" />
          <span>
            🏥 Base de données enrichie de médecins belges
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
          <Globe className="h-3 w-3" />
          <span>
            🌐 Recherche en temps réel sur les sites médicaux
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
          <Zap className="h-3 w-3" />
          <span>
            ⚡ Recherche automatique étendue (Wikipedia, Google) si aucun résultat
          </span>
        </div>
      </div>
    </div>
  );
};
