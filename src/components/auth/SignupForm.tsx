
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
    console.log("🚀 Starting signup process...");
    
    const sanitizedEmail = values.email.toLowerCase().trim();
    const sanitizedName = values.name.trim();
    const sanitizedFirstName = values.firstName?.trim() || "";
    const sanitizedLastName = values.lastName?.trim() || "";

    onLoadingChange(true);
    try {
      console.log("📝 Attempting to sign up user:", sanitizedEmail);
      
      const { error, data } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: sanitizedName,
            first_name: sanitizedFirstName,
            last_name: sanitizedLastName,
          },
        },
      });

      if (error) {
        console.error("❌ Signup error:", error);
        
        if (error.message.includes('User already registered')) {
          toast.error("Un compte existe déjà avec cette adresse email.");
        } else if (error.message.includes('Password should be at least')) {
          toast.error("Le mot de passe doit respecter les critères de sécurité.");
        } else if (error.message.includes('Invalid email')) {
          toast.error("Adresse email invalide.");
        } else {
          toast.error(`Erreur lors de l'inscription: ${error.message}`);
        }
        return;
      }

      console.log("✅ Signup successful:", data);
      
      if (data.user && !data.session) {
        toast.success("Inscription réussie ! Vérifiez votre email pour confirmer votre compte.");
      } else if (data.session) {
        toast.success("Inscription réussie ! Vous êtes maintenant connecté.");
      }
      
      // Auto-switch to login tab after successful signup
      onSignupSuccess({
        email: sanitizedEmail,
        password: values.password,
      });
      
    } catch (error: any) {
      console.error("❌ Unexpected error during signup:", error);
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>
          Créez votre compte HealthCentral pour commencer à gérer vos médicaments
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
