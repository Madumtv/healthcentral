
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Pill, User, LogIn, Users, Calendar, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  avatar_url?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user profile for avatar
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url, name, first_name, last_name')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchUser(); // Refetch profile data
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate("/");
    setIsMenuOpen(false);
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
    }
    return profile?.name?.charAt(0) || user?.email?.charAt(0) || "U";
  };

  return (
    <nav className="bg-white shadow-sm border-b w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Pill className="h-8 w-auto text-medBlue" />
              <span className="ml-2 text-xl font-semibold text-medBlue">
                PilulePal
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Accueil
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Aujourd'hui
                </Link>
                <Link to="/medications" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue flex items-center">
                  <Pill className="h-4 w-4 mr-1" />
                  Mes médicaments
                </Link>
                <Link to="/doctors" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Médecins
                </Link>
                <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue">
                  À propos
                </Link>
                <Link 
                  to="/profile" 
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue flex items-center"
                >
                  {profile?.avatar_url ? (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={profile.avatar_url} alt="Avatar" />
                      <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Profil
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-medBlue"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue">
                  À propos
                </Link>
                <Button 
                  onClick={() => navigate("/auth")} 
                  className="flex items-center bg-medBlue hover:bg-blue-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-medBlue"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
              onClick={toggleMenu}
            >
              <Home className="h-4 w-4 mr-2" />
              Accueil
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
                  onClick={toggleMenu}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Aujourd'hui
                </Link>
                <Link
                  to="/medications"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
                  onClick={toggleMenu}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Mes médicaments
                </Link>
                <Link
                  to="/doctors"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
                  onClick={toggleMenu}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Médecins
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  À propos
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
                  onClick={toggleMenu}
                >
                  {profile?.avatar_url ? (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={profile.avatar_url} alt="Avatar" />
                      <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  Profil
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  À propos
                </Link>
                <Button
                  onClick={() => {
                    navigate("/auth");
                    toggleMenu();
                  }}
                  className="w-full mt-2 flex items-center justify-center bg-medBlue hover:bg-blue-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
