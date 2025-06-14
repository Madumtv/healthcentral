
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { LogOut } from "lucide-react";

interface SettingsTabProps {
  user: User | null;
}

export function SettingsTab({ user }: SettingsTabProps) {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Vous avez été déconnecté avec succès");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Modifiez votre mot de passe pour sécuriser votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm user={user} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Déconnexion</CardTitle>
          <CardDescription>
            Déconnectez-vous de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
