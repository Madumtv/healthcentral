
import { useState, useEffect } from "react";
import { Medication } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2, Info, FileText, User, Phone, MapPin } from "lucide-react";
import { daysOfWeekLabels, timeOfDayLabels } from "@/lib/constants";
import { MedicamentDetailsModal } from "./medication/MedicamentDetailsModal";
import { DeleteMedicationDialog } from "./medication/DeleteMedicationDialog";

interface MedicationCardProps {
  medication: Medication;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MedicationCard({ medication, onEdit, onDelete }: MedicationCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [defaultAction, setDefaultAction] = useState<'details' | 'edit'>('edit');

  // Charger l'action par défaut depuis les paramètres
  useEffect(() => {
    const savedAction = localStorage.getItem('medicationDefaultAction') as 'details' | 'edit';
    if (savedAction) {
      setDefaultAction(savedAction);
    }
  }, []);

  console.log("MedicationCard rendering with timeOfDay:", medication.timeOfDay);

  // Vérifier si le lien est valide (non vide et commence par http)
  const hasValidLink = medication.infoLink && 
    medication.infoLink.trim() !== "" && 
    (medication.infoLink.startsWith("http://") || medication.infoLink.startsWith("https://"));

  // Dédoublonner les périodes de temps pour éviter les doublons
  const uniqueTimeOfDay = medication.timeOfDay ? [...new Set(medication.timeOfDay)] : [];
  console.log("Unique timeOfDay:", uniqueTimeOfDay);

  const handleCardClick = () => {
    if (defaultAction === 'details') {
      setShowDetailsModal(true);
    } else {
      onEdit(medication.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(medication.id);
    setShowDeleteDialog(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(medication.id);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailsModal(true);
  };

  return (
    <>
      <Card 
        className="w-full transition-shadow duration-200 hover:shadow-md cursor-pointer" 
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <CardTitle className="text-lg font-medium text-medBlue">{medication.name}</CardTitle>
              <CardDescription className="mt-1">{medication.dosage}</CardDescription>
            </div>
            <div className="flex space-x-2 flex-shrink-0">
              {defaultAction === 'details' ? (
                <Button variant="outline" size="icon" onClick={handleEditClick}>
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="icon" onClick={handleDetailsClick}>
                  <Info className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="icon" className="text-destructive" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {medication.description && (
            <p className="text-sm text-gray-600">{medication.description}</p>
          )}
          
          {uniqueTimeOfDay.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Quand prendre</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueTimeOfDay.map((time) => (
                  <Badge key={time} variant="outline" className="bg-blue-50 text-medBlue border-blue-200 px-2 py-1">
                    {timeOfDayLabels[time] || time}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {medication.daysOfWeek && medication.daysOfWeek.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Jours de prise</h4>
              <div className="flex flex-wrap gap-2">
                {medication.daysOfWeek.map((day) => (
                  <Badge key={day} variant="outline" className="bg-green-50 text-medGreen border-green-200 px-2 py-1">
                    {daysOfWeekLabels[day]}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Doctor information */}
          {(medication.doctor || medication.prescribingDoctor) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <User className="h-4 w-4" />
                Médecin prescripteur
              </h4>
              {medication.doctor ? (
                <div className="bg-blue-50 p-3 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-medBlue">
                      Dr {medication.doctor.firstName} {medication.doctor.lastName}
                    </span>
                    {medication.doctor.specialty && (
                      <Badge variant="outline" className="text-xs">
                        {medication.doctor.specialty}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {medication.doctor.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {medication.doctor.city}
                      </div>
                    )}
                    {medication.doctor.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {medication.doctor.phone}
                      </div>
                    )}
                  </div>
                  {medication.doctor.inamiNumber && (
                    <p className="text-xs text-gray-500">INAMI: {medication.doctor.inamiNumber}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">{medication.prescribingDoctor}</p>
              )}
            </div>
          )}
          
          {medication.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Notes</h4>
              <p className="text-sm text-gray-600">{medication.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-4 border-t bg-gray-50">
          <div className="flex gap-2">
            {hasValidLink ? (
              <a
                href={medication.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-medBlue hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" /> 
                Lien personnalisé
              </a>
            ) : null}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDetailsClick}
              className="text-sm text-medBlue hover:bg-blue-50 p-1 h-auto"
            >
              <FileText className="h-3 w-3 mr-1" />
              Informations officielles
            </Button>
          </div>
          
          {!hasValidLink && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Info className="h-3 w-3" /> 
              Pas d'informations complémentaires
            </span>
          )}
        </CardFooter>
      </Card>

      <MedicamentDetailsModal
        medicamentName={medication.name}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      <DeleteMedicationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        medicationName={medication.name}
      />
    </>
  );
}

export default MedicationCard;
