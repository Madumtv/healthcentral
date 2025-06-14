
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
      console.log(`OrdomedicService: recherche pour "${query}"`);
      
      // 1. Si pas de requête, retourner quelques médecins populaires
      if (!query || query.trim().length < 2) {
        return this.getMockOrdomedicResults('').slice(0, 5);
      }

      // 2. Recherche dans la base locale d'abord
      const localResults = await this.searchLocalDoctors(query);
      
      if (localResults.length > 0) {
        console.log(`Trouvé ${localResults.length} médecins dans la base locale`);
        return localResults;
      }

      // 3. Recherche dans les données simulées étendues
      console.log("Aucun résultat local, recherche dans les données simulées...");
      const mockResults = this.getMockOrdomedicResults(query);
      console.log(`Trouvé ${mockResults.length} médecins simulés`);
      
      return mockResults;
    } catch (error) {
      console.error('Erreur lors de la recherche ordomedic:', error);
      // Fallback vers la recherche simulée uniquement
      return this.getMockOrdomedicResults(query);
    }
  }

  /**
   * Recherche des médecins dans la base de données locale
   */
  private async searchLocalDoctors(query: string): Promise<Doctor[]> => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialty.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la recherche locale de médecins:', error);
      return [];
    }

    return (data || []).map(doctor => ({
      id: doctor.id,
      inami_number: doctor.inami_number,
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      specialty: doctor.specialty,
      address: doctor.address,
      city: doctor.city,
      postal_code: doctor.postal_code,
      phone: doctor.phone,
      email: doctor.email,
      is_active: doctor.is_active,
      created_at: new Date(doctor.created_at),
      updated_at: new Date(doctor.updated_at),
    }));
  }

  /**
   * Données simulées basées sur des médecins réels d'ordomedic.be - base étendue
   */
  private getMockOrdomedicResults(query: string): Doctor[] => {
    const mockDoctors: Doctor[] = [
      // Médecins existants
      {
        id: 'ordo_audrey_loumaye',
        first_name: 'Audrey',
        last_name: 'LOUMAYE',
        specialty: 'Médecine générale',
        address: 'Rue de la Station 45',
        city: 'Namur',
        postal_code: '5000',
        phone: '081/22.33.44',
        inami_number: '11223344556',
        email: 'audrey.loumaye@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_jean_dupont',
        first_name: 'Jean',
        last_name: 'Dupont',
        specialty: 'Médecine générale',
        address: 'Rue de la Paix 15',
        city: 'Bruxelles',
        postal_code: '1000',
        phone: '02/123.45.67',
        inami_number: '12345678901',
        email: 'jean.dupont@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_marie_martin',
        first_name: 'Marie',
        last_name: 'Martin',
        specialty: 'Cardiologie',
        address: 'Avenue Louise 50',
        city: 'Bruxelles',
        postal_code: '1050',
        phone: '02/234.56.78',
        inami_number: '23456789012',
        email: 'marie.martin@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_pierre_leblanc',
        first_name: 'Pierre',
        last_name: 'Leblanc',
        specialty: 'Pédiatrie',
        address: 'Place Saint-Lambert 12',
        city: 'Liège',
        postal_code: '4000',
        phone: '04/345.67.89',
        inami_number: '34567890123',
        email: 'pierre.leblanc@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_sophie_durand',
        first_name: 'Sophie',
        last_name: 'Durand',
        specialty: 'Gynécologie',
        address: 'Chaussée de Charleroi 89',
        city: 'Charleroi',
        postal_code: '6000',
        phone: '071/456.78.90',
        inami_number: '45678901234',
        email: 'sophie.durand@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Médecins supplémentaires pour une recherche plus complète
      {
        id: 'ordo_luc_bernard',
        first_name: 'Luc',
        last_name: 'Bernard',
        specialty: 'Orthopédie',
        address: 'Avenue des Arts 25',
        city: 'Bruxelles',
        postal_code: '1000',
        phone: '02/345.67.89',
        inami_number: '56789012345',
        email: 'luc.bernard@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_anne_moreau',
        first_name: 'Anne',
        last_name: 'Moreau',
        specialty: 'Dermatologie',
        address: 'Rue Neuve 78',
        city: 'Gand',
        postal_code: '9000',
        phone: '09/123.45.67',
        inami_number: '67890123456',
        email: 'anne.moreau@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_patrick_simon',
        first_name: 'Patrick',
        last_name: 'Simon',
        specialty: 'Neurologie',
        address: 'Boulevard de la Liberté 33',
        city: 'Antwerpen',
        postal_code: '2000',
        phone: '03/456.78.90',
        inami_number: '78901234567',
        email: 'patrick.simon@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ordo_catherine_laurent',
        first_name: 'Catherine',
        last_name: 'Laurent',
        specialty: 'Ophtalmologie',
        address: 'Place du Marché 12',
        city: 'Mons',
        postal_code: '7000',
        phone: '065/567.89.01',
        inami_number: '89012345678',
        email: 'catherine.laurent@ordomedic.be',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Filtrer selon la requête avec recherche plus flexible
    const queryLower = query.toLowerCase();
    const filtered = mockDoctors.filter(doctor => {
      if (!queryLower) return true;
      
      const fullName = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
      const reverseName = `${doctor.last_name} ${doctor.first_name}`.toLowerCase();
      
      return fullName.includes(queryLower) ||
             reverseName.includes(queryLower) ||
             doctor.first_name.toLowerCase().includes(queryLower) ||
             doctor.last_name.toLowerCase().includes(queryLower) ||
             (doctor.specialty && doctor.specialty.toLowerCase().includes(queryLower)) ||
             (doctor.city && doctor.city.toLowerCase().includes(queryLower));
    });

    console.log(`Filtre appliqué sur "${query}": ${filtered.length} résultats`);
    return filtered;
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
