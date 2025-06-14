
import { Doctor } from "@/lib/supabase-doctors-service";
import { OrdomedicDoctor } from "./ordomedic/types";
import { filterMockDoctors } from "./ordomedic/mock-data";
import { searchLocalDoctors } from "./ordomedic/local-search";
import { supabase } from "@/integrations/supabase/client";

class OrdomedicService {
  private readonly baseUrl = 'https://ordomedic.be';

  /**
   * Recherche des médecins avec scraping en temps réel d'ordomedic.be
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      console.log(`OrdomedicService: recherche pour "${query}"`);
      
      // 1. Si pas de requête, retourner quelques médecins populaires des mock data
      if (!query || query.trim().length < 2) {
        return filterMockDoctors('').slice(0, 5);
      }

      // 2. Recherche dans la base locale d'abord
      const localResults = await searchLocalDoctors(query);
      
      if (localResults.length > 0) {
        console.log(`Trouvé ${localResults.length} médecins dans la base locale`);
        return localResults;
      }

      // 3. Scraping en temps réel d'ordomedic.be
      console.log("Aucun résultat local, lancement du scraping d'ordomedic.be...");
      const scrapedResults = await this.scrapeOrdomedic(query);
      
      if (scrapedResults.length > 0) {
        console.log(`Trouvé ${scrapedResults.length} médecins via scraping`);
        return scrapedResults;
      }

      // 4. Fallback vers les données simulées étendues
      console.log("Aucun résultat du scraping, utilisation des données simulées...");
      const mockResults = filterMockDoctors(query);
      console.log(`Trouvé ${mockResults.length} médecins simulés`);
      
      return mockResults;
    } catch (error) {
      console.error('Erreur lors de la recherche ordomedic:', error);
      // Fallback vers la recherche simulée uniquement
      return filterMockDoctors(query);
    }
  }

  /**
   * Scraping en temps réel d'ordomedic.be via Edge Function
   */
  private async scrapeOrdomedic(query: string): Promise<Doctor[]> {
    try {
      console.log(`Lancement du scraping pour: "${query}"`);
      
      const { data, error } = await supabase.functions.invoke('scrape-ordomedic', {
        body: { query },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Erreur Edge Function:', error);
        return []; // Retourner un tableau vide au lieu de throw
      }

      if (!data) {
        console.warn('Aucune donnée retournée du scraping');
        return [];
      }

      // Vérifier si la réponse contient une erreur
      if (data.error) {
        console.warn('Erreur dans la réponse du scraping:', data.error);
        return [];
      }

      if (!data.doctors || !Array.isArray(data.doctors)) {
        console.warn('Format de données invalide retourné du scraping');
        return [];
      }

      // Convertir les résultats scrapés au format Doctor
      const doctors: Doctor[] = data.doctors.map((scraped: any, index: number) => ({
        id: scraped.id || `ordo_scraped_${Date.now()}_${index}`,
        first_name: scraped.first_name,
        last_name: scraped.last_name,
        specialty: scraped.specialty,
        address: scraped.address,
        city: scraped.city,
        postal_code: scraped.postal_code,
        phone: scraped.phone,
        email: scraped.email,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      console.log(`Conversion réussie: ${doctors.length} médecins scrapés`);
      return doctors;

    } catch (error) {
      console.error('Erreur lors du scraping ordomedic:', error);
      return []; // Retourner un tableau vide au lieu de throw
    }
  }
}

export const ordomedicService = new OrdomedicService();
