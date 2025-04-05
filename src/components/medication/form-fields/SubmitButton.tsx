
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SubmitButtonProps {
  isSaving: boolean;
  className?: string;
  icon?: React.ReactNode;
  text?: string;
  loadingText?: string;
}

export const SubmitButton = ({ 
  isSaving, 
  className = "",
  icon = <Save className="mr-2 h-4 w-4" />,
  text = "Enregistrer",
  loadingText = "Enregistrement..."
}: SubmitButtonProps) => {
  return (
    <div className={`flex justify-end pt-4 ${className}`}>
      <Button 
        type="submit" 
        className="bg-medBlue hover:bg-blue-600 transition-colors"
        disabled={isSaving}
      >
        {isSaving ? null : icon}
        {isSaving ? loadingText : text}
      </Button>
    </div>
  );
};

export default SubmitButton;
