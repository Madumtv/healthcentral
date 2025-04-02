
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { MedicationsTab } from "./MedicationsTab";
import { SettingsTab } from "./SettingsTab";
import { User } from "@supabase/supabase-js";
import { ProfileFormValues } from "./ProfileForm";

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface ProfileTabsProps {
  user: User | null;
  profile: Profile | null;
  onProfileUpdate: (values: ProfileFormValues) => void;
}

export function ProfileTabs({ user, profile, onProfileUpdate }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="profile">
      <TabsList className="mb-4">
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="medications">Mes médicaments</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileInfoTab 
          user={user} 
          profile={profile} 
          onProfileUpdate={onProfileUpdate} 
        />
      </TabsContent>

      <TabsContent value="medications">
        <MedicationsTab />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
}
