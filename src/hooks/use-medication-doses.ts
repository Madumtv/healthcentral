
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MedicationDose } from "./use-medication-doses/types";
import { loadMedicationDoses } from "./use-medication-doses/data-loader";
import { createDoseActions } from "./use-medication-doses/actions";

export const useMedicationDoses = (selectedDate: Date) => {
  const [isLoading, setIsLoading] = useState(true);
  const [medicationDoses, setMedicationDoses] = useState<MedicationDose[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoses = async () => {
      try {
        setIsLoading(true);
        const doses = await loadMedicationDoses(selectedDate, toast);
        setMedicationDoses(doses);
      } finally {
        setIsLoading(false);
      }
    };

    // Vérifier si l'utilisateur est authentifié
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      loadDoses();
    };

    checkAuth();
  }, [selectedDate, toast, navigate]);

  const actions = createDoseActions(setMedicationDoses, toast);

  return {
    isLoading,
    medicationDoses,
    ...actions
  };
};
