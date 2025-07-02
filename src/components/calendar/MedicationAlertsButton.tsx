import { useState } from "react";
import { Bell, BellRing, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isToday, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "@/hooks/use-toast";

interface MedicationAlertsButtonProps {
  medicationDoses: any[];
  selectedDate: Date;
}

export const MedicationAlertsButton = ({ medicationDoses, selectedDate }: MedicationAlertsButtonProps) => {
  const { toast } = useToast();
  const { settings: notificationSettings, scheduleNotification } = useNotifications();
  const [alertsScheduled, setAlertsScheduled] = useState(false);

  const scheduleAllMedicationAlerts = () => {
    if (!isToday(selectedDate) || !notificationSettings.enabled) {
      toast({
        title: "Alertes non programmées",
        description: "Les alertes ne peuvent être programmées que pour aujourd'hui et nécessitent l'activation des notifications.",
        variant: "destructive"
      });
      return;
    }

    const pendingDoses = medicationDoses.filter(dose => !dose.is_taken);
    
    if (pendingDoses.length === 0) {
      toast({
        title: "Aucune prise en attente",
        description: "Toutes les prises pour aujourd'hui ont été marquées comme prises.",
      });
      return;
    }

    let scheduledCount = 0;
    
    pendingDoses.forEach(dose => {
      const medication = dose.medications;
      if (!medication) return;

      const now = new Date();
      let reminderTime = new Date();
      
      // Définir des heures approximatives pour chaque période
      switch (dose.time_of_day) {
        case 'morning':
          reminderTime.setHours(8, 0, 0, 0);
          break;
        case 'noon':
          reminderTime.setHours(12, 0, 0, 0);
          break;
        case 'evening':
          reminderTime.setHours(18, 0, 0, 0);
          break;
        case 'night':
          reminderTime.setHours(22, 0, 0, 0);
          break;
        default:
          return; // Ignorer les périodes personnalisées
      }

      // Programmer l'alerte X minutes avant
      const notificationTime = new Date(reminderTime.getTime() - (notificationSettings.reminderTime * 60 * 1000));
      const timeUntilNotification = notificationTime.getTime() - now.getTime();

      if (timeUntilNotification > 0) {
        const timeout = scheduleNotification(medication.name, timeUntilNotification);
        if (timeout) {
          scheduledCount++;
        }
      }
    });

    if (scheduledCount > 0) {
      setAlertsScheduled(true);
      toast({
        title: "Alertes programmées",
        description: `${scheduledCount} alerte(s) ont été programmées pour vos prises de médicaments.`,
      });
    } else {
      toast({
        title: "Aucune alerte programmée",
        description: "Toutes les heures de prise sont déjà passées pour aujourd'hui.",
      });
    }
  };

  const pendingDoses = medicationDoses.filter(dose => !dose.is_taken);
  const canSchedule = isToday(selectedDate) && notificationSettings.enabled && pendingDoses.length > 0;

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
          <BellRing className="h-4 w-4" />
          Alertes médicaments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Clock className="h-4 w-4" />
          <span>{pendingDoses.length} prise(s) en attente</span>
          {notificationSettings.enabled && (
            <Badge variant="secondary" className="text-xs">
              {notificationSettings.reminderTime} min avant
            </Badge>
          )}
        </div>

        <Button
          onClick={scheduleAllMedicationAlerts}
          disabled={!canSchedule || alertsScheduled}
          className="w-full"
          size="sm"
        >
          <Bell className="h-4 w-4 mr-2" />
          {alertsScheduled ? "Alertes programmées" : "Programmer les alertes"}
        </Button>

        {!isToday(selectedDate) && (
          <p className="text-xs text-muted-foreground">
            Les alertes ne peuvent être programmées que pour aujourd'hui
          </p>
        )}

        {!notificationSettings.enabled && isToday(selectedDate) && (
          <p className="text-xs text-muted-foreground">
            Activez les notifications pour programmer des alertes
          </p>
        )}
      </CardContent>
    </Card>
  );
};