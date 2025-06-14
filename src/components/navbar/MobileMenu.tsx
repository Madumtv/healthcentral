
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Pill, Users, User, LogIn } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { UserAvatar } from "./UserAvatar";

interface Profile {
  avatar_url?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

interface MobileMenuProps {
  user: SupabaseUser | null;
  profile: Profile | null;
  getInitials: () => string;
  onLogout: () => void;
  onToggleMenu: () => void;
}

export function MobileMenu({ user, profile, getInitials, onLogout, onToggleMenu }: MobileMenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    onToggleMenu();
  };

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <Link
          to="/"
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
          onClick={onToggleMenu}
        >
          <Home className="h-4 w-4 mr-2" />
          Accueil
        </Link>

        {user ? (
          <>
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
              onClick={onToggleMenu}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Aujourd'hui
            </Link>
            <Link
              to="/medications"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
              onClick={onToggleMenu}
            >
              <Pill className="h-4 w-4 mr-2" />
              Mes médicaments
            </Link>
            <Link
              to="/doctors"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
              onClick={onToggleMenu}
            >
              <Users className="h-4 w-4 mr-2" />
              Médecins
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50"
              onClick={onToggleMenu}
            >
              À propos
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 flex items-center"
              onClick={onToggleMenu}
            >
              {profile?.avatar_url ? (
                <UserAvatar 
                  avatarUrl={profile.avatar_url} 
                  initials={getInitials()} 
                />
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
              onClick={onToggleMenu}
            >
              À propos
            </Link>
            <Button
              onClick={() => {
                navigate("/auth");
                onToggleMenu();
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
  );
}
