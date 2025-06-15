
import { AvatarUpload } from "./AvatarUpload";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

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
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl);

  // Mettre à jour l'avatar local quand les props changent
  useEffect(() => {
    setCurrentAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  // Gestionnaire pour la mise à jour de l'avatar
  const handleAvatarUpdate = (newAvatarUrl: string) => {
    console.log("🔄 Mise à jour de l'avatar dans ProfileHeader:", newAvatarUrl);
    setCurrentAvatarUrl(newAvatarUrl);
    onAvatarUpdate(newAvatarUrl);
  };

  // Construire le nom d'affichage en fonction des données disponibles
  const displayName = name || 
                     (firstName && lastName ? `${firstName} ${lastName}` : 
                     firstName || lastName || "Utilisateur");

  return (
    <div className="flex items-center mb-6">
      <div className="mr-6">
        <AvatarUpload
          user={user}
          currentAvatarUrl={currentAvatarUrl}
          name={name}
          firstName={firstName}
          lastName={lastName}
          email={email}
          onAvatarUpdate={handleAvatarUpdate}
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
