
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
  const [profile, setProfile] = useState<Profile | null>(null);
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
        return;
      }

      if (profileData) {
        console.log("✅ Profile fetched:", profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log("🔐 Initializing auth...");
    setIsLoading(true);

    // Vérifier la session actuelle
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Session error:", error);
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log("✅ Session found:", session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log("ℹ️ No active session");
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("❌ Error checking session:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, session?.user?.email || 'No user');
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
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
