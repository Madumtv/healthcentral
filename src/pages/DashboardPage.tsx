
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Pill } from "lucide-react";
import { Medication } from "@/types";
import { supabaseMedicationService } from "@/lib/supabase-medication-service";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { TodayMedicationsList } from "@/components/dashboard/TodayMedicationsList";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    console.log("🔍 Dashboard - Auth state:", { user: !!user, authLoading });
    
    if (authLoading) {
      console.log("⏳ Still loading auth...");
      return;
    }

    if (!user) {
      console.log("❌ No user found, redirecting to auth");
      navigate('/auth');
      return;
    }

    console.log("✅ User found in dashboard:", user.email);
    
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("❌ Error fetching profile in dashboard:", error);
          setUserName(user.email?.split('@')[0] || 'utilisateur');
          return;
        }
        
        // Construire le nom d'affichage en utilisant la même logique que useAuth
        const displayName = data?.name || 
                           (data?.first_name && data?.last_name ? `${data.first_name} ${data.last_name}` : 
                           data?.first_name || data?.last_name || user.email?.split('@')[0] || 'utilisateur');
        
        console.log("✅ Profile data in dashboard:", displayName);
        setUserName(displayName);
      } catch (error) {
        console.error("💥 Error in dashboard profile fetch:", error);
        setUserName(user.email?.split('@')[0] || 'utilisateur');
      }
    };

    checkAuth();
  }, [user, authLoading, navigate]);

  const fetchMedications = async () => {
    if (!user) {
      console.log("❌ No user, skipping medication fetch");
      return;
    }

    try {
      console.log("🔍 Fetching medications for user:", user.id);
      const data = await supabaseMedicationService.getAll();
      console.log("✅ Medications fetched:", data.length);
      setMedications(data);
    } catch (error) {
      console.error("❌ Error fetching medications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos médicaments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchMedications();
    }
  }, [user, authLoading, toast]);

  const handleEditMedication = (id: string) => {
    navigate(`/medications/edit/${id}`);
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      await supabaseMedicationService.delete(id);
      // Recharger la liste des médicaments pour synchroniser les changements
      await fetchMedications();
      toast({
        title: "Succès",
        description: "Médicament supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce médicament.",
        variant: "destructive",
      });
    }
  };

  // Afficher un loading pendant que l'auth se charge
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Pill className="h-8 w-8 animate-spin text-medBlue mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  // Créer des groupes par moment de prise
  const todayMedications = medications.filter(med => {
    const today = new Date().getDay();
    // Convertir jour JS (0=dim, 1=lun, ...) en notre format
    const daysMap: Record<number, string> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return med.daysOfWeek.includes(daysMap[today] as any);
  });

  const medicationsByTime: Record<string, Medication[]> = {
    morning: todayMedications.filter(med => med.timeOfDay.includes("morning")),
    noon: todayMedications.filter(med => med.timeOfDay.includes("noon")),
    evening: todayMedications.filter(med => med.timeOfDay.includes("evening")),
    night: todayMedications.filter(med => med.timeOfDay.includes("night")),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <DashboardGreeting userName={userName} />
          
          <TodayMedicationsList
            medicationsByTime={medicationsByTime}
            isLoading={isLoading}
            onEdit={handleEditMedication}
            onDelete={handleDeleteMedication}
          />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Pill className="h-6 w-6 text-white mr-2" />
              <span className="text-lg font-semibold">PilulePal</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PilulePal. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
