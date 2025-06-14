
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Database, Globe, Mail, IdCard, CheckCircle } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";

interface DoctorSearchResultsProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorSearchResults = ({ doctors, onSelectDoctor }: DoctorSearchResultsProps) => {
  if (doctors.length === 0) return null;

  const getSourceInfo = (doctor: Doctor) => {
    if (doctor.id.startsWith('doctoranytime_')) {
      return { icon: Globe, label: 'DoctorAnytime.be', color: 'bg-green-100 text-green-800', isReal: true };
    }
    if (doctor.id.startsWith('ordomedic_')) {
      return { icon: Globe, label: 'Ordomedic.be', color: 'bg-blue-100 text-blue-800', isReal: true };
    }
    if (doctor.id.startsWith('doctoralia_')) {
      return { icon: Globe, label: 'Doctoralia.be', color: 'bg-purple-100 text-purple-800', isReal: true };
    }
    if (doctor.id.startsWith('qare_')) {
      return { icon: Globe, label: 'Qare.be', color: 'bg-teal-100 text-teal-800', isReal: true };
    }
    if (doctor.id.startsWith('search_') || doctor.id.startsWith('edge_')) {
      return { icon: Globe, label: 'Recherche Web', color: 'bg-indigo-100 text-indigo-800', isReal: true };
    }
    if (doctor.id.startsWith('popular_')) {
      return { icon: Database, label: 'Médecins populaires', color: 'bg-orange-100 text-orange-800', isReal: false };
    }
    if (doctor.id.startsWith('fallback_') || doctor.id.startsWith('simulated_')) {
      return { icon: Database, label: 'Données simulées', color: 'bg-gray-100 text-gray-800', isReal: false };
    }
    return { icon: Database, label: 'Base locale', color: 'bg-green-100 text-green-800', isReal: true };
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <h4 className="font-medium mb-3 text-medBlue">
          {doctors.length} médecin{doctors.length > 1 ? 's' : ''} trouvé{doctors.length > 1 ? 's' : ''}
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {doctors.map((doctor) => {
            const sourceInfo = getSourceInfo(doctor);
            const SourceIcon = sourceInfo.icon;
            
            return (
              <div
                key={doctor.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors hover:border-medBlue"
                onClick={() => onSelectDoctor(doctor)}
              >
                <div className="space-y-2">
                  {/* Header avec nom et badges */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-base text-medBlue">
                        Dr {doctor.first_name} {doctor.last_name}
                        {sourceInfo.isReal && (
                          <CheckCircle className="inline-block h-4 w-4 ml-2 text-green-600" />
                        )}
                      </h5>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doctor.specialty && (
                        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                          {doctor.specialty}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${sourceInfo.color}`}>
                        <SourceIcon className="h-3 w-3 mr-1" />
                        {sourceInfo.label}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Coordonnées */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    {(doctor.address || doctor.city) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-medBlue" />
                        <div className="flex-1">
                          {doctor.address && <div>{doctor.address}</div>}
                          {doctor.city && (
                            <div className="font-medium">
                              {doctor.postal_code} {doctor.city}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {doctor.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-medBlue" />
                        <span className="font-medium">{doctor.phone}</span>
                      </div>
                    )}
                    
                    {doctor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-medBlue" />
                        <span className="text-blue-600 hover:underline">
                          {doctor.email}
                        </span>
                      </div>
                    )}
                    
                    {doctor.inami_number && (
                      <div className="flex items-center gap-2">
                        <IdCard className="h-4 w-4 text-medBlue" />
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          INAMI: {doctor.inami_number}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Indicateur de source réelle */}
                  {sourceInfo.isReal && (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      ✓ Médecin trouvé via recherche en temps réel
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {doctors.length >= 15 && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800 text-center">
            Plus de résultats disponibles. Affinez votre recherche pour des résultats plus précis.
          </div>
        )}
        
        {/* Légende des sources */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>Sources officielles en temps réel</span>
          </div>
          <div className="text-gray-500">
            DoctorAnytime.be • Ordomedic.be • Doctoralia.be • Base locale
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
