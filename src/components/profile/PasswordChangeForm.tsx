
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { validatePassword, sanitizeInput, logSecurityEvent, rateLimiter } from "@/lib/security-utils";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Le mot de passe actuel doit contenir au moins 6 caractères.",
  }),
  newPassword: z.string().min(8, {
    message: "Le nouveau mot de passe doit contenir au moins 8 caractères.",
  }),
  confirmNewPassword: z.string().min(8, {
    message: "La confirmation du mot de passe doit contenir au moins 8 caractères.",
  }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmNewPassword"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
  user: User | null;
}

export function PasswordChangeForm({ user }: PasswordChangeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: PasswordChangeFormValues) => {
    if (!user) {
      toast.error("Vous devez être connecté pour changer votre mot de passe.");
      return;
    }

    // Check rate limiting
    const rateLimitKey = `password_change_${user.id}`;
    if (rateLimiter.isRateLimited(rateLimitKey, 3, 15 * 60 * 1000)) {
      toast.error("Trop de tentatives. Veuillez attendre 15 minutes avant de réessayer.");
      await logSecurityEvent('password_change_rate_limited', { user_id: user.id });
      return;
    }

    // Validate new password strength
    const passwordValidation = validatePassword(values.newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(user.email!);
      const currentPassword = values.currentPassword;
      const newPassword = values.newPassword;

      // Verify current password using our secure RPC function
      const { data: isValidPassword, error: verificationError } = await supabase
        .rpc('verify_user_password', {
          user_email: sanitizedEmail,
          current_password: currentPassword
        });

      if (verificationError) {
        console.error("Erreur lors de la vérification du mot de passe:", verificationError);
        toast.error("Erreur lors de la vérification du mot de passe actuel.");
        await logSecurityEvent('password_verification_error', { 
          user_id: user.id, 
          error: verificationError.message 
        });
        return;
      }

      if (!isValidPassword) {
        toast.error("Le mot de passe actuel est incorrect.");
        await logSecurityEvent('invalid_current_password_attempt', { user_id: user.id });
        return;
      }

      // Change the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      toast.success("Mot de passe modifié avec succès !");
      form.reset();
      
      // Clear rate limiting on success
      rateLimiter.clear(rateLimitKey);
      
      // Log successful password change
      await logSecurityEvent('password_changed_successfully', { user_id: user.id });
      
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast.error(error.message || "La modification du mot de passe a échoué.");
      await logSecurityEvent('password_change_failed', { 
        user_id: user.id, 
        error: error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe actuel</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  {...field} 
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  {...field} 
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un chiffre.
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  {...field} 
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          <LockKeyhole className="mr-2 h-4 w-4" />
          {isSubmitting ? "Modification en cours..." : "Changer le mot de passe"}
        </Button>
      </form>
    </Form>
  );
}
