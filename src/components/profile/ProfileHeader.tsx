
import { AvatarUpload } from "./AvatarUpload";
import { User } from "@supabase/supabase-js";

interface ProfileHeaderProps {
  user: User | null;
  name: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string | null;
  avatarUrl?: string | null;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export function ProfileHeader({ 
  user, 
  name, 
  firstName, 
  lastName, 
  email, 
  avatarUrl,
  onAvatarUpdate 
}: ProfileHeaderProps) {
  // Construire le nom d'affichage en fonction des données disponibles
  const displayName = name || 
                     (firstName && lastName ? `${firstName} ${lastName}` : 
                     firstName || lastName || "Utilisateur");

  return (
    <div className="flex items-center mb-6">
      <div className="mr-6">
        <AvatarUpload
          user={user}
          currentAvatarUrl={avatarUrl}
          name={name}
          firstName={firstName}
          lastName={lastName}
          email={email}
          onAvatarUpdate={onAvatarUpdate}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
