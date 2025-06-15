
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UseAvatarUploadProps {
  user: User | null;
  currentAvatarUrl?: string | null;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export function useAvatarUpload({ user, currentAvatarUrl, onAvatarUpdate }: UseAvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState(currentAvatarUrl);

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

      // Obtenir l'URL publique avec un timestamp pour éviter le cache
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
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

      // Mettre à jour l'état local immédiatement
      setLocalAvatarUrl(avatarUrl);
      
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

  return {
    uploading,
    localAvatarUrl,
    uploadAvatar
  };
}
