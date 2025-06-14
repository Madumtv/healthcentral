
export interface MedicamentInfo {
  cnk: string;
  name: string;
  company: string;
  category: string;
  atc: string;
  deliveryStatus: string;
  prescriptionType: string;
  packSize: string;
  publicPrice?: string;
  reimbursementCode?: string;
  reimbursementRate?: string;
}

export interface MedicamentComposition {
  cnk: string;
  activeSubstance: string;
  strength: string;
  unit: string;
}

export interface MedicamentPresentations {
  cnk: string;
  name: string;
  company: string;
  packSize: string;
  publicPrice?: string;
  reimbursementCode?: string;
  reimbursementRate?: string;
  deliveryStatus: string;
}

class MedicamentsApiService {
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
      return this.formatSearchResults(data) || [];
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
      return this.formatMedicamentDetails(data);
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
      return this.formatComposition(data) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de la composition:', error);
      return this.getMockComposition(cnk);
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
      return this.formatPresentations(data) || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des présentations:', error);
      return this.getMockPresentations(cnk);
    }
  }

  /**
   * Formatage du dosage pour l'affichage
   */
  formatDosage(composition: MedicamentComposition[]): string {
    if (!composition.length) return '';
    
    return composition
      .map(comp => `${comp.activeSubstance} ${comp.strength} ${comp.unit}`)
      .join(', ');
  }

  // Méthodes de formatage pour adapter les données de l'API FAGG-AFMPS
  private formatSearchResults(data: any): MedicamentInfo[] {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      cnk: item.cnk || '',
      name: item.name || item.denomination || '',
      company: item.company || item.laboratoire || '',
      category: item.category || item.forme || '',
      atc: item.atc || '',
      deliveryStatus: item.deliveryStatus || item.statut || '',
      prescriptionType: item.prescriptionType || item.prescription || '',
      packSize: item.packSize || item.conditionnement || '',
      publicPrice: item.publicPrice || item.prix,
      reimbursementCode: item.reimbursementCode || item.codeRemboursement,
      reimbursementRate: item.reimbursementRate || item.tauxRemboursement
    }));
  }

  private formatMedicamentDetails(data: any): MedicamentInfo {
    return {
      cnk: data.cnk || '',
      name: data.name || data.denomination || '',
      company: data.company || data.laboratoire || '',
      category: data.category || data.forme || '',
      atc: data.atc || '',
      deliveryStatus: data.deliveryStatus || data.statut || '',
      prescriptionType: data.prescriptionType || data.prescription || '',
      packSize: data.packSize || data.conditionnement || '',
      publicPrice: data.publicPrice || data.prix,
      reimbursementCode: data.reimbursementCode || data.codeRemboursement,
      reimbursementRate: data.reimbursementRate || data.tauxRemboursement
    };
  }

  private formatComposition(data: any): MedicamentComposition[] {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      cnk: item.cnk || '',
      activeSubstance: item.activeSubstance || item.substanceActive || '',
      strength: item.strength || item.dosage || '',
      unit: item.unit || item.unite || 'mg'
    }));
  }

  private formatPresentations(data: any): MedicamentPresentations[] {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      cnk: item.cnk || '',
      name: item.name || item.libelle || '',
      company: item.company || item.laboratoire || '',
      packSize: item.packSize || item.conditionnement || '',
      publicPrice: item.publicPrice || item.prix,
      reimbursementCode: item.reimbursementCode || item.codeRemboursement,
      reimbursementRate: item.reimbursementRate || item.tauxRemboursement,
      deliveryStatus: item.deliveryStatus || item.statut || ''
    }));
  }

  // Données simulées pour le développement (en attendant l'API réelle)
  private getMockSearchResults(query: string): MedicamentInfo[] {
    const mockData = [
      {
        cnk: "0318717",
        name: "DAFALGAN 500MG COMP 30",
        company: "UCB PHARMA",
        category: "Comprimé",
        atc: "N02BE01",
        deliveryStatus: "Disponible",
        prescriptionType: "Libre",
        packSize: "30 comprimés",
        publicPrice: "5.95",
        reimbursementCode: "A",
        reimbursementRate: "40%"
      },
      {
        cnk: "0318725",
        name: "DAFALGAN 1G COMP PELL 8",
        company: "UCB PHARMA",
        category: "Comprimé pelliculé",
        atc: "N02BE01",
        deliveryStatus: "Disponible",
        prescriptionType: "Libre",
        packSize: "8 comprimés",
        publicPrice: "3.85",
        reimbursementCode: "A",
        reimbursementRate: "40%"
      },
      {
        cnk: "4782108",
        name: "METFORMIN EG COMPR PELLIC 120X 850MG",
        company: "EG (EUROGENERICS)",
        category: "Comprimé pelliculé",
        atc: "A10BA02",
        deliveryStatus: "Disponible",
        prescriptionType: "Prescription médicale",
        packSize: "120 comprimés",
        publicPrice: "12.50",
        reimbursementCode: "A",
        reimbursementRate: "75%"
      },
      {
        cnk: "4782109",
        name: "METFORMIN SANDOZ 500MG COMP PELL 120",
        company: "SANDOZ",
        category: "Comprimé pelliculé",
        atc: "A10BA02",
        deliveryStatus: "Disponible",
        prescriptionType: "Prescription médicale",
        packSize: "120 comprimés",
        publicPrice: "8.95",
        reimbursementCode: "A",
        reimbursementRate: "75%"
      },
      {
        cnk: "1234568",
        name: "METFORMIN MYLAN 1000MG COMP PELL 60",
        company: "MYLAN",
        category: "Comprimé pelliculé",
        atc: "A10BA02",
        deliveryStatus: "Disponible",
        prescriptionType: "Prescription médicale",
        packSize: "60 comprimés",
        publicPrice: "10.25",
        reimbursementCode: "A",
        reimbursementRate: "75%"
      }
    ];

    return mockData.filter(med => 
      med.name.toLowerCase().includes(query.toLowerCase()) ||
      med.company.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockMedicamentDetails(cnk: string): MedicamentInfo {
    if (cnk === "4782108") {
      return {
        cnk: cnk,
        name: "METFORMIN EG COMPR PELLIC 120X 850MG",
        company: "EG (EUROGENERICS)",
        category: "Comprimé pelliculé",
        atc: "A10BA02",
        deliveryStatus: "Disponible",
        prescriptionType: "Prescription médicale",
        packSize: "120 comprimés",
        publicPrice: "12.50",
        reimbursementCode: "A",
        reimbursementRate: "75%"
      };
    }
    
    return {
      cnk: cnk,
      name: "DAFALGAN 500MG COMP 30",
      company: "UCB PHARMA",
      category: "Comprimé",
      atc: "N02BE01",
      deliveryStatus: "Disponible",
      prescriptionType: "Libre",
      packSize: "30 comprimés",
      publicPrice: "5.95",
      reimbursementCode: "A",
      reimbursementRate: "40%"
    };
  }

  private getMockComposition(cnk: string): MedicamentComposition[] {
    if (cnk === "4782108") {
      return [
        {
          cnk: cnk,
          activeSubstance: "Metformine HCl",
          strength: "850",
          unit: "mg"
        }
      ];
    }
    
    return [
      {
        cnk: cnk,
        activeSubstance: "Paracétamol",
        strength: "500",
        unit: "mg"
      }
    ];
  }

  private getMockPresentations(cnk: string): MedicamentPresentations[] {
    return [
      {
        cnk: cnk,
        name: "DAFALGAN 500MG COMP 30",
        company: "UCB PHARMA",
        packSize: "30 comprimés",
        publicPrice: "5.95",
        reimbursementCode: "A",
        reimbursementRate: "40%",
        deliveryStatus: "Disponible"
      }
    ];
  }
}

export const medicamentsApi = new MedicamentsApiService();
