
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  avatar_url?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log("📝 Fetching profile for user:", userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('avatar_url, name, first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("❌ Error fetching profile:", error);
        setProfile({});
        return;
      }

      if (profileData) {
        console.log("✅ Profile fetched:", profileData);
        // S'assurer que l'avatar_url est une chaîne ou undefined
        const cleanProfile = {
          ...profileData,
          avatar_url: profileData.avatar_url || undefined
        };
        setProfile(cleanProfile);
      } else {
        console.log("ℹ️ No profile data found, setting empty profile");
        setProfile({});
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      setProfile({});
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      console.log("🔄 Refreshing profile...");
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log("🔐 Initializing auth...");
    
    let mounted = true;

    // Fonction pour traiter un changement d'utilisateur
    const handleUserChange = async (newUser: SupabaseUser | null) => {
      if (!mounted) return;
      
      console.log("👤 Processing user change:", newUser?.email || 'No user');
      setUser(newUser);
      
      if (newUser) {
        // Charger le profil de manière asynchrone
        setTimeout(async () => {
          if (mounted) {
            await fetchProfile(newUser.id);
            setIsLoading(false);
          }
        }, 0);
      } else {
        setProfile({});
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, session?.user?.email || 'No user');
        
        if (!mounted) return;
        
        await handleUserChange(session?.user || null);
      }
    );

    const checkSession = async () => {
      try {
        console.log("🔍 Checking current session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error("❌ Session error:", error);
          await handleUserChange(null);
          return;
        }

        await handleUserChange(session?.user || null);
      } catch (error) {
        console.error("❌ Error checking session:", error);
        if (mounted) {
          await handleUserChange(null);
        }
      }
    };

    checkSession();

    return () => {
      console.log("🧹 Cleaning up auth subscription");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      await supabase.auth.signOut();
      setUser(null);
      setProfile({});
      navigate("/");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
    }
    if (profile?.name) {
      return profile.name.charAt(0);
    }
    return user?.email?.charAt(0) || "U";
  };

  console.log("🎯 Auth state - User:", !!user, "Profile:", !!profile, "Loading:", isLoading);

  return {
    user,
    profile,
    isLoading,
    handleLogout,
    getInitials,
    refreshProfile
  };
}
