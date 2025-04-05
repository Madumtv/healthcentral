
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PeriodHeaderProps {
  title: string;
  isAllTaken: boolean;
  onMarkAll: (markAsTaken: boolean) => void;
}

export const PeriodHeader = ({ title, isAllTaken, onMarkAll }: PeriodHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold flex items-center">
        <span className="w-2 h-8 bg-medBlue rounded-full mr-3"></span>
        {title}
      </h3>
      <Button
        onClick={() => onMarkAll(!isAllTaken)}
        variant={isAllTaken ? "outline" : "default"}
        className={isAllTaken 
          ? "border-green-500 text-green-600 hover:bg-green-50" 
          : "bg-medBlue hover:bg-medBlue/90"
        }
      >
        {isAllTaken ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Tous pris
          </>
        ) : (
          "Tout prendre"
        )}
      </Button>
    </div>
  );
};
