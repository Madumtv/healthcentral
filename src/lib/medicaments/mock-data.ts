
import { MedicamentInfo, MedicamentComposition, MedicamentPresentations } from './types';

export const mockMedicamentsData: MedicamentInfo[] = [
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

export const getMockCompositions = (cnk: string): MedicamentComposition[] => {
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
};

export const getMockPresentations = (cnk: string): MedicamentPresentations[] => {
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
};
