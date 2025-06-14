
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, MapPin, Phone } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";

interface DoctorSuggestionsProps {
  suggestions: Doctor[];
  onAddDoctor: (doctor: Doctor) => void;
}

export const DoctorSuggestions = ({ suggestions, onAddDoctor }: DoctorSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
          <ExternalLink className="h-4 w-4" />
          Médecins trouvés sur les sites officiels
        </CardTitle>
        <p className="text-xs text-blue-600">
          Ces médecins ont été trouvés sur les sites médicaux belges. Voulez-vous en ajouter un ?
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((doctor) => (
          <div
            key={doctor.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">
                  Dr {doctor.first_name} {doctor.last_name}
                </h4>
                {doctor.specialty && (
                  <Badge variant="secondary" className="text-xs">
                    {doctor.specialty}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-600">
                {doctor.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{doctor.city}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{doctor.phone}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  Source: {doctor.source || 'Site médical belge'}
                </Badge>
              </div>
            </div>
            
            <Button
              size="sm"
              onClick={() => onAddDoctor(doctor)}
              className="ml-3 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-3 w-3 mr-1" />
              Ajouter
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
