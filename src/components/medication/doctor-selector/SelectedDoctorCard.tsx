
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, MapPin, Phone, Mail, FileText, Edit } from "lucide-react";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";

interface SelectedDoctorCardProps {
  doctorText: string;
  doctorId?: string | null;
  onClear: () => void;
}

export const SelectedDoctorCard = ({ doctorText, doctorId, onClear }: SelectedDoctorCardProps) => {
  const [doctorDetails, setDoctorDetails] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (doctorId) {
        setIsLoading(true);
        try {
          const doctor = await supabaseDoctorsService.getById(doctorId);
          setDoctorDetails(doctor);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails du médecin:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDoctorDetails();
  }, [doctorId]);

  const isManualEntry = !doctorId;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">{doctorText}</span>
              {isManualEntry && (
                <Badge variant="secondary" className="text-xs">
                  Saisie manuelle
                </Badge>
              )}
            </div>

            {isLoading && (
              <p className="text-sm text-gray-500">Chargement des détails...</p>
            )}

            {doctorDetails && (
              <div className="space-y-2 text-sm text-gray-600">
                {doctorDetails.specialty && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span>{doctorDetails.specialty}</span>
                  </div>
                )}
                
                {(doctorDetails.address || doctorDetails.city) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {doctorDetails.address && `${doctorDetails.address}, `}
                      {doctorDetails.postal_code && `${doctorDetails.postal_code} `}
                      {doctorDetails.city}
                    </span>
                  </div>
                )}
                
                {doctorDetails.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>{doctorDetails.phone}</span>
                  </div>
                )}
                
                {doctorDetails.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>{doctorDetails.email}</span>
                  </div>
                )}

                {doctorDetails.inami_number && (
                  <div className="text-xs text-gray-500">
                    INAMI: {doctorDetails.inami_number}
                  </div>
                )}
              </div>
            )}

            {!doctorDetails && !isLoading && !isManualEntry && (
              <p className="text-sm text-gray-500">Médecin externe</p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-green-600 hover:text-green-800 hover:bg-green-100 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
