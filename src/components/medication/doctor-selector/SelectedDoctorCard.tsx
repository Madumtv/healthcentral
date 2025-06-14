
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";

interface SelectedDoctorCardProps {
  doctorText: string;
  doctorId?: string | null;
  onClear: () => void;
}

export const SelectedDoctorCard = ({ doctorText, doctorId, onClear }: SelectedDoctorCardProps) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                {doctorText}
              </span>
            </div>
            {doctorId && (
              <p className="text-xs text-gray-500">ID: {doctorId}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            Changer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
