
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface AddDoctorFormHeaderProps {
  onCancel: () => void;
}

export const AddDoctorFormHeader = ({ onCancel }: AddDoctorFormHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onCancel}
          className="p-1 h-auto"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle>Ajouter un nouveau médecin</CardTitle>
      </div>
    </CardHeader>
  );
};
