
import { Doctor } from "@/lib/supabase-doctors-service";
import { OrdomedicDoctor } from "./ordomedic/types";
import { filterMockDoctors } from "./ordomedic/mock-data";
import { searchLocalDoctors } from "./ordomedic/local-search";
import { supabase } from "@/integrations/supabase/client";

class OrdomedicService {
  private readonly baseUrl = 'https://ordomedic.be';

  /**
   * Recherche des médecins avec priorité aux données simulées réalistes
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      console.log(`OrdomedicService: recherche pour "${query}"`);
      
      // 1. Si pas de requête, retourner quelques médecins populaires
      if (!query || query.trim().length < 2) {
        return this.getPopularDoctors();
      }

      // 2. Recherche dans la base locale d'abord
      const localResults = await searchLocalDoctors(query);
      
      if (localResults.length > 0) {
        console.log(`Trouvé ${localResults.length} médecins dans la base locale`);
        return localResults;
      }

      // 3. Appel à l'Edge Function pour données simulées réalistes
      console.log("Recherche via Edge Function avec données réalistes...");
      const edgeFunctionResults = await this.callEdgeFunction(query);
      
      if (edgeFunctionResults.length > 0) {
        console.log(`Trouvé ${edgeFunctionResults.length} médecins via Edge Function`);
        return edgeFunctionResults;
      }

      // 4. Fallback vers les données mock étendues
      console.log("Utilisation des données mock étendues...");
      const mockResults = filterMockDoctors(query);
      console.log(`Trouvé ${mockResults.length} médecins mock`);
      
      return mockResults;
    } catch (error) {
      console.error('Erreur lors de la recherche ordomedic:', error);
      // Fallback absolu vers les données mock
      return filterMockDoctors(query);
    }
  }

  /**
   * Obtenir quelques médecins populaires
   */
  private getPopularDoctors(): Doctor[] {
    const popularDoctors = [
      {
        id: `popular_${Date.now()}_1`,
        first_name: 'Jean',
        last_name: 'MARTIN',
        specialty: 'Médecine générale',
        city: 'Bruxelles',
        postal_code: '1000',
        address: '123 Avenue Louise',
        phone: '02 123 45 67',
        email: 'jean.martin@cabinet.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: `popular_${Date.now()}_2`,
        first_name: 'Marie',
        last_name: 'DUBOIS',
        specialty: 'Cardiologie',
        city: 'Liège',
        postal_code: '4000',
        address: '456 Rue de la Paix',
        phone: '04 987 65 43',
        email: 'marie.dubois@cardio.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    return popularDoctors;
  }

  /**
   * Appel à l'Edge Function améliorée
   */
  private async callEdgeFunction(query: string): Promise<Doctor[]> {
    try {
      console.log(`Appel Edge Function pour: "${query}"`);
      
      const { data, error } = await supabase.functions.invoke('scrape-ordomedic', {
        body: { query },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Erreur Edge Function:', error);
        return [];
      }

      if (!data || !data.doctors || !Array.isArray(data.doctors)) {
        console.warn('Format de données invalide retourné de l\'Edge Function');
        return [];
      }

      // Convertir les résultats au format Doctor
      const doctors: Doctor[] = data.doctors.map((scraped: any, index: number) => ({
        id: scraped.id || `edge_${Date.now()}_${index}`,
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

      console.log(`Conversion réussie: ${doctors.length} médecins de l'Edge Function`);
      return doctors;

    } catch (error) {
      console.error('Erreur lors de l\'appel Edge Function:', error);
      return [];
    }
  }
}

export const ordomedicService = new OrdomedicService();
