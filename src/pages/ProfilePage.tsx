
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
    const initializeProfile = async () => {
      console.log("🔄 Initializing profile page...");
      
      try {
        // Vérifier la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Session error:", sessionError);
          navigate("/auth");
          return;
        }

        if (!session?.user) {
          console.log("❌ No session found, redirecting to auth");
          navigate("/auth");
          return;
        }

        console.log("✅ Session found for user:", session.user.id);
        setUser(session.user);

        // Récupérer ou créer le profil
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("❌ Error fetching profile:", fetchError);
          throw fetchError;
        }

        if (existingProfile) {
          console.log("✅ Profile found:", existingProfile);
          setProfile(existingProfile as Profile);
        } else {
          console.log("ℹ️ No profile found, creating one...");
          
          const newProfileData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.email?.split('@')[0] || 'Utilisateur',
            is_verified: session.user.email_confirmed_at !== null
          };

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();

          if (createError) {
            console.error("❌ Error creating profile:", createError);
            throw createError;
          }

          console.log("✅ Profile created successfully:", newProfile);
          setProfile(newProfile as Profile);
        }

      } catch (error) {
        console.error("💥 Profile initialization error:", error);
        toast.error("Impossible de charger le profil. Veuillez réessayer.");
      } finally {
        setLoading(false);
        console.log("🏁 Profile initialization completed");
      }
    };

    initializeProfile();
  }, [navigate]);

  const handleProfileUpdate = async (values: ProfileFormValues) => {
    if (!profile) return;
    
    console.log("🔄 Updating profile with values:", values);
    
    const updatedProfile = { 
      ...profile, 
      name: values.name,
      first_name: values.firstName || undefined,
      last_name: values.lastName || undefined,
      birth_date: values.birthDate ? values.birthDate.toISOString() : undefined
    };
    
    setProfile(updatedProfile);
    await refreshProfile();
    
    console.log("✅ Profile updated successfully");
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    if (!profile) return;
    
    console.log("🔄 Updating avatar URL:", avatarUrl);
    
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    await refreshProfile();
    
    console.log("✅ Avatar updated successfully");
  };

  if (loading) {
    console.log("⏳ Profile page is loading...");
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    console.log("❌ No user or profile data available");
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Erreur lors du chargement du profil.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  console.log("✅ Rendering profile page with data:", { user: user.id, profile: profile.name });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto flex-grow py-8 px-4">
        <ProfileHeader 
          user={user}
          name={profile.name} 
          firstName={profile.first_name}
          lastName={profile.last_name}
          email={user.email || null}
          avatarUrl={profile.avatar_url}
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
