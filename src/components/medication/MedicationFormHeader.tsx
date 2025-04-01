
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MedicationFormHeaderProps {
  isEditing: boolean;
}

const MedicationFormHeader = ({ isEditing }: MedicationFormHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      <h1 className="text-3xl font-bold text-medBlue">
        {isEditing ? "Modifier un médicament" : "Ajouter un médicament"}
      </h1>
    </div>
  );
};

export default MedicationFormHeader;
