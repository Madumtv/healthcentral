
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Doctor } from "@/lib/supabase-doctors-service";

interface EditDoctorModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: Doctor) => void;
}

export const EditDoctorModal = ({ doctor, isOpen, onClose, onSave }: EditDoctorModalProps) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    specialty: "",
    inami_number: "",
    address: "",
    city: "",
    postal_code: "",
    phone: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (doctor) {
      setFormData({
        first_name: doctor.first_name || "",
        last_name: doctor.last_name || "",
        specialty: doctor.specialty || "",
        inami_number: doctor.inami_number || "",
        address: doctor.address || "",
        city: doctor.city || "",
        postal_code: doctor.postal_code || "",
        phone: doctor.phone || "",
        email: doctor.email || "",
      });
    }
  }, [doctor]);

  const handleSave = async () => {
    if (!doctor) return;

    setIsLoading(true);
    try {
      const updatedDoctor = {
        ...doctor,
        ...formData,
      };
      
      onSave(updatedDoctor);
      onClose();
      
      toast({
        title: "Succès",
        description: "Les informations du médecin ont été mises à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le médecin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le médecin</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialty">Spécialité</Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={(e) => handleChange("specialty", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="inami_number">Numéro INAMI</Label>
            <Input
              id="inami_number"
              value={formData.inami_number}
              onChange={(e) => handleChange("inami_number", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postal_code">Code postal</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !formData.first_name || !formData.last_name}
              className="bg-medBlue hover:bg-blue-600"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
