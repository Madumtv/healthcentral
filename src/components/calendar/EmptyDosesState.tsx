
import { Pill, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyDosesStateProps {
  message: string;
  description: string;
}

export const EmptyDosesState = ({ message, description }: EmptyDosesStateProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Pill className="h-12 w-12 text-gray-300 mb-4" />
        <p className="text-xl font-medium text-gray-500 mb-2">{message}</p>
        <p className="text-gray-400 mb-6">{description}</p>
        <Button 
          onClick={() => navigate("/medications/add")} 
          className="bg-medBlue hover:bg-blue-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un médicament
        </Button>
      </CardContent>
    </Card>
  );
};
