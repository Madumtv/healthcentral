
import { Doctor } from "./types";

export const removeDuplicateDoctors = (doctors: Doctor[]): Doctor[] => {
  return doctors.filter((doctor, index, self) => 
    index === self.findIndex(d => {
      const sameNameAndFirstName = 
        d.first_name.toLowerCase() === doctor.first_name.toLowerCase() && 
        d.last_name.toLowerCase() === doctor.last_name.toLowerCase();
      
      // Si les deux ont un numéro INAMI, les comparer
      if (d.inami_number && doctor.inami_number) {
        return sameNameAndFirstName && d.inami_number === doctor.inami_number;
      }
      
      // Sinon, juste comparer nom/prénom
      return sameNameAndFirstName;
    })
  );
};

export const sortDoctors = (doctors: Doctor[], query?: string): Doctor[] => {
  return doctors.sort((a, b) => {
    // Médecins de la base locale en premier
    const aIsLocal = a.source === 'Base locale';
    const bIsLocal = b.source === 'Base locale';
    if (aIsLocal && !bIsLocal) return -1;
    if (!aIsLocal && bIsLocal) return 1;

    // Correspondance exacte en premier si on a une query
    if (query && query.trim().length > 0) {
      const aExactMatch = `${a.first_name} ${a.last_name}`.toLowerCase() === query.toLowerCase();
      const bExactMatch = `${b.first_name} ${b.last_name}`.toLowerCase() === query.toLowerCase();
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
    }

    // Médecins avec spécialité en premier
    if (a.specialty && !b.specialty) return -1;
    if (!a.specialty && b.specialty) return 1;

    // Ordre alphabétique
    return a.last_name.localeCompare(b.last_name);
  });
};
