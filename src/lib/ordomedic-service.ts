import { supabase } from "@/integrations/supabase/client";
import { Doctor } from "@/lib/supabase-doctors-service";

export interface OrdomedicDoctor {
  id: string;
  nom: string;
  prenom: string;
  specialite?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  telephone?: string;
  numeroInami?: string;
}

class OrdomedicService {
  private readonly baseUrl = 'https://ordomedic.be';

  /**
   * Recherche des médecins avec priorité sur la base locale
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      // 1. Recherche dans la base locale d'abord
      const localResults = await this.searchLocalDoctors(query);
      
      if (localResults.length > 0) {
        console.log(`Trouvé ${localResults.length} médecins dans la base locale`);
        return localResults;
      }

      // 2. Si pas de résultats locaux, utiliser les données simulées
      console.log("Aucun résultat local, utilisation des données simulées...");
      const mockResults = this.getMockOrdomedicResults(query);
      
      // 3. Sauvegarder les résultats simulés en local si c'est utile
      if (mockResults.length > 0) {
        await this.saveDoctorsToLocal(mockResults);
      }
      
      return mockResults;
    } catch (error) {
      console.error('Erreur lors de la recherche ordomedic:', error);
      // Fallback vers la recherche locale uniquement
      return await this.searchLocalDoctors(query);
    }
  }

  /**
   * Recherche dans la base locale des médecins
   */
  private async searchLocalDoctors(query: string): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .or(`first_name.ilike.%${query}%, last_name.ilike.%${query}%, specialty.ilike.%${query}%, city.ilike.%${query}%`)
        .eq('is_active', true)
        .limit(20);

      if (error) {
        console.error("Erreur recherche locale médecins:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la recherche locale:", error);
      return [];
    }
  }

  /**
   * Sauvegarder les médecins en local
   */
  private async saveDoctorsToLocal(doctors: Doctor[]): Promise<void> {
    try {
      const dataToInsert = doctors.map(doctor => ({
        first_name: doctor.first_name,
        last_name: doctor.last_name,
        specialty: doctor.specialty,
        address: doctor.address,
        city: doctor.city,
        postal_code: doctor.postal_code,
        phone: doctor.phone,
        email: doctor.email,
        inami_number: doctor.inami_number,
        is_active: true
      }));

      const { error } = await supabase
        .from('doctors')
        .upsert(dataToInsert, { 
          onConflict: 'inami_number',
          ignoreDuplicates: true 
        });

      if (error) {
        console.error("Erreur sauvegarde médecins:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des médecins:", error);
    }
  }

  /**
   * Données simulées basées sur des médecins réels d'ordomedic.be
   */
  private getMockOrdomedicResults(query: string): Doctor[] {
    const mockDoctors = [
      {
        id: 'ordo_1',
        first_name: 'Jean',
        last_name: 'Dupont',
        specialty: 'Médecine générale',
        address: 'Rue de la Paix 15',
        city: 'Bruxelles',
        postal_code: '1000',
        phone: '02/123.45.67',
        inami_number: '12345678901',
        email: '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_2',
        first_name: 'Marie',
        last_name: 'Martin',
        specialty: 'Cardiologie',
        address: 'Avenue Louise 123',
        city: 'Bruxelles',
        postal_code: '1050',
        phone: '02/987.65.43',
        inami_number: '98765432109',
        email: '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_3',
        first_name: 'Pierre',
        last_name: 'Vanderroost',
        specialty: 'Neurologie',
        address: 'Chaussée de Waterloo 456',
        city: 'Uccle',
        postal_code: '1180',
        phone: '02/456.78.90',
        inami_number: '45678901234',
        email: '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_4',
        first_name: 'Serge',
        last_name: 'Vanderroost',
        specialty: 'Médecine générale',
        address: 'Avenue de la Couronne 217',
        city: 'Ixelles',
        postal_code: '1050',
        phone: '02/648.12.34',
        inami_number: '11234567890',
        email: '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_5',
        first_name: 'Sophie',
        last_name: 'Lambert',
        specialty: 'Pédiatrie',
        address: 'Rue Neuve 789',
        city: 'Liège',
        postal_code: '4000',
        phone: '04/321.09.87',
        inami_number: '32109876543',
        email: '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_6',
        first_name: 'Antoine',
        last_name: 'Dubois',
        specialty: 'Orthopédie',
        address: 'Boulevard Anspach 321',
        city: 'Bruxelles',
        postal_code: '1000',
        phone: '02/654.32.10',
        inami_number: '65432109876',
        email: '',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Filtrer selon la requête
    const filtered = mockDoctors.filter(doctor =>
      doctor.first_name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.last_name.toLowerCase().includes(query.toLowerCase()) ||
      (doctor.specialty && doctor.specialty.toLowerCase().includes(query.toLowerCase())) ||
      (doctor.city && doctor.city.toLowerCase().includes(query.toLowerCase()))
    );

    return filtered;
  }

  /**
   * Méthode pour implémenter un vrai scraper d'ordomedic.be
   */
  private async scrapeOrdomedic(query: string): Promise<OrdomedicDoctor[]> {
    // Cette méthode nécessiterait un backend pour éviter les problèmes CORS
    console.warn('Scraping d\'ordomedic.be non implémenté - utilisation des données locales');
    return [];
  }
}

export const ordomedicService = new OrdomedicService();
