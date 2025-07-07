
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
  description?: string;
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
