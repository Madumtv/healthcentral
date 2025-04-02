
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardGreetingProps {
  userName: string | null;
}

export const DashboardGreeting = ({ userName }: DashboardGreetingProps) => {
  const navigate = useNavigate();

  const getGreetingByTime = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bonjour";
    if (hour >= 12 && hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-medBlue">
          {getGreetingByTime()}{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-gray-600">Gérez vos médicaments et consultez votre programme</p>
      </div>
      <Button 
        className="mt-4 md:mt-0 bg-medBlue hover:bg-blue-600"
        onClick={() => navigate("/medications/add")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un médicament
      </Button>
    </div>
  );
};
