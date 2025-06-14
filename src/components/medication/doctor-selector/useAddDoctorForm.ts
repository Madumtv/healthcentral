
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";

interface FormData {
  firstName: string;
  lastName: string;
  specialty: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  inamiNumber: string;
}

interface UseAddDoctorFormProps {
  onDoctorAdded: (doctor: Doctor) => void;
  initialSearchQuery?: string;
}

export const useAddDoctorForm = ({ onDoctorAdded, initialSearchQuery }: UseAddDoctorFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extraire prénom et nom du searchQuery initial si possible
  const parseInitialName = (query: string) => {
    if (!query) return { firstName: "", lastName: "" };
    
    // Supprimer "Dr" ou "Dr." du début
    const cleanQuery = query.replace(/^(Dr\.?|Docteur)\s*/i, "").trim();
    
    // Séparer par espace - prendre le premier mot comme prénom, le reste comme nom
    const parts = cleanQuery.split(/\s+/);
    if (parts.length === 1) {
      return { firstName: "", lastName: parts[0] };
    } else {
      return { 
        firstName: parts[0], 
        lastName: parts.slice(1).join(" ") 
      };
    }
  };

  const { firstName: initialFirstName, lastName: initialLastName } = parseInitialName(initialSearchQuery || "");

  const [formData, setFormData] = useState<FormData>({
    firstName: initialFirstName,
    lastName: initialLastName,
    specialty: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    inamiNumber: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      specialty: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      inamiNumber: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast({
        title: "Erreur",
        description: "Le prénom et le nom sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting doctor form with data:", formData);
      
      const doctorData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        specialty: formData.specialty.trim() || undefined,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        postal_code: formData.postalCode.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        inami_number: formData.inamiNumber.trim() || undefined,
        is_active: true
      };

      console.log("Creating doctor with processed data:", doctorData);
      
      const newDoctor = await supabaseDoctorsService.create(doctorData);
      
      console.log("Doctor created successfully:", newDoctor);

      toast({
        title: "Succès",
        description: `Dr ${newDoctor.first_name} ${newDoctor.last_name} a été ajouté avec succès.`,
      });

      // Réinitialiser le formulaire
      resetForm();
      
      // Appeler le callback avec le nouveau médecin
      onDoctorAdded(newDoctor);
    } catch (error: any) {
      console.error("Error creating doctor:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le médecin. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
};
