
import { Link } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { UserAvatar } from "./UserAvatar";
import { useUserRole } from "@/hooks/useUserRole";
import { Settings } from "lucide-react";

interface Profile {
  avatar_url?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

interface NavLinksProps {
  user: SupabaseUser | null;
  profile: Profile;
  getInitials: () => string;
}

export const NavLinks = ({ user, profile, getInitials }: NavLinksProps) => {
  const { isAdmin } = useUserRole();

  if (!user) {
    return (
      <>
        <Link to="/about" className="text-gray-700 hover:text-medBlue px-3 py-2 text-sm font-medium">
          À propos
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/dashboard" className="text-gray-700 hover:text-medBlue px-3 py-2 text-sm font-medium">
        Tableau de bord
      </Link>
      <Link to="/medications" className="text-gray-700 hover:text-medBlue px-3 py-2 text-sm font-medium">
        Médicaments
      </Link>
      <Link to="/doctors" className="text-gray-700 hover:text-medBlue px-3 py-2 text-sm font-medium">
        Médecins
      </Link>
      <Link to="/calendar" className="text-gray-700 hover:text-medBlue px-3 py-2 text-sm font-medium">
        Calendrier
      </Link>
      
      {isAdmin && (
        <Link 
          to="/admin" 
          className="text-gray-700 hover:text-medBlue px-3 py-2 text-sm font-medium flex items-center"
          title="Administration"
        >
          <Settings className="h-4 w-4 mr-1" />
          Admin
        </Link>
      )}
      
      <UserAvatar 
        avatarUrl={profile.avatar_url} 
        initials={getInitials()} 
        showFallbackIcon={false} 
      />
    </>
  );
};
