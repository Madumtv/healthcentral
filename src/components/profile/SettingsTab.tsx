
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { User } from "@supabase/supabase-js";

interface SettingsTabProps {
  user: User | null;
}

export function SettingsTab({ user }: SettingsTabProps) {
  console.log("⚙️ SettingsTab rendering with user:", !!user);

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Utilisateur non connecté</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Gérez les paramètres de sécurité de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
