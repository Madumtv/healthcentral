
export interface MedicamentInfo {
  codeCIS: string;
  denomination: string;
  formePharmaceutique: string;
  voiesAdministration: string[];
  statutAMM: string;
  typeAMM: string;
  dateAMM: string;
  titulaires: string[];
  surveillance: boolean;
}

export interface MedicamentComposition {
  codeCIS: string;
  elementPharmaceutique: string;
  substanceActive: string;
  dosageSubstance: string;
  referenceDosage: string;
  nature: string;
}

export interface MedicamentPresentations {
  codeCIS: string;
  codeCIP7: string;
  codeCIP13: string;
  libelle: string;
  statutAdministratif: string;
  etatCommercialisation: string;
  dateDeclarationCommercialisation: string;
  prix?: string;
  tauxRemboursement?: string;
}

class MedicamentsApiService {
  private readonly baseUrl = 'https://api-medicaments.fr';

  /**
   * Recherche des médicaments par nom
   */
  async searchMedicaments(query: string): Promise<MedicamentInfo[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`${this.baseUrl}/medicaments?nom=${encodedQuery}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de médicaments:', error);
      return [];
    }
  }

  /**
   * Récupère les détails d'un médicament par son code CIS
   */
  async getMedicamentDetails(codeCIS: string): Promise<MedicamentInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/medicament/${codeCIS}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      return null;
    }
  }

  /**
   * Récupère la composition d'un médicament
   */
  async getMedicamentComposition(codeCIS: string): Promise<MedicamentComposition[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicament/${codeCIS}/composition`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de la composition:', error);
      return [];
    }
  }

  /**
   * Récupère les présentations d'un médicament
   */
  async getMedicamentPresentations(codeCIS: string): Promise<MedicamentPresentations[]> {
    try {
      const response = await fetch(`${this.baseUrl}/medicament/${codeCIS}/presentations`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des présentations:', error);
      return [];
    }
  }

  /**
   * Formatage du dosage pour l'affichage
   */
  formatDosage(composition: MedicamentComposition[]): string {
    if (!composition.length) return '';
    
    return composition
      .map(comp => `${comp.substanceActive} ${comp.dosageSubstance}`)
      .join(', ');
  }
}

export const medicamentsApi = new MedicamentsApiService();
