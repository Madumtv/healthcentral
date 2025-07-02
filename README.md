# HealthCentral

*An English version is available in [README.en.md](README.en.md).*

HealthCentral est une application de gestion de médicaments construite avec React, Vite et Supabase. Elle vous aide à suivre vos traitements, vous rappelle quand prendre vos doses et conserve vos contacts médicaux en un lieu sécurisé.

## Fonctionnalités

- **Pilulier numérique** – organisez vos médicaments avec une planification détaillée
- **Vue calendrier** – marquez les prises effectuées jour après jour
- **Rappels intelligents** – recevez des notifications pour les doses à venir
- **Gestion des médecins** – gardez la liste de vos professionnels de santé
- **Tableau de bord** – gérez vos informations personnelles
- **Zone d'administration** – outils pour gérer les médecins et les futurs paramètres du système
- **Backend Supabase** – authentification et stockage de toutes les données de l'application

## Mise en place

1. Installez Node.js (version 18 ou supérieure).
2. Clonez ce dépôt puis installez les dépendances :
   ```sh
   git clone <repo_url>
   cd healthcentral
   npm install
   ```
3. Créez un fichier `.env` et renseignez vos identifiants Supabase :
   ```
   VITE_SUPABASE_URL=<votre-url-supabase>
   VITE_SUPABASE_ANON_KEY=<votre-anon-key>
   SUPABASE_URL=<votre-url-supabase>
   SUPABASE_SERVICE_ROLE_KEY=<votre-service-role-key>
   ```
   La clé de rôle de service est uniquement utilisée par les fonctions Supabase côté serveur.
4. Démarrez le serveur de développement :
   ```sh
   npm run dev
   ```

## Commandes de développement

- `npm run dev` – démarre le serveur Vite
- `npm run build` – génère la version de production
- `npm run build:dev` – build avec les paramètres de développement
- `npm run lint` – exécute ESLint
- `npm run preview` – prévisualise la build de production localement

## Licence

HealthCentral est distribué sous licence MIT.
