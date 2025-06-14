
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log("📝 Fetching profile for user:", userId);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('avatar_url, name, first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        console.log("✅ Profile fetched:", profileData);
        setProfile(profileData);
      } else {
        console.log("ℹ️ No profile found for user");
        setProfile(null);
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log("🔐 Initializing auth...");
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("❌ Session error:", error);
        }

        if (mounted) {
          if (session?.user) {
            console.log("✅ User session found:", session.user.id);
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            console.log("ℹ️ No user session found");
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("💥 Auth initialization error:", error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, session?.user?.id);
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    console.log("🚪 Logging out...");
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      console.log("✅ Logout successful");
      navigate("/");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
    }
    return profile?.name?.charAt(0) || user?.email?.charAt(0) || "U";
  };

  return {
    user,
    profile,
    loading,
    handleLogout,
    getInitials,
    refreshProfile
  };
}
