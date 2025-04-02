
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

interface Profile {
  id: string;
  name: string;
  email: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setProfile(data as Profile);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast.error("Impossible de charger les informations du profil.");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  const handleProfileUpdate = (values: ProfileFormValues) => {
    setProfile(prev => prev ? { ...prev, name: values.name } : null);
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
          name={profile?.name} 
          email={user?.email || null} 
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
