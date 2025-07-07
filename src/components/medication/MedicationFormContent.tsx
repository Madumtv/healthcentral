
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
  // Pour la compatibilité temporaire, on crée un form mock
  const mockForm = {
    control: {} as any,
    setValue: (name: string, value: string) => {
      // Simuler la mise à jour via onInputChange
      const mockEvent = {
        target: { name, value }
      } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(mockEvent);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Pour l'instant, on utilise les champs basiques simples */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du médicament *
          </label>
          <input
            type="text"
            name="name"
            value={medication.name || ""}
            onChange={onInputChange}
            placeholder="Ex: Doliprane, Aspirine..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dosage *
          </label>
          <input
            type="text"
            name="dosage"
            value={medication.dosage || ""}
            onChange={onInputChange}
            placeholder="Ex: 500mg, 1 comprimé..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={medication.description || ""}
            onChange={onInputChange}
            placeholder="Description optionnelle du médicament..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
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
