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
import { ExternalLink, Info, AlertCircle, CheckCircle, Euro } from "lucide-react";
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
          medicamentsApi.getMedicamentComposition(medicament.cnk),
          medicamentsApi.getMedicamentPresentations(medicament.cnk)
        ]);
        
        setComposition(compositionData);
        setPresentations(presentationsData);
      } else {
        toast({
          title: "Médicament non trouvé",
          description: "Ce médicament n'a pas été trouvé dans la base de données officielle belge.",
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
    if (statut.includes("Disponible")) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (statut.includes("Retiré") || statut.includes("Suspendu")) return <AlertCircle className="h-4 w-4 text-red-600" />;
    return <Info className="h-4 w-4 text-blue-600" />;
  };

  const getStatusBadgeVariant = (statut: string) => {
    if (statut.includes("Disponible")) return "default";
    if (statut.includes("Retiré") || statut.includes("Suspendu")) return "destructive";
    return "secondary";
  };

  const getReimbursementBadgeVariant = (code: string) => {
    if (code === "A") return "default";
    if (code === "B") return "secondary";
    return "outline";
  };

  const getMedicamentDetailUrl = (medicamentDetails: MedicamentInfo) => {
    // Formater le nom pour l'URL (remplacer espaces par tirets, enlever caractères spéciaux)
    const formattedName = medicamentDetails.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `https://www.pharmacie.be/Medicine/Detail/${formattedName}~${medicamentDetails.cnk}`;
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
            Données issues de la base de données AFMPS (Agence fédérale des médicaments belges)
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
              <h3 className="font-semibold text-lg">{medicamentDetails.name}</h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusIcon(medicamentDetails.deliveryStatus)}
                <Badge variant={getStatusBadgeVariant(medicamentDetails.deliveryStatus)}>
                  {medicamentDetails.deliveryStatus}
                </Badge>
                {medicamentDetails.reimbursementCode && (
                  <Badge variant={getReimbursementBadgeVariant(medicamentDetails.reimbursementCode)}>
                    Catégorie {medicamentDetails.reimbursementCode}
                  </Badge>
                )}
                {medicamentDetails.prescriptionType && (
                  <Badge variant="outline">
                    {medicamentDetails.prescriptionType}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Laboratoire:</span>
                  <p className="text-gray-600">{medicamentDetails.company}</p>
                </div>
                <div>
                  <span className="font-medium">Catégorie:</span>
                  <p className="text-gray-600">{medicamentDetails.category}</p>
                </div>
                <div>
                  <span className="font-medium">Code ATC:</span>
                  <p className="text-gray-600">{medicamentDetails.atc || 'Non spécifié'}</p>
                </div>
                <div>
                  <span className="font-medium">CNK:</span>
                  <p className="text-gray-600">{medicamentDetails.cnk}</p>
                </div>
              </div>

              {medicamentDetails.publicPrice && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Prix public: {medicamentDetails.publicPrice}€</span>
                  {medicamentDetails.reimbursementRate && (
                    <span className="text-green-600 text-sm">
                      (Remboursement: {medicamentDetails.reimbursementRate})
                    </span>
                  )}
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
                      <div className="font-medium">{comp.activeSubstance}</div>
                      <div className="text-gray-600">
                        Dosage: {comp.strength} {comp.unit}
                      </div>
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
                      <div className="font-medium">{pres.name}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-600">CNK: {pres.cnk}</span>
                        <Badge variant={pres.deliveryStatus === "Disponible" ? "default" : "secondary"}>
                          {pres.deliveryStatus}
                        </Badge>
                      </div>
                      {pres.publicPrice && (
                        <div className="text-gray-600 text-xs mt-1 flex items-center gap-1">
                          <Euro className="h-3 w-3" />
                          Prix: {pres.publicPrice}€ 
                          {pres.reimbursementRate && `(Remb. ${pres.reimbursementRate})`}
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getMedicamentDetailUrl(medicamentDetails), '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Fiche Pharmacie.be
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.pharmacie.be', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Pharmacie.be
                </Button>
              </div>
              <Button onClick={onClose}>Fermer</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Aucune information trouvée pour ce médicament dans la base de données officielle belge.
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
