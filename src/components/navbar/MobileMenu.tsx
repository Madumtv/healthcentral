
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { LogIn, Settings } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { UserAvatar } from "./UserAvatar";

interface Profile {
  avatar_url?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

interface MobileMenuProps {
  user: SupabaseUser | null;
  profile: Profile;
  getInitials: () => string;
  onLogout: () => void;
  onToggleMenu: () => void;
}

export const MobileMenu = ({ user, profile, getInitials, onLogout, onToggleMenu }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  const handleNavigation = (path: string) => {
    navigate(path);
    onToggleMenu();
  };

  if (!user) {
    return (
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={() => handleNavigation("/about")}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full text-left"
          >
            À propos
          </button>
          <Button 
            onClick={() => handleNavigation("/auth")} 
            className="w-full bg-medBlue hover:bg-blue-600 mt-4"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <button
          onClick={() => handleNavigation("/dashboard")}
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full text-left"
        >
          Tableau de bord
        </button>
        <button
          onClick={() => handleNavigation("/medications")}
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full text-left"
        >
          Médicaments
        </button>
        <button
          onClick={() => handleNavigation("/doctors")}
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full text-left"
        >
          Médecins
        </button>
        <button
          onClick={() => handleNavigation("/calendar")}
          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full text-left"
        >
          Calendrier
        </button>
        
        {isAdmin && (
          <button
            onClick={() => handleNavigation("/admin")}
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full text-left"
          >
            <Settings className="h-4 w-4 mr-2" />
            Administration
          </button>
        )}
        
        <Link
          to="/profile"
          onClick={onToggleMenu}
          className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-medBlue hover:bg-gray-50 w-full"
        >
          <UserAvatar 
            avatarUrl={profile.avatar_url} 
            initials={getInitials()} 
            showFallbackIcon={false} 
          />
          <span className="ml-2">Profil</span>
        </Link>
        
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="w-full text-left justify-start text-gray-700 hover:text-medBlue mt-4"
        >
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
