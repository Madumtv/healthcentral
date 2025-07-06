# HealthCentral

HealthCentral is a medication management application built with React, Vite and Supabase. It helps you keep track of your treatments, reminds you when to take them and stores your medical contacts in one secure place.

## Features

- **Digital pillbox** – organise medications with detailed scheduling
- **Calendar view** – mark doses as taken day by day
- **Smart reminders** – get notifications for upcoming doses
- **Doctor management** – keep a list of your health professionals
- **Profile dashboard** – manage your personal information
- **Admin area** – tools for managing doctors and future system settings
- **Supabase backend** – authentication and storage of all application data

## Setup

1. Install Node.js (version 18 or higher).
2. Clone this repository and install dependencies:
   ```sh
   git clone <repo_url>
   cd healthcentral
   npm install
   ```
3. Create a `.env` file and provide your Supabase credentials:
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Development commands

- `npm run dev` – start the Vite dev server
- `npm run build` – create a production build
- `npm run build:dev` – build with development settings
- `npm run lint` – run ESLint
- `npm run test` – run unit tests
- `npm run preview` – preview the production build locally

## License

HealthCentral is released under the MIT License.
