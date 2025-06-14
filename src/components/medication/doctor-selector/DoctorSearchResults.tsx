
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";

interface DoctorSearchResultsProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorSearchResults = ({ doctors, onSelectDoctor }: DoctorSearchResultsProps) => {
  if (doctors.length === 0) return null;

  return (
    <Card>
      <CardContent className="pt-4">
        <h4 className="font-medium mb-3">Médecins trouvés</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectDoctor(doctor)}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-sm">
                    Dr {doctor.first_name} {doctor.last_name}
                  </h5>
                  {doctor.specialty && (
                    <Badge variant="outline" className="text-xs">
                      {doctor.specialty}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  {doctor.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {doctor.city}
                    </div>
                  )}
                  {doctor.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {doctor.phone}
                    </div>
                  )}
                </div>
                
                {doctor.inami_number && (
                  <p className="text-xs text-gray-500">INAMI: {doctor.inami_number}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
