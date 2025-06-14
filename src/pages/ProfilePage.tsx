
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileFormValues } from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  email: string;
  avatar_url?: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("📝 Chargement du profil pour l'utilisateur:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      console.log("✅ Profil chargé:", data);
      setProfile(data as Profile);
    } catch (error) {
      console.error("❌ Erreur lors du chargement du profil:", error);
      toast.error("Impossible de charger les informations du profil.");
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadUserProfile(session.user.id);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      console.log("🔄 Mise à jour du profil avec les valeurs:", values);
      
      // Attendre un court délai pour s'assurer que la base de données est mise à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Recharger les données depuis la base
      await loadUserProfile(user.id);
      
      // Rafraîchir le profil dans le hook useAuth pour mettre à jour la navbar
      await refreshProfile();
      
      console.log("✅ Profil mis à jour avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    if (!user) return;

    try {
      // Recharger les données depuis la base
      await loadUserProfile(user.id);
      
      // Rafraîchir le profil dans le hook useAuth pour mettre à jour la navbar
      await refreshProfile();
      
      console.log("✅ Avatar mis à jour avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de l'avatar:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Chargement du profil...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container flex-grow py-10">
        <ProfileHeader 
          user={user}
          name={profile?.name} 
          firstName={profile?.first_name}
          lastName={profile?.last_name}
          email={user?.email || null}
          avatarUrl={profile?.avatar_url}
          onAvatarUpdate={handleAvatarUpdate}
        />
        
        <ProfileTabs 
          user={user} 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate} 
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
