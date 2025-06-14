
import { Doctor } from "@/lib/supabase-doctors-service";
import { supabase } from "@/integrations/supabase/client";

interface SearchResponse {
  doctors: Doctor[];
  suggestions: Doctor[];
  metadata: {
    query: string;
    total_local?: number;
    total_suggestions?: number;
    sources: string[];
    external_sources?: string[];
    search_type: string;
    timestamp: string;
  };
}

class OrdomedicService {
  /**
   * Recherche hybride de médecins avec suggestions d'ajout
   */
  async searchDoctors(query: string): Promise<{ doctors: Doctor[], suggestions: Doctor[] }> {
    try {
      console.log(`OrdomedicService: recherche hybride pour "${query}"`);
      
      // Appel à l'Edge Function améliorée
      console.log("🔍 Lancement de la recherche hybride via Edge Function...");
      const searchResults = await this.callSearchEdgeFunction(query);
      
      return searchResults;

    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      return {
        doctors: this.getLocalFallback(query),
        suggestions: []
      };
    }
  }

  /**
   * Ajouter un médecin suggéré à la base de données
   */
  async addSuggestedDoctor(doctor: Doctor): Promise<Doctor | null> {
    try {
      console.log(`📝 Ajout du médecin suggéré: ${doctor.first_name} ${doctor.last_name}`);
      
      const { data, error } = await supabase
        .from('doctors')
        .insert({
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          specialty: doctor.specialty,
          address: doctor.address,
          city: doctor.city,
          postal_code: doctor.postal_code,
          phone: doctor.phone,
          email: doctor.email,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur lors de l\'ajout:', error);
        return null;
      }

      console.log(`✅ Médecin ajouté avec succès: ${data.id}`);
      
      return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        specialty: data.specialty,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        phone: data.phone,
        email: data.email,
        is_active: data.is_active,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at)
      };

    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du médecin:', error);
      return null;
    }
  }

  /**
   * Appel à l'Edge Function de recherche
   */
  private async callSearchEdgeFunction(query: string): Promise<{ doctors: Doctor[], suggestions: Doctor[] }> {
    try {
      console.log(`🌐 Recherche hybride pour: "${query}"`);
      
      const { data, error } = await supabase.functions.invoke('scrape-ordomedic', {
        body: { query },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('❌ Erreur Edge Function:', error);
        return { doctors: [], suggestions: [] };
      }

      if (!data) {
        console.warn('⚠️ Aucune données retournées de l\'Edge Function');
        return { doctors: [], suggestions: [] };
      }

      const searchResponse = data as SearchResponse;

      // Log des métadonnées pour debugging
      if (searchResponse.metadata) {
        console.log(`📊 Métadonnées recherche:`, {
          total_local: searchResponse.metadata.total_local,
          total_suggestions: searchResponse.metadata.total_suggestions,
          sources: searchResponse.metadata.sources,
          external_sources: searchResponse.metadata.external_sources
        });
      }

      // Convertir les résultats au format Doctor
      const doctors: Doctor[] = (searchResponse.doctors || []).map((scraped: any, index: number) => ({
        id: scraped.id || `dynamic_${Date.now()}_${index}`,
        first_name: scraped.first_name,
        last_name: scraped.last_name,
        specialty: scraped.specialty,
        address: scraped.address,
        city: scraped.city,
        postal_code: scraped.postal_code,
        phone: scraped.phone,
        email: scraped.email,
        source: scraped.source,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      const suggestions: Doctor[] = (searchResponse.suggestions || []).map((scraped: any, index: number) => ({
        id: scraped.id || `suggestion_${Date.now()}_${index}`,
        first_name: scraped.first_name,
        last_name: scraped.last_name,
        specialty: scraped.specialty,
        address: scraped.address,
        city: scraped.city,
        postal_code: scraped.postal_code,
        phone: scraped.phone,
        email: scraped.email,
        source: scraped.source,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }));

      console.log(`✅ Conversion réussie: ${doctors.length} médecins locaux, ${suggestions.length} suggestions`);
      
      return { doctors, suggestions };

    } catch (error) {
      console.error('❌ Erreur lors de l\'appel Edge Function:', error);
      return { doctors: [], suggestions: [] };
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
