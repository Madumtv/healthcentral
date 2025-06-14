
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

  // S'assurer que nous avons des valeurs par défaut correctes
  const initialValues = {
    name: profile?.name || "",
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    birthDate: birthDate
  };

  console.log("🔧 ProfileInfoTab - Valeurs initiales transmises:", initialValues);
  console.log("🔧 ProfileInfoTab - Profile reçu:", profile);

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
          key={profile?.id || 'no-profile'} // Force re-render quand le profil change
          initialValues={initialValues}
          user={user}
          onSuccess={onProfileUpdate}
        />
      </CardContent>
    </Card>
  );
}
