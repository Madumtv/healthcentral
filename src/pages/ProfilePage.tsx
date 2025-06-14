
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

  useEffect(() => {
    const checkUser = async () => {
      console.log("Début du chargement du profil...");
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session récupérée:", session);
      
      if (!session) {
        console.log("Aucune session trouvée, redirection vers /auth");
        navigate("/auth");
        return;
      }

      console.log("Utilisateur connecté:", session.user.id);
      setUser(session.user);

      try {
        console.log("Tentative de récupération du profil pour l'utilisateur:", session.user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log("Réponse Supabase:", { data, error });

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          
          // Si le profil n'existe pas, on le crée
          if (error.code === 'PGRST116') {
            console.log("Profil non trouvé, création d'un nouveau profil...");
            
            const newProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'Utilisateur',
              first_name: null,
              last_name: null,
              birth_date: null,
              avatar_url: null
            };

            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (createError) {
              console.error("Erreur lors de la création du profil:", createError);
              throw createError;
            }

            console.log("Profil créé avec succès:", createdProfile);
            setProfile(createdProfile as Profile);
          } else {
            throw error;
          }
        } else {
          console.log("Profil récupéré avec succès:", data);
          setProfile(data as Profile);
        }
      } catch (error) {
        console.error("Erreur fatale lors du chargement du profil:", error);
        toast.error("Impossible de charger les informations du profil.");
      } finally {
        console.log("Fin du chargement du profil");
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    console.log("Mise à jour du profil local:", values);
    setProfile(prev => prev ? { 
      ...prev, 
      name: values.name,
      first_name: values.firstName || undefined,
      last_name: values.lastName || undefined,
      birth_date: values.birthDate ? values.birthDate.toISOString() : undefined
    } : null);
    
    // Rafraîchir le profil dans le hook useAuth pour mettre à jour la navbar
    await refreshProfile();
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    console.log("Mise à jour de l'avatar:", avatarUrl);
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    
    // Rafraîchir le profil dans le hook useAuth pour mettre à jour la navbar
    await refreshProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Chargement du profil...</p>
            <p className="text-sm text-gray-500 mt-2">Vérifiez la console pour plus d'informations</p>
          </div>
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
