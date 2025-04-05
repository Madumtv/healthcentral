
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du médicament *</Label>
          <Input
            id="name"
            name="name"
            value={name || ""}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            name="dosage"
            value={dosage || ""}
            onChange={onChange}
            placeholder="Ex: 500mg, 10ml..."
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={description || ""}
          onChange={onChange}
          placeholder="Ex: Antidouleur, antibiotique..."
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
