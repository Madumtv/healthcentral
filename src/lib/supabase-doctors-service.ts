
import { supabase } from "@/integrations/supabase/client";
import { ordomedicService } from "./ordomedic-service";

export interface Doctor {
  id: string;
  inami_number?: string;
  first_name: string;
  last_name: string;
  specialty?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  source?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export const supabaseDoctorsService = {
  // Search doctors by name or specialty (hybride: local + scraping ordomedic.be en temps réel)
  search: async (query: string): Promise<Doctor[]> => {
    if (!query || query.trim().length < 2) {
      // Afficher quelques médecins populaires sans recherche
      try {
        const searchResults = await ordomedicService.searchDoctors('');
        return searchResults.doctors.slice(0, 8);
      } catch (error) {
        console.error('Erreur lors du chargement des médecins populaires:', error);
        return [];
      }
    }

    const results: Doctor[] = [];

    try {
      // 1. Recherche locale dans Supabase en premier
      console.log(`Recherche locale pour: "${query}"`);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,specialty.ilike.%${query}%,city.ilike.%${query}%`)
        .eq('is_active', true)
        .order('last_name', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Erreur recherche locale:', error);
      } else if (data && data.length > 0) {
        const localDoctors = data.map(doctor => ({
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
          source: 'Base locale',
          is_active: doctor.is_active,
          created_at: new Date(doctor.created_at),
          updated_at: new Date(doctor.updated_at),
        }));
        results.push(...localDoctors);
        console.log(`Trouvé ${localDoctors.length} médecins dans la base locale`);
      }

      // 2. Scraping en temps réel d'ordomedic.be (priorité élevée)
      console.log(`Lancement du scraping ordomedic.be pour: "${query}"`);
      const searchResults = await ordomedicService.searchDoctors(query);
      const scrapedDoctors = searchResults.doctors;
      console.log(`Trouvé ${scrapedDoctors.length} médecins via scraping ordomedic.be`);
      
      if (scrapedDoctors.length > 0) {
        results.push(...scrapedDoctors);
      }

      // 3. Éliminer les doublons basés sur nom/prénom et INAMI si disponible
      const uniqueDoctors = results.filter((doctor, index, self) => 
        index === self.findIndex(d => {
          const sameNameAndFirstName = 
            d.first_name.toLowerCase() === doctor.first_name.toLowerCase() && 
            d.last_name.toLowerCase() === doctor.last_name.toLowerCase();
          
          // Si les deux ont un numéro INAMI, les comparer
          if (d.inami_number && doctor.inami_number) {
            return sameNameAndFirstName && d.inami_number === doctor.inami_number;
          }
          
          // Sinon, juste comparer nom/prénom
          return sameNameAndFirstName;
        })
      );

      // 4. Trier par pertinence puis par nom
      const sortedDoctors = uniqueDoctors.sort((a, b) => {
        // Correspondance exacte en premier
        const aExactMatch = `${a.first_name} ${a.last_name}`.toLowerCase() === query.toLowerCase();
        const bExactMatch = `${b.first_name} ${b.last_name}`.toLowerCase() === query.toLowerCase();
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Médecins avec spécialité en premier
        if (a.specialty && !b.specialty) return -1;
        if (!a.specialty && b.specialty) return 1;

        // Médecins scrapés d'ordomedic.be en priorité (ID commence par "ordo_")
        const aIsScraped = a.id.startsWith('ordo_');
        const bIsScraped = b.id.startsWith('ordo_');
        if (aIsScraped && !bIsScraped) return -1;
        if (!aIsScraped && bIsScraped) return 1;

        // Ordre alphabétique
        return a.last_name.localeCompare(b.last_name);
      });

      console.log(`Résultats finaux: ${sortedDoctors.length} médecins uniques trouvés`);
      return sortedDoctors.slice(0, 25); // Limiter à 25 résultats
    } catch (error) {
      console.error('Erreur lors de la recherche hybride complète:', error);
      // En cas d'erreur, essayer au moins la recherche via ordomedic
      try {
        const fallbackResults = await ordomedicService.searchDoctors(query);
        return fallbackResults.doctors.slice(0, 15);
      } catch (fallbackError) {
        console.error('Erreur de secours:', fallbackError);
        return results; // Retourner ce qu'on a pu récupérer
      }
    }
  },

  // Get doctor by ID
  getById: async (id: string): Promise<Doctor | null> => {
    // Si l'ID commence par un préfixe externe, c'est un médecin d'une source externe
    if (id.startsWith('ordo_') || id.startsWith('doctoralia_') || 
        id.startsWith('doctoranytime_') || id.startsWith('qare_') || 
        id.startsWith('specialist_')) {
      // Rechercher dans les sources externes
      const searchResults = await ordomedicService.searchDoctors('');
      const externalDoctors = searchResults.doctors;
      return externalDoctors.find(d => d.id === id) || null;
    }

    // Sinon, rechercher dans Supabase
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return {
      id: data.id,
      inami_number: data.inami_number,
      first_name: data.first_name,
      last_name: data.last_name,
      specialty: data.specialty,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      phone: data.phone,
      email: data.email,
      source: 'Base locale',
      is_active: data.is_active,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  },

  create: async (doctor: Omit<Doctor, "id" | "created_at" | "updated_at">): Promise<Doctor> => {
    console.log("Creating doctor with data:", doctor);
    
    const { data, error } = await supabase
      .from('doctors')
      .insert({
        inami_number: doctor.inami_number || null,
        first_name: doctor.first_name,
        last_name: doctor.last_name,
        specialty: doctor.specialty || null,
        address: doctor.address || null,
        city: doctor.city || null,
        postal_code: doctor.postal_code || null,
        phone: doctor.phone || null,
        email: doctor.email || null,
        is_active: doctor.is_active,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating doctor:", error);
      throw error;
    }

    console.log("Doctor created successfully:", data);

    return {
      id: data.id,
      inami_number: data.inami_number,
      first_name: data.first_name,
      last_name: data.last_name,
      specialty: data.specialty,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      phone: data.phone,
      email: data.email,
      source: 'Base locale',
      is_active: data.is_active,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }
};
