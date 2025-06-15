
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorsManagement } from "@/components/admin/DoctorsManagement";
import { AdminProtection } from "@/components/admin/AdminProtection";
import { Users, Stethoscope, Settings, Database, AlertTriangle } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <AdminProtection>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-medBlue flex items-center">
                <Settings className="mr-3 h-8 w-8" />
                Administration
              </h1>
              <p className="text-gray-600">Gestion des données et paramètres de l'application</p>
            </div>

            <Tabs defaultValue="doctors" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="doctors" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Médecins
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Système
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Monitoring
                </TabsTrigger>
              </TabsList>

              <TabsContent value="doctors">
                <DoctorsManagement />
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Interface de gestion des utilisateurs - à venir...
                      <br />
                      Fonctionnalités prévues :
                    </p>
                    <ul className="list-disc list-inside mt-3 text-sm text-gray-600 space-y-1">
                      <li>Liste des utilisateurs inscrits</li>
                      <li>Gestion des rôles et permissions</li>
                      <li>Désactivation/activation de comptes</li>
                      <li>Statistiques d'utilisation</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="system">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres système</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Configuration système - à venir...
                      <br />
                      Fonctionnalités prévues :
                    </p>
                    <ul className="list-disc list-inside mt-3 text-sm text-gray-600 space-y-1">
                      <li>Configuration de l'application</li>
                      <li>Maintenance de la base de données</li>
                      <li>Sauvegarde et restauration</li>
                      <li>Logs système</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monitoring">
                <Card>
                  <CardHeader>
                    <CardTitle>Monitoring et alertes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      Surveillance et monitoring - à venir...
                      <br />
                      Fonctionnalités prévues :
                    </p>
                    <ul className="list-disc list-inside mt-3 text-sm text-gray-600 space-y-1">
                      <li>Tableau de bord des métriques</li>
                      <li>Alertes système</li>
                      <li>Rapports d'erreurs</li>
                      <li>Performance de l'application</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </AdminProtection>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
