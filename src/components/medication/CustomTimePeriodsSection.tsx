
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2, X } from "lucide-react";
import { TimeOfDay } from "@/types";
import { timeOfDayLabels } from "@/lib/constants";

interface CustomTimePeriodsSectionProps {
  selectedPeriods: TimeOfDay[];
  onChange: (periods: TimeOfDay[]) => void;
  className?: string;
  title?: string;
  placeholder?: string;
}

export const CustomTimePeriodsSection = ({
  selectedPeriods,
  onChange,
  className = "",
  title = "Périodes personnalisées",
  placeholder = "Exemple: Après déjeuner"
}: CustomTimePeriodsSectionProps) => {
  const [newPeriod, setNewPeriod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Les périodes par défaut qu'on ne peut pas supprimer
  const defaultPeriods = ["morning", "noon", "evening", "night"];
  
  // Convertir en période personnalisée valide (sans espaces, en minuscules)
  const formatPeriodKey = (input: string): string => {
    return input.trim().toLowerCase().replace(/\s+/g, '_');
  };
  
  const addCustomPeriod = () => {
    if (!newPeriod.trim()) {
      setErrorMessage("Veuillez entrer un nom pour la période");
      return;
    }
    
    const formattedKey = formatPeriodKey(newPeriod);
    
    // Vérifier si cette période existe déjà
    if (Object.keys(timeOfDayLabels).includes(formattedKey)) {
      setErrorMessage("Cette période existe déjà");
      return;
    }
    
    // Mise à jour du state parent avec la nouvelle période
    onChange([...selectedPeriods, formattedKey as TimeOfDay]);
    
    // Reset du formulaire
    setNewPeriod("");
    setErrorMessage("");
  };
  
  const removePeriod = (period: string) => {
    onChange(selectedPeriods.filter(p => p !== period));
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomPeriod();
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="customPeriod" className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-medBlue" />
          {title}
        </Label>
        
        {selectedPeriods.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedPeriods.map(period => (
              <Badge 
                key={period} 
                variant={defaultPeriods.includes(period) ? "secondary" : "outline"}
                className="flex items-center gap-1 py-1.5 px-3 text-sm transition-colors hover:bg-muted group"
              >
                {timeOfDayLabels[period] || period}
                {!defaultPeriods.includes(period) && (
                  <button 
                    onClick={() => removePeriod(period)}
                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Supprimer ${timeOfDayLabels[period] || period}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="customPeriod"
              value={newPeriod}
              onChange={(e) => {
                setNewPeriod(e.target.value);
                setErrorMessage("");
              }}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="pr-12 transition-shadow focus-within:shadow-sm"
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? "customPeriod-error" : undefined}
            />
          </div>
          <Button 
            type="button" 
            onClick={addCustomPeriod}
            size="sm"
            className="shrink-0 transition-all"
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </Button>
        </div>
        {errorMessage && (
          <p id="customPeriod-error" className="text-sm text-red-500 mt-1">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default CustomTimePeriodsSection;
