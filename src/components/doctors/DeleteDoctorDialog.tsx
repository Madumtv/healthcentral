
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Doctor } from "@/lib/supabase-doctors-service";

interface DeleteDoctorDialogProps {
  doctor: Doctor | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDoctorDialog = ({ 
  doctor, 
  isDeleting, 
  onConfirm, 
  onCancel 
}: DeleteDoctorDialogProps) => {
  return (
    <AlertDialog open={!!doctor} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer Dr {doctor?.first_name} {doctor?.last_name} ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
