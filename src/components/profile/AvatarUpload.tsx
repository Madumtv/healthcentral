
import { User } from "@supabase/supabase-js";
import { AvatarDisplay } from "./avatar/AvatarDisplay";
import { AvatarUploadButton } from "./avatar/AvatarUploadButton";
import { useAvatarUpload } from "./avatar/useAvatarUpload";

interface AvatarUploadProps {
  user: User | null;
  currentAvatarUrl?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export function AvatarUpload({ 
  user, 
  currentAvatarUrl, 
  name, 
  firstName, 
  lastName, 
  email,
  onAvatarUpdate 
}: AvatarUploadProps) {
  const { uploading, localAvatarUrl, uploadAvatar } = useAvatarUpload({
    user,
    currentAvatarUrl,
    onAvatarUpdate
  });

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    }
    return name?.charAt(0) || email?.charAt(0) || "U";
  };

  // Utiliser l'URL locale si elle existe, sinon l'URL passée en props
  const displayAvatarUrl = localAvatarUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <AvatarDisplay 
          avatarUrl={displayAvatarUrl} 
          initials={getInitials()} 
        />
        <AvatarUploadButton 
          uploading={uploading} 
          onFileChange={uploadAvatar} 
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {uploading ? 'Téléchargement en cours...' : 'Cliquez sur l\'icône pour changer votre avatar'}
      </p>
    </div>
  );
}
