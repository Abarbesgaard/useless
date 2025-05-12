import { forwardRef } from "react";
import { Trash2 } from "lucide-react";
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
} from "../ui/alert-dialog";

interface DeleteButtonProps {
  onClick: () => void;
}

// Convert to forwardRef to properly handle refs
export const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ onClick }, ref) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            ref={ref}
            className="bg-[--chart-5] hover:bg-[--chart-4] p-3"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClick();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

DeleteButton.displayName = "DeleteButton";
