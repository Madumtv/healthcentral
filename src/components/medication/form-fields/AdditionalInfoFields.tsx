
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DoctorSelector } from "../DoctorSelector";

interface AdditionalInfoFieldsProps {
  notes?: string;
  prescribingDoctor?: string;
  doctorId?: string;
  infoLink?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDoctorChange: (doctorId: string | null, doctorText: string) => void;
}

export const AdditionalInfoFields = ({ 
  notes, 
  prescribingDoctor, 
  doctorId,
  infoLink, 
  onChange,
  onDoctorChange
}: AdditionalInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <DoctorSelector
        selectedDoctorId={doctorId}
        selectedDoctorText={prescribingDoctor}
        onDoctorChange={onDoctorChange}
      />
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes personnelles (optionnel)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes || ""}
          onChange={onChange}
          placeholder="Notes supplémentaires sur ce médicament..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="infoLink">Lien d'information (optionnel)</Label>
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
