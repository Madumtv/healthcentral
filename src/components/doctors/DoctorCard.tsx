
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Doctor } from "@/lib/supabase-doctors-service";

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

export const DoctorCard = ({ doctor, onEdit, onDelete }: DoctorCardProps) => {
  const isLocalDoctor = doctor.source === 'Base locale';

  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-lg">
            Dr {doctor.first_name} {doctor.last_name}
          </h3>
          {doctor.specialty && (
            <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
          )}
          <div className="space-y-1">
            {doctor.address && (
              <p className="text-sm text-gray-600">{doctor.address}</p>
            )}
            {doctor.city && (
              <p className="text-sm text-gray-600">{doctor.city} {doctor.postal_code}</p>
            )}
            {doctor.phone && (
              <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
            )}
            {doctor.email && (
              <p className="text-sm text-gray-600">✉️ {doctor.email}</p>
            )}
            {doctor.inami_number && (
              <p className="text-xs text-gray-400">INAMI: {doctor.inami_number}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              isLocalDoctor 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {doctor.source || 'Externe'}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            title="Modifier"
            onClick={() => onEdit(doctor)}
            disabled={!isLocalDoctor}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive" 
            title="Supprimer"
            onClick={() => onDelete(doctor)}
            disabled={!isLocalDoctor}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
