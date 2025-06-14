
import { ordomedicService } from "../ordomedic-service";
import { Doctor } from "./types";

export const searchExternalDoctors = async (query: string): Promise<Doctor[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  console.log(`Lancement du scraping ordomedic.be pour: "${query}"`);
  
  try {
    const searchResults = await ordomedicService.searchDoctors(query);
    const scrapedDoctors = searchResults.doctors;
    console.log(`Trouvé ${scrapedDoctors.length} médecins via scraping ordomedic.be`);
    return scrapedDoctors;
  } catch (scrapingError) {
    console.error('Erreur lors du scraping:', scrapingError);
    return [];
  }
};
