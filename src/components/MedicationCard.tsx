
import { Medication } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit, Trash2, Info } from "lucide-react";
import { daysOfWeekLabels, timeOfDayLabels } from "@/lib/constants";

interface MedicationCardProps {
  medication: Medication;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MedicationCard({ medication, onEdit, onDelete }: MedicationCardProps) {
  return (
    <Card className="w-full transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium text-medBlue">{medication.name}</CardTitle>
            <CardDescription>{medication.dosage}</CardDescription>
          </div>
          <div className="flex space-x-2">
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
        
        <div>
          <h4 className="text-sm font-medium mb-1">Quand prendre</h4>
          <div className="flex flex-wrap gap-2">
            {medication.timeOfDay.map((time) => (
              <Badge key={time} variant="outline" className="bg-blue-50 text-medBlue border-blue-200">
                {timeOfDayLabels[time]}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-1">Jours de prise</h4>
          <div className="flex flex-wrap gap-2">
            {medication.daysOfWeek.map((day) => (
              <Badge key={day} variant="outline" className="bg-green-50 text-medGreen border-green-200">
                {daysOfWeekLabels[day]}
              </Badge>
            ))}
          </div>
        </div>
        
        {medication.notes && (
          <div>
            <h4 className="text-sm font-medium mb-1">Notes</h4>
            <p className="text-sm text-gray-600">{medication.notes}</p>
          </div>
        )}
        
        {medication.prescribingDoctor && (
          <div>
            <h4 className="text-sm font-medium mb-1">Médecin prescripteur</h4>
            <p className="text-sm text-gray-600">{medication.prescribingDoctor}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        {medication.infoLink ? (
          <a
            href={medication.infoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-medBlue hover:underline flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" /> Informations détaillées
          </a>
        ) : (
          <span className="text-sm text-gray-400 flex items-center">
            <Info className="h-3 w-3 mr-1" /> Pas d'informations complémentaires
          </span>
        )}
      </CardFooter>
    </Card>
  );
}

export default MedicationCard;
