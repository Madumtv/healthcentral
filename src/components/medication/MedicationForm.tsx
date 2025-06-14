
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Medication } from "@/types";
import { useMedicationForm } from "./hooks/useMedicationForm";
import { useMedicationHandlers } from "./handlers/useMedicationHandlers";
import { MedicationFormContent } from "./MedicationFormContent";

interface MedicationFormProps {
  medication: Partial<Medication>;
  isEditing: boolean;
  id?: string;
}

const MedicationForm = ({ medication: initialMedication, isEditing, id }: MedicationFormProps) => {
  const {
    medication,
    setMedication,
    customTimePeriods,
    setCustomTimePeriods,
    isSaving,
    handleSubmit
  } = useMedicationForm({ initialMedication, isEditing, id });

  const {
    handleInputChange,
    handleDayChange,
    handleTimeChange,
    handleCustomPeriodsChange,
    handleDoctorChange
  } = useMedicationHandlers({
    medication,
    setMedication,
    customTimePeriods,
    setCustomTimePeriods
  });

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier" : "Ajouter"} un médicament</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Modifiez les informations de votre médicament" 
            : "Renseignez les informations de votre médicament"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MedicationFormContent
          medication={medication}
          customTimePeriods={customTimePeriods}
          isSaving={isSaving}
          onInputChange={handleInputChange}
          onDayChange={handleDayChange}
          onTimeChange={handleTimeChange}
          onCustomPeriodsChange={handleCustomPeriodsChange}
          onDoctorChange={handleDoctorChange}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default MedicationForm;
