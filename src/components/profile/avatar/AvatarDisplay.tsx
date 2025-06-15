
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarDisplayProps {
  avatarUrl?: string | null;
  initials: string;
  size?: string;
}

export function AvatarDisplay({ avatarUrl, initials, size = "h-24 w-24" }: AvatarDisplayProps) {
  return (
    <Avatar className={size}>
      {avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt="Avatar" 
          onError={(e) => {
            console.error("❌ Erreur chargement image:", avatarUrl);
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      )}
    </Avatar>
  );
}
