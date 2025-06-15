
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface DoctorsPageHeaderProps {
  onAddDoctor: () => void;
}

export const DoctorsPageHeader = ({ onAddDoctor }: DoctorsPageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-medBlue flex items-center">
          <Users className="mr-3 h-8 w-8" />
          Gestion des médecins
        </h1>
        <p className="text-gray-600">Ajoutez et gérez vos médecins</p>
      </div>
      <Button 
        className="mt-4 md:mt-0 bg-medBlue hover:bg-blue-600"
        onClick={onAddDoctor}
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un médecin
      </Button>
    </div>
  );
};
