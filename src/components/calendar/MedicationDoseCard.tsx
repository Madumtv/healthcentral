
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MedicationDoseCardProps {
  dose: any;
  onToggle: () => void;
}

export const MedicationDoseCard = ({ dose, onToggle }: MedicationDoseCardProps) => {
  const medication = dose.medications;
  const isTaken = dose.is_taken;

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-200",
      isTaken ? "border-l-green-500 bg-green-50" : "border-l-medBlue hover:border-l-medBlue/80"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-lg">
              {medication.name}
            </h4>
            <p className="text-gray-500 text-sm mt-1">
              {medication.dosage}
            </p>
            {medication.description && (
              <p className="text-gray-600 mt-2 text-sm">
                {medication.description}
              </p>
            )}
            {isTaken && dose.taken_at && (
              <p className="text-green-600 text-xs mt-2">
                Pris le {format(new Date(dose.taken_at), "d MMM à HH:mm", { locale: fr })}
              </p>
            )}
          </div>
          <Button
            onClick={onToggle}
            variant={isTaken ? "outline" : "default"}
            size="sm"
            className={cn(
              "ml-4",
              isTaken ? "border-green-500 text-green-600 hover:bg-green-50" : "bg-medBlue hover:bg-medBlue/90"
            )}
          >
            {isTaken ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Pris
              </>
            ) : (
              "Marquer comme pris"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
