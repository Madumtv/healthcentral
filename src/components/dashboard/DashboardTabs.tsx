
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar } from "lucide-react";
import { Medication } from "@/types";
import { TodayMedicationsList } from "./TodayMedicationsList";
import { AllMedicationsList } from "./AllMedicationsList";

interface DashboardTabsProps {
  medications: Medication[];
  medicationsByTime: Record<string, Medication[]>;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DashboardTabs = ({ 
  medications, 
  medicationsByTime, 
  isLoading, 
  onEdit, 
  onDelete 
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="today" className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="today"><Clock className="h-4 w-4 mr-2" /> Aujourd'hui</TabsTrigger>
        <TabsTrigger value="all"><Calendar className="h-4 w-4 mr-2" /> Tous mes médicaments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="today">
        <TodayMedicationsList 
          medicationsByTime={medicationsByTime} 
          isLoading={isLoading} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TabsContent>
      
      <TabsContent value="all">
        <AllMedicationsList 
          medications={medications} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TabsContent>
    </Tabs>
  );
};
