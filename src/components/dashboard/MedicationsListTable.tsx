
import { Medication } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, FileText, User } from "lucide-react";
import { daysOfWeekLabels, timeOfDayLabels } from "@/lib/constants";
import { useState } from "react";
import { MedicamentDetailsModal } from "../medication/MedicamentDetailsModal";

interface MedicationsListTableProps {
  medications: Medication[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MedicationsListTable = ({ medications, onEdit, onDelete }: MedicationsListTableProps) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState<string>("");

  const handleShowDetails = (medicamentName: string) => {
    setSelectedMedicament(medicamentName);
    setShowDetailsModal(true);
  };

  const handleEdit = (id: string) => {
    console.log("Editing medication:", id);
    onEdit(id);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Médicament</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Moments de prise</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Médecin</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => {
              const uniqueTimeOfDay = medication.timeOfDay ? [...new Set(medication.timeOfDay)] : [];
              const hasValidLink = medication.infoLink && 
                medication.infoLink.trim() !== "" && 
                (medication.infoLink.startsWith("http://") || medication.infoLink.startsWith("https://"));

              console.log("Rendering medication:", medication.name, "Doctor:", medication.doctor, "DoctorId:", medication.doctorId);

              return (
                <TableRow key={`${medication.id}-${medication.updatedAt}`}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold text-medBlue">{medication.name}</div>
                      {medication.description && (
                        <div className="text-sm text-gray-500 mt-1">{medication.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {uniqueTimeOfDay.map((time) => (
                        <Badge key={time} variant="outline" className="bg-blue-50 text-medBlue border-blue-200 text-xs">
                          {timeOfDayLabels[time] || time}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {medication.daysOfWeek && medication.daysOfWeek.slice(0, 3).map((day) => (
                        <Badge key={day} variant="outline" className="bg-green-50 text-medGreen border-green-200 text-xs">
                          {daysOfWeekLabels[day]}
                        </Badge>
                      ))}
                      {medication.daysOfWeek && medication.daysOfWeek.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{medication.daysOfWeek.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {medication.doctor ? (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        <span>Dr {medication.doctor.firstName} {medication.doctor.lastName}</span>
                      </div>
                    ) : medication.prescribingDoctor ? (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        <span>{medication.prescribingDoctor}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {hasValidLink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={medication.infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-medBlue"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShowDetails(medication.name)}
                        className="text-medBlue"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(medication.id)}
                        className="text-medBlue"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(medication.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <MedicamentDetailsModal
        medicamentName={selectedMedicament}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
};
