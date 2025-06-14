
import { useState } from "react";
import { Medication } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2, Info, FileText } from "lucide-react";
import { daysOfWeekLabels, timeOfDayLabels } from "@/lib/constants";
import { MedicamentDetailsModal } from "./medication/MedicamentDetailsModal";

interface MedicationCardProps {
  medication: Medication;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MedicationCard({ medication, onEdit, onDelete }: MedicationCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  console.log("MedicationCard rendering with timeOfDay:", medication.timeOfDay);

  // Vérifier si le lien est valide (non vide et commence par http)
  const hasValidLink = medication.infoLink && 
    medication.infoLink.trim() !== "" && 
    (medication.infoLink.startsWith("http://") || medication.infoLink.startsWith("https://"));

  // Dédoublonner les périodes de temps pour éviter les doublons
  const uniqueTimeOfDay = medication.timeOfDay ? [...new Set(medication.timeOfDay)] : [];
  console.log("Unique timeOfDay:", uniqueTimeOfDay);

  return (
    <>
      <Card className="w-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <CardTitle className="text-lg font-medium text-medBlue">{medication.name}</CardTitle>
              <CardDescription className="mt-1">{medication.dosage}</CardDescription>
            </div>
            <div className="flex space-x-2 flex-shrink-0">
              <Button variant="outline" size="icon" onClick={() => onEdit(medication.id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive" onClick={() => onDelete(medication.id)}>
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
          
          {medication.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Notes</h4>
              <p className="text-sm text-gray-600">{medication.notes}</p>
            </div>
          )}
          
          {medication.prescribingDoctor && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Médecin prescripteur</h4>
              <p className="text-sm text-gray-600">{medication.prescribingDoctor}</p>
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
              >
                <ExternalLink className="h-3 w-3" /> 
                Lien personnalisé
              </a>
            ) : null}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetailsModal(true)}
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
    </>
  );
}

export default MedicationCard;
