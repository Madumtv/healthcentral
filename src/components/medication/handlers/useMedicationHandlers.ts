
import { TimeOfDay } from "@/types";

interface UseMedicationHandlersProps {
  medication: any;
  setMedication: (medication: any) => void;
  customTimePeriods: TimeOfDay[];
  setCustomTimePeriods: (periods: TimeOfDay[]) => void;
}

export const useMedicationHandlers = ({
  medication,
  setMedication,
  customTimePeriods,
  setCustomTimePeriods
}: UseMedicationHandlersProps) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedication((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setMedication((prev: any) => ({
      ...prev,
      daysOfWeek: checked
        ? [...(prev.daysOfWeek || []), day]
        : (prev.daysOfWeek || []).filter((d: string) => d !== day)
    }));
  };

  const handleTimeChange = (time: string, checked: boolean) => {
    setMedication((prev: any) => ({
      ...prev,
      timeOfDay: checked
        ? [...(prev.timeOfDay || []), time]
        : (prev.timeOfDay || []).filter((t: string) => t !== time)
    }));
  };

  const handleCustomPeriodsChange = (periods: TimeOfDay[]) => {
    setCustomTimePeriods(periods);
    
    // Mettre à jour timeOfDay en gardant les périodes standards et en ajoutant les personnalisées
    const standardPeriods = ['morning', 'noon', 'evening', 'night'];
    const currentStandardPeriods = (medication.timeOfDay || []).filter((time: string) => 
      standardPeriods.includes(time)
    );
    
    setMedication((prev: any) => ({
      ...prev,
      timeOfDay: [...currentStandardPeriods, ...periods]
    }));
  };

  const handleDoctorChange = (doctorId: string | null, doctorText: string) => {
    console.log("Doctor changed:", { doctorId, doctorText });
    
    setMedication((prev: any) => ({
      ...prev,
      doctorId: doctorId,
      prescribingDoctor: doctorText,
      // Nettoyer les données du médecin si aucun ID n'est fourni
      doctor: doctorId ? prev.doctor : undefined
    }));
  };

  return {
    handleInputChange,
    handleDayChange,
    handleTimeChange,
    handleCustomPeriodsChange,
    handleDoctorChange
  };
};
