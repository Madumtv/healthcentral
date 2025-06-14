
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm, ProfileFormValues } from "./ProfileForm";
import { User } from "@supabase/supabase-js";

interface ProfileInfoTabProps {
  user: User | null;
  profile: { 
    name: string;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
  } | null;
  onProfileUpdate: (values: ProfileFormValues) => void;
}

export function ProfileInfoTab({ user, profile, onProfileUpdate }: ProfileInfoTabProps) {
  // Convertir la date de naissance de string en Date si elle existe
  const birthDate = profile?.birth_date ? new Date(profile.birth_date) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du profil</CardTitle>
        <CardDescription>
          Modifiez vos informations personnelles ici.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm 
          initialValues={{ 
            name: profile?.name || "",
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            birthDate: birthDate
          }}
          user={user}
          onSuccess={onProfileUpdate}
        />
      </CardContent>
    </Card>
  );
}
