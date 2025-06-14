
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface AddDoctorFormFieldsProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddDoctorFormFields = ({ formData, onInputChange }: AddDoctorFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
          onChange={onInputChange}
          placeholder="Ex: Médecine générale, Cardiologie..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inamiNumber">Numéro INAMI</Label>
        <Input
          id="inamiNumber"
          name="inamiNumber"
          value={formData.inamiNumber}
          onChange={onInputChange}
          placeholder="Numéro INAMI (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="1000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={onInputChange}
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
            onChange={onInputChange}
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
            onChange={onInputChange}
            placeholder="docteur@exemple.be"
          />
        </div>
      </div>
    </div>
  );
};
