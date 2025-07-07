
import { MedicamentInfo, MedicamentComposition, MedicamentPresentations } from './types';
import { ApiFormatters } from './api-formatters';
import { mockMedicamentsData, getMockCompositions, getMockPresentations } from './mock-data';

export class MedicamentsApiService {
  private readonly baseUrl = 'https://banquededonneesmedicaments.fagg-afmps.be/api';

  /**
   * Recherche des médicaments par nom
   */
  async searchMedicaments(query: string): Promise<MedicamentInfo[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`${this.baseUrl}/search?name=${encodedQuery}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return ApiFormatters.formatSearchResults(data) || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de médicaments:', error);
      // Retourner des données simulées pour le développement
      return this.getMockSearchResults(query);
    }
  }

  /**
   * Récupère les détails d'un médicament par son CNK
   */
  async getMedicamentDetails(cnk: string): Promise<MedicamentInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/medicament/${cnk}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return ApiFormatters.formatMedicamentDetails(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      return this.getMockMedicamentDetails(cnk);
    }
  }

  /**
   * Récupère la composition d'un médicament
   */
  async getMedicamentComposition(cnk: string): Promise<MedicamentComposition[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicament/${cnk}/composition`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return ApiFormatters.formatComposition(data) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de la composition:', error);
      return getMockCompositions(cnk);
    }
  }

  /**
   * Récupère les présentations d'un médicament
   */
  async getMedicamentPresentations(cnk: string): Promise<MedicamentPresentations[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicament/${cnk}/presentations`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return ApiFormatters.formatPresentations(data) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des présentations:', error);
      return getMockPresentations(cnk);
    }
  }

  /**
   * Formatage du dosage pour l'affichage
   */
  formatDosage(composition: MedicamentComposition[]): string {
    return ApiFormatters.formatDosage(composition);
  }

  // Données simulées pour le développement (en attendant l'API réelle)
  private getMockSearchResults(query: string): MedicamentInfo[] {
    return mockMedicamentsData.filter(med => 
      med.name.toLowerCase().includes(query.toLowerCase()) ||
      med.company.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockMedicamentDetails(cnk: string): MedicamentInfo {
    const found = mockMedicamentsData.find(med => med.cnk === cnk);
    return found || mockMedicamentsData[0];
  }
}
