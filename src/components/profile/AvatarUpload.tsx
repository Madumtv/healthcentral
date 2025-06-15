
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
      console.log("🔄 Début de l'upload d'avatar...");

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      if (!user?.id) {
        throw new Error('Utilisateur non connecté.');
      }

      const file = event.target.files[0];
      console.log("📁 Fichier sélectionné:", file.name, "Taille:", file.size);
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La taille du fichier ne doit pas dépasser 5MB.');
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Veuillez sélectionner un fichier image.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log("📤 Upload du fichier vers:", filePath);

      // Vérifier que le bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log("🪣 Buckets disponibles:", buckets);
      
      if (bucketsError) {
        console.error("❌ Erreur lors de la récupération des buckets:", bucketsError);
        throw new Error("Erreur de configuration du stockage");
      }

      const avatarBucket = buckets?.find(bucket => bucket.id === 'avatars');
      if (!avatarBucket) {
        console.error("❌ Bucket 'avatars' non trouvé");
        throw new Error("Le stockage d'avatars n'est pas configuré");
      }

      // Supprimer l'ancien avatar s'il existe
      if (currentAvatarUrl) {
        try {
          const oldPath = currentAvatarUrl.split('/').slice(-2).join('/');
          console.log("🗑️ Suppression de l'ancien avatar:", oldPath);
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([oldPath]);
          
          if (deleteError) {
            console.warn("⚠️ Impossible de supprimer l'ancien avatar:", deleteError);
          }
        } catch (error) {
          console.warn("⚠️ Erreur lors de la suppression de l'ancien avatar:", error);
        }
      }

      // Upload du nouveau fichier
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error("❌ Erreur upload:", uploadError);
        throw new Error(`Erreur lors de l'upload: ${uploadError.message}`);
      }

      console.log("✅ Fichier uploadé avec succès:", uploadData);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;
      console.log("🔗 URL publique générée:", avatarUrl);

      // Mettre à jour le profil dans la base de données
      console.log("💾 Mise à jour du profil en base...");
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id)
        .select();

      if (updateError) {
        console.error("❌ Erreur mise à jour profil:", updateError);
        throw new Error(`Erreur lors de la mise à jour du profil: ${updateError.message}`);
      }

      console.log("✅ Profil mis à jour en base:", updateData);

      // Notifier le composant parent
      onAvatarUpdate(avatarUrl);
      toast.success('Avatar mis à jour avec succès !');

      // Vider le champ de fichier pour permettre de re-uploader le même fichier
      event.target.value = '';

    } catch (error) {
      console.error('❌ Erreur complète lors du téléchargement:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors du téléchargement de l\'avatar.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          {currentAvatarUrl ? (
            <AvatarImage 
              src={currentAvatarUrl} 
              alt="Avatar" 
              onError={(e) => {
                console.error("❌ Erreur chargement image:", currentAvatarUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
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
        {uploading ? 'Téléchargement en cours...' : 'Cliquez sur l\'icône pour changer votre avatar'}
      </p>
    </div>
  );
}
