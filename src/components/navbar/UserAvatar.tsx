
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  avatarUrl?: string;
  initials: string;
  showFallbackIcon?: boolean;
}

export function UserAvatar({ avatarUrl, initials, showFallbackIcon = false }: UserAvatarProps) {
  return (
    <Avatar className="h-6 w-6 mr-2">
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt="Avatar" />
      ) : showFallbackIcon ? (
        <User className="h-4 w-4" />
      ) : (
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      )}
    </Avatar>
  );
}
