
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabaseDoctorsService, Doctor } from "@/lib/supabase-doctors-service";
import { ArrowLeft } from "lucide-react";

interface AddDoctorFormProps {
  onDoctorAdded: (doctor: Doctor) => void;
  onCancel: () => void;
  initialSearchQuery?: string;
}

export const AddDoctorForm = ({ onDoctorAdded, onCancel, initialSearchQuery }: AddDoctorFormProps) => {
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

  const [formData, setFormData] = useState({
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

      // Call the callback with the new doctor
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="p-1 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Ajouter un nouveau médecin</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Prénom du médecin"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Nom du médecin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Spécialité</Label>
            <Input
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              placeholder="Ex: Médecine générale, Cardiologie..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inamiNumber">Numéro INAMI</Label>
            <Input
              id="inamiNumber"
              name="inamiNumber"
              value={formData.inamiNumber}
              onChange={handleInputChange}
              placeholder="Numéro INAMI (optionnel)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Adresse du cabinet"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="1000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Bruxelles"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+32 2 123 45 67"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="docteur@exemple.be"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter le médecin"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
