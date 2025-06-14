
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Camera, Upload } from "lucide-react";

interface AvatarUploadProps {
  user: User | null;
  currentAvatarUrl?: string | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export function AvatarUpload({ 
  user, 
  currentAvatarUrl, 
  name, 
  firstName, 
  lastName, 
  email,
  onAvatarUpdate 
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    }
    return name?.charAt(0) || email?.charAt(0) || "U";
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(avatarUrl);
      toast.success('Avatar mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement de l\'avatar.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          {currentAvatarUrl ? (
            <AvatarImage src={currentAvatarUrl} alt="Avatar" />
          ) : (
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          )}
        </Avatar>
        <div className="absolute -bottom-2 -right-2">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Button
              type="button"
              size="sm"
              className="rounded-full p-2 h-8 w-8"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <Upload className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </span>
            </Button>
          </label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Cliquez sur l'icône pour changer votre avatar
      </p>
    </div>
  );
}
