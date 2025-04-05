
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoFieldsProps {
  notes?: string;
  prescribingDoctor?: string;
  infoLink?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const AdditionalInfoFields = ({ 
  notes,
  prescribingDoctor,
  infoLink,
  onChange 
}: AdditionalInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Notes personnelles</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes || ""}
          onChange={onChange}
          placeholder="Informations complémentaires, effets secondaires..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="prescribingDoctor">Médecin prescripteur</Label>
        <Input
          id="prescribingDoctor"
          name="prescribingDoctor"
          value={prescribingDoctor || ""}
          onChange={onChange}
          placeholder="Dr. Dupont"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="infoLink">Lien vers des informations</Label>
        <Input
          id="infoLink"
          name="infoLink"
          value={infoLink || ""}
          onChange={onChange}
          placeholder="https://..."
          type="url"
        />
      </div>
    </div>
  );
};

export default AdditionalInfoFields;
