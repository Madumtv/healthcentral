import { useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { LoginFormData } from "@/components/auth/schemas";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleSignupSuccess = (loginData: LoginFormData) => {
    // Auto-switch to login tab after successful signup
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Pill className="h-12 w-12 text-medBlue" />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                isLoading={isLoading} 
                onLoadingChange={setIsLoading} 
              />
              <CardFooter className="flex justify-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Vous n'avez pas de compte ? Cliquez sur "Inscription"
                </p>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="signup">
              <SignupForm 
                isLoading={isLoading} 
                onLoadingChange={setIsLoading}
                onSignupSuccess={handleSignupSuccess}
              />
              <CardFooter className="flex justify-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Vous avez déjà un compte ? Cliquez sur "Connexion"
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;