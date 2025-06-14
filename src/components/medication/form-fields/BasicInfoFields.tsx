
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Flag } from "lucide-react";
import { HybridMedicationSearch } from "../HybridMedicationSearch";
import { MedicamentInfo } from "@/lib/medicaments-api";

interface BasicInfoFieldsProps {
  name: string;
  dosage: string;
  description?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicInfoFields = ({ 
  name, 
  dosage, 
  description, 
  onChange 
}: BasicInfoFieldsProps) => {
  const [showMedicamentSearch, setShowMedicamentSearch] = useState(false);
  const [searchRegion, setSearchRegion] = useState<'belgium' | 'france'>('belgium');

  const handleMedicamentSelect = (medicament: MedicamentInfo & { dosage?: string }) => {
    // Simuler les événements onChange pour mettre à jour le formulaire parent
    const nameEvent = {
      target: { name: 'name', value: medicament.name }
    } as React.ChangeEvent<HTMLInputElement>;
    
    const dosageEvent = {
      target: { name: 'dosage', value: medicament.dosage || medicament.category }
    } as React.ChangeEvent<HTMLInputElement>;
    
    const descriptionEvent = {
      target: { 
        name: 'description', 
        value: [
          medicament.category,
          medicament.company ? `Laboratoire: ${medicament.company}` : '',
          searchRegion === 'belgium' ? `CNK: ${medicament.cnk}` : `Vidal ID: ${medicament.cnk}`,
          medicament.publicPrice ? `Prix: ${medicament.publicPrice}€` : ''
        ].filter(Boolean).join(' • ')
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onChange(nameEvent);
    onChange(dosageEvent);
    onChange(descriptionEvent);
    
    setShowMedicamentSearch(false);
  };

  const handleSearchToggle = (region: 'belgium' | 'france') => {
    setSearchRegion(region);
    setShowMedicamentSearch(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Informations du médicament</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSearchToggle('belgium')}
            className="text-sm"
          >
            <Flag className="mr-2 h-4 w-4 text-yellow-500" />
            Recherche Belgique
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSearchToggle('france')}
            className="text-sm"
          >
            <Flag className="mr-2 h-4 w-4 text-blue-500" />
            Recherche France (Vidal)
          </Button>
          {showMedicamentSearch && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMedicamentSearch(false)}
              className="text-sm"
            >
              Saisie manuelle
            </Button>
          )}
        </div>
      </div>

      {showMedicamentSearch ? (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            {searchRegion === 'belgium' ? (
              <HybridMedicationSearch 
                onMedicamentSelect={handleMedicamentSelect}
                className=""
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <Flag className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Recherche Vidal.fr (France)</span>
                </div>
                <p className="text-sm text-blue-600">
                  Recherche dans la base de données française Vidal - médicaments disponibles en France
                </p>
                <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    <strong>Fonctionnalité en développement</strong> - La recherche Vidal.fr sera bientôt disponible. 
                    Pour l'instant, vous pouvez consulter directement <a href="https://www.vidal.fr/" target="_blank" rel="noopener noreferrer" className="underline">vidal.fr</a> 
                    et saisir manuellement les informations ci-dessous.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Ou continuez avec la saisie manuelle ci-dessous
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du médicament *</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Ex: Dafalgan"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage unitaire *</Label>
          <Input
            id="dosage"
            name="dosage"
            value={dosage}
            onChange={onChange}
            placeholder="Ex: 2 comprimés, 1 gélule"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Textarea
          id="description"
          name="description"
          value={description || ""}
          onChange={onChange}
          placeholder="Informations complémentaires sur le médicament..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
