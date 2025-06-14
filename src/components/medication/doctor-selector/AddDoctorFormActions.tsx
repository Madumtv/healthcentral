
import React from "react";
import { Button } from "@/components/ui/button";

interface AddDoctorFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AddDoctorFormActions = ({ onCancel, isSubmitting }: AddDoctorFormActionsProps) => {
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ajout en cours..." : "Ajouter le médecin"}
      </Button>
    </div>
  );
};
