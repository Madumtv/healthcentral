
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SubmitButtonProps {
  isSaving: boolean;
}

export const SubmitButton = ({ isSaving }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end pt-4">
      <Button 
        type="submit" 
        className="bg-medBlue hover:bg-blue-600"
        disabled={isSaving}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
};

export default SubmitButton;
