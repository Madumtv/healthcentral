import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Crown, Settings } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, name, first_name, last_name');

      if (profilesError) {
        console.error("Erreur lors de la récupération des profils:", profilesError);
        return;
      }

      // Récupérer les rôles pour chaque utilisateur
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase.rpc('get_user_role', {
            _user_id: profile.id
          });
          
          return {
            ...profile,
            role: roleData || 'user'
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Supprimer l'ancien rôle
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Ajouter le nouveau rôle avec le bon type
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole as 'admin' | 'moderator' | 'user'
        });

      if (error) {
        console.error("Erreur lors de la mise à jour du rôle:", error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le rôle de l'utilisateur",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Rôle mis à jour avec succès"
      });

      // Rafraîchir la liste
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Gestion des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse">Chargement des utilisateurs...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Gestion des utilisateurs et rôles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Gérez les rôles et permissions des utilisateurs de l'application.
            <br />
            <strong>Admin:</strong> Accès complet • <strong>Moderator:</strong> Gestion limitée • <strong>User:</strong> Utilisateur standard
          </div>
          
          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.name || 'Utilisateur'}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant={getRoleBadgeVariant(user.role || 'user')} className="flex items-center space-x-1">
                      {getRoleIcon(user.role || 'user')}
                      <span className="capitalize">{user.role || 'user'}</span>
                    </Badge>
                    
                    <Select
                      value={user.role || 'user'}
                      onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button onClick={fetchUsers} variant="outline" className="w-full">
            Actualiser la liste
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};