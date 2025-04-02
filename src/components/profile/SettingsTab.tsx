
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SettingsTab() {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Vous avez été déconnecté avec succès");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du compte</CardTitle>
        <CardDescription>
          Gérez les paramètres de votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            variant="destructive" 
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
