
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Pill, Calendar, User, ArrowRight, ClipboardCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulation d'authentification
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-medBlue to-blue-500 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">
                Gérez vos médicaments en toute simplicité
              </h1>
              <p className="text-xl mb-8">
                PilulePal vous aide à organiser vos prises de médicaments et à ne jamais oublier votre traitement.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-medBlue hover:bg-gray-100"
                  onClick={() => isLoggedIn ? navigate("/dashboard") : setIsLoggedIn(true)}
                >
                  {isLoggedIn ? "Accéder à mon espace" : "Commencer maintenant"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/about")}
                >
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="pb-2">
                  <Pill className="h-12 w-12 text-medBlue mb-2" />
                  <CardTitle>Gestion des médicaments</CardTitle>
                  <CardDescription>
                    Enregistrez tous vos médicaments avec leurs informations détaillées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Nom, dosage, et description</li>
                    <li>Moments de prise (matin, midi, soir...)</li>
                    <li>Fréquence dans la semaine</li>
                    <li>Notes personnelles</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <Calendar className="h-12 w-12 text-medBlue mb-2" />
                  <CardTitle>Planification personnalisée</CardTitle>
                  <CardDescription>
                    Organisez vos prises selon votre emploi du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Planification par jour de la semaine</li>
                    <li>Moments de prise adaptables</li>
                    <li>Vue d'ensemble de votre traitement</li>
                    <li>Adaptez selon vos besoins</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <User className="h-12 w-12 text-medBlue mb-2" />
                  <CardTitle>Espace personnel</CardTitle>
                  <CardDescription>
                    Accédez à vos informations sur tous vos appareils
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Connexion sécurisée</li>
                    <li>Données synchronisées</li>
                    <li>Personnalisation de votre espace</li>
                    <li>Accès aux informations médicales</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Prêt à mieux gérer votre traitement ?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Rejoignez PilulePal et gardez le contrôle sur vos médicaments en toute simplicité.
              </p>
              <Button 
                size="lg" 
                className="bg-medBlue hover:bg-blue-600"
                onClick={() => isLoggedIn ? navigate("/dashboard") : setIsLoggedIn(true)}
              >
                <ClipboardCheck className="mr-2 h-5 w-5" />
                {isLoggedIn ? "Accéder à mon espace" : "Créer mon compte gratuit"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Pill className="h-6 w-6 text-white mr-2" />
              <span className="text-lg font-semibold">PilulePal</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PilulePal. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
