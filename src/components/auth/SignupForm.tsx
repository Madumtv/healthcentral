
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { signupSchema, SignupFormData, LoginFormData } from "./schemas";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { sanitizeInput, validateEmail, validatePassword, logSecurityEvent, rateLimiter } from "@/lib/security-utils";

interface SignupFormProps {
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
  onSignupSuccess: (loginData: LoginFormData) => void;
}

export const SignupForm = ({ isLoading, onLoadingChange, onSignupSuccess }: SignupFormProps) => {
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleSignup = async (values: SignupFormData) => {
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(values.email.toLowerCase().trim());
    const sanitizedName = sanitizeInput(values.name.trim());
    const sanitizedFirstName = values.firstName ? sanitizeInput(values.firstName.trim()) : undefined;
    const sanitizedLastName = values.lastName ? sanitizeInput(values.lastName.trim()) : undefined;
    const password = values.password;

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      toast.error("Format d'email invalide.");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }

    // Check rate limiting
    const rateLimitKey = `signup_${sanitizedEmail}`;
    if (rateLimiter.isRateLimited(rateLimitKey, 3, 60 * 60 * 1000)) {
      toast.error("Trop de tentatives d'inscription. Veuillez attendre 1 heure.");
      await logSecurityEvent('signup_rate_limited', { email: sanitizedEmail });
      return;
    }

    onLoadingChange(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: sanitizedName,
            first_name: sanitizedFirstName || null,
            last_name: sanitizedLastName || null,
          },
        },
      });

      if (error) {
        // Log failed signup attempt
        await logSecurityEvent('signup_failed', { 
          email: sanitizedEmail, 
          error: error.message 
        });

        if (error.message.includes('User already registered')) {
          toast.error("Un compte existe déjà avec cette adresse email.");
        } else if (error.message.includes('Password should be at least')) {
          toast.error("Le mot de passe doit respecter les critères de sécurité.");
        } else {
          toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
        }
        throw error;
      }

      // Clear rate limiting on successful signup
      rateLimiter.clear(rateLimitKey);
      
      // Log successful signup
      await logSecurityEvent('signup_successful', { 
        user_id: data.user?.id,
        email: sanitizedEmail 
      });

      toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      onSignupSuccess({
        email: sanitizedEmail,
        password: password,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>
          Créez votre compte PilulePal pour commencer à gérer vos médicaments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={signupForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Votre prénom" 
                        {...field} 
                        autoComplete="given-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de famille</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Votre nom de famille" 
                        {...field} 
                        autoComplete="family-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'affichage</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Votre nom" 
                      {...field} 
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={signupForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="votre@email.com" 
                      {...field} 
                      autoComplete="email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={signupForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
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
            
            <Button 
              type="submit" 
              className="w-full bg-medBlue hover:bg-blue-600"
              disabled={isLoading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>
          <div className="mt-4">
            <GoogleAuthButton isLoading={isLoading} onLoadingChange={onLoadingChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
