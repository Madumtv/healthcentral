
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface ManualDoctorInputProps {
  onSubmit: (doctorName: string) => void;
}

export const ManualDoctorInput = ({ onSubmit }: ManualDoctorInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualDoctorText, setManualDoctorText] = useState("");

  const handleSubmit = () => {
    if (manualDoctorText.trim()) {
      onSubmit(manualDoctorText.trim());
      setManualDoctorText("");
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full"
          >
            <UserPlus className="h-3 w-3 mr-2" />
            Saisir manuellement un médecin
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-gray-700">
          <UserPlus className="h-4 w-4" />
          Saisie manuelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={manualDoctorText}
          onChange={(e) => setManualDoctorText(e.target.value)}
          placeholder="Ex: Dr Martin Dubois"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!manualDoctorText.trim()}
          >
            Confirmer
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setIsExpanded(false);
              setManualDoctorText("");
            }}
          >
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
