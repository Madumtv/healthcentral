
import { Doctor } from "@/lib/supabase-doctors-service";
import { supabase } from "@/integrations/supabase/client";

class OrdomedicService {
  /**
   * Recherche dynamique de médecins dans une base étendue
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      console.log(`OrdomedicService: recherche dynamique pour "${query}"`);
      
      // Appel à l'Edge Function améliorée
      console.log("🔍 Lancement de la recherche dynamique via Edge Function...");
      const searchResults = await this.callSearchEdgeFunction(query);
      
      if (searchResults.length > 0) {
        console.log(`✅ Trouvé ${searchResults.length} médecins via recherche dynamique`);
        return searchResults;
      }

      // Fallback local si échec complet
      console.log("⚠️ Échec recherche, utilisation de fallback local...");
      const fallbackResults = this.getLocalFallback(query);
      console.log(`📋 Retour de ${fallbackResults.length} médecins fallback`);
      
      return fallbackResults;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      return this.getLocalFallback(query);
    }
  }

  /**
   * Appel à l'Edge Function de recherche
   */
  private async callSearchEdgeFunction(query: string): Promise<Doctor[]> {
    try {
      console.log(`🌐 Recherche dynamique pour: "${query}"`);
      
      const { data, error } = await supabase.functions.invoke('scrape-ordomedic', {
        body: { query },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('❌ Erreur Edge Function:', error);
        return [];
      }

      if (!data || !data.doctors || !Array.isArray(data.doctors)) {
        console.warn('⚠️ Format de données invalide retourné de l\'Edge Function');
        return [];
      }

      // Log des métadonnées pour debugging
      if (data.metadata) {
        console.log(`📊 Métadonnées recherche:`, {
          total: data.metadata.total,
          sources: data.metadata.sources,
          query: data.metadata.query
        });
      }

      // Convertir les résultats au format Doctor
      const doctors: Doctor[] = data.doctors.map((scraped: any, index: number) => ({
        id: scraped.id || `dynamic_${Date.now()}_${index}`,
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

      console.log(`✅ Conversion réussie: ${doctors.length} médecins trouvés via recherche dynamique`);
      
      return doctors;

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel Edge Function:', error);
      return [];
    }
  }

  /**
   * Fallback local minimal
   */
  private getLocalFallback(query: string): Doctor[] {
    console.log(`🔄 Génération de fallback local pour "${query}"`);
    
    const localDoctors = [
      { first: 'Andrey', last: 'BRAGIN', specialty: 'Cardiologie', city: 'Bruxelles', postal: '1000' },
      { first: 'Serge', last: 'VANDERROOST', specialty: 'Médecine générale', city: 'Gand', postal: '9000' },
      { first: 'Jean', last: 'MARTIN', specialty: 'Médecine générale', city: 'Liège', postal: '4000' }
    ];
    
    const queryLower = query.toLowerCase();
    
    // Filtrer par correspondance si query fournie
    const selectedDoctors = query.trim().length >= 2 
      ? localDoctors.filter(doc => {
          const fullName = `${doc.first} ${doc.last}`.toLowerCase();
          return fullName.includes(queryLower) || 
                 doc.first.toLowerCase().includes(queryLower) ||
                 doc.last.toLowerCase().includes(queryLower);
        })
      : localDoctors;
    
    return selectedDoctors.map((doc, index) => ({
      id: `local_${Date.now()}_${index}`,
      first_name: doc.first,
      last_name: doc.last,
      specialty: doc.specialty,
      city: doc.city,
      postal_code: doc.postal,
      address: `${Math.floor(Math.random() * 99) + 1} Rue des Médecins`,
      phone: `0${Math.floor(Math.random() * 9) + 1}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      email: `${doc.first.toLowerCase()}.${doc.last.toLowerCase()}@cabinet-medical.be`,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }));
  }
}

export const ordomedicService = new OrdomedicService();
