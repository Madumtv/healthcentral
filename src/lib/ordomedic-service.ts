
import { Doctor } from "@/lib/supabase-doctors-service";
import { OrdomedicDoctor } from "./ordomedic/types";
import { filterMockDoctors } from "./ordomedic/mock-data";
import { searchLocalDoctors } from "./ordomedic/local-search";

class OrdomedicService {
  private readonly baseUrl = 'https://ordomedic.be';

  /**
   * Recherche des médecins avec priorité sur la base locale
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      console.log(`OrdomedicService: recherche pour "${query}"`);
      
      // 1. Si pas de requête, retourner quelques médecins populaires
      if (!query || query.trim().length < 2) {
        return filterMockDoctors('').slice(0, 5);
      }

      // 2. Recherche dans la base locale d'abord
      const localResults = await searchLocalDoctors(query);
      
      if (localResults.length > 0) {
        console.log(`Trouvé ${localResults.length} médecins dans la base locale`);
        return localResults;
      }

      // 3. Recherche dans les données simulées étendues
      console.log("Aucun résultat local, recherche dans les données simulées...");
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
   * Scrape les données depuis Ordomedic (pas utilisé pour le moment)
   */
  private async scrapeOrdomedic(query: string): Promise<OrdomedicDoctor[]> {
    // Implémentation du scraping ici (nécessite une librairie comme Cheerio)
    console.warn('Scraping Ordomedic non implémenté');
    return [];
  }
}

export const ordomedicService = new OrdomedicService();
