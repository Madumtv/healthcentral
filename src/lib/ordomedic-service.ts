
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
   * Recherche des médecins sur ordomedic.be
   * Note: Ceci est une simulation car ordomedic.be ne fournit pas d'API publique
   * En production, il faudrait soit un scraper soit une API officielle
   */
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      // Pour l'instant, nous simulons des données d'ordomedic.be
      // En production, il faudrait implémenter un scraper ou utiliser une API
      return this.getMockOrdomedicResults(query);
    } catch (error) {
      console.error('Erreur lors de la recherche ordomedic:', error);
      return [];
    }
  }

  /**
   * Données simulées basées sur des médecins réels d'ordomedic.be
   * À remplacer par un vrai scraper ou API
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
   * (nécessiterait un backend ou une fonction edge)
   */
  private async scrapeOrdomedic(query: string): Promise<OrdomedicDoctor[]> {
    // Cette méthode nécessiterait un backend pour éviter les problèmes CORS
    // et respecter les conditions d'utilisation d'ordomedic.be
    
    console.warn('Scraping d\'ordomedic.be non implémenté - utilisation des données simulées');
    return [];
  }
}

export const ordomedicService = new OrdomedicService();
