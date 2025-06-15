
import { useEffect, useState } from "react";
import { format, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/use-notifications";

interface ActiveRemindersProps {
  medicationDoses: any[];
  selectedDate: Date;
}

export const ActiveReminders = ({ medicationDoses, selectedDate }: ActiveRemindersProps) => {
  const { settings, scheduleNotification } = useNotifications();
  const [scheduledReminders, setScheduledReminders] = useState<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Nettoyer les anciens rappels
    scheduledReminders.forEach((timeout) => clearTimeout(timeout));
    const newReminders = new Map<string, NodeJS.Timeout>();

    if (!settings.enabled || !isToday(selectedDate)) {
      setScheduledReminders(newReminders);
      return;
    }

    // Programmer les nouveaux rappels pour aujourd'hui
    medicationDoses
      .filter(dose => !dose.is_taken)
      .forEach(dose => {
        const medication = dose.medications;
        if (!medication) return;

        // Calculer le temps jusqu'à la prise (simulation avec heure actuelle + période)
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
            return; // Ignorer les périodes personnalisées pour le moment
        }

        // Programmer le rappel X minutes avant
        const notificationTime = new Date(reminderTime.getTime() - (settings.reminderTime * 60 * 1000));
        const timeUntilNotification = notificationTime.getTime() - now.getTime();

        if (timeUntilNotification > 0) {
          const timeout = scheduleNotification(medication.name, timeUntilNotification);
          if (timeout) {
            newReminders.set(dose.id, timeout);
          }
        }
      });

    setScheduledReminders(newReminders);

    return () => {
      newReminders.forEach((timeout) => clearTimeout(timeout));
    };
  }, [medicationDoses, selectedDate, settings, scheduleNotification]);

  if (!settings.enabled || !isToday(selectedDate) || scheduledReminders.size === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
          <Bell className="h-4 w-4" />
          Rappels programmés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Clock className="h-4 w-4" />
          <span>{scheduledReminders.size} rappel(s) actif(s)</span>
          <Badge variant="secondary" className="text-xs">
            {settings.reminderTime} min avant
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
