
import { Doctor } from "@/lib/supabase-doctors-service";

/**
 * Données simulées basées sur des médecins réels d'ordomedic.be - base étendue
 */
export const getMockOrdomedicDoctors = (): Doctor[] => [
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

/**
 * Filtrer les médecins selon la requête avec recherche flexible
 */
export const filterMockDoctors = (query: string): Doctor[] => {
  const mockDoctors = getMockOrdomedicDoctors();
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
};
