
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MedicationsTab() {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes médicaments</CardTitle>
        <CardDescription>
          Gérez vos médicaments et leurs plannings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Consultez et modifiez vos médicaments.</p>
          <Button onClick={() => navigate("/medications")}>
            Voir tous mes médicaments
          </Button>
          <Button variant="outline" onClick={() => navigate("/medications/add")} className="ml-2">
            Ajouter un médicament
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
