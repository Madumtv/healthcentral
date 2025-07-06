
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SettingsTab() {
  const [medicationAction, setMedicationAction] = useState<'details' | 'edit'>('edit');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les préférences de l'utilisateur
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Si des préférences sont stockées dans le profil, les charger
        // Pour l'instant on utilise localStorage comme solution simple
        const savedAction = localStorage.getItem('medicationDefaultAction') as 'details' | 'edit';
        if (savedAction) {
          setMedicationAction(savedAction);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Sauvegarder les préférences (ici on utilise localStorage pour simplicité)
      localStorage.setItem('medicationDefaultAction', medicationAction);
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Préférences des médicaments</CardTitle>
          <CardDescription>
            Choisissez l'action par défaut lorsque vous cliquez sur un médicament.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Action par défaut</Label>
            <RadioGroup
              value={medicationAction}
              onValueChange={(value: 'details' | 'edit') => setMedicationAction(value)}
              className="grid grid-cols-1 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="edit" id="edit" />
                <div className="flex-1">
                  <Label htmlFor="edit" className="font-medium cursor-pointer">
                    Éditer le médicament
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Ouvre directement le formulaire d'édition du médicament
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="details" id="details" />
                <div className="flex-1">
                  <Label htmlFor="details" className="font-medium cursor-pointer">
                    Voir les détails
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Ouvre le modal avec les informations détaillées du médicament
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <Button onClick={handleSaveSettings} disabled={isLoading} className="bg-medBlue hover:bg-blue-600">
            {isLoading ? "Sauvegarde..." : "Sauvegarder les paramètres"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
