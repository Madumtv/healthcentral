
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string | null;
}

export function ProfileHeader({ name, firstName, lastName, email }: ProfileHeaderProps) {
  // Construire le nom d'affichage en fonction des données disponibles
  const displayName = name || 
                     (firstName && lastName ? `${firstName} ${lastName}` : 
                     firstName || lastName || "Utilisateur");
  
  // Récupérer les initiales pour l'avatar
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    }
    return name?.charAt(0) || email?.charAt(0) || "U";
  };

  return (
    <div className="flex items-center mb-6">
      <Avatar className="h-16 w-16 mr-4">
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{displayName}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
