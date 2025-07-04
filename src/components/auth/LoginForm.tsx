import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { loginSchema, LoginFormData } from "./schemas";
import { GoogleAuthButton } from "./GoogleAuthButton";

interface LoginFormProps {
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export const LoginForm = ({ isLoading, onLoadingChange }: LoginFormProps) => {
  const navigate = useNavigate();
  
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormData) => {
    onLoadingChange(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte PilulePal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-medBlue hover:bg-blue-600"
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
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