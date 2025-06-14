
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
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMedication((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleDayChange = (day: string, checked: boolean) => {
    setMedication((prev: any) => {
      const daysOfWeek = [...(prev.daysOfWeek || [])];
      
      if (checked) {
        if (!daysOfWeek.includes(day as any)) {
          daysOfWeek.push(day as any);
        }
      } else {
        const index = daysOfWeek.indexOf(day as any);
        if (index > -1) {
          daysOfWeek.splice(index, 1);
        }
      }
      
      return { ...prev, daysOfWeek };
    });
  };
  
  const handleTimeChange = (time: string, checked: boolean) => {
    console.log("Time change:", time, checked);
    
    setMedication((prev: any) => {
      // Récupérer seulement les périodes standard du timeOfDay actuel
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const currentTimeOfDay = prev.timeOfDay || [];
      
      // Séparer les périodes standard des périodes personnalisées
      const standardSelected = currentTimeOfDay.filter((period: string) => standardPeriods.includes(period));
      const customSelected = currentTimeOfDay.filter((period: string) => !standardPeriods.includes(period));
      
      let newStandardSelected = [...standardSelected];
      
      if (checked) {
        if (!newStandardSelected.includes(time as any)) {
          newStandardSelected.push(time as any);
        }
      } else {
        const index = newStandardSelected.indexOf(time as any);
        if (index > -1) {
          newStandardSelected.splice(index, 1);
        }
      }
      
      // Combiner les périodes standard avec les périodes personnalisées
      const newTimeOfDay = [...newStandardSelected, ...customSelected] as TimeOfDay[];
      
      console.log("New timeOfDay:", newTimeOfDay);
      
      return { 
        ...prev, 
        timeOfDay: newTimeOfDay
      };
    });
  };
  
  // Gérer les changements dans les périodes personnalisées
  const handleCustomPeriodsChange = (periods: TimeOfDay[]) => {
    console.log("Custom periods change:", periods);
    setCustomTimePeriods(periods);
    
    // Mettre à jour timeOfDay dans medication
    setMedication((prev: any) => {
      // Récupérer les périodes standard sélectionnées
      const standardPeriods = ['morning', 'noon', 'evening', 'night'];
      const standardSelected = (prev.timeOfDay || [])
        .filter((period: string) => standardPeriods.includes(period));
      
      const newTimeOfDay = [...standardSelected, ...periods] as TimeOfDay[];
      console.log("Updated timeOfDay with custom periods:", newTimeOfDay);
      
      return {
        ...prev,
        timeOfDay: newTimeOfDay
      };
    });
  };

  // Gérer les changements de médecin
  const handleDoctorChange = (doctorId: string | null, doctorText: string) => {
    setMedication((prev: any) => ({
      ...prev,
      doctorId,
      prescribingDoctor: doctorText
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
