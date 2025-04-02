
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string | null;
  email: string | null;
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
  return (
    <div className="flex items-center mb-6">
      <Avatar className="h-16 w-16 mr-4">
        <AvatarFallback>{name?.charAt(0) || email?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{name || "Utilisateur"}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
