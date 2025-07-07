
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { MedicationFormData } from "@/types";
import { VidalSearch } from "../VidalSearch";

interface BasicInfoFieldsProps {
  form: UseFormReturn<MedicationFormData>;
  showMedicamentSearch: boolean;
  setShowMedicamentSearch: (show: boolean) => void;
  selectedRegion: 'belgium' | 'france';
}

export const BasicInfoFields = ({ 
  form, 
  showMedicamentSearch, 
  setShowMedicamentSearch,
  selectedRegion 
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du médicament *</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Doliprane, Aspirine..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Recherche de médicament</FormLabel>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedRegion === 'belgium' ? 'Base belge' : 'Vidal.fr'}
            </span>
            <Switch
              checked={showMedicamentSearch}
              onCheckedChange={setShowMedicamentSearch}
            />
          </div>
        </div>

        {showMedicamentSearch && (
          <div className="border rounded-lg p-4 bg-gray-50">
            {selectedRegion === 'belgium' ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Recherche dans la base belge
                </h3>
                <p className="text-gray-600 mb-4">
                  Fonctionnalité en développement - La recherche dans la base de données belge sera bientôt disponible.
                </p>
                <p className="text-sm text-gray-500">
                  Pour l'instant, vous pouvez saisir manuellement les informations ci-dessous.
                </p>
              </div>
            ) : (
              <VidalSearch 
                onMedicamentSelect={(medication) => {
                  form.setValue('name', medication.name);
                  if (medication.dosage) {
                    form.setValue('dosage', medication.dosage);
                  }
                  if (medication.description) {
                    form.setValue('description', medication.description);
                  }
                  setShowMedicamentSearch(false);
                }}
              />
            )}
          </div>
        )}
      </div>

      <FormField
        control={form.control}
        name="dosage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dosage *</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: 500mg, 1 comprimé..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Description optionnelle du médicament..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
