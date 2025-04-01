
import { Medication } from "@/types";

// Données fictives pour l'exemple
export const mockMedications: Medication[] = [
  {
    id: "1",
    name: "Doliprane",
    description: "Paracétamol - Antalgique et antipyrétique",
    dosage: "1000mg",
    timeOfDay: ["morning", "evening"],
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    notes: "Prendre en cas de douleur ou fièvre",
    prescribingDoctor: "Dr. Martin",
    infoLink: "https://www.vidal.fr/medicaments/doliprane-1000-mg-comprimes-4228.html",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Kardégic",
    description: "Acétylsalicylate de DL-Lysine - Antiagrégant plaquettaire",
    dosage: "75mg",
    timeOfDay: ["morning"],
    daysOfWeek: ["monday", "wednesday", "friday"],
    notes: "Prendre au petit déjeuner",
    prescribingDoctor: "Dr. Dupont",
    infoLink: "https://www.vidal.fr/medicaments/kardegic-75-mg-pdre-sol-buv-sachet-1602.html",
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2023-01-02"),
  },
  {
    id: "3",
    name: "Levothyrox",
    description: "Lévothyroxine sodique - Hormone thyroïdienne",
    dosage: "50µg",
    timeOfDay: ["morning"],
    daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    notes: "Prendre à jeun, 30 minutes avant le petit déjeuner",
    prescribingDoctor: "Dr. Blanc",
    infoLink: "https://www.vidal.fr/medicaments/levothyrox-50-microgrammes-comprime-secable-6775.html",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03"),
  },
];

// Service simulant l'accès à l'API
export const medicationService = {
  getAll: () => Promise.resolve([...mockMedications]),
  getById: (id: string) => Promise.resolve(mockMedications.find(med => med.id === id)),
  create: (medication: Omit<Medication, "id" | "createdAt" | "updatedAt">) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockMedications.push(newMedication);
    return Promise.resolve(newMedication);
  },
  update: (id: string, medication: Partial<Medication>) => {
    const index = mockMedications.findIndex(med => med.id === id);
    if (index !== -1) {
      mockMedications[index] = {
        ...mockMedications[index],
        ...medication,
        updatedAt: new Date(),
      };
      return Promise.resolve(mockMedications[index]);
    }
    return Promise.reject(new Error("Médicament non trouvé"));
  },
  delete: (id: string) => {
    const index = mockMedications.findIndex(med => med.id === id);
    if (index !== -1) {
      mockMedications.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error("Médicament non trouvé"));
  },
};
