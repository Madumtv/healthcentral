
import { searchLocalDoctors, filterLocalDoctors } from "./doctors/local-search";
import { searchExternalDoctors } from "./doctors/external-search";
import { removeDuplicateDoctors, sortDoctors } from "./doctors/doctor-utils";
import { getDoctorById, createDoctor } from "./doctors/doctor-crud";
import { Doctor, DoctorCreateData } from "./doctors/types";

// Re-export types for backward compatibility
export type { Doctor, DoctorCreateData };

export const supabaseDoctorsService = {
  // Search doctors by name or specialty (hybride: local + scraping ordomedic.be en temps réel)
  search: async (query: string): Promise<Doctor[]> => {
    try {
      console.log(`Recherche hybride pour: "${query}"`);
      
      // 1. TOUJOURS rechercher dans la base locale en premier
      const localDoctors = await searchLocalDoctors();
      
      // 2. Si on a une recherche spécifique, faire aussi le scraping
      const externalDoctors = await searchExternalDoctors(query);
      
      // 3. Combiner les résultats
      const allDoctors = [...localDoctors, ...externalDoctors];
      
      // 4. Filtrer les résultats locaux si on a une query
      const filteredDoctors = filterLocalDoctors(allDoctors, query);
      
      // 5. Éliminer les doublons
      const uniqueDoctors = removeDuplicateDoctors(filteredDoctors);
      
      // 6. Trier par pertinence puis par nom
      const sortedDoctors = sortDoctors(uniqueDoctors, query);
      
      console.log(`Résultats finaux: ${sortedDoctors.length} médecins trouvés`);
      return sortedDoctors.slice(0, 25); // Limiter à 25 résultats
    } catch (error) {
      console.error('Erreur lors de la recherche complète:', error);
      return [];
    }
  },

  getById: getDoctorById,
  create: createDoctor
};
