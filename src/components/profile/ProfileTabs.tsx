
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInfoTab } from "./ProfileInfoTab";
import { MedicationsTab } from "./MedicationsTab";
import { SettingsTab } from "./SettingsTab";
import { User } from "@supabase/supabase-js";
import { ProfileFormValues } from "./ProfileForm";

interface Profile {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  email: string;
  avatar_url?: string;
}

interface ProfileTabsProps {
  user: User | null;
  profile: Profile | null;
  onProfileUpdate: (values: ProfileFormValues) => void;
}

export function ProfileTabs({ user, profile, onProfileUpdate }: ProfileTabsProps) {
  console.log("🎯 ProfileTabs rendering with:", { 
    hasUser: !!user, 
    hasProfile: !!profile,
    profileName: profile?.name 
  });

  if (!user || !profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Données du profil non disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="medications">Mes médicaments</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileInfoTab 
            user={user} 
            profile={profile} 
            onProfileUpdate={onProfileUpdate} 
          />
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <MedicationsTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
