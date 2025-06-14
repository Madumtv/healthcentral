
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

const passwordChangeSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
  user: User | null;
}

export function PasswordChangeForm({ user }: PasswordChangeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordChangeValues) => {
    if (!user) return;

    console.log("🔐 Changing password for user:", user.id);
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) {
        console.error("❌ Password change error:", error);
        throw error;
      }
      
      form.reset();
      console.log("✅ Password changed successfully");
      toast.success("Mot de passe mis à jour avec succès !");
    } catch (error) {
      console.error("💥 Error changing password:", error);
      toast.error("La mise à jour du mot de passe a échoué.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p className="text-gray-500">Utilisateur non connecté</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Entrez votre nouveau mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirmez votre nouveau mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Mise à jour..." : "Changer le mot de passe"}
        </Button>
      </form>
    </Form>
  );
}
