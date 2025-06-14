import { supabase } from "@/integrations/supabase/client";
import { medicamentsApi, MedicamentInfo, MedicamentComposition } from "@/lib/medicaments-api";

export interface MedicationInfoData {
  id: string;
  cnk: string;
  name: string;
  company?: string;
  category?: string;
  atc_code?: string;
  delivery_status?: string;
  prescription_type?: string;
  pack_size?: string;
  public_price?: number;
  reimbursement_code?: string;
  reimbursement_rate?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicationCompositionData {
  id: string;
  cnk: string;
  active_substance: string;
  strength?: string;
  unit?: string;
  created_at: string;
}

class MedicationInfoService {
  
  /**
   * Recherche dans la base locale d'abord, puis dans l'API externe si nécessaire
   */
  async searchMedications(query: string): Promise<MedicamentInfo[]> {
    try {
      // 1. Recherche dans la base locale
      const localResults = await this.searchLocalMedications(query);
      
      if (localResults.length > 0) {
        return localResults.map(this.convertToMedicamentInfo);
      }

      // 2. Si pas de résultats locaux, recherche dans l'API externe
      console.log("Aucun résultat local, recherche dans l'API externe...");
      const externalResults = await medicamentsApi.searchMedicaments(query);
      
      // 3. Sauvegarder les résultats externes en local pour la prochaine fois
      if (externalResults.length > 0) {
        await this.saveMedicationsToLocal(externalResults);
      }
      
      return externalResults;
    } catch (error) {
      console.error("Erreur lors de la recherche de médicaments:", error);
      // Fallback vers les données locales uniquement
      const localResults = await this.searchLocalMedications(query);
      return localResults.map(this.convertToMedicamentInfo);
    }
  }

  /**
   * Obtenir les détails d'un médicament par CNK
   */
  async getMedicationDetails(cnk: string): Promise<MedicamentInfo | null> {
    try {
      // 1. Recherche locale
      const { data: medication, error } = await supabase
        .from('medication_info')
        .select('*')
        .eq('cnk', cnk)
        .single();

      if (!error && medication) {
        return this.convertToMedicamentInfo(medication);
      }

      // 2. Recherche externe si pas trouvé localement
      const externalResults = await medicamentsApi.searchMedicaments(cnk);
      const found = externalResults.find(med => med.cnk === cnk);
      
      if (found) {
        await this.saveMedicationsToLocal([found]);
        return found;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      return null;
    }
  }

  /**
   * Obtenir la composition d'un médicament
   */
  async getMedicationComposition(cnk: string): Promise<MedicamentComposition[]> {
    try {
      // 1. Recherche locale
      const { data: compositions, error } = await supabase
        .from('medication_composition')
        .select('*')
        .eq('cnk', cnk);

      if (!error && compositions && compositions.length > 0) {
        return compositions.map(comp => ({
          cnk: comp.cnk,
          activeSubstance: comp.active_substance,
          strength: comp.strength || '',
          unit: comp.unit || 'mg'
        }));
      }

      // 2. Recherche externe si pas trouvé localement
      const externalComposition = await medicamentsApi.getMedicamentComposition(cnk);
      
      if (externalComposition.length > 0) {
        await this.saveCompositionToLocal(cnk, externalComposition);
      }
      
      return externalComposition;
    } catch (error) {
      console.error("Erreur lors de la récupération de la composition:", error);
      return [];
    }
  }

  /**
   * Recherche dans la base locale uniquement
   */
  private async searchLocalMedications(query: string): Promise<MedicationInfoData[]> {
    const { data, error } = await supabase
      .from('medication_info')
      .select('*')
      .or(`name.ilike.%${query}%, company.ilike.%${query}%, cnk.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error("Erreur recherche locale:", error);
      return [];
    }

    return data || [];
  }

  /**
   * Sauvegarder les médicaments en local
   */
  private async saveMedicationsToLocal(medications: MedicamentInfo[]): Promise<void> {
    try {
      const dataToInsert = medications.map(med => ({
        cnk: med.cnk,
        name: med.name,
        company: med.company,
        category: med.category,
        atc_code: med.atcCode,
        delivery_status: med.deliveryStatus,
        prescription_type: med.prescriptionType,
        pack_size: med.packSize,
        public_price: med.publicPrice ? parseFloat(med.publicPrice.toString()) : null,
        reimbursement_code: med.reimbursementCode,
        reimbursement_rate: med.reimbursementRate
      }));

      const { error } = await supabase
        .from('medication_info')
        .upsert(dataToInsert, { 
          onConflict: 'cnk',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error("Erreur sauvegarde médicaments:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  }

  /**
   * Sauvegarder la composition en local
   */
  private async saveCompositionToLocal(cnk: string, compositions: MedicamentComposition[]): Promise<void> {
    try {
      const dataToInsert = compositions.map(comp => ({
        cnk,
        active_substance: comp.activeSubstance,
        strength: comp.strength,
        unit: comp.unit || 'mg'
      }));

      const { error } = await supabase
        .from('medication_composition')
        .upsert(dataToInsert);

      if (error) {
        console.error("Erreur sauvegarde composition:", error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la composition:", error);
    }
  }

  /**
   * Convertir les données locales vers le format MedicamentInfo
   */
  private convertToMedicamentInfo(data: MedicationInfoData): MedicamentInfo {
    return {
      cnk: data.cnk,
      name: data.name,
      company: data.company || '',
      category: data.category || '',
      atcCode: data.atc_code || '',
      deliveryStatus: data.delivery_status || '',
      prescriptionType: data.prescription_type || '',
      packSize: data.pack_size || '',
      publicPrice: data.public_price?.toString() || '',
      reimbursementCode: data.reimbursement_code || '',
      reimbursementRate: data.reimbursement_rate || ''
    };
  }
}

export const medicationInfoService = new MedicationInfoService();
