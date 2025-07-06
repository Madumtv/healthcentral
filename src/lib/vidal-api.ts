
export interface VidalMedicamentInfo {
  id: string;
  name: string;
  laboratoire: string;
  forme: string;
  dosage: string;
  prix?: string;
  statut: string;
  classification: string;
  composition?: string;
  indications?: string;
}

class VidalApiService {
  private readonly baseUrl = 'https://www.vidal.fr';

  /**
   * Recherche des médicaments sur Vidal.fr
   */
  async searchMedicaments(query: string): Promise<VidalMedicamentInfo[]> {
    try {
      // Pour l'instant, on utilise des données simulées basées sur Vidal.fr
      // En production, ceci ferait appel à l'API Vidal ou à un scraper
      console.log(`🇫🇷 Recherche Vidal.fr pour: "${query}"`);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return this.getMockVidalResults(query);
    } catch (error) {
      console.error('Erreur lors de la recherche Vidal:', error);
      return [];
    }
  }

  /**
   * Obtenir les détails d'un médicament Vidal
   */
  async getMedicamentDetails(id: string): Promise<VidalMedicamentInfo | null> {
    try {
      console.log(`🇫🇷 Récupération détails Vidal pour ID: ${id}`);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const allResults = this.getAllMockVidalData();
      return allResults.find(med => med.id === id) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails Vidal:', error);
      return null;
    }
  }

  /**
   * Données simulées basées sur des médicaments réels du Vidal français
   */
  private getMockVidalResults(query: string): VidalMedicamentInfo[] {
    const allData = this.getAllMockVidalData();
    
    return allData.filter(med =>
      med.name.toLowerCase().includes(query.toLowerCase()) ||
      med.laboratoire.toLowerCase().includes(query.toLowerCase()) ||
      med.composition?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limiter à 10 résultats
  }

  private getAllMockVidalData(): VidalMedicamentInfo[] {
    return [
      {
        id: "vidal_1",
        name: "DOLIPRANE 1000 mg cp",
        laboratoire: "Sanofi",
        forme: "Comprimé",
        dosage: "1000 mg",
        prix: "2,95€",
        statut: "Disponible",
        classification: "Antalgique - Antipyrétique",
        composition: "Paracétamol 1000 mg",
        indications: "Douleurs et fièvre"
      },
      {
        id: "vidal_2",
        name: "EFFERALGAN 500 mg cp effervescent",
        laboratoire: "UPSA",
        forme: "Comprimé effervescent",
        dosage: "500 mg",
        prix: "3,25€",
        statut: "Disponible",
        classification: "Antalgique - Antipyrétique",
        composition: "Paracétamol 500 mg",
        indications: "Douleurs et fièvre"
      },
      {
        id: "vidal_3",
        name: "ADVIL 400 mg cp pelliculé",
        laboratoire: "Pfizer",
        forme: "Comprimé pelliculé",
        dosage: "400 mg",
        prix: "4,15€",
        statut: "Disponible",
        classification: "Anti-inflammatoire non stéroïdien",
        composition: "Ibuprofène 400 mg",
        indications: "Douleurs et inflammation"
      },
      {
        id: "vidal_4",
        name: "METFORMINE BIOGARAN 850 mg cp",
        laboratoire: "Biogaran",
        forme: "Comprimé",
        dosage: "850 mg",
        prix: "8,50€",
        statut: "Disponible",
        classification: "Antidiabétique",
        composition: "Metformine HCl 850 mg",
        indications: "Diabète type 2"
      },
      {
        id: "vidal_5",
        name: "GLUCOPHAGE 1000 mg cp pelliculé",
        laboratoire: "Merck",
        forme: "Comprimé pelliculé",
        dosage: "1000 mg",
        prix: "12,80€",
        statut: "Disponible",
        classification: "Antidiabétique",
        composition: "Metformine HCl 1000 mg",
        indications: "Diabète type 2"
      },
      {
        id: "vidal_6",
        name: "LEVOTHYROX 50 µg cp sécable",
        laboratoire: "Merck",
        forme: "Comprimé sécable",
        dosage: "50 µg",
        prix: "5,95€",
        statut: "Disponible",
        classification: "Hormone thyroïdienne",
        composition: "Lévothyroxine sodique 50 µg",
        indications: "Hypothyroïdie"
      },
      {
        id: "vidal_7",
        name: "SPASFON 80 mg cp pelliculé",
        laboratoire: "Teva",
        forme: "Comprimé pelliculé",
        dosage: "80 mg",
        prix: "3,75€",
        statut: "Disponible",
        classification: "Antispasmodique",
        composition: "Phloroglucinol 80 mg",
        indications: "Spasmes digestifs et urinaires"
      },
      {
        id: "vidal_8",
        name: "SMECTA 3g poudre pour suspension buvable",
        laboratoire: "Ipsen",
        forme: "Poudre pour suspension",
        dosage: "3 g",
        prix: "4,25€",
        statut: "Disponible",
        classification: "Antidiarrhéique",
        composition: "Diosmectite 3 g",
        indications: "Diarrhée aiguë"
      }
    ];
  }

  /**
   * Convertir les données Vidal vers le format MedicamentInfo
   */
  convertToMedicamentInfo(vidalData: VidalMedicamentInfo) {
    return {
      cnk: vidalData.id,
      name: vidalData.name,
      company: vidalData.laboratoire,
      category: vidalData.forme,
      atc: '',
      deliveryStatus: vidalData.statut,
      prescriptionType: 'Variable',
      packSize: vidalData.dosage,
      publicPrice: vidalData.prix,
      reimbursementCode: '',
      reimbursementRate: ''
    };
  }
}

export const vidalApi = new VidalApiService();
