
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Info, AlertCircle, CheckCircle } from "lucide-react";
import { medicamentsApi, MedicamentInfo, MedicamentComposition, MedicamentPresentations } from "@/lib/medicaments-api";
import { useToast } from "@/components/ui/use-toast";

interface MedicamentDetailsModalProps {
  medicamentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MedicamentDetailsModal = ({ 
  medicamentName, 
  isOpen, 
  onClose 
}: MedicamentDetailsModalProps) => {
  const [medicamentDetails, setMedicamentDetails] = useState<MedicamentInfo | null>(null);
  const [composition, setComposition] = useState<MedicamentComposition[]>([]);
  const [presentations, setPresentations] = useState<MedicamentPresentations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && medicamentName) {
      fetchMedicamentData();
    }
  }, [isOpen, medicamentName]);

  const fetchMedicamentData = async () => {
    setIsLoading(true);
    try {
      // Rechercher le médicament par nom
      const searchResults = await medicamentsApi.searchMedicaments(medicamentName);
      
      if (searchResults.length > 0) {
        const medicament = searchResults[0]; // Prendre le premier résultat
        setMedicamentDetails(medicament);
        
        // Récupérer les détails supplémentaires
        const [compositionData, presentationsData] = await Promise.all([
          medicamentsApi.getMedicamentComposition(medicament.codeCIS),
          medicamentsApi.getMedicamentPresentations(medicament.codeCIS)
        ]);
        
        setComposition(compositionData);
        setPresentations(presentationsData);
      } else {
        toast({
          title: "Médicament non trouvé",
          description: "Ce médicament n'a pas été trouvé dans la base de données officielle.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les informations du médicament.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (statut: string) => {
    if (statut.includes("Autorisation")) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (statut.includes("Retrait")) return <AlertCircle className="h-4 w-4 text-red-600" />;
    return <Info className="h-4 w-4 text-blue-600" />;
  };

  const getStatusBadgeVariant = (statut: string) => {
    if (statut.includes("Autorisation")) return "default";
    if (statut.includes("Retrait")) return "destructive";
    return "secondary";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-medBlue" />
            Informations officielles du médicament
          </DialogTitle>
          <DialogDescription>
            Données issues de la base de données publique française des médicaments
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p>Chargement des informations...</p>
          </div>
        ) : medicamentDetails ? (
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{medicamentDetails.denomination}</h3>
              
              <div className="flex items-center gap-2">
                {getStatusIcon(medicamentDetails.statutAMM)}
                <Badge variant={getStatusBadgeVariant(medicamentDetails.statutAMM)}>
                  {medicamentDetails.statutAMM}
                </Badge>
                {medicamentDetails.surveillance && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Surveillance renforcée
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Forme pharmaceutique:</span>
                  <p className="text-gray-600">{medicamentDetails.formePharmaceutique}</p>
                </div>
                <div>
                  <span className="font-medium">Voies d'administration:</span>
                  <p className="text-gray-600">{medicamentDetails.voiesAdministration.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium">Date d'AMM:</span>
                  <p className="text-gray-600">{new Date(medicamentDetails.dateAMM).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="font-medium">Code CIS:</span>
                  <p className="text-gray-600">{medicamentDetails.codeCIS}</p>
                </div>
              </div>

              {medicamentDetails.titulaires.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Titulaire(s) de l'AMM:</span>
                  <p className="text-gray-600 text-sm">{medicamentDetails.titulaires.join(', ')}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Composition */}
            {composition.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Composition</h4>
                <div className="space-y-2">
                  {composition.map((comp, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="font-medium">{comp.substanceActive}</div>
                      <div className="text-gray-600">
                        Dosage: {comp.dosageSubstance} {comp.referenceDosage}
                      </div>
                      {comp.nature && (
                        <div className="text-gray-500 text-xs">Nature: {comp.nature}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Présentations */}
            {presentations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Présentations disponibles</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {presentations.slice(0, 5).map((pres, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      <div className="font-medium">{pres.libelle}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600">CIP: {pres.codeCIP13}</span>
                        <Badge variant={pres.etatCommercialisation === "Commercialisée" ? "default" : "secondary"}>
                          {pres.etatCommercialisation}
                        </Badge>
                      </div>
                      {pres.prix && (
                        <div className="text-gray-600 text-xs mt-1">
                          Prix: {pres.prix}€ {pres.tauxRemboursement && `(Remb. ${pres.tauxRemboursement}%)`}
                        </div>
                      )}
                    </div>
                  ))}
                  {presentations.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      ... et {presentations.length - 5} autres présentations
                    </p>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://api-medicaments.fr/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                API Médicaments
              </Button>
              <Button onClick={onClose}>Fermer</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Aucune information trouvée pour ce médicament dans la base de données officielle.
            </p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicamentDetailsModal;
