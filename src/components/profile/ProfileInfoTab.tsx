
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
  console.log("📝 ProfileInfoTab rendering with:", { 
    hasUser: !!user, 
    hasProfile: !!profile,
    profileData: profile 
  });

  if (!user || !profile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Aucune donnée de profil disponible</p>
        </CardContent>
      </Card>
    );
  }

  // Convertir la date de naissance de string en Date si elle existe
  const birthDate = profile.birth_date ? new Date(profile.birth_date) : undefined;

  const initialValues = {
    name: profile.name || "",
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    birthDate: birthDate
  };

  console.log("📝 ProfileInfoTab initial values:", initialValues);

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
          initialValues={initialValues}
          user={user}
          onSuccess={onProfileUpdate}
        />
      </CardContent>
    </Card>
  );
}
