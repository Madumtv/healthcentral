import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Calendar, Bell, Users, Shield, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
const Index = () => {
  const features = [{
    icon: Pill,
    title: "Pilulier numérique",
    description: "Organisez tous vos médicaments dans un interface claire et moderne"
  }, {
    icon: Bell,
    title: "Rappels intelligents",
    description: "Ne manquez plus jamais une prise grâce à nos notifications personnalisées"
  }, {
    icon: Calendar,
    title: "Planification avancée",
    description: "Planifiez vos prises selon vos horaires et vos besoins spécifiques"
  }, {
    icon: Users,
    title: "Suivi médical",
    description: "Gardez le contact avec vos professionnels de santé et partagez vos données"
  }, {
    icon: Shield,
    title: "Sécurité maximale",
    description: "Vos données médicales sont protégées avec les plus hauts standards de sécurité"
  }];
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medBlue to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Pill className="h-16 w-16 text-white mr-4" />
              <h1 className="text-5xl font-bold">HealthCentral</h1>
            </div>
            <p className="text-xl mb-8 text-blue-100">Toute votre santé, organisée simplement : traitements, contacts et piluliers réunis</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-medBlue hover:bg-gray-100 font-semibold px-8">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8">
                  <Info className="mr-2 h-5 w-5" />
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir HealthCentral?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez comment notre application révolutionne la gestion de vos médicaments au quotidien
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-medBlue rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à simplifier la gestion de vos médicaments ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">Rejoignez des milliers d'utilisateurs qui font déjà confiance à HealthCentralpour leur santé</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-medBlue hover:bg-blue-600 font-semibold px-8">
                  Créer mon compte gratuitement
                </Button>
              </Link>
              <Badge variant="outline" className="text-green-600 border-green-600">
                100% Gratuit
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Pill className="h-6 w-6 text-white mr-2" />
              <span className="text-lg font-semibold">HealthCentral</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                À propos
              </Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <span className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PilulePal. Tous droits réservés.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;