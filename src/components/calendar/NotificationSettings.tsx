
import { useState } from "react";
import { Bell, BellOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNotifications } from "@/hooks/use-notifications";

export const NotificationSettings = () => {
  const { permission, settings, requestPermission, updateSettings } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleEnableNotifications = async () => {
    if (permission === "default") {
      const granted = await requestPermission();
      if (granted) {
        updateSettings({ ...settings, enabled: true });
      }
    } else if (permission === "granted") {
      updateSettings({ ...settings, enabled: !settings.enabled });
    } else {
      // Permission refusée, expliquer comment l'activer
      alert("Les notifications ont été refusées. Veuillez les activer dans les paramètres de votre navigateur.");
    }
  };

  const handleReminderTimeChange = (value: string) => {
    updateSettings({ ...settings, reminderTime: parseInt(value) });
  };

  const getNotificationStatus = () => {
    if (permission === "denied") return "Refusées";
    if (permission === "default") return "Non configurées";
    if (permission === "granted" && settings.enabled) return "Activées";
    return "Désactivées";
  };

  const getStatusColor = () => {
    if (permission === "denied") return "text-red-600";
    if (permission === "granted" && settings.enabled) return "text-green-600";
    return "text-yellow-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {settings.enabled && permission === "granted" ? (
            <Bell className="h-4 w-4 text-green-600" />
          ) : (
            <BellOff className="h-4 w-4 text-gray-400" />
          )}
          Notifications
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres de notification
          </DialogTitle>
          <DialogDescription>
            Configurez vos rappels de médicaments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Statut actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {getNotificationStatus()}
              </p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-sm font-medium">
              Activer les notifications
            </Label>
            <Switch
              id="notifications"
              checked={settings.enabled && permission === "granted"}
              onCheckedChange={handleEnableNotifications}
              disabled={permission === "denied"}
            />
          </div>

          {settings.enabled && permission === "granted" && (
            <div className="space-y-2">
              <Label htmlFor="reminder-time" className="text-sm font-medium">
                Rappel avant la prise
              </Label>
              <Select value={settings.reminderTime.toString()} onValueChange={handleReminderTimeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {permission === "denied" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                Les notifications ont été refusées. Pour les activer, allez dans les paramètres de votre navigateur et autorisez les notifications pour ce site.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
