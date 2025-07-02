import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Shield, Users, Clock, Heart } from "lucide-react";
const AboutPage = () => {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* En-tête de la page */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Pill className="h-12 w-12 text-medBlue mr-3" />
                <h1 className="text-4xl font-bold text-medBlue">HealthCentral</h1>
              </div>
              <p className="text-xl text-gray-600">
                Votre compagnon numérique pour une gestion simple et efficace de vos traitements
              </p>
            </div>

            {/* Concept du site */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2" />
                  Notre concept
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">HealthCentralrévolutionne la gestion de vos médicaments en transformant votre smartphone en un pilulier intelligent. Fini les oublis, les confusions ou les inquiétudes liées à votre traitement médical.</p>
                <p className="text-gray-700">
                  Notre application centralise toutes les informations importantes de vos médicaments, 
                  vous accompagne au quotidien avec des rappels personnalisés et vous permet de 
                  suivre l'évolution de votre traitement en temps réel.
                </p>
              </CardContent>
            </Card>

            {/* Fonctionnalités principales */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  Fonctionnalités principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📱 Pilulier numérique</h4>
                    <p className="text-gray-700 text-sm">
                      Organisez tous vos médicaments dans un interface claire et intuitive
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">⏰ Rappels intelligents</h4>
                    <p className="text-gray-700 text-sm">
                      Recevez des notifications personnalisées pour ne jamais oublier une prise
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">👨‍⚕️ Gestion des médecins</h4>
                    <p className="text-gray-700 text-sm">
                      Centralisez les informations de vos professionnels de santé
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Suivi personnalisé</h4>
                    <p className="text-gray-700 text-sm">
                      Visualisez votre historique de prises et suivez vos progrès
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment ça marche */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 text-green-500 mr-2" />
                  Comment ça marche ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-medBlue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Créez votre compte</h4>
                      <p className="text-gray-700 text-sm">Sécurisez vos données médicales avec un compte personnel protégé</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-medBlue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Ajoutez vos médicaments</h4>
                      <p className="text-gray-700 text-sm">Enregistrez facilement tous vos traitements avec leurs informations complètes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-medBlue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Configurez vos rappels</h4>
                      <p className="text-gray-700 text-sm">Personnalisez les horaires et la fréquence selon vos besoins</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-medBlue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Suivez votre traitement</h4>
                      <p className="text-gray-700 text-sm">Consultez votre tableau de bord pour une vue d'ensemble de votre santé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité et confidentialité */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 text-purple-500 mr-2" />
                  Sécurité et confidentialité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  La protection de vos données personnelles et médicales est notre priorité absolue. 
                  PilulePal utilise les technologies de sécurité les plus avancées pour garantir la 
                  confidentialité de vos informations.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Chiffrement de bout en bout de toutes vos données</li>
                  <li>Hébergement sécurisé conforme aux normes RGPD</li>
                  <li>Aucun partage de données avec des tiers sans votre consentement</li>
                  <li>Accès strictement personnel à votre pilulier numérique</li>
                  <li>Suppression définitive de vos données sur demande</li>
                </ul>
              </CardContent>
            </Card>

            {/* Mentions légales */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Mentions légales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Éditeur du site</h4>
                  <p className="text-gray-700 text-sm">
                    PilulePal SAS<br />
                    Capital social : 10 000 €<br />
                    RCS Paris : 123 456 789<br />
                    Siège social : 123 Avenue de la Santé, 75001 Paris, France<br />
                    Téléphone : +33 (0)1 23 45 67 89<br />
                    Email : contact@pilulepal.fr
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Directeur de la publication</h4>
                  <p className="text-gray-700 text-sm">Dr. Marie Dubois, Directrice Générale</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Hébergement</h4>
                  <p className="text-gray-700 text-sm">
                    Supabase Inc.<br />
                    970 Toa Payoh North #07-04<br />
                    Singapore 318992<br />
                    www.supabase.com
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Propriété intellectuelle</h4>
                  <p className="text-gray-700 text-sm">L'ensemble des contenus présents sur le site HealthCentral (textes, images, logos, graphismes, etc.) sont protégés par le droit d'auteur et appartiennent à HealthCentral SAS ou à leurs auteurs respectifs. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Données personnelles</h4>
                  <p className="text-gray-700 text-sm">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez 
                    d'un droit d'accès, de rectification, de suppression et de portabilité de vos données 
                    personnelles. Pour exercer ces droits, contactez-nous à l'adresse : privacy@pilulepal.fr
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Responsabilité</h4>
                  <p className="text-gray-700 text-sm">HealthCentral est un outil d'aide à la gestion des médicaments et ne remplace en aucun cas l'avis d'un professionnel de santé. En cas de doute sur votre traitement, consultez immédiatement votre médecin ou pharmacien.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Droit applicable</h4>
                  <p className="text-gray-700 text-sm">Les présentes mentions légales sont régies par le droit belge. En cas de litige, les tribunaux belgesseront seuls compétents.</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Nous contacter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Support utilisateur</h4>
                    <p className="text-gray-700 text-sm">
                      Email : support@pilulepal.fr<br />
                      Téléphone : +33 (0)1 23 45 67 89<br />
                      Horaires : Lundi-Vendredi 9h-18h
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Partenariats</h4>
                    <p className="text-gray-700 text-sm">
                      Email : partenaires@pilulepal.fr<br />
                      Pour les professionnels de santé,<br />
                      pharmacies et établissements médicaux
                    </p>
                  </div>
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
    </div>;
};
export default AboutPage;