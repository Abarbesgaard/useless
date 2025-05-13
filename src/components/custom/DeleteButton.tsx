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
import { TooltipTrigger } from "../ui/tooltip";

interface DeleteButtonProps {
  onClick: () => void;
}

// Convert to forwardRef to properly handle refs
export const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  ({ onClick }, ref) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              className="text-destructive hover:text-chart-5 ml-1"
              title="Delete"
            >
              <Trash2 />
            </button>
          </TooltipTrigger>
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
