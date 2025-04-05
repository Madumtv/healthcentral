
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface GlobalActionButtonProps {
  isAllTaken: boolean;
  onMarkAll: (markAsTaken: boolean) => void;
}

export const GlobalActionButton = ({ isAllTaken, onMarkAll }: GlobalActionButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button
        onClick={() => onMarkAll(!isAllTaken)}
        variant={isAllTaken ? "outline" : "default"}
        className={isAllTaken 
          ? "border-green-500 text-green-600 hover:bg-green-50" 
          : "bg-medBlue hover:bg-medBlue/90"
        }
        size="lg"
      >
        {isAllTaken ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Tous médicaments pris
          </>
        ) : (
          "Tout prendre"
        )}
      </Button>
    </div>
  );
};
