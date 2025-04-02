
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm, ProfileFormValues } from "./ProfileForm";
import { User } from "@supabase/supabase-js";

interface ProfileInfoTabProps {
  user: User | null;
  profile: { name: string } | null;
  onProfileUpdate: (values: ProfileFormValues) => void;
}

export function ProfileInfoTab({ user, profile, onProfileUpdate }: ProfileInfoTabProps) {
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
          initialValues={{ name: profile?.name || "" }}
          user={user}
          onSuccess={onProfileUpdate}
        />
      </CardContent>
    </Card>
  );
}
