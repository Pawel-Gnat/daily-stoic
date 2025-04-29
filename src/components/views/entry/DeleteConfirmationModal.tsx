import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  trigger: React.ReactNode;
}

const DeleteConfirmationModal = ({ trigger, onConfirm }: DeleteConfirmationModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this entry?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your entry from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button asChild variant="outline">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </Button>
          <Button asChild variant="destructive">
            <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;
