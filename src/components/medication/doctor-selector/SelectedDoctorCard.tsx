
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";

interface SelectedDoctorCardProps {
  doctor: Doctor;
  onClear: () => void;
}

export const SelectedDoctorCard = ({ doctor, onClear }: SelectedDoctorCardProps) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                Dr {doctor.first_name} {doctor.last_name}
              </span>
            </div>
            {doctor.specialty && (
              <Badge variant="outline" className="text-xs">
                {doctor.specialty}
              </Badge>
            )}
            {doctor.city && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                {doctor.city}
              </div>
            )}
            {doctor.inami_number && (
              <p className="text-xs text-gray-500">INAMI: {doctor.inami_number}</p>
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
