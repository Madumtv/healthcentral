
import { Link } from "react-router-dom";
import { Home, Calendar, Pill, Users, User } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { UserAvatar } from "./UserAvatar";

interface Profile {
  avatar_url?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

interface NavLinksProps {
  user: SupabaseUser | null;
  profile: Profile | null;
  getInitials: () => string;
  className?: string;
}

export function NavLinks({ user, profile, getInitials, className = "" }: NavLinksProps) {
  const baseClassName = "px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue flex items-center";
  const linkClassName = `${baseClassName} ${className}`;

  return (
    <>
      <Link to="/" className={linkClassName}>
        <Home className="h-4 w-4 mr-1" />
        Accueil
      </Link>
      
      {user ? (
        <>
          <Link to="/dashboard" className={linkClassName}>
            <Calendar className="h-4 w-4 mr-1" />
            Aujourd'hui
          </Link>
          <Link to="/medications" className={linkClassName}>
            <Pill className="h-4 w-4 mr-1" />
            Mes médicaments
          </Link>
          <Link to="/doctors" className={linkClassName}>
            <Users className="h-4 w-4 mr-1" />
            Médecins
          </Link>
          <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue">
            À propos
          </Link>
          <Link to="/profile" className={linkClassName}>
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
        </>
      ) : (
        <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-medBlue">
          À propos
        </Link>
      )}
    </>
  );
}
