
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Doctor } from "@/lib/supabase-doctors-service";
import { AddDoctorFormHeader } from "./AddDoctorFormHeader";
import { AddDoctorFormFields } from "./AddDoctorFormFields";
import { AddDoctorFormActions } from "./AddDoctorFormActions";
import { useAddDoctorForm } from "./useAddDoctorForm";

interface AddDoctorFormProps {
  onDoctorAdded: (doctor: Doctor) => void;
  onCancel: () => void;
  initialSearchQuery?: string;
}

export const AddDoctorForm = ({ onDoctorAdded, onCancel, initialSearchQuery }: AddDoctorFormProps) => {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useAddDoctorForm({ onDoctorAdded, initialSearchQuery });

  return (
    <Card className="w-full">
      <AddDoctorFormHeader onCancel={onCancel} />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddDoctorFormFields 
            formData={formData}
            onInputChange={handleInputChange}
          />
          <AddDoctorFormActions 
            onCancel={onCancel}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  );
};
