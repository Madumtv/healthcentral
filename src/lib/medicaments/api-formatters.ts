
import { MedicamentInfo, MedicamentComposition, MedicamentPresentations } from './types';

export class ApiFormatters {
  static formatSearchResults(data: any): MedicamentInfo[] {
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

  static formatMedicamentDetails(data: any): MedicamentInfo {
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

  static formatComposition(data: any): MedicamentComposition[] {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      cnk: item.cnk || '',
      activeSubstance: item.activeSubstance || item.substanceActive || '',
      strength: item.strength || item.dosage || '',
      unit: item.unit || item.unite || 'mg'
    }));
  }

  static formatPresentations(data: any): MedicamentPresentations[] {
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

  static formatDosage(composition: MedicamentComposition[]): string {
    if (!composition.length) return '';
    
    return composition
      .map(comp => `${comp.activeSubstance} ${comp.strength} ${comp.unit}`)
      .join(', ');
  }
}
