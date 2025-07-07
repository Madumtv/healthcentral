
import React from "react";
import { TimeOfDay } from "@/types";
import { BasicInfoFields } from "./form-fields/BasicInfoFields";
import StandardTimePeriods from "./form-fields/StandardTimePeriods";
import DaysOfWeekField from "./form-fields/DaysOfWeekField";
import AdditionalInfoFields from "./form-fields/AdditionalInfoFields";
import SubmitButton from "./form-fields/SubmitButton";
import { CustomTimePeriodsSection } from "./CustomTimePeriodsSection";

interface MedicationFormContentProps {
  medication: any;
  customTimePeriods: TimeOfDay[];
  isSaving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDayChange: (day: string, checked: boolean) => void;
  onTimeChange: (time: string, checked: boolean) => void;
  onCustomPeriodsChange: (periods: TimeOfDay[]) => void;
  onDoctorChange: (doctorId: string | null, doctorText: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MedicationFormContent = ({
  medication,
  customTimePeriods,
  isSaving,
  onInputChange,
  onDayChange,
  onTimeChange,
  onCustomPeriodsChange,
  onDoctorChange,
  onSubmit
}: MedicationFormContentProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <BasicInfoFields
        name={medication.name || ""}
        dosage={medication.dosage || ""}
        description={medication.description}
        onChange={onInputChange}
      />
      
      <StandardTimePeriods
        selectedTimes={medication.timeOfDay || []}
        onChange={onTimeChange}
      />
      
      <CustomTimePeriodsSection
        selectedPeriods={customTimePeriods}
        onChange={onCustomPeriodsChange}
      />
      
      <DaysOfWeekField
        selectedDays={medication.daysOfWeek || []}
        onChange={onDayChange}
      />
      
      <AdditionalInfoFields
        notes={medication.notes}
        prescribingDoctor={medication.prescribingDoctor}
        doctorId={medication.doctorId}
        infoLink={medication.infoLink}
        onChange={onInputChange}
        onDoctorChange={onDoctorChange}
      />
      
      <SubmitButton isSaving={isSaving} />
    </form>
  );
};

export default MedicationFormContent;
