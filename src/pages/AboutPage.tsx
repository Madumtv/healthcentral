
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-medBlue">À propos de PilulePal</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Notre mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  PilulePal est né d'une volonté de simplifier la gestion des traitements médicamenteux au quotidien. 
                  Notre mission est d'aider les personnes suivant un traitement à mieux s'organiser, à ne jamais oublier 
                  une prise et à avoir toutes les informations nécessaires à portée de main.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Comment ça marche ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  PilulePal vous permet de créer votre pilulier numérique personnalisé :
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li><span className="font-medium">Créez votre compte</span> pour sécuriser vos données</li>
                  <li><span className="font-medium">Ajoutez vos médicaments</span> avec toutes leurs informations (nom, dosage, etc.)</li>
                  <li><span className="font-medium">Personnalisez votre planning</span> en définissant les moments de prise et la fréquence</li>
                  <li><span className="font-medium">Accédez à votre tableau de bord</span> pour une vue d'ensemble de votre traitement</li>
                  <li><span className="font-medium">Consultez les informations</span> sur vos médicaments à tout moment</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Confidentialité et sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Nous accordons la plus haute importance à la protection de vos données personnelles et médicales. 
                  Toutes les informations que vous enregistrez sur PilulePal sont sécurisées et ne sont jamais 
                  partagées avec des tiers sans votre consentement explicite. Notre application respecte les normes 
                  les plus strictes en matière de confidentialité des données de santé.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Pour toute question, suggestion ou assistance, n'hésitez pas à nous contacter :
                </p>
                <div className="space-y-2 text-gray-700">
                  <p>Email : contact@pilulepal.fr</p>
                  <p>Téléphone : +33 (0)1 23 45 67 89</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

export default AboutPage;
