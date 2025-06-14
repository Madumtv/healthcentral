
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ManualDoctorInputProps {
  initialValue?: string;
  onSubmit: (doctorText: string) => void;
}

export const ManualDoctorInput = ({ initialValue = "", onSubmit }: ManualDoctorInputProps) => {
  const [manualDoctorText, setManualDoctorText] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(manualDoctorText);
  };

  return (
    <div className="space-y-2">
      <Input
        value={manualDoctorText}
        onChange={(e) => setManualDoctorText(e.target.value)}
        placeholder="Ex: Dr Martin Dubois"
      />
      <Button
        type="button"
        size="sm"
        onClick={handleSubmit}
        disabled={!manualDoctorText.trim()}
      >
        Confirmer
      </Button>
    </div>
  );
};
