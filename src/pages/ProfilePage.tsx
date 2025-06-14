
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
      console.log("Checking user session...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found, redirecting to auth");
        navigate("/auth");
        return;
      }

      console.log("Session found, user:", session.user.id);
      setUser(session.user);

      try {
        console.log("Fetching profile for user:", session.user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Aucun profil trouvé, on en crée un
            console.log("No profile found, creating one...");
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email?.split('@')[0] || 'Utilisateur',
                is_verified: session.user.email_confirmed_at !== null
              })
              .select()
              .single();

            if (createError) {
              console.error("Error creating profile:", createError);
              throw createError;
            }

            console.log("Profile created successfully:", newProfile);
            setProfile(newProfile as Profile);
          } else {
            console.error("Error fetching profile:", error);
            throw error;
          }
        } else {
          console.log("Profile found:", data);
          setProfile(data as Profile);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast.error("Impossible de charger les informations du profil.");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
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
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    
    // Rafraîchir le profil dans le hook useAuth pour mettre à jour la navbar
    await refreshProfile();
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
