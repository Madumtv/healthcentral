
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ManualDoctorInputProps {
  initialValue?: string;
  onConfirm: (doctorText: string) => void;
}

export const ManualDoctorInput = ({ initialValue = "", onConfirm }: ManualDoctorInputProps) => {
  const [manualDoctorText, setManualDoctorText] = useState(initialValue);

  const handleConfirm = () => {
    onConfirm(manualDoctorText);
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
        onClick={handleConfirm}
        disabled={!manualDoctorText.trim()}
      >
        Confirmer
      </Button>
    </div>
  );
};
