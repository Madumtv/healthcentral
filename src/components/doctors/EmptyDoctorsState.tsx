
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

interface EmptyDoctorsStateProps {
  searchTerm: string;
  onClearSearch: () => void;
  onAddDoctor: () => void;
}

export const EmptyDoctorsState = ({ searchTerm, onClearSearch, onAddDoctor }: EmptyDoctorsStateProps) => {
  return (
    <div className="text-center py-8">
      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      {searchTerm ? (
        <>
          <p className="text-gray-500 mb-4">Aucun médecin trouvé pour "{searchTerm}"</p>
          <Button onClick={onClearSearch} variant="outline">
            Effacer la recherche
          </Button>
        </>
      ) : (
        <>
          <p className="text-gray-500 mb-4">Aucun médecin dans votre base de données</p>
          <Button onClick={onAddDoctor} className="bg-medBlue hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter votre premier médecin
          </Button>
        </>
      )}
    </div>
  );
};
