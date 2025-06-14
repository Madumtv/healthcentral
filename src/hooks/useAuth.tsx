
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
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('avatar_url, name, first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("❌ Error fetching profile:", error);
        setProfile(null);
        return;
      }
      
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
            console.log("🔍 Setting user state:", session.user.email);
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            console.log("ℹ️ No user session found");
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
          console.log("🔄 Auth initialization complete, loading:", false);
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

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, session?.user?.id);
        console.log("🔍 Session details:", session?.user?.email);
        
        if (mounted) {
          if (session?.user) {
            console.log("✅ Setting user from auth change:", session.user.email);
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            console.log("❌ Clearing user from auth change");
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      }
    );

    // Then initialize
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add debug logging for state changes
  useEffect(() => {
    console.log("🎯 Auth state updated - User:", !!user, "Loading:", loading, "Profile:", !!profile);
    if (user) {
      console.log("👤 Current user email:", user.email);
    }
  }, [user, loading, profile]);

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
