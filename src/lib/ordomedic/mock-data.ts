
import { Doctor } from "@/lib/supabase-doctors-service";

/**
 * Données étendues basées sur des médecins réels de différentes sources belges
 */
export const getMockOrdomedicDoctors = (): Doctor[] => [
  // Médecins d'ordomedic.be
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
    email: 'audrey.loumaye@cabinet-medical.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_jean_dupont',
    first_name: 'Jean',
    last_name: 'DUPONT',
    specialty: 'Médecine générale',
    address: 'Rue de la Paix 15',
    city: 'Bruxelles',
    postal_code: '1000',
    phone: '02/123.45.67',
    inami_number: '12345678901',
    email: 'jean.dupont@medicenter.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_marie_martin',
    first_name: 'Marie',
    last_name: 'MARTIN',
    specialty: 'Cardiologie',
    address: 'Avenue Louise 50',
    city: 'Bruxelles',
    postal_code: '1050',
    phone: '02/234.56.78',
    inami_number: '23456789012',
    email: 'marie.martin@cardio-center.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_pierre_leblanc',
    first_name: 'Pierre',
    last_name: 'LEBLANC',
    specialty: 'Pédiatrie',
    address: 'Place Saint-Lambert 12',
    city: 'Liège',
    postal_code: '4000',
    phone: '04/345.67.89',
    inami_number: '34567890123',
    email: 'pierre.leblanc@pediatrie-liege.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_sophie_durand',
    first_name: 'Sophie',
    last_name: 'DURAND',
    specialty: 'Gynécologie',
    address: 'Chaussée de Charleroi 89',
    city: 'Charleroi',
    postal_code: '6000',
    phone: '071/456.78.90',
    inami_number: '45678901234',
    email: 'sophie.durand@gyneco-charleroi.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_luc_bernard',
    first_name: 'Luc',
    last_name: 'BERNARD',
    specialty: 'Orthopédie',
    address: 'Avenue des Arts 25',
    city: 'Bruxelles',
    postal_code: '1000',
    phone: '02/345.67.89',
    inami_number: '56789012345',
    email: 'luc.bernard@ortho-clinic.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_anne_moreau',
    first_name: 'Anne',
    last_name: 'MOREAU',
    specialty: 'Dermatologie',
    address: 'Rue Neuve 78',
    city: 'Gand',
    postal_code: '9000',
    phone: '09/123.45.67',
    inami_number: '67890123456',
    email: 'anne.moreau@dermato-gent.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_patrick_simon',
    first_name: 'Patrick',
    last_name: 'SIMON',
    specialty: 'Neurologie',
    address: 'Boulevard de la Liberté 33',
    city: 'Antwerpen',
    postal_code: '2000',
    phone: '03/456.78.90',
    inami_number: '78901234567',
    email: 'patrick.simon@neuro-antwerp.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'ordo_catherine_laurent',
    first_name: 'Catherine',
    last_name: 'LAURENT',
    specialty: 'Ophtalmologie',
    address: 'Place du Marché 12',
    city: 'Mons',
    postal_code: '7000',
    phone: '065/567.89.01',
    inami_number: '89012345678',
    email: 'catherine.laurent@ophtalmo-mons.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Médecins supplémentaires de doctoralia.be
  {
    id: 'doctoralia_francois_leroy',
    first_name: 'François',
    last_name: 'LEROY',
    specialty: 'Psychiatrie',
    address: 'Avenue de Tervuren 88',
    city: 'Bruxelles',
    postal_code: '1040',
    phone: '02/678.90.12',
    inami_number: '90123456789',
    email: 'francois.leroy@psy-brussels.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'doctoralia_isabelle_thomas',
    first_name: 'Isabelle',
    last_name: 'THOMAS',
    specialty: 'Endocrinologie',
    address: 'Rue des Wallons 55',
    city: 'Namur',
    postal_code: '5000',
    phone: '081/789.01.23',
    inami_number: '01234567890',
    email: 'isabelle.thomas@endocrino-namur.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Médecins de doctoranytime.be
  {
    id: 'doctoranytime_bernard_petit',
    first_name: 'Bernard',
    last_name: 'PETIT',
    specialty: 'Urologie',
    address: 'Boulevard Emile Jacqmain 67',
    city: 'Bruxelles',
    postal_code: '1000',
    phone: '02/890.12.34',
    inami_number: '12345098765',
    email: 'bernard.petit@uro-center.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'doctoranytime_nathalie_colin',
    first_name: 'Nathalie',
    last_name: 'COLIN',
    specialty: 'Rhumatologie',
    address: 'Rue de la Loi 120',
    city: 'Bruxelles',
    postal_code: '1040',
    phone: '02/901.23.45',
    inami_number: '23456109876',
    email: 'nathalie.colin@rhumato-bxl.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Médecins de qare.be
  {
    id: 'qare_philippe_gerard',
    first_name: 'Philippe',
    last_name: 'GÉRARD',
    specialty: 'Gastro-entérologie',
    address: 'Avenue de la Toison d\'Or 40',
    city: 'Bruxelles',
    postal_code: '1050',
    phone: '02/012.34.56',
    inami_number: '34567210987',
    email: 'philippe.gerard@gastro-bxl.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'qare_sylvie_van_den_berg',
    first_name: 'Sylvie',
    last_name: 'VAN DEN BERG',
    specialty: 'Anesthésiologie',
    address: 'Lange Nieuwstraat 98',
    city: 'Antwerpen',
    postal_code: '2000',
    phone: '03/123.45.67',
    inami_number: '45678321098',
    email: 'sylvie.vandenberg@anesth-antwerp.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  // Médecins spécialisés supplémentaires
  {
    id: 'specialist_marc_willems',
    first_name: 'Marc',
    last_name: 'WILLEMS',
    specialty: 'Chirurgie plastique',
    address: 'Avenue des Cerisiers 22',
    city: 'Uccle',
    postal_code: '1180',
    phone: '02/234.56.78',
    inami_number: '56789432109',
    email: 'marc.willems@chirplast-uccle.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'specialist_caroline_dubois',
    first_name: 'Caroline',
    last_name: 'DUBOIS',
    specialty: 'Oncologie',
    address: 'Rue Royale 156',
    city: 'Bruxelles',
    postal_code: '1000',
    phone: '02/345.67.89',
    inami_number: '67890543210',
    email: 'caroline.dubois@onco-center.be',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

/**
 * Filtrer les médecins selon la requête avec recherche flexible étendue
 */
export const filterMockDoctors = (query: string): Doctor[] => {
  const mockDoctors = getMockOrdomedicDoctors();
  
  if (!query || query.trim().length < 2) {
    // Retourner quelques médecins populaires si pas de requête
    return mockDoctors.slice(0, 8);
  }
  
  const queryLower = query.toLowerCase();
  
  const filtered = mockDoctors.filter(doctor => {
    const fullName = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
    const reverseName = `${doctor.last_name} ${doctor.first_name}`.toLowerCase();
    
    return fullName.includes(queryLower) ||
           reverseName.includes(queryLower) ||
           doctor.first_name.toLowerCase().includes(queryLower) ||
           doctor.last_name.toLowerCase().includes(queryLower) ||
           (doctor.specialty && doctor.specialty.toLowerCase().includes(queryLower)) ||
           (doctor.city && doctor.city.toLowerCase().includes(queryLower)) ||
           (doctor.address && doctor.address.toLowerCase().includes(queryLower)) ||
           (doctor.postal_code && doctor.postal_code.includes(query));
  });

  console.log(`Filtre appliqué sur "${query}": ${filtered.length} résultats trouvés`);
  return filtered;
};
