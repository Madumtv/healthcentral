
import React from "react";
import { Button } from "@/components/ui/button";

interface AddDoctorFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddDoctorFormActions = ({ onCancel, isSubmitting, onSubmit }: AddDoctorFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button 
        type="button" 
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? "Ajout en cours..." : "Ajouter le médecin"}
      </Button>
    </div>
  );
};
