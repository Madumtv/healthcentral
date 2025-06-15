
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: number; // minutes avant la prise
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    reminderTime: 15
  });
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier le statut actuel des permissions
    setPermission(Notification.permission);
    
    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('medication-notifications');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications non supportées",
        description: "Votre navigateur ne supporte pas les notifications.",
        variant: "destructive",
      });
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      toast({
        title: "Notifications activées",
        description: "Vous recevrez maintenant des rappels pour vos médicaments.",
      });
      return true;
    } else {
      toast({
        title: "Permissions refusées",
        description: "Vous devez autoriser les notifications pour recevoir des rappels.",
        variant: "destructive",
      });
      return false;
    }
  };

  const scheduleNotification = (medicationName: string, timeUntil: number) => {
    if (permission !== "granted" || !settings.enabled) return;

    const timeout = setTimeout(() => {
      new Notification(`Rappel médicament - ${medicationName}`, {
        body: `Il est temps de prendre votre médicament : ${medicationName}`,
        icon: "/favicon.ico",
        badge: "/favicon.ico"
      });
    }, timeUntil);

    return timeout;
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('medication-notifications', JSON.stringify(newSettings));
  };

  return {
    permission,
    settings,
    requestPermission,
    scheduleNotification,
    updateSettings
  };
};
